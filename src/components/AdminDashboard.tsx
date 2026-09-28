import React, { useState, useEffect, useMemo } from 'react';
import {
  getRSVPs,
  calculateRSVPStats,
  exportRSVPsToCSV,
  isSupabaseConfigured,
  SUPABASE_SETUP_SQL,
} from '../lib/supabase';
import { RSVPRecord, RSVPStats } from '../types/rsvp';
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
  Database,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  X,
  Eye,
  Music,
  Volume2,
  Upload,
} from 'lucide-react';
import {
  getCustomMusicUrl,
  setCustomMusicUrl,
  toggleBackgroundMusic,
  isBgMusicPlaying,
  DEFAULT_WEDDING_SONG_URL,
  WEDDING_SONG_TITLE,
} from '../lib/audio';

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'declined'>('all');
  const [selectedGuest, setSelectedGuest] = useState<RSVPRecord | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicUrlInput, setMusicUrlInput] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicNotice, setMusicNotice] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Manual RSVP form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualAttendance, setManualAttendance] = useState<'accepted' | 'declined'>('accepted');
  const [manualCount, setManualCount] = useState<number>(1);
  const [manualNotes, setManualNotes] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  // Authenticate PIN
  const adminPin = import.meta.env.VITE_ADMIN_PIN || 'ugoamaka2026';

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

  const handleSaveManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    setIsSavingManual(true);
    try {
      const { submitRSVP } = await import('../lib/supabase');
      await submitRSVP({
        full_name: manualName.trim(),
        phone: manualPhone.trim(),
        email: manualEmail.trim() || 'phone-rsvp@ugoamaka26.ng',
        attendance: manualAttendance,
        guest_count: manualAttendance === 'accepted' ? Number(manualCount) : 0,
        guest_names: '',
        dietary_or_notes: `[Logged by Admin] ${manualNotes.trim()}`,
      });

      // Reset and reload
      setManualName('');
      setManualPhone('');
      setManualEmail('');
      setManualNotes('');
      setShowAddGuestModal(false);
      await loadRecords();
    } finally {
      setIsSavingManual(false);
    }
  };


  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getRSVPs();
      setRecords(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRecords();
    }
  }, [isAuthenticated]);

  // Filtered guest list
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.guest_names && r.guest_names.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ? true : r.attendance === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const stats: RSVPStats = useMemo(() => {
    return calculateRSVPStats(records, 350);
  }, [records]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Login Screen if not yet authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#D6B477] shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#0E1B2E] text-[#D6B477] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="font-display text-xl font-extrabold text-[#0E1B2E] tracking-wider uppercase">
            ADMINISTRATOR ACCESS
          </h2>
          <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold mt-1">
            Precious &amp; Ugochukwu Wedding Management
          </p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#0E1B2E] uppercase tracking-wider text-left mb-1">
                Enter Admin Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/40 text-sm text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#5687AD]"
              />
              {authError && (
                <p className="text-[11px] text-[#8F2D25] font-semibold text-left mt-1.5">
                  Invalid passcode. (Default: ugoamaka2026)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-display text-xs font-bold tracking-widest uppercase text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              UNLOCK DASHBOARD
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#D6B477]/30">
            <button
              onClick={onBackToInvitation}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5687AD] hover:text-[#0E1B2E] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Invitation</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#D6B477]/50 mb-6">
        <div>
          <button
            onClick={onBackToInvitation}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5687AD] hover:text-[#0E1B2E] transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invitation</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1B2E] tracking-wide">
            RSVP GUEST DIRECTORY
          </h1>
          <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold tracking-wider uppercase mt-0.5">
            #UgoAmaka26 · 13 November 2026 · Abuja
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Supabase status badge */}
          <button
            onClick={() => setShowSqlModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Click to view Supabase database configuration & SQL schema"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}</span>
          </button>

          {/* Background Song Setup */}
          <button
            onClick={() => {
              setMusicUrlInput(getCustomMusicUrl());
              setMusicPlaying(isBgMusicPlaying());
              setMusicNotice(null);
              setShowMusicModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0E1B2E] bg-[#FAF7F2] border border-[#D6B477] hover:bg-[#0E1B2E] hover:text-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
            title="Configure or upload wedding background music"
          >
            <Music className="w-3.5 h-3.5 text-[#5687AD]" />
            <span>Music Soundtrack</span>
          </button>

          {/* Log Manual RSVP */}
          <button
            onClick={() => setShowAddGuestModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0E1B2E] bg-[#FAF7F2] border border-[#D6B477] hover:bg-[#0E1B2E] hover:text-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
          >
            <span>+ Log RSVP</span>
          </button>

          {/* Export to CSV */}
          <button
            onClick={() => exportRSVPsToCSV(filteredRecords)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>EXPORT CSV</span>
          </button>


          {/* Refresh */}
          <button
            onClick={loadRecords}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-[#0E1B2E] border border-[#D6B477]/70 bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* METRIC CARDS (Section 11 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {/* TOTAL INVITED */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#D6B477]/60 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-[#0E1B2E]/70 font-semibold mb-1">
            <Users className="w-3.5 h-3.5 text-[#0E1B2E]" />
            <span>TOTAL INVITED</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-[#0E1B2E] tabular-nums">
            {stats.total_invited}
          </div>
        </div>

        {/* CONFIRMED */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-emerald-300 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>CONFIRMED</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-emerald-700 tabular-nums">
            {stats.confirmed}
          </div>
        </div>

        {/* DECLINED */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-rose-300 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold mb-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>DECLINED</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-rose-700 tabular-nums">
            {stats.declined}
          </div>
        </div>

        {/* PENDING */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-amber-300 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>PENDING</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-amber-700 tabular-nums">
            {stats.pending}
          </div>
        </div>

        {/* TOTAL ATTENDING */}
        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-xl bg-[#0E1B2E] text-[#FAF7F2] border border-[#D6B477] shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-[#D6B477] font-semibold mb-1">
            <UserCheck className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>TOTAL ATTENDING</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-[#FAF7F2] tabular-nums">
            {stats.total_attending}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="p-4 rounded-xl bg-white border border-[#D6B477]/60 shadow-sm mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#0E1B2E]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#D6B477]/50 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#0E1B2E] text-[#FAF7F2] shadow-sm'
                : 'text-[#0E1B2E]/70 hover:text-[#0E1B2E]'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'accepted'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-[#0E1B2E]/70 hover:text-emerald-800'
            }`}
          >
            Accepted ({stats.confirmed})
          </button>
          <button
            onClick={() => setStatusFilter('declined')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'declined'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-[#0E1B2E]/70 hover:text-rose-800'
            }`}
          >
            Declined ({stats.declined})
          </button>
        </div>
      </div>

      {/* GUEST TABLE (Section 11) */}
      <div className="rounded-xl bg-white border border-[#D6B477]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0E1B2E] text-[#D6B477] font-display text-[11px] tracking-wider uppercase">
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Guests</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6B477]/30 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#0E1B2E]/60">
                    No RSVP records found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0E1B2E]">
                      <div>{r.full_name}</div>
                      {r.guest_names && (
                        <div className="text-[10px] text-[#5687AD] font-normal mt-0.5">
                          With: {r.guest_names}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#0E1B2E]/80 font-mono text-[11px]">
                      {r.phone}
                    </td>
                    <td className="py-3 px-4 text-[#0E1B2E]/80">
                      {r.email}
                    </td>
                    <td className="py-3 px-4">
                      {r.attendance === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#0E1B2E] tabular-nums">
                      {r.attendance === 'accepted' ? r.guest_count : 0}
                    </td>
                    <td className="py-3 px-4 text-[#0E1B2E]/60 text-[11px] tabular-nums">
                      {new Date(r.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedGuest(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#5687AD] bg-[#FAF7F2] hover:bg-[#0E1B2E] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border-2 border-[#D6B477] shadow-2xl relative">
            <button
              onClick={() => setSelectedGuest(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg font-bold text-[#0E1B2E] uppercase">
              GUEST RSVP DETAILS
            </h3>
            <p className="text-xs text-[#5687AD] font-semibold mb-4">
              Submitted on {new Date(selectedGuest.created_at).toLocaleString()}
            </p>

            <div className="space-y-2.5 text-xs text-[#0E1B2E] bg-[#FAF7F2]/40 p-4 rounded-xl border border-[#D6B477]/40 mb-4">
              <div>
                <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Guest Name</span>
                <span className="font-semibold text-sm">{selectedGuest.full_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Phone</span>
                  <span>{selectedGuest.phone}</span>
                </div>
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Email</span>
                  <span>{selectedGuest.email}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Attendance</span>
                  <span className={`font-bold ${selectedGuest.attendance === 'accepted' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedGuest.attendance === 'accepted' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Seats Reserved</span>
                  <span className="font-bold">{selectedGuest.guest_count}</span>
                </div>
              </div>
              {selectedGuest.guest_names && (
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Accompanying Guests</span>
                  <span>{selectedGuest.guest_names}</span>
                </div>
              )}
              {selectedGuest.dietary_or_notes && (
                <div>
                  <span className="font-bold text-[#0E1B2E]/60 uppercase block text-[10px]">Notes &amp; Wishes</span>
                  <p className="italic bg-white p-2 rounded border border-[#D6B477]/40 mt-0.5">
                    "{selectedGuest.dietary_or_notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Connection Setup & SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-white border-2 border-[#D6B477] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSqlModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-[#5687AD]" />
              <h3 className="font-display text-base font-bold text-[#0E1B2E] uppercase">
                Supabase Database Integration
              </h3>
            </div>

            <p className="text-xs text-[#0E1B2E]/80 mb-3">
              The application stores RSVPs in local storage automatically and can synchronize in real-time to a Supabase project when environment variables <code className="bg-[#FAF7F2] px-1 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-[#FAF7F2] px-1 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code> are provided.
            </p>

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E1B2E] uppercase">SQL Migration for Supabase:</span>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0E1B2E] text-[#FAF7F2] text-xs font-medium cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#0E1B2E] text-[#FAF7F2] rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed select-all">
              {SUPABASE_SETUP_SQL}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual RSVP Logging Modal */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border-2 border-[#D6B477] shadow-2xl relative">
            <button
              onClick={() => setShowAddGuestModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-base font-bold text-[#0E1B2E] uppercase">
              Log Offline / Phone RSVP
            </h3>
            <p className="text-xs text-[#5687AD] font-semibold mb-4">
              Directly record an RSVP response received via phone, SMS, or committee liaison.
            </p>

            <form onSubmit={handleSaveManualGuest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief O. Okeke"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234..."
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="guest@email.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                    Attendance
                  </label>
                  <select
                    value={manualAttendance}
                    onChange={(e) => setManualAttendance(e.target.value as 'accepted' | 'declined')}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none"
                  >
                    <option value="accepted">Joyfully Accepts</option>
                    <option value="declined">Regretfully Declines</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                    Seats Reserved
                  </label>
                  <select
                    disabled={manualAttendance === 'declined'}
                    value={manualCount}
                    onChange={(e) => setManualCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none disabled:opacity-50"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0E1B2E] uppercase mb-1">
                  Notes / VIP Designation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Groom VIP relative table, special dietary..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#D6B477]/70 text-xs font-semibold text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-4 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] cursor-pointer disabled:opacity-50"
                >
                  {isSavingManual ? 'Saving...' : 'Save Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Background Music Configuration Modal */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border-2 border-[#D6B477] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#0E1B2E] text-[#D6B477] flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-bold text-[#0E1B2E] uppercase">
                Wedding Background Music
              </h3>
            </div>
            <p className="text-xs text-[#0E1B2E]/70 mb-4">
              Configure the romantic song playing gently in the background when guests open the digital invitation.
            </p>

            {musicNotice && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{musicNotice}</span>
              </div>
            )}

            {/* Audio Preview & Toggle Player */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D6B477]/50 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E1B2E] block">
                  Soundtrack Status
                </span>
                <span className="text-xs text-[#5687AD] font-medium">
                  {musicPlaying ? 'Currently Playing ♪' : 'Currently Muted'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const state = toggleBackgroundMusic();
                  setMusicPlaying(state);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1B2E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3152] transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#D6B477]" />
                <span>{musicPlaying ? 'Pause Audio' : 'Preview Song'}</span>
              </button>
            </div>

            {/* Method A: Paste Audio URL */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-[#0E1B2E] uppercase mb-1">
                  Option 1: Direct Audio URL (MP3 / M4A / WAV)
                </label>
                <input
                  type="url"
                  placeholder="https://.../wedding_song.mp3"
                  value={musicUrlInput}
                  onChange={(e) => setMusicUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D6B477]/70 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#5687AD]"
                />
                <p className="text-[10px] text-[#0E1B2E]/60 mt-1">
                  Works with Cloudinary audio links, Dropbox direct links, Google Drive direct links, or AWS S3 MP3s.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomMusicUrl(musicUrlInput);
                    setMusicNotice('Audio URL successfully updated and saved!');
                    setMusicPlaying(isBgMusicPlaying());
                    setTimeout(() => setMusicNotice(null), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] cursor-pointer"
                >
                  Save Soundtrack URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMusicUrlInput(DEFAULT_WEDDING_SONG_URL);
                    setCustomMusicUrl(DEFAULT_WEDDING_SONG_URL);
                    setMusicNotice(`Restored default song: ${WEDDING_SONG_TITLE}`);
                    setMusicPlaying(isBgMusicPlaying());
                    setTimeout(() => setMusicNotice(null), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-[#D6B477]/70 text-xs font-semibold text-[#0E1B2E] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Reset to Default Song
                </button>
              </div>
            </div>

            {/* Method B: Upload from Device */}
            <div className="pt-3 border-t border-[#D6B477]/30 space-y-2 mb-4">
              <label className="block text-xs font-bold text-[#0E1B2E] uppercase">
                Option 2: Upload Audio File From Device
              </label>
              <div className="p-3 border-2 border-dashed border-[#D6B477]/60 rounded-xl text-center bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  id="admin-audio-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (uploadEvt) => {
                      const dataUrl = uploadEvt.target?.result as string;
                      if (dataUrl) {
                        setMusicUrlInput(`[Local File: ${file.name}]`);
                        setCustomMusicUrl(dataUrl);
                        setMusicNotice(`Loaded and saved "${file.name}"!`);
                        setMusicPlaying(isBgMusicPlaying());
                        setTimeout(() => setMusicNotice(null), 4000);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <label
                  htmlFor="admin-audio-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0E1B2E] bg-white border border-[#D6B477] shadow-2xs hover:bg-[#0E1B2E] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Audio File (.mp3, .m4a, .wav)</span>
                </label>
                <p className="text-[10px] text-[#0E1B2E]/60 mt-1">
                  Upload your favorite couple song directly from your phone or computer.
                </p>
              </div>
            </div>

            {/* How it plays */}
            <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200 text-[11px] text-[#0E1B2E]/80 leading-relaxed space-y-1">
              <div className="font-bold text-[#0E1B2E]">How Guests Hear the Music:</div>
              <div>
                1. Browsers require a user tap before playing audio. When guests tap the screen to break the wax seal and open the physical envelope, audio playback begins smoothly in the background.
              </div>
              <div>
                2. Guests can always mute or unmute anytime using the luxury "Music" button on the invitation header.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D6B477]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMusicModal(false)}
                className="px-4 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#5687AD] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

