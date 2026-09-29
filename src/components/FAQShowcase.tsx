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
    question: 'Can I take photos and share videos?',
    answer:
      'Yes, we would be overjoyed! Please capture memories of love and laughter and tag your posts with our wedding hashtag #UgoAmaka26.',
  },
  {
    id: 'f4',
    question: 'What is the dress code?',
    answer:
      'Formal and elegant traditional attire, black-tie optional, or sophisticated cocktail wear reflecting our royal palette (Navy Blue, Sky Blue, and Champagne Gold).',
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
      {/* 1. Illustrated Antique Scroll Icon (inspired by Screenshot 8) */}
      <div className="flex justify-center mb-2">
        <div className="w-11 h-11 rounded-full bg-[#FAF5EA] border-2 border-[#D6B477] shadow-sm flex items-center justify-center text-[#D6B477]">
          <Scroll className="w-5 h-5 text-[#5687AD]" />
        </div>
      </div>

      {/* 2. Clear Luxury Heading */}
      <ScrollReveal direction="up" distance={16} duration={700}>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0E1B2E] tracking-tight block">
          Frequently Asked Questions
        </h3>

        <div className="flex items-center justify-center gap-2 mt-1 mb-5">
          <span className="w-8 h-[1px] bg-[#D6B477]" />
          <span className="font-serif-luxury text-[11px] text-[#5687AD] uppercase tracking-[0.25em] font-semibold">
            Frequently Asked Questions
          </span>
          <span className="w-8 h-[1px] bg-[#D6B477]" />
        </div>
      </ScrollReveal>

      {/* 3. Soft Parchment Accordion Cards */}
      <div className="space-y-2.5 text-left">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-white/75 backdrop-blur-xs border border-[#D6B477]/50 shadow-2xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer gap-2"
                aria-expanded={isOpen}
              >
                <span className="font-serif-luxury text-sm font-bold text-[#0E1B2E] leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D6B477] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#5687AD]' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-3.5 pt-0 text-xs text-[#0E1B2E]/75 font-serif-luxury italic leading-relaxed border-t border-[#D6B477]/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
