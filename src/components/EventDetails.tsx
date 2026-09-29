import React from 'react';
import { Calendar, ShieldAlert } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const EventDetails: React.FC = () => {
  // Google Calendar link for 13 Nov 2026 16:00 to 22:00 WAT (15:00Z to 21:00Z)
  const gcalUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Celebration:+Precious+%26+Ugochukwu+%23UgoAmaka26&dates=20261113T150000Z/20261113T210000Z&details=The+Wedding+Celebration+of+Precious+Uzoamaka+Mark+%26+Ugochukwu+Cyril+Omeogu.+Strictly+by+Invitation.+Hashtag:+%23UgoAmaka26';

  const downloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UgoAmaka26//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Wedding Celebration: Precious & Ugochukwu (#UgoAmaka26)',
      'UID:ugoamaka26-wedding-20261113@wedding.ng',
      'DTSTART:20261113T150000Z',
      'DTEND:20261113T210000Z',
      'DESCRIPTION:The Wedding Celebration of Precious Uzoamaka Mark & Ugochukwu Cyril Omeogu. Strictly by Invitation.',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'UgoAmaka26_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto text-center">
      {/* Editorial Header */}
      <ScrollReveal direction="up" distance={14} duration={700} className="flex items-center justify-center gap-2 mb-3">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Date &amp; Celebration Time
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </ScrollReveal>

      <ScrollReveal direction="up" distance={18} delay={120} duration={750}>
        <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] border-2 border-[#D6B477]/70 shadow-[0_12px_30px_-5px_rgba(14,27,46,0.1)]">
        {/* Corner filigree accents */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D6B477]" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#D6B477]" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#D6B477]" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D6B477]" />

        {/* Date & Time */}
        <div className="my-2">
          <p className="font-serif-luxury text-sm tracking-[0.25em] text-[#5687AD] font-bold uppercase">
            Friday, 13 November 2026
          </p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#0E1B2E] tracking-wider mt-2 mb-1">
            4:00 PM WAT
          </p>
        </div>

        {/* Hairline Divider with center diamond */}
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="w-12 h-[1px] bg-[#D6B477]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#8FB5D1]" />
          <span className="w-12 h-[1px] bg-[#D6B477]" />
        </div>

        {/* STRICTLY BY INVITATION NOTICE */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0E1B2E]/5 border border-[#0E1B2E]/20 mb-5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#5687AD]" />
          <span className="font-serif-luxury text-[11px] font-bold tracking-[0.2em] text-[#0E1B2E] uppercase">
            Strictly by Invitation
          </span>
        </div>

        {/* Calendar Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0E1B2E] bg-white border border-[#D6B477]/70 shadow-2xs hover:border-[#8FB5D1] hover:text-[#5687AD] active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-[#8FB5D1]" />
            <span>Google Calendar</span>
          </a>

          <button
            onClick={downloadICS}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0E1B2E] bg-white border border-[#D6B477]/70 shadow-2xs hover:border-[#8FB5D1] hover:text-[#5687AD] active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>Apple / Outlook (.ics)</span>
          </button>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};
