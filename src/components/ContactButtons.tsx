import React from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';

export const ContactButtons: React.FC = () => {
  const phoneRaw = '+2348030000000';
  const whatsappUrl = `https://wa.me/2348030000000?text=${encodeURIComponent(
    'Hello Precious & Ugochukwu! I am contacting you regarding your wedding #UgoAmaka26.'
  )}`;
  const emailUrl = `mailto:ugoamaka26@gmail.com?subject=${encodeURIComponent(
    'Wedding RSVP Inquiry - #UgoAmaka26'
  )}&body=${encodeURIComponent(
    'Warm congratulations Precious and Ugochukwu!\n\nI have an inquiry regarding the wedding celebration:'
  )}`;

  return (
    <div className="w-full max-w-[440px] mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Get In Touch
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h4 className="font-display text-sm tracking-wider text-[#0E1B2E] font-bold uppercase mb-3">
        WEDDING LIAISON &amp; PROTOCOL
      </h4>

      {/* Buttons Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* CALL */}
        <a
          href={`tel:${phoneRaw}`}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/95 border border-[#D6B477]/60 shadow-sm hover:border-[#8FB5D1] hover:shadow-md active:scale-95 transition-all duration-200 group"
          aria-label="Call wedding hotline"
        >
          <div className="w-9 h-9 rounded-full bg-[#0E1B2E] text-[#D6B477] flex items-center justify-center mb-1.5 group-hover:bg-[#1A3152] group-hover:text-[#8FB5D1] transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <span className="font-display text-[11px] font-bold tracking-wider text-[#0E1B2E] uppercase">
            CALL
          </span>
          <span className="text-[10px] text-[#0E1B2E]/60 mt-0.5 hidden sm:block">
            +234 803 000
          </span>
        </a>

        {/* WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/95 border border-[#D6B477]/60 shadow-sm hover:border-[#25D366] hover:shadow-md active:scale-95 transition-all duration-200 group"
          aria-label="Open WhatsApp chat with couple"
        >
          <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="font-display text-[11px] font-bold tracking-wider text-[#0E1B2E] uppercase">
            WHATSAPP
          </span>
          <span className="text-[10px] text-[#0E1B2E]/60 mt-0.5 hidden sm:block">
            Instant Chat
          </span>
        </a>

        {/* EMAIL */}
        <a
          href={emailUrl}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/95 border border-[#D6B477]/60 shadow-sm hover:border-[#8FB5D1] hover:shadow-md active:scale-95 transition-all duration-200 group"
          aria-label="Send email to couple"
        >
          <div className="w-9 h-9 rounded-full bg-[#0E1B2E] text-[#D6B477] flex items-center justify-center mb-1.5 group-hover:bg-[#1A3152] group-hover:text-[#8FB5D1] transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-display text-[11px] font-bold tracking-wider text-[#0E1B2E] uppercase">
            EMAIL
          </span>
          <span className="text-[10px] text-[#0E1B2E]/60 mt-0.5 hidden sm:block">
            ugoamaka26
          </span>
        </a>
      </div>
    </div>
  );
};
