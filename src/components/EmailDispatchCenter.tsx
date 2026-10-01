import React, { useState, useMemo } from 'react';
import { RSVPRecord } from '../types/rsvp';
import {
  generateWeddingEmail,
  generateMailtoUrl,
  sendEmailViaService,
  EmailCustomization,
} from '../lib/emailTemplates';
import {
  Mail,
  Send,
  Eye,
  Check,
  Copy,
  ExternalLink,
  Settings,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface EmailDispatchCenterProps {
  records: RSVPRecord[];
  onShowToast: (msg: string) => void;
  onRefreshRecords?: () => void;
}

export const EmailDispatchCenter: React.FC<EmailDispatchCenterProps> = ({
  records,
  onShowToast,
  onRefreshRecords,
}) => {
  const [templateType, setTemplateType] = useState<'approval' | 'acknowledgment' | 'waitlist'>('approval');
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [includeCardImage, setIncludeCardImage] = useState<boolean>(true);

  // Settings
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('ugoamaka26_resend_key') || '');
  const [senderName, setSenderName] = useState<string>(() => localStorage.getItem('ugoamaka26_sender_name') || 'Precious & Ugochukwu (#UgoAmaka26)');

  // Send state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Filter approved & pending guests with valid emails
  const approvedGuests = useMemo(() => {
    return records.filter((r) => r.status === 'approved' && r.email && r.email.includes('@'));
  }, [records]);

  const pendingGuests = useMemo(() => {
    return records.filter((r) => r.status === 'pending' && r.email && r.email.includes('@'));
  }, [records]);

  const targetGuests = useMemo(() => {
    if (templateType === 'approval') return approvedGuests;
    if (templateType === 'acknowledgment') return pendingGuests;
    return records.filter((r) => r.status === 'waitlisted' && r.email);
  }, [templateType, approvedGuests, pendingGuests, records]);

  // Selected Guest or sample guest for preview
  const activeGuest: RSVPRecord = useMemo(() => {
    if (selectedGuestId) {
      const found = records.find((r) => r.id === selectedGuestId);
      if (found) return found;
    }
    if (targetGuests.length > 0) {
      return targetGuests[0];
    }
    // Mock sample for preview if no guest exists
    return {
      id: 'preview-sample',
      reference_code: 'UGO-PREVIEW',
      full_name: 'Dr. & Mrs. Emeka Okafor',
      phone: '+234 703 431 0865',
      email: 'guest@example.com',
      attendance: 'accepted',
      status: templateType === 'approval' ? 'approved' : templateType === 'acknowledgment' ? 'pending' : 'waitlisted',
      guest_count: 2,
      allocated_seats: 2,
      guest_names: 'Mrs. Chidinma Okafor',
      relationship: "Groom's Family / Elder",
      table_assignment: 'Table 2 - Groom\'s Family (Elders)',
      wedding_slug: 'ugoamaka26',
      created_at: new Date().toISOString(),
    };
  }, [selectedGuestId, records, targetGuests, templateType]);

  // Generate Current Email
  const customization: EmailCustomization = useMemo(() => {
    return {
      subject: customSubject || undefined,
      message: customMessage || undefined,
      includeCardImage,
    };
  }, [customSubject, customMessage, includeCardImage]);

  const generatedEmail = useMemo(() => {
    return generateWeddingEmail(templateType, activeGuest, customization);
  }, [templateType, activeGuest, customization]);

  // Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ugoamaka26_resend_key', apiKey.trim());
    localStorage.setItem('ugoamaka26_sender_name', senderName.trim());
    setShowSettingsModal(false);
    onShowToast('Email Dispatch Settings saved');
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedEmail.html);
    setCopiedHtml(true);
    onShowToast('Full styled HTML copied to clipboard (ready to paste in Gmail/Outlook)');
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleOpenMailto = () => {
    if (!activeGuest.email) {
      onShowToast('This guest has no email address');
      return;
    }
    const url = generateMailtoUrl(activeGuest.email, generatedEmail.subject, generatedEmail.text);
    window.open(url, '_blank');
  };

  const handleSendSingle = async () => {
    if (!activeGuest.email) {
      onShowToast('Please select a guest with a valid email address');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendEmailViaService({
        to: activeGuest.email,
        subject: generatedEmail.subject,
        html: generatedEmail.html,
        text: generatedEmail.text,
        apiKey: apiKey.trim() || undefined,
      });

      if (res.success) {
        onShowToast(`Official invitation sent to ${activeGuest.full_name} (${activeGuest.email})`);
      } else {
        // Offer graceful fallback
        onShowToast(`Notice: ${res.message}. Opening via default email client...`);
        handleOpenMailto();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleBatchSendApproved = async () => {
    if (approvedGuests.length === 0) {
      onShowToast('No approved guests with email addresses found');
      return;
    }

    if (!window.confirm(`Are you sure you want to dispatch official invitation emails to all ${approvedGuests.length} approved guests?`)) {
      return;
    }

    setIsSending(true);
    setBatchProgress({ current: 0, total: approvedGuests.length });

    let sentCount = 0;
    for (let i = 0; i < approvedGuests.length; i++) {
      const g = approvedGuests[i];
      setBatchProgress({ current: i + 1, total: approvedGuests.length });

      const emailData = generateWeddingEmail('approval', g, customization);
      try {
        await sendEmailViaService({
          to: g.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          apiKey: apiKey.trim() || undefined,
        });
        sentCount++;
      } catch (e) {
        console.error('Batch send failed for:', g.email, e);
      }
      // Small pause to prevent rate limiting
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsSending(false);
    setBatchProgress(null);
    onShowToast(`Dispatched official invitations to ${sentCount} approved guests!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER & CONTROL BAR */}
      <div className="p-5 rounded-2xl bg-white border border-[#D6B477]/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
            Automated Protocol Mailer &amp; Invitation Dispatch Hub
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#0E1B2E] mt-0.5">
            Personalized Email Dispatcher
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Dispatch personalized Official Invitation Cards, seating allocations, and RSVP review notifications directly to guest inboxes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Configure Mailer API / Resend Key"
          >
            <Settings className="w-4 h-4 text-gray-600" />
            <span>Mailer Settings</span>
          </button>

          {templateType === 'approval' && (
            <button
              onClick={handleBatchSendApproved}
              disabled={isSending || approvedGuests.length === 0}
              className="px-4 py-2 rounded-xl bg-[#0E1B2E] hover:bg-[#142338] text-[#ECC880] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#ECC880]" />
              <span>
                {isSending && batchProgress
                  ? `Sending (${batchProgress.current}/${batchProgress.total})...`
                  : `Batch Send to All Approved (${approvedGuests.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* WORKSPACE: TEMPLATE CUSTOMIZER (LEFT) & LIVE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CUSTOMIZATION CONTROLS (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Template Selector Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6B477]/60 shadow-xs space-y-3">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
              1. Select Email Workflow
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('approval')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  templateType === 'approval'
                    ? 'bg-[#0E1B2E] text-[#ECC880] border-[#D6B477]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>VIP Approved</span>
                </div>
                <span className="text-[10px] block font-normal opacity-80">
                  Sends Card &amp; Table
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('acknowledgment')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  templateType === 'acknowledgment'
                    ? 'bg-[#0E1B2E] text-[#ECC880] border-[#D6B477]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>Under Review</span>
                </div>
                <span className="text-[10px] block font-normal opacity-80">
                  Hides Venue/Seats
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('waitlist')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  templateType === 'waitlist'
                    ? 'bg-[#0E1B2E] text-[#ECC880] border-[#D6B477]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>Waitlist</span>
                </div>
                <span className="text-[10px] block font-normal opacity-80">
                  100 Capacity Regret
                </span>
              </button>
            </div>
          </div>

          {/* Guest Selector Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6B477]/60 shadow-xs space-y-2">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
              2. Target Guest Recipient
            </label>

            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
            >
              <option value="">Choose from {targetGuests.length} guests in this status...</option>
              {targetGuests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.full_name} ({g.email || 'No email'}) · {g.reference_code}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span>Selected Email:</span>
              <span className="font-mono font-bold text-[#0E1B2E]">
                {activeGuest.email || 'None'}
              </span>
            </div>
          </div>

          {/* Email Content Editor */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6B477]/60 shadow-xs space-y-3">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
              3. Customize Email Copy
            </label>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Subject Line:
              </span>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder={generatedEmail.subject}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Custom Body Message (Optional):
              </span>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Leave blank to use default royal invitation phrasing..."
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
              />
            </div>

            {templateType === 'approval' && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={includeCardImage}
                  onChange={(e) => setIncludeCardImage(e.target.checked)}
                  className="rounded text-[#D6B477] focus:ring-[#D6B477]"
                />
                <span className="text-xs text-gray-700 font-medium">
                  Embed Official Invitation Card Graphic
                </span>
              </label>
            )}
          </div>

          {/* Action Buttons for Selected Guest */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0E1B2E] to-[#142338] text-white border border-[#D6B477] shadow-md space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ECC880] block">
              Dispatch Options for {activeGuest.full_name}
            </span>

            <button
              onClick={handleSendSingle}
              disabled={isSending || !activeGuest.email}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D6B477] text-[#0E1B2E] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Dispatching...' : 'Send Official Email Now'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleOpenMailto}
                disabled={!activeGuest.email}
                className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer disabled:opacity-50"
                title="Open in your default email software (Gmail, Outlook, Apple Mail)"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>Open in Mail App</span>
              </button>

              <button
                onClick={handleCopyHtml}
                className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
                title="Copy styled HTML to paste directly in email client"
              >
                {copiedHtml ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#ECC880]" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE VISUAL EMAIL PREVIEW (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#D6B477]" />
              Live Inbox Preview
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              Responsive Royal HTML Email
            </span>
          </div>

          <div className="rounded-3xl border-2 border-[#D6B477]/80 bg-white shadow-xl overflow-hidden">
            {/* Mock Email Client Title Bar */}
            <div className="p-3 bg-gray-100 border-b border-gray-200 text-xs text-gray-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="font-semibold text-gray-700 ml-2 truncate">
                  Subject: {generatedEmail.subject}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                To: {activeGuest.email || 'guest@email.com'}
              </span>
            </div>

            {/* Embedded Live HTML Iframe */}
            <div className="p-4 bg-[#F4EBD9] overflow-y-auto max-h-[600px] flex justify-center">
              <iframe
                title="Live Email Preview"
                srcDoc={generatedEmail.html}
                className="w-full min-h-[560px] border-0 rounded-xl bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: MAILER API SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-display text-base font-bold uppercase text-[#0E1B2E]">
                Email Dispatch Configuration
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              To send automated emails directly from the server or background, enter your <strong>Resend API Key</strong> (get one free at resend.com - 3,000 free emails/month). If empty, the system will use direct email client dispatch (`mailto:`) and one-click rich HTML copying.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">
                  Resend API Key (Optional):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="re_123456789..."
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs font-mono text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">
                  Sender Display Name:
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold uppercase tracking-wider hover:bg-[#142338]"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
