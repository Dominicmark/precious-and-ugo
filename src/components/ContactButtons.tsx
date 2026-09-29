import React from 'react';
import { MessageCircle } from 'lucide-react';

export const ContactButtons: React.FC = () => {
  const whatsappUrl = `https://wa.me/2348030000000?text=${encodeURIComponent(
    'Hello Precious & Ugochukwu! I am contacting you regarding your wedding celebration (#UgoAmaka26).'
  )}`;

  return (
    <div className="w-full max-w-[420px] mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Get In Touch
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h4 className="font-display text-xs sm:text-sm tracking-wider text-[#0E1B2E] font-bold uppercase mb-3">
        QUESTIONS OR SPECIAL ACCOMMODATIONS CONTACT
      </h4>

      {/* WhatsApp Strictly Card */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 border-2 border-[#D6B477]/70 shadow-sm hover:border-[#25D366] hover:shadow-md active:scale-98 transition-all duration-200 group"
        aria-label="Open WhatsApp chat for questions or accommodations"
      >
        <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className="font-display text-xs sm:text-sm font-bold tracking-wider text-[#0E1B2E] uppercase group-hover:text-[#25D366] transition-colors">
            WHATSAPP DIRECT CONTACT
          </div>
          <div className="text-xs text-[#0E1B2E]/70 font-mono font-medium">
            +234 803 000 0000
          </div>
        </div>
      </a>
    </div>
  );
};
