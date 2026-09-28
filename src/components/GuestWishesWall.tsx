import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, MessageSquareHeart, Sparkles } from 'lucide-react';
import { fireWeddingConfetti } from '../lib/confetti';

interface WishMessage {
  id: string;
  sender: string;
  location?: string;
  message: string;
  likes: number;
  created_at: string;
}

const STORAGE_WISHES_KEY = 'ugoamaka26_wishes_v1';

const INITIAL_WISHES: WishMessage[] = [
  {
    id: 'w-1',
    sender: 'Aunty Beatrice & Family',
    location: 'Lagos',
    message: 'May God bless your sacred union with boundless joy, divine prosperity, and everlasting harmony. You make such a radiant couple!',
    likes: 18,
    created_at: '2026-09-18T12:00:00Z',
  },
  {
    id: 'w-2',
    sender: 'Kelechi & Chidinma',
    location: 'Abuja',
    message: 'Counting down to the grand celebration! Ugo, you found your jewel. Precious, you have an incredible man. Cheers to #UgoAmaka26!',
    likes: 24,
    created_at: '2026-09-20T15:30:00Z',
  },
  {
    id: 'w-3',
    sender: 'Dr. Tunde Alabi',
    location: 'London, UK',
    message: 'Wishing you both a lifetime of divine love, fruitful laughter, and peace that surpasses all understanding. Hearty congratulations!',
    likes: 15,
    created_at: '2026-09-22T08:45:00Z',
  },
];

export const GuestWishesWall: React.FC = () => {
  const [wishes, setWishes] = useState<WishMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_WISHES_KEY);
      return raw ? JSON.parse(raw) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLikedIds, setUserLikedIds] = useState<Set<string>>(new Set());

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newWish: WishMessage = {
      id: `wish_${Date.now()}`,
      sender: name.trim(),
      location: location.trim() || undefined,
      message: message.trim(),
      likes: 1,
      created_at: new Date().toISOString(),
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    fireWeddingConfetti();
    setName('');
    setLocation('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    if (userLikedIds.has(id)) return;

    setUserLikedIds(new Set([...userLikedIds, id]));
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);
    try {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto text-center">
      {/* Section Kicker */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Love &amp; Blessings
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-widest uppercase mb-1">
        GUEST WISHES WALL
      </h3>
      <p className="font-serif-luxury text-xs text-[#0E1B2E]/70 italic mb-4">
        Leave your heartfelt congratulations and prayers for Precious &amp; Ugochukwu.
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleSendWish}
        className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-[#D6B477]/70 shadow-md text-left mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mary &amp; Emeka"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#8FB5D1]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
              City / Country (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Abuja or London"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#8FB5D1]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
            Your Blessing / Congratulatory Note *
          </label>
          <textarea
            required
            rows={2}
            placeholder="Share your prayers, love, or advice for the couple..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-xs text-[#0E1B2E] focus:outline-none focus:ring-1 focus:ring-[#8FB5D1] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl font-display text-xs font-bold tracking-widest uppercase text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#1A3152] active:scale-95 transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Send className="w-3.5 h-3.5 text-[#D6B477]" />
          <span>Post Wedding Blessing</span>
        </button>
      </form>

      {/* Messages List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        <AnimatePresence>
          {wishes.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 sm:p-4 rounded-xl bg-white/90 border border-[#D6B477]/50 shadow-2xs text-left relative"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div>
                  <span className="font-display text-xs font-bold text-[#0E1B2E]">
                    {w.sender}
                  </span>
                  {w.location && (
                    <span className="text-[10px] text-[#5687AD] font-medium ml-1.5 font-serif-luxury">
                      · {w.location}
                    </span>
                  )}
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(w.id)}
                  type="button"
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    userLikedIds.has(w.id)
                      ? 'text-[#8FB5D1] bg-sky-50'
                      : 'text-[#0E1B2E]/60 hover:text-[#5687AD] hover:bg-[#FAF7F2]'
                  }`}
                  aria-label="Send love reaction"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      userLikedIds.has(w.id) ? 'fill-[#8FB5D1] text-[#8FB5D1]' : 'text-[#0E1B2E]/50'
                    }`}
                  />
                  <span className="tabular-nums">{w.likes}</span>
                </button>
              </div>

              <p className="text-xs text-[#0E1B2E]/85 font-serif-luxury leading-relaxed italic">
                "{w.message}"
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
