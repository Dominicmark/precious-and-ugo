import React, { useState } from 'react';
import { Scroll, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Can I bring a plus one?',
    answer:
      'Due to intimate seating capacity, our celebration is strictly by invitation for named guests indicated on your digital invitation.',
  },
  {
    id: 'f2',
    question: 'What time should I arrive?',
    answer:
      'Celebration festivities commence promptly at 4:00 PM WAT. We kindly advise guests to arrive by 3:45 PM to be warmly welcomed and seated.',
  },
  {
    id: 'f3',
    question: 'Can I share photos or videos?',
    answer:
      'NO!!!!! We kindly request an unplugged and private celebration. Please do not take or post photos and videos on social media so that our special moments remain intimate and everyone can be fully present with us.',
  },
  {
    id: 'f4',
    question: 'What is the dress code?',
    answer:
      'Strictly formal Western attire (Black-Tie). Gentlemen: Black-tie tuxedo, dinner jacket, or tailored dark suit with a bow tie or formal tie. Ladies: Floor-length formal evening gowns with optional fascinators in our nuptial palette (Dusty/Sky Blue, Champagne Gold, and Royal Navy accents). Please kindly note: NO traditional attire permitted (strictly no Agbada, Senator, native wear, or African lace/Asoebi).',
  },
  {
    id: 'f5',
    question: 'Can I bring my child?',
    answer:
      'While we love your little ones, our celebration is an adult-focused evening banquet with curated seating. We thank you for your understanding.',
  },
];

export const FAQShowcase: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <div className="w-full max-w-[460px] mx-auto text-center py-4 px-2">
      {/* 1. Illustrated Antique Scroll Icon */}
      <div className="flex justify-center mb-2">
        <div className="w-11 h-11 rounded-full bg-[#FAF5EA] border-2 border-[#D6B477] shadow-xs flex items-center justify-center text-[#D6B477]">
          <Scroll className="w-5 h-5 text-[#5687AD]" />
        </div>
      </div>

      {/* 2. Editorial Header */}
      <ScrollReveal direction="up" distance={16} duration={700}>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0E1B2E] tracking-tight block">
          Frequently Asked Questions
        </h3>

        <div className="flex items-center justify-center gap-2 mt-1 mb-5">
          <span className="w-8 h-[0.5px] bg-[#D6B477]" />
          <span className="font-serif-luxury text-[11px] text-[#5687AD] uppercase tracking-[0.25em] font-semibold">
            Essential Nuptial Information
          </span>
          <span className="w-8 h-[0.5px] bg-[#D6B477]" />
        </div>
      </ScrollReveal>

      {/* 3. Parchment Accordion List */}
      <div className="space-y-3 text-left">
        {FAQS.map((faq, index) => {
          const isOpen = openId === faq.id;
          return (
            <ScrollReveal
              key={faq.id}
              direction="up"
              distance={14}
              delay={index * 60}
              duration={650}
            >
              <div className="rounded-xl border border-[#D6B477]/40 bg-white/70 backdrop-blur-xs overflow-hidden transition-all duration-300 shadow-xs hover:border-[#D6B477]">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none select-none transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-luxury text-sm sm:text-base font-bold text-[#0E1B2E] pr-3 leading-snug">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="shrink-0 text-[#D6B477]"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm font-sans text-[#0E1B2E]/80 leading-relaxed border-t border-[#D6B477]/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};
