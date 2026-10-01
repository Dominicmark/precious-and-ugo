import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';

export const ContactButtons: React.FC = () => {
  const phoneFormatted = '+234 703 431 0865';
  const phoneRaw = '+2347034310865';
  const whatsappUrl = `https://wa.me/2347034310865?text=${encodeURIComponent(
    'Hello Precious & Ugochukwu! I am contacting you regarding your wedding celebration (#UgoAmaka26).'
  )}`;
  const callUrl = `tel:${phoneRaw}`;

  return (
    <div className="w-full max-w-[460px] mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Get In Touch
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h4 className="font-display text-xs sm:text-sm tracking-wider text-[#0E1B2E] font-bold uppercase mb-3">
        QUESTIONS OR SPECIAL ACCOMMODATIONS
      </h4>

      {/* Main Luxury Contact Card in Website Ivory/Parchment Style */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAF5EA] to-[#F3EAD8] border-2 border-[#D6B477] shadow-md space-y-3.5">
        <div className="text-center">
          <p className="text-[11px] text-[#0E1B2E]/70 uppercase tracking-widest font-bold">
            Official Protocol &amp; Helpline
          </p>
          <p className="font-mono text-base sm:text-lg font-black text-[#0E1B2E] tracking-wider mt-0.5">
            {phoneFormatted}
          </p>
        </div>

        {/* Dual Actions: WhatsApp Chat & Direct Phone Call */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white border border-[#25D366]/40 shadow-xs hover:border-[#25D366] hover:bg-[#25D366]/5 active:scale-98 transition-all group cursor-pointer"
            aria-label="Chat on WhatsApp with Protocol Team"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <span className="font-display text-xs font-bold text-[#0E1B2E] group-hover:text-[#25D366] transition-colors block">
                Chat on WhatsApp
              </span>
              <span className="text-[10px] text-gray-500 font-semibold block">
                Instant Messaging
              </span>
            </div>
          </a>

          {/* Direct Phone Call Action */}
          <a
            href={callUrl}
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white border border-[#D6B477]/60 shadow-xs hover:border-[#0E1B2E] hover:bg-[#0E1B2E]/5 active:scale-98 transition-all group cursor-pointer"
            aria-label="Direct Telephone Call to Protocol Helpline"
          >
            <div className="w-8 h-8 rounded-full bg-[#0E1B2E] text-[#ECC880] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <span className="font-display text-xs font-bold text-[#0E1B2E] transition-colors block">
                Direct Phone Call
              </span>
              <span className="text-[10px] text-gray-500 font-semibold block">
                Voice Dial
              </span>
            </div>
          </a>
        </div>

        <p className="text-[10px] text-gray-500 italic pt-1">
          Available for VIP arrivals, dietary inquiries, and protocol assistance.
        </p>
      </div>
    </div>
  );
};
