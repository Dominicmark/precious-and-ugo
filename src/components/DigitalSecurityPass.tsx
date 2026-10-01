import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RSVPRecord } from '../types/rsvp';
import { getOfficialCardUrl } from '../lib/invitationCardAsset';
import {
  generateInvitationCardJPEG,
  downloadInvitationCardJPEG,
} from '../lib/invitationCardGenerator';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Download,
  Share2,
  X,
  QrCode,
  Image as ImageIcon,
  CreditCard,
  Maximize2,
  Check,
  Loader2,
} from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface DigitalSecurityPassProps {
  record: RSVPRecord;
  onClose?: () => void;
}

export const DigitalSecurityPass: React.FC<DigitalSecurityPassProps> = ({
  record,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pass' | 'card'>('pass');
  const [cardUrl, setCardUrl] = useState<string>(getOfficialCardUrl());
  const [personalizedCardJpeg, setPersonalizedCardJpeg] = useState<string | null>(null);
  const [isGeneratingJpeg, setIsGeneratingJpeg] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const seats = record.allocated_seats || record.guest_count || 1;
  const isApproved = record.status === 'approved';

  useEffect(() => {
    let isMounted = true;
    setIsGeneratingJpeg(true);
    generateInvitationCardJPEG(record)
      .then((dataUrl) => {
        if (isMounted) setPersonalizedCardJpeg(dataUrl);
      })
      .catch((err) => {
        console.warn('Personalized card generation notice:', err);
      })
      .finally(() => {
        if (isMounted) setIsGeneratingJpeg(false);
      });
    return () => {
      isMounted = false;
    };
  }, [record]);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ url: string }>;
      if (custom.detail?.url) {
        setCardUrl(custom.detail.url);
      }
    };
    window.addEventListener('wedding-card-updated', handleUpdate);
    return () => window.removeEventListener('wedding-card-updated', handleUpdate);
  }, []);

  const sharePass = () => {
    const text = `Official Wedding Invitation & Security Pass for Precious & Ugochukwu (#UgoAmaka26):\n\nGuest: ${record.full_name}\nAccess: ${seats} Seat(s)\nTable: ${record.table_assignment || 'VIP Protocol Table'}\nRef Code: ${record.reference_code}\nDate: Friday, 13 Nov 2026 · 10:00 AM\nVenue: Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki Abuja\nDress: Strictly Black-Tie`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const addToCalendar = () => {
    const title = encodeURIComponent('Precious & Ugochukwu Wedding (#UgoAmaka26)');
    const details = encodeURIComponent(
      `Wedding Celebration for Precious Uzoamaka & Ugochukwu Omeogu.\nRef Code: ${record.reference_code}\nReserved Seats: ${seats}\nTable: ${record.table_assignment || 'VIP Protocol Table'}\nDress Code: Strictly Black-Tie Formal Western Attire (No Traditional Attire).`
    );
    const location = encodeURIComponent('Tee s Cee Event Center, 6, Faskari Street, Area 3, Garki, Abuja, Nigeria');
    const start = '20261113T090000Z';
    const end = '20261113T180000Z';
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      await downloadInvitationCardJPEG(record);
    } catch (err) {
      console.warn('Error downloading card JPEG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        className="relative w-full max-w-lg my-auto"
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-30 w-9 h-9 rounded-full bg-[#0E1B2E] text-white border-2 border-[#D6B477] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#ECC880]" />
          </button>
        )}

        {/* Top Segmented Controls: Gate Pass vs Official Card */}
        <div className="mb-3 flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-black/60 border border-[#D6B477]/40 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('pass')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pass'
                  ? 'bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Gate Pass &amp; QR</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Official Invitation Card</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GATE PASS & QR */}
        {activeTab === 'pass' && (
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0E1B2E] via-[#142338] to-[#0E1B2E] text-white border-2 border-[#D6B477] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden p-6 sm:p-7">
            {/* Gold Foil Top Border */}
            <div className="absolute top-0 inset-x-0 h-2 gold-foil-gradient" />

            {/* Ambient Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6B477]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8FB5D1]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="text-center pb-4 border-b border-[#D6B477]/30">
              <div className="flex justify-center mb-3">
                <WaxSeal size={52} />
              </div>

              <p className="font-display text-[10px] tracking-[0.3em] font-bold text-[#D6B477] uppercase">
                Official Digital Security Pass
              </p>
              <h2 className="font-display text-lg sm:text-xl font-black text-white tracking-wider uppercase mt-0.5">
                Precious &amp; Ugochukwu
              </h2>
              <p className="text-[11px] tracking-widest text-white/60 font-serif-luxury uppercase">
                Solemnization of Holy Matrimony
              </p>
            </div>

            {/* Security Status Badge */}
            <div className="my-4 flex items-center justify-between bg-black/40 border border-[#D6B477]/40 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                {isApproved ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#ECC880]" />
                )}
                <div className="text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-white/60 font-semibold">
                    Gate Verification
                  </span>
                  <span
                    className={`text-xs font-bold tracking-wider uppercase ${
                      isApproved ? 'text-emerald-400' : 'text-[#ECC880]'
                    }`}
                  >
                    {isApproved ? 'CONFIRMED & APPROVED' : 'UNDER PROTOCOL REVIEW'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-wider text-white/60 font-semibold">
                  Ref No.
                </span>
                <span className="font-mono text-sm font-extrabold text-[#ECC880] tracking-wider">
                  {record.reference_code}
                </span>
              </div>
            </div>

            {/* Guest Identity & Seat Allotment */}
            <div className="space-y-3.5 my-4 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6B477] font-bold block">
                  Honoured Guest
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-wide mt-0.5">
                  {record.full_name}
                </h3>
                {record.guest_names && record.guest_names !== record.full_name && (
                  <p className="text-xs text-white/70 italic mt-0.5">
                    Accompanying: {record.guest_names}
                  </p>
                )}
              </div>

              {/* Seat & Table Allocation */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-[#D6B477]/30 text-center">
                  <span className="text-[9px] uppercase tracking-wider text-white/60 block font-semibold">
                    Access Allocation
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-[#ECC880]" />
                    Admit {seats} {seats === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-[#D6B477]/30 text-center">
                  <span className="text-[9px] uppercase tracking-wider text-white/60 block font-semibold">
                    Table Assignment
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#ECC880] truncate block mt-0.5">
                    {record.table_assignment || 'VIP Protocol Table'}
                  </span>
                </div>
              </div>

              {/* Event Time & Venue */}
              <div className="p-3 rounded-xl bg-white/5 border border-[#D6B477]/25 text-left text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#ECC880] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      Friday, 13 November 2026
                    </span>
                    <span className="text-white/70 text-[11px]">
                      Ceremony &amp; Reception · 10:00 AM Prompt
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ECC880] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      Tee s Cee Event Center
                    </span>
                    <span className="text-white/70 text-[11px]">
                      6, Faskari Street, Area 3, Garki Abuja
                    </span>
                  </div>
                </div>
              </div>

              {/* Dress Code Notice */}
              <div className="px-3 py-1.5 rounded-lg bg-[#ECC880]/15 border border-[#ECC880]/40 text-center">
                <span className="text-[10px] font-bold text-[#ECC880] tracking-wider uppercase block">
                  Dress Code: Strictly Black-Tie Formal Western Attire
                </span>
                <span className="text-[9px] text-white/75 block">
                  No Traditional Attire · Security Verification Required at Gate
                </span>
              </div>
            </div>

            {/* QR Strip */}
            <div className="pt-3 border-t border-[#D6B477]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-10 h-10 text-[#ECC880]" />
                <div className="text-left text-[9px] text-white/60">
                  <span className="block font-mono text-white/90 font-bold">
                    PASS #{record.reference_code}
                  </span>
                  <span>Non-Transferable Gate Pass</span>
                </div>
              </div>

              <span className="font-display text-[9px] tracking-widest text-[#D6B477] uppercase font-bold">
                #UgoAmaka26
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] font-bold text-xs hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0E1B2E]" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#0E1B2E]" />
                )}
                <span>{isDownloading ? 'Saving...' : 'Save Card'}</span>
              </button>

              <button
                onClick={sharePass}
                className="py-2.5 px-2 rounded-xl bg-white/15 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#D6B477]/40"
              >
                <Share2 className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={addToCalendar}
                className="py-2.5 px-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>Calendar</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL INVITATION CARD (PNG/JPEG IMAGE ASSET) */}
        {activeTab === 'card' && (
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0E1B2E] via-[#142338] to-[#0E1B2E] text-white border-2 border-[#D6B477] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden p-5 sm:p-6 text-center space-y-4">
            <div className="absolute top-0 inset-x-0 h-2 gold-foil-gradient" />

            <div>
              <p className="font-display text-[10px] tracking-[0.3em] font-bold text-[#D6B477] uppercase">
                Official Wedding Stationery
              </p>
              <h3 className="font-display text-base sm:text-lg font-bold uppercase text-white mt-0.5">
                Official Invitation Card (JPEG)
              </h3>
              <p className="text-[11px] text-white/60">
                Personalized for {record.full_name} · Ref #{record.reference_code}
              </p>
            </div>

            {/* Card Graphic Container with Gold Border */}
            <div className="relative rounded-xl overflow-hidden border-2 border-[#D6B477]/80 shadow-2xl bg-black group min-h-[320px] flex items-center justify-center">
              {isGeneratingJpeg && !personalizedCardJpeg ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-white/70">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ECC880]" />
                  <span className="text-xs font-medium">Generating your personalized invitation card JPEG...</span>
                </div>
              ) : (
                <img
                  src={personalizedCardJpeg || cardUrl}
                  alt={`Official Wedding Invitation Card for ${record.full_name}`}
                  className="w-full h-auto max-h-[480px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
              )}

              {/* Watermark Reference on Card */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-[#0E1B2E]/90 border border-[#D6B477]/60 text-[9px] font-mono text-[#ECC880] shadow-md backdrop-blur-xs">
                Ref: {record.reference_code}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0E1B2E]" />
                ) : (
                  <Download className="w-4 h-4 text-[#0E1B2E]" />
                )}
                <span>{isDownloading ? 'Saving JPEG to Phone...' : 'Download JPEG Card to Phone'}</span>
              </button>

              <button
                onClick={sharePass}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#ECC880]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
