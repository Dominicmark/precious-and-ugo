import React from 'react';
import { Wine, Heart, Crown, Church, Cake, Music, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

interface TimelineEvent {
  time: string;
  tag: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EVENTS: TimelineEvent[] = [
  {
    time: '16:00',
    tag: 'START',
    title: 'Arrival & Welcome Refreshment',
    desc: 'We look forward to welcoming you with joyful music and chilled refreshments.',
    icon: Wine,
  },
  {
    time: '16:30',
    tag: 'PROCESSIONAL',
    title: 'Royal Bridal Train Entry',
    desc: 'Formal introduction and grand entrance of esteemed families and the bridal train.',
    icon: Heart,
  },
  {
    time: '17:00',
    tag: 'THE ARRIVAL',
    title: 'Grand Entrance of the Couple',
    desc: 'Welcoming Mr. & Mrs. Ugochukwu Cyril Omeogu with joyous cheers and fanfare!',
    icon: Crown,
  },
  {
    time: '17:30',
    tag: 'BLESSING',
    title: 'Opening Prayers & Nuptial Dedication',
    desc: 'Dedication of the holy union, sacred hymns, and Chairman’s opening address.',
    icon: Church,
  },
  {
    time: '18:00',
    tag: 'CELEBRATION',
    title: 'Cake Cutting & Royal Toast',
    desc: 'Sweet nuptial cutting of the cake followed by a champagne toast to lasting love.',
    icon: Cake,
  },
  {
    time: '18:45',
    tag: 'FIRST DANCE',
    title: "Couple's Dance & Joyous Rhythms",
    desc: 'Romantic first dance of the newlyweds, followed by vibrant family celebrations.',
    icon: Music,
  },
  {
    time: '19:45',
    tag: 'PARTY',
    title: 'Vote of Thanks & Evening Celebration',
    desc: 'Heartfelt appreciation from the couple and opening of the dance floor.',
    icon: Sparkles,
  },
];

export const WhatWeHavePlannedTimeline: React.FC = () => {
  return (
    <div className="w-full max-w-[500px] mx-auto text-center px-3 py-4">
      {/* Readable, High-Contrast Luxury Heading */}
      <ScrollReveal direction="up" distance={16} duration={700} className="mb-4">
        <h3 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E1B2E] tracking-tight block">
          What We Have Planned For You
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="w-10 h-[1px] bg-[#D6B477]" />
          <span className="font-display text-[11px] sm:text-xs text-[#5687AD] uppercase tracking-[0.25em] font-bold">
            Order of Events
          </span>
          <span className="w-10 h-[1px] bg-[#D6B477]" />
        </div>
      </ScrollReveal>

      {/* Vertical Central Dotted Timeline Thread */}
      <div className="relative mt-8">
        {/* Central Vertical Dotted Gold Thread */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-8 w-[1.5px] border-l-2 border-dotted border-[#D6B477]/60 pointer-events-none" />

        <div className="space-y-7 relative z-10">
          {EVENTS.map((event, idx) => {
            const Icon = event.icon;

            return (
              <motion.div
                key={event.time}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="relative flex flex-col items-center"
              >
                {/* Center Node Icon with Gold Ring */}
                <div className="relative mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EA] border-2 border-[#D6B477] shadow-sm flex items-center justify-center text-[#0E1B2E]">
                    <Icon className="w-4 h-4 text-[#5687AD]" />
                  </div>
                  {/* Outer subtle halo ring */}
                  <div className="absolute -inset-1 rounded-full border border-[#D6B477]/30 pointer-events-none" />
                </div>

                {/* Event Time & Tag */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-base sm:text-lg font-bold text-[#0E1B2E] tracking-wider">
                    {event.time}
                  </span>
                  <span className="font-display text-[10px] tracking-[0.18em] font-bold uppercase text-[#D6B477] bg-[#0E1B2E] px-2.5 py-0.5 rounded-full">
                    {event.tag}
                  </span>
                </div>

                {/* Event Title - Crisp, Clear & Readable */}
                <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#0E1B2E] tracking-wide max-w-sm">
                  {event.title}
                </h4>

                {/* Event Description - Clear, Non-italic Readable Body Text */}
                <p className="font-sans text-xs sm:text-sm text-[#0E1B2E]/80 max-w-sm mt-1 leading-relaxed font-normal">
                  {event.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
