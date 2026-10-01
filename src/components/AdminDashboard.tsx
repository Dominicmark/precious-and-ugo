import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getRSVPs,
  updateRSVPStatus,
  calculateRSVPStats,
  exportRSVPsToCSV,
} from '../lib/supabase';
import { RSVPRecord, RSVPStats, RSVPApprovalStatus, GuestRelationship } from '../types/rsvp';
import { DigitalSecurityPass } from './DigitalSecurityPass';
import {
  getOfficialCardUrl,
  setOfficialCardUrl,
  resetOfficialCardUrl,
  DEFAULT_OFFICIAL_CARD_URL,
} from '../lib/invitationCardAsset';
import { VisualSeatingPlanner } from './VisualSeatingPlanner';
import { EmailDispatchCenter } from './EmailDispatchCenter';
import {
  ShieldCheck,
  Search,
  Download,
  Lock,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  X,
  Eye,
  MessageCircle,
  Plus,
  Edit2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  Layers,
  ChevronRight,
  LayoutGrid,
  Menu,
  Mail,
} from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface AdminDashboardProps {
  onBackToInvitation: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToInvitation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'waitlisted' | 'declined' | 'all'>('pending');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [dashboardView, setDashboardView] = useState<'registry' | 'seating' | 'emails'>('registry');
  const [showMobileActionMenu, setShowMobileActionMenu] = useState(false);

  // Official Card Asset State
  const [officialCardUrl, setOfficialCardUrlState] = useState<string>(getOfficialCardUrl());
  const [showCardManagerModal, setShowCardManagerModal] = useState(false);
  const [cardUploadInputUrl, setCardUploadInputUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [selectedGuestForPass, setSelectedGuestForPass] = useState<RSVPRecord | null>(null);
  const [editingGuest, setEditingGuest] = useState<RSVPRecord | null>(null);
  const [editSeats, setEditSeats] = useState<number>(1);
  const [editTable, setEditTable] = useState<string>('');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null);

  // Manual Add Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualRelationship, setManualRelationship] = useState<GuestRelationship>("Bride's Family / Guest");
  const [manualSeats, setManualSeats] = useState<number>(1);
  const [manualTable, setManualTable] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  const adminPin = import.meta.env.VITE_ADMIN_PIN || 'ugoamaka2026';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      setIsAuthenticated(true);
      setAuthError(false);
      loadRecords();
    } else {
      setAuthError(true);
    }
  };

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getRSVPs();
      setRecords(data);
    } catch (err) {
      console.error('Error loading RSVPs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRecords();
    }
  }, [isAuthenticated]);

  const stats: RSVPStats = useMemo(() => {
    return calculateRSVPStats(records, 100);
  }, [records]);

  const capacityPercent = Math.min(100, Math.round((stats.total_allocated_seats / 100) * 100));

  // Quick Approval
  const handleQuickApprove = async (guest: RSVPRecord, seats: number) => {
    const res = await updateRSVPStatus(guest.id, {
      status: 'approved',
      allocated_seats: seats,
    });
    if (res.success) {
      showToast(`Approved ${guest.full_name} · ${seats} seat(s)`);
      loadRecords();
    }
  };

  // Quick Waitlist
  const handleWaitlist = async (guest: RSVPRecord) => {
    const res = await updateRSVPStatus(guest.id, { status: 'waitlisted' });
    if (res.success) {
      showToast(`Moved ${guest.full_name} to Waitlist`);
      loadRecords();
    }
  };

  // Quick Decline
  const handleDecline = async (guest: RSVPRecord) => {
    const res = await updateRSVPStatus(guest.id, { status: 'declined', allocated_seats: 0 });
    if (res.success) {
      showToast(`Declined ${guest.full_name}`);
      loadRecords();
    }
  };

  // Save Modal Edit
  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    const res = await updateRSVPStatus(editingGuest.id, {
      status: 'approved',
      allocated_seats: editSeats,
      table_assignment: editTable.trim(),
    });
    if (res.success) {
      showToast(`Updated reservation for ${editingGuest.full_name}`);
      setEditingGuest(null);
      loadRecords();
    }
  };

  // Copy Reference Code
  const handleCopyRef = (refCode: string) => {
    navigator.clipboard.writeText(refCode);
    setCopiedRefId(refCode);
    setTimeout(() => setCopiedRefId(null), 2000);
  };

  // WhatsApp Pass Dispatch
  const handleSendWhatsAppPass = (guest: RSVPRecord) => {
    const cleanPhone = guest.phone.replace(/\D/g, '');
    const seats = guest.allocated_seats || guest.guest_count || 1;
    const tableText = guest.table_assignment ? ` at ${guest.table_assignment}` : '';
    const message = `Dear ${guest.full_name},\n\nPrecious & Ugochukwu joyfully confirm your ${seats} reserved seat(s)${tableText} for their wedding on Friday, 13 November 2026.\n\n🎟️ Ref Code: ${guest.reference_code}\n📍 Venue: Tee Scee Event Center, 6 Area 3, Garki, Abuja\n⏰ Time: 10:00 AM Prompt\n👔 Dress Code: Strictly Black-Tie Formal Western Attire (No Traditional Attire)\n\nPlease keep your reference code handy for gate verification. We look forward to celebrating with you!\n\n#UgoAmaka26`;
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Add Manual Guest
  const handleSaveManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    setIsSavingManual(true);
    try {
      const { submitRSVP } = await import('../lib/supabase');
      await submitRSVP({
        full_name: manualName.trim(),
        phone: manualPhone.trim(),
        email: manualEmail.trim() || `${manualPhone.replace(/\D/g, '')}@ugoamaka26.ng`,
        attendance: 'accepted',
        status: 'approved',
        guest_count: Number(manualSeats),
        allocated_seats: Number(manualSeats),
        relationship: manualRelationship,
        table_assignment: manualTable.trim(),
        dietary_or_notes: '[Added via Protocol Desk]',
      });
      showToast(`Added ${manualName} to guest registry`);
      setShowAddGuestModal(false);
      setManualName('');
      setManualPhone('');
      setManualEmail('');
      setManualTable('');
      loadRecords();
    } catch {
      alert('Failed to save manual guest.');
    } finally {
      setIsSavingManual(false);
    }
  };

  // File Upload for Invitation Card Image (PNG, JPG, WebP)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setOfficialCardUrl(result);
        setOfficialCardUrlState(result);
        showToast('Official Invitation Card image updated successfully!');
      }
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      showToast('Error reading image file');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCardUrl = () => {
    if (!cardUploadInputUrl.trim()) return;
    setOfficialCardUrl(cardUploadInputUrl.trim());
    setOfficialCardUrlState(cardUploadInputUrl.trim());
    setCardUploadInputUrl('');
    showToast('Official Card URL updated!');
  };

  const handleResetCard = () => {
    resetOfficialCardUrl();
    setOfficialCardUrlState(DEFAULT_OFFICIAL_CARD_URL);
    showToast('Reset to default invitation artwork');
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (relationshipFilter !== 'all' && r.relationship !== relationshipFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.full_name.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.reference_code || '').toLowerCase().includes(q) ||
          (r.table_assignment || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, statusFilter, relationshipFilter, searchQuery]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E1B2E] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-[#142338] border-2 border-[#D6B477] p-8 text-center shadow-2xl text-white">
          <div className="w-14 h-14 rounded-full bg-[#0E1B2E] border border-[#D6B477] flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock className="w-6 h-6 text-[#ECC880]" />
          </div>

          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-[#ECC880]">
            Protocol Desk
          </h2>
          <p className="text-xs text-white/70 mt-1 mb-6">
            Bride &amp; Groom RSVP &amp; Card Management (#UgoAmaka26)
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Access Passcode"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#0E1B2E] border border-[#D6B477]/60 text-white placeholder-white/40 text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] font-bold text-xs uppercase tracking-widest hover:brightness-105 transition-all shadow-lg cursor-pointer"
            >
              Unlock Protocol Desk
            </button>

            <button
              type="button"
              onClick={onBackToInvitation}
              className="w-full text-xs text-white/60 hover:text-white pt-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Wedding Invitation</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E1B2E] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#0E1B2E] text-white border border-[#D6B477] shadow-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#ECC880]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LUXURY EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-30 bg-[#0E1B2E] text-white border-b border-[#D6B477]/30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToInvitation}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ECC880] transition-colors cursor-pointer"
              title="Return to Public Invitation"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  Precious &amp; Ugochukwu
                </h1>
                <span className="text-[10px] text-[#ECC880] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10">
                  #UgoAmaka26
                </span>
              </div>
              <p className="text-[10px] text-white/60 uppercase font-serif-luxury tracking-widest">
                VIP Protocol Desk &amp; Seating Allocation
              </p>
            </div>
          </div>

          {/* Action Controls: Compact Desktop & Mobile Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Action Buttons (Visible on md+ screens) */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setShowCardManagerModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ECC880] text-[11px] font-bold transition-all flex items-center gap-1 border border-[#D6B477]/40 shadow-xs cursor-pointer"
                title="Manage Official Invitation Card Artwork"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>Card Asset</span>
              </button>

              <button
                onClick={() => setShowAddGuestModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#D6B477] text-[#0E1B2E] text-[11px] font-bold hover:brightness-105 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guest</span>
              </button>

              <button
                onClick={() => exportRSVPsToCSV(records)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center gap-1 border border-white/20 cursor-pointer"
                title="Download Gate Bouncer List (CSV)"
              >
                <Download className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>Bouncer List</span>
              </button>

              <button
                onClick={loadRecords}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Refresh Registry"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#ECC880] ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Mobile Action Hamburger Button (Always visible on mobile & tablet) */}
            <div className="relative">
              <button
                onClick={() => setShowMobileActionMenu(!showMobileActionMenu)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#ECC880] border border-[#D6B477]/60 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Open Protocol Actions Menu"
                title="Actions Menu"
              >
                {showMobileActionMenu ? (
                  <X className="w-5 h-5 text-[#ECC880]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#ECC880]" />
                )}
              </button>

              {/* Mobile Action Menu Dropdown / Popover */}
              {showMobileActionMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
                    onClick={() => setShowMobileActionMenu(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-[#0E1B2E] border-2 border-[#D6B477] shadow-2xl p-2.5 space-y-1 text-white animate-fade-in">
                    <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#D6B477]">
                      Protocol Controls
                    </div>

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        setDashboardView('emails');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer text-[#ECC880]"
                    >
                      <Mail className="w-4 h-4 text-[#ECC880]" />
                      <span>Email &amp; Invitation Dispatcher</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        setShowCardManagerModal(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer text-[#ECC880]"
                    >
                      <ImageIcon className="w-4 h-4 text-[#ECC880]" />
                      <span>Invitation Card Asset</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        setShowAddGuestModal(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer text-white"
                    >
                      <Plus className="w-4 h-4 text-[#D6B477]" />
                      <span>Add VIP / Offline Guest</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        exportRSVPsToCSV(records);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer text-white"
                    >
                      <Download className="w-4 h-4 text-[#ECC880]" />
                      <span>Download Bouncer List (CSV)</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        loadRecords();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer text-white"
                    >
                      <RefreshCw className="w-4 h-4 text-[#ECC880]" />
                      <span>Refresh Guest Registry</span>
                    </button>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      onClick={() => {
                        setShowMobileActionMenu(false);
                        onBackToInvitation();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold hover:bg-red-900/30 text-red-300 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-red-400" />
                      <span>Exit Protocol Desk</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* VIEW NAVIGATION TABS (REGISTRY vs VISUAL SEATING PLAN vs EMAIL DISPATCHER) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setDashboardView('registry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'registry'
                ? 'bg-[#0E1B2E] text-[#ECC880] shadow-md'
                : 'bg-white text-gray-700 hover:text-[#0E1B2E] border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#D6B477]" />
            <span>Guest Registry &amp; Approvals ({records.length})</span>
          </button>

          <button
            onClick={() => setDashboardView('seating')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'seating'
                ? 'bg-[#0E1B2E] text-[#ECC880] shadow-md'
                : 'bg-white text-gray-700 hover:text-[#0E1B2E] border border-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#D6B477]" />
            <span>Visual Seating &amp; Table Arrangement</span>
          </button>

          <button
            onClick={() => setDashboardView('emails')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'emails'
                ? 'bg-[#0E1B2E] text-[#ECC880] shadow-md'
                : 'bg-white text-gray-700 hover:text-[#0E1B2E] border border-gray-200'
            }`}
          >
            <Mail className="w-4 h-4 text-[#D6B477]" />
            <span>Email &amp; Invitation Dispatcher</span>
          </button>
        </div>

        {dashboardView === 'emails' ? (
          <EmailDispatchCenter
            records={records}
            onShowToast={showToast}
            onRefreshRecords={loadRecords}
          />
        ) : dashboardView === 'seating' ? (
          <VisualSeatingPlanner
            records={records}
            onRefreshRecords={loadRecords}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* CAPACITY PROGRESS & HIGH-LEVEL OVERVIEW BAR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D6B477]/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
              Venue Seating Capacity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-[#0E1B2E]">
                {stats.total_allocated_seats}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                of 100 Seats Allocated ({capacityPercent}% Booked)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-80 h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-[#D6B477] to-[#0E1B2E] transition-all duration-500 rounded-full"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600 divide-x divide-gray-200">
            <div className="pr-4">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Requests</span>
              <span className="font-bold text-[#0E1B2E] text-base">{stats.total_requests}</span>
            </div>
            <div className="px-4">
              <span className="text-amber-600 block text-[10px] uppercase font-bold">Needs Decision</span>
              <span className="font-bold text-amber-700 text-base">{stats.pending_review}</span>
            </div>
            <div className="pl-4">
              <span className="text-emerald-600 block text-[10px] uppercase font-bold">Approved</span>
              <span className="font-bold text-emerald-700 text-base">{stats.approved_guests}</span>
            </div>
          </div>
        </div>

        {/* DECISION METRIC TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Pending Tile */}
          <div
            onClick={() => setStatusFilter('pending')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'pending'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300'
                : 'bg-white border-gray-200 hover:bg-amber-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Pending Review
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-display text-3xl font-black text-amber-950 mt-1">
              {stats.pending_review}
            </p>
            <span className="text-[10px] text-amber-800 font-semibold block mt-1">
              Action required by couple
            </span>
          </div>

          {/* Approved Tile */}
          <div
            onClick={() => setStatusFilter('approved')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'approved'
                ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-white border-gray-200 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                Approved Guests
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-display text-3xl font-black text-emerald-950 mt-1">
              {stats.approved_guests}
            </p>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
              {stats.total_allocated_seats} seats officially granted
            </span>
          </div>

          {/* Waitlist Tile */}
          <div
            onClick={() => setStatusFilter('waitlisted')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'waitlisted'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300'
                : 'bg-white border-gray-200 hover:bg-blue-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                Waitlisted
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-display text-3xl font-black text-blue-950 mt-1">
              {stats.waitlisted}
            </p>
            <span className="text-[10px] text-blue-800 font-semibold block mt-1">
              Standby seat allocation
            </span>
          </div>

          {/* Declined Tile */}
          <div
            onClick={() => setStatusFilter('declined')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'declined'
                ? 'bg-gray-100 border-gray-400 ring-2 ring-gray-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Declined
              </span>
              <XCircle className="w-4 h-4 text-gray-500" />
            </div>
            <p className="font-display text-3xl font-black text-gray-800 mt-1">
              {stats.declined}
            </p>
            <span className="text-[10px] text-gray-600 font-semibold block mt-1">
              Regretfully cannot attend
            </span>
          </div>
        </div>

        {/* SEARCH & SEGMENTED CONTROLS BAR */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#D6B477]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 w-full md:w-auto p-1 bg-gray-100 rounded-xl">
            {(['pending', 'approved', 'waitlisted', 'declined', 'all'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0E1B2E] text-[#ECC880] shadow-xs'
                    : 'text-gray-600 hover:text-[#0E1B2E]'
                }`}
              >
                {st === 'pending'
                  ? `Pending (${stats.pending_review})`
                  : st === 'approved'
                  ? `Approved (${stats.approved_guests})`
                  : st === 'waitlisted'
                  ? `Waitlist (${stats.waitlisted})`
                  : st === 'declined'
                  ? `Declined (${stats.declined})`
                  : `All (${records.length})`}
              </button>
            ))}
          </div>

          {/* Affiliation Dropdown & Search Bar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
            >
              <option value="all">All Affiliations</option>
              <option value="Bride's Family / Guest">Bride&apos;s Guests</option>
              <option value="Groom's Family / Guest">Groom&apos;s Guests</option>
              <option value="VIP Dignitary">VIP Dignitaries</option>
              <option value="Mutual Friend / Colleague">Mutual Friends</option>
            </select>

            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, ref..."
                className="w-full px-3 py-2 pl-8 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* GUEST CARDS / TABLE VIEW */}
        <div className="rounded-2xl bg-white border border-[#D6B477]/50 shadow-sm overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No guests found in this filter</p>
              <p className="text-xs text-gray-400">Change your filter or search query</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRecords.map((guest) => {
                const isPending = guest.status === 'pending';
                const isApproved = guest.status === 'approved';
                const isCopied = copiedRefId === guest.reference_code;

                return (
                  <div
                    key={guest.id}
                    className="p-4 sm:p-5 hover:bg-gray-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Guest Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-bold text-[#0E1B2E] uppercase">
                          {guest.full_name}
                        </span>

                        {/* Copyable Ref Code Badge */}
                        <button
                          onClick={() => handleCopyRef(guest.reference_code)}
                          title="Click to copy Reference Code"
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#0E1B2E] text-[#ECC880] hover:bg-[#142338] transition-colors cursor-pointer"
                        >
                          <span>{guest.reference_code}</span>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/50" />
                          )}
                        </button>

                        {/* Clean Status Badges */}
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase border border-amber-300">
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300">
                            Approved ({guest.allocated_seats || 1} Seat)
                          </span>
                        )}
                        {guest.status === 'waitlisted' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold uppercase border border-blue-300">
                            Waitlist
                          </span>
                        )}
                        {guest.status === 'declined' && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase border border-gray-300">
                            Declined
                          </span>
                        )}
                      </div>

                      {/* Unboxed Metadata with Typographic Separator */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span>📱 {guest.phone}</span>
                        <span aria-hidden="true" className="text-gray-300">·</span>
                        <span>✉️ {guest.email}</span>
                        <span aria-hidden="true" className="text-gray-300">·</span>
                        <span className="text-[#5687AD] font-semibold">{guest.relationship || 'Guest'}</span>
                        {guest.table_assignment && (
                          <>
                            <span aria-hidden="true" className="text-gray-300">·</span>
                            <span className="text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              🍽️ {guest.table_assignment}
                            </span>
                          </>
                        )}
                      </div>

                      {guest.guest_names && guest.guest_names !== guest.full_name && (
                        <p className="text-xs text-gray-500 italic">
                          Accompanying: {guest.guest_names}
                        </p>
                      )}

                      {guest.dietary_or_notes && (
                        <p className="text-xs text-gray-600 bg-gray-50/80 p-2 rounded-lg border border-gray-200/60 max-w-xl">
                          &quot;{guest.dietary_or_notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(guest, 1)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Approve for 1 Seat"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve (1)</span>
                          </button>

                          <button
                            onClick={() => handleQuickApprove(guest, 2)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Approve for 2 Seats"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Approve (2)</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingGuest(guest);
                              setEditSeats(guest.allocated_seats || guest.guest_count || 1);
                              setEditTable(guest.table_assignment || '');
                            }}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="Assign Custom Table or Seats"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleWaitlist(guest)}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Waitlist
                          </button>

                          <button
                            onClick={() => handleDecline(guest)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <>
                          <button
                            onClick={() => {
                              setDashboardView('emails');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-[#0E1B2E] border border-[#D6B477] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="Dispatch personalized email with invitation card & seating details"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#D6B477]" />
                            <span>Email Card</span>
                          </button>

                          <button
                            onClick={() => handleSendWhatsAppPass(guest)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="Send official pass via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Pass</span>
                          </button>

                          <button
                            onClick={() => setSelectedGuestForPass(guest)}
                            className="px-3 py-1.5 rounded-xl bg-[#0E1B2E] hover:bg-[#142338] text-[#ECC880] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="View Gate Pass & Official Card"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pass &amp; Card</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingGuest(guest);
                              setEditSeats(guest.allocated_seats || 1);
                              setEditTable(guest.table_assignment || '');
                            }}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                            title="Edit Table or Seats"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {(guest.status === 'waitlisted' || guest.status === 'declined') && (
                        <button
                          onClick={() => handleQuickApprove(guest, 1)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Reinstate / Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
          </>
        )}
      </main>

      {/* MODAL 1: VIEW DIGITAL PASS & ATTACHED CARD */}
      {selectedGuestForPass && (
        <DigitalSecurityPass
          record={selectedGuestForPass}
          onClose={() => setSelectedGuestForPass(null)}
        />
      )}

      {/* MODAL 2: OFFICIAL INVITATION CARD ASSET MANAGER */}
      {showCardManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0E1B2E] border-2 border-[#D6B477] text-white p-6 shadow-2xl space-y-4 my-auto">
            {/* Gold Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 gold-foil-gradient rounded-t-2xl" />

            <div className="flex items-center justify-between pb-3 border-b border-[#D6B477]/30">
              <div>
                <h3 className="font-display text-base font-bold uppercase text-[#ECC880]">
                  Official Invitation Card Asset
                </h3>
                <p className="text-xs text-white/60">
                  Upload your high-res wedding card (PNG, JPG, or PDF image)
                </p>
              </div>
              <button
                onClick={() => setShowCardManagerModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Card Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#D6B477] uppercase tracking-wider block">
                Current Attached Card Preview:
              </span>
              <div className="relative rounded-xl overflow-hidden border border-[#D6B477]/50 bg-black/60 max-h-64 flex items-center justify-center">
                <img
                  src={officialCardUrl}
                  alt="Official Invitation Card"
                  className="w-full h-full object-contain max-h-60"
                />
              </div>
            </div>

            {/* Upload Method 1: File Picker */}
            <div className="p-4 rounded-xl bg-white/5 border border-dashed border-[#D6B477]/60 text-center space-y-2">
              <Upload className="w-8 h-8 text-[#ECC880] mx-auto" />
              <div>
                <p className="text-xs font-bold text-white">
                  Upload New Card Graphic (PNG / JPEG / WebP)
                </p>
                <p className="text-[11px] text-white/50">
                  Select your designer&apos;s exported invitation graphic from your device
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer shadow-md"
              >
                {isUploadingImage ? 'Reading Image...' : 'Choose File from Device'}
              </button>
            </div>

            {/* Upload Method 2: Web URL / Cloudinary */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#D6B477] uppercase tracking-wider">
                Or Paste Image Link (Cloudinary / S3 / Direct Image URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={cardUploadInputUrl}
                  onChange={(e) => setCardUploadInputUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../card.jpg"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
                <button
                  type="button"
                  onClick={handleSaveCardUrl}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D6B477]/60 text-xs font-bold text-white cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={handleResetCard}
                className="text-[11px] text-white/50 hover:text-white underline cursor-pointer"
              >
                Reset to default artwork
              </button>

              <button
                type="button"
                onClick={() => setShowCardManagerModal(false)}
                className="px-4 py-2 rounded-xl bg-[#ECC880] text-[#0E1B2E] text-xs font-bold cursor-pointer hover:brightness-105"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CUSTOM SEAT & TABLE EDIT MODAL */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-display text-sm font-bold uppercase text-[#0E1B2E]">
                Set Seat &amp; Table Allocation
              </h3>
              <button
                onClick={() => setEditingGuest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Guest: <strong>{editingGuest.full_name}</strong> ({editingGuest.reference_code})
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Approved Seat Count
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEditSeats(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      editSeats === num
                        ? 'bg-[#0E1B2E] text-white border-[#D6B477]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {num} {num === 1 ? 'Seat' : 'Seats'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Table Assignment
              </label>
              <input
                type="text"
                value={editTable}
                onChange={(e) => setEditTable(e.target.value)}
                placeholder="e.g. Table 4 - Presidential"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold hover:bg-[#142338] transition-colors cursor-pointer"
              >
                Confirm &amp; Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: MANUAL ADD GUEST */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-display text-sm font-bold uppercase text-[#0E1B2E]">
                Add VIP / Offline Guest
              </h3>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Chief &amp; Mrs. Emeka Okoye"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="email@..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Affiliation
                  </label>
                  <select
                    value={manualRelationship}
                    onChange={(e) => setManualRelationship(e.target.value as GuestRelationship)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                  >
                    <option value="Bride's Family / Guest">Bride&apos;s Guest</option>
                    <option value="Groom's Family / Guest">Groom&apos;s Guest</option>
                    <option value="VIP Dignitary">VIP Dignitary</option>
                    <option value="Mutual Friend / Colleague">Mutual Friend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Seats
                  </label>
                  <select
                    value={manualSeats}
                    onChange={(e) => setManualSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Table Assignment
                </label>
                <input
                  type="text"
                  value={manualTable}
                  onChange={(e) => setManualTable(e.target.value)}
                  placeholder="e.g. Table 1 - High Table"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-4 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold hover:bg-[#142338] transition-colors cursor-pointer"
                >
                  {isSavingManual ? 'Saving...' : 'Save to Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
