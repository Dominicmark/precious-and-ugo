import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, ShieldAlert, Copy, Check, Car, UserCheck } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const venueAddress = 'Tee Scee Event Center, 6 Area 3, Garki, Abuja, Nigeria';

  // Google Maps Search URL for Tee Scee Event Center, Area 3 Garki Abuja
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Tee+Scee+Event+Center+Area+3+Garki+Abuja';

  // Google Calendar link for 13 Nov 2026 10:00 to 18:00 WAT (09:00Z to 17:00Z)
  const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception:+Precious+%26+Ugochukwu+%23UgoAmaka26&dates=20261113T090000Z/20261113T170000Z&details=The+Wedding+Reception+of+Precious+Uzoamaka+Mark+%26+Ugochukwu+Cyril+Omeogu.+Strictly+by+Invitation.+Hashtag:+%23UgoAmaka26&location=Tee+Scee+Event+Center,+6+Area+3,+Garki,+Abuja';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(venueAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const downloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UgoAmaka26//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Wedding Reception: Precious & Ugochukwu (#UgoAmaka26)',
      'UID:ugoamaka26-wedding-20261113@wedding.ng',
      'DTSTART:20261113T090000Z',
      'DTEND:20261113T170000Z',
      'LOCATION:Tee Scee Event Center, 6 Area 3, Garki, Abuja, Nigeria',
      'DESCRIPTION:The Wedding Reception of Precious Uzoamaka Mark & Ugochukwu Cyril Omeogu. Strictly by Invitation.',
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
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Celebration Venue &amp; Time
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] border-2 border-[#D6B477]/70 shadow-[0_12px_30px_-5px_rgba(14,27,46,0.1)]">
        {/* Corner filigree accents */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D6B477]" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#D6B477]" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#D6B477]" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D6B477]" />

        {/* Date & Time */}
        <div className="mb-4">
          <p className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] font-bold uppercase">
            Friday, 13 November 2026
          </p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#0E1B2E] tracking-wider mt-1">
            10:00 AM WAT
          </p>
        </div>

        {/* Hairline Divider with center diamond */}
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="w-12 h-[1px] bg-[#D6B477]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#8FB5D1]" />
          <span className="w-12 h-[1px] bg-[#D6B477]" />
        </div>

        {/* Venue Location */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-11 h-11 rounded-full bg-[#0E1B2E] flex items-center justify-center text-[#D6B477] mb-2.5 shadow-md">
            <MapPin className="w-5 h-5 text-[#D6B477]" />
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-[#0E1B2E] tracking-wide">
            TEE SCEE EVENT CENTER
          </h4>
          <p className="text-xs sm:text-sm text-[#0E1B2E]/85 mt-1 font-medium">
            6 Area 3, Garki, Abuja
          </p>

          {/* Quick Copy Address Button */}
          <button
            onClick={handleCopyAddress}
            type="button"
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-[#0E1B2E] hover:text-[#5687AD] bg-white border border-[#D6B477]/60 hover:border-[#8FB5D1] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Address copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#D6B477]" />
                <span>Copy full address</span>
              </>
            )}
          </button>
        </div>

        {/* STRICTLY BY INVITATION NOTICE */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0E1B2E]/5 border border-[#0E1B2E]/20 mb-5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#5687AD]" />
          <span className="font-serif-luxury text-[11px] font-bold tracking-[0.2em] text-[#0E1B2E] uppercase">
            Strictly by Invitation
          </span>
        </div>

        {/* Venue Amenities & Protocol Badges */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] text-[#0E1B2E]/80 text-left">
          <div className="p-2.5 rounded-xl bg-white/90 border border-[#D6B477]/40 flex items-center gap-2">
            <Car className="w-4 h-4 text-[#5687AD] shrink-0" />
            <span>Dedicated Secured Parking</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-[#D6B477]/40 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#5687AD] shrink-0" />
            <span>Reception Protocol &amp; Seating</span>
          </div>
        </div>

        {/* Action Buttons: Get Directions & Add to Calendar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-[#FAF7F2] bg-[#0E1B2E] border border-[#D6B477]/80 shadow hover:bg-[#1A3152] hover:border-[#8FB5D1] active:scale-95 transition-all duration-200"
          >
            <Navigation className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>GET DIRECTIONS</span>
          </a>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-[#0E1B2E] bg-white border border-[#D6B477]/80 hover:bg-[#FAF7F2] active:scale-95 transition-all duration-200"
              title="Add to Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-[#5687AD]" />
              <span>Google Cal</span>
            </a>

            <button
              onClick={downloadICS}
              type="button"
              className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#0E1B2E] bg-white border border-[#D6B477]/80 hover:bg-[#FAF7F2] active:scale-95 transition-all duration-200 cursor-pointer"
              title="Download iCal (.ics file for Apple/Outlook)"
            >
              .ICS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

