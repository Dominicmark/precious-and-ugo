import React, { useState, useEffect } from 'react';
import { calculateTimeRemaining, padZero, WEDDING_DATE } from '../lib/countdown';
import { Clock, CalendarCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const Countdown: React.FC = () => {
  const [time, setTime] = useState(() => calculateTimeRemaining(WEDDING_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining(WEDDING_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (time.hasPassed) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-6 rounded-2xl bg-[#0E1B2E] text-[#FAF7F2] border border-[#D6B477]/40 shadow-xl">
        <CalendarCheck className="w-8 h-8 text-[#D6B477] mx-auto mb-2" />
        <h3 className="font-display text-xl tracking-wider text-[#D6B477] font-bold">
          TODAY IS THE DAY!
        </h3>
        <p className="font-serif-luxury text-sm tracking-wide text-[#FAF7F2]/90 mt-1 italic">
          Celebrating the Holy Matrimony &amp; Reception of Precious &amp; Ugochukwu.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: padZero(time.days) },
    { label: 'HOURS', value: padZero(time.hours) },
    { label: 'MINUTES', value: padZero(time.minutes) },
    { label: 'SECONDS', value: padZero(time.seconds) },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <ScrollReveal direction="up" distance={14} duration={700} className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-[#8FB5D1]" />
        <h3 className="font-display text-xs sm:text-sm tracking-[0.25em] text-[#0E1B2E] uppercase font-bold">
          COUNTING DOWN TO FOREVER
        </h3>
      </ScrollReveal>

      {/* Countdown Digits Grid */}
      <ScrollReveal direction="up" distance={18} delay={120} duration={750} className="w-full flex justify-center">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[360px] sm:max-w-[420px]">
          {units.map((unit, index) => (
            <div
              key={unit.label}
              className="relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] border border-[#D6B477]/60 shadow-[0_4px_12px_rgba(14,27,46,0.06)]"
            >
              {/* Top gold foil accent notch */}
              <div className="absolute top-0 inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-[#D6B477] to-transparent" />

              <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#0E1B2E] tabular-nums tracking-tight">
                {unit.value}
              </span>
              <span className="font-serif-luxury text-[9px] sm:text-[10px] tracking-[0.2em] text-[#5687AD] font-bold uppercase mt-1">
                {unit.label}
              </span>

              {/* Subtle separator between columns */}
              {index < 3 && (
                <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-[#D6B477] font-bold text-xs pointer-events-none">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" distance={10} delay={200} duration={700}>
        <p className="text-[11px] text-[#0E1B2E]/70 font-serif-luxury tracking-widest uppercase mt-3">
          Abuja, Nigeria · West Africa Time (WAT)
        </p>
      </ScrollReveal>
    </div>
  );
};
