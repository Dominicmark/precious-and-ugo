import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WaxSeal } from './WaxSeal';
import { ScratchReveal } from './ScratchReveal';
import { Countdown } from './Countdown';
import { EventDetails } from './EventDetails';
import { DressCode } from './DressCode';
import { RSVPForm } from './RSVPForm';
import { ContactButtons } from './ContactButtons';
import { WeddingProgramme } from './WeddingProgramme';
import { LoveStoryModal } from './LoveStoryModal';
import { GiftRegistryModal } from './GiftRegistryModal';
import { AudioPlayerToggle } from './AudioPlayerToggle';
import { CoupleGallery } from './CoupleGallery';
import { GuestWishesWall } from './GuestWishesWall';
import { MailOpen, BookOpen, Heart, Shield, Sparkles, Gift, MessageSquareHeart } from 'lucide-react';

interface InvitationCardProps {
  onReopenEnvelope: () => void;
  onOpenAdmin: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  onReopenEnvelope,
  onOpenAdmin,
}) => {
  const [showProgramme, setShowProgramme] = useState(false);
  const [showLoveStory, setShowLoveStory] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const scrollToRSVP = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWishes = () => {
    const el = document.getElementById('wishes-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Top Floating Utility Controls (Audio, Story, Programme, Gifts, Envelope) */}
      <header className="sticky top-2 z-30 mb-4 flex items-center justify-between px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D6B477]/60 shadow-md">
        {/* Brand Kicker */}
        <span className="font-display text-xs font-extrabold tracking-widest text-[#0E1B2E]">
          #UgoAmaka26
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <AudioPlayerToggle />

          <button
            onClick={() => setShowLoveStory(true)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] hover:bg-[#EBF3F8] transition-colors flex items-center gap-1 cursor-pointer"
            title="Our Journey to Forever"
          >
            <Heart className="w-3.5 h-3.5 text-[#8FB5D1]" />
            <span className="hidden sm:inline text-[11px]">Story</span>
          </button>

          <button
            onClick={() => setShowProgramme(true)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] hover:bg-[#EBF3F8] transition-colors flex items-center gap-1 cursor-pointer"
            title="Wedding Programme & Order of Events"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D6B477]" />
            <span className="hidden sm:inline text-[11px]">Programme</span>
          </button>

          <button
            onClick={() => setShowGiftModal(true)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] hover:bg-[#EBF3F8] transition-colors flex items-center gap-1 cursor-pointer"
            title="Registry & Blessings"
          >
            <Gift className="w-3.5 h-3.5 text-[#8FB5D1]" />
            <span className="hidden sm:inline text-[11px]">Gifts</span>
          </button>

          <button
            onClick={scrollToWishes}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] hover:bg-[#EBF3F8] transition-colors flex items-center gap-1 cursor-pointer"
            title="Wishes Wall"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#8FB5D1]" />
            <span className="hidden sm:inline text-[11px]">Wishes</span>
          </button>

          <button
            onClick={onReopenEnvelope}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] hover:bg-[#EBF3F8] transition-colors flex items-center gap-1 cursor-pointer"
            title="Replay Physical Envelope Animation"
          >
            <MailOpen className="w-3.5 h-3.5 text-[#0E1B2E]" />
            <span className="hidden sm:inline text-[11px]">Envelope</span>
          </button>
        </div>
      </header>

      {/* MAIN INVITATION CARD (Luxury Physical Stationery Appearance) */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/95 backdrop-blur-md paper-texture p-6 sm:p-10 border-2 border-[#D6B477] shadow-[0_25px_70px_-15px_rgba(14,27,46,0.22)] text-center overflow-hidden"
      >
        {/* Double Gold Foil Decorative Inner Border */}
        <div className="absolute inset-2 sm:inset-3 border border-[#D6B477]/50 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-[#D6B477]/30 rounded-lg pointer-events-none" />

        {/* Ornate Corner Elements */}
        <div className="absolute top-4 left-4 text-[#D6B477] text-xs pointer-events-none">❖</div>
        <div className="absolute top-4 right-4 text-[#D6B477] text-xs pointer-events-none">❖</div>
        <div className="absolute bottom-4 left-4 text-[#D6B477] text-xs pointer-events-none">❖</div>
        <div className="absolute bottom-4 right-4 text-[#D6B477] text-xs pointer-events-none">❖</div>

        {/* SECTION 4: HEADER & COUPLE NAMES */}
        <div className="pt-2 sm:pt-4 mb-8">
          <div className="flex justify-center mb-4">
            <WaxSeal size={96} interactive={true} onClick={onReopenEnvelope} />
          </div>

          <p className="font-serif-luxury text-xs sm:text-sm tracking-[0.3em] text-[#5687AD] uppercase font-bold">
            THE WEDDING RECEPTION OF
          </p>

          {/* Couple Names */}
          <div className="my-3 space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E1B2E] tracking-wider leading-tight">
              PRECIOUS UZOAMAKA MARK
            </h1>

            <div className="flex items-center justify-center gap-3 my-1">
              <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D6B477]" />
              <span className="font-script text-3xl sm:text-4xl text-[#8FB5D1] leading-none">
                &amp;
              </span>
              <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D6B477]" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E1B2E] tracking-wider leading-tight">
              UGOCHUKWU CYRIL OMEOGU
            </h1>
          </div>

          {/* Hashtag */}
          <div className="inline-block mt-1">
            <span className="font-display text-xs sm:text-sm tracking-[0.3em] font-bold text-[#D6B477] bg-[#0E1B2E] px-4 py-1 rounded-full shadow-xs">
              #UgoAmaka26
            </span>
          </div>

          <p className="font-serif-luxury text-xs sm:text-sm text-[#0E1B2E]/75 italic mt-3 max-w-sm mx-auto leading-relaxed">
            Together with their families, cordially invite you to celebrate their union in holy matrimony and joyous reception banquet.
          </p>
        </div>

        {/* SECTION 5: SIGNATURE SCRATCH-TO-REVEAL INTERACTION */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <ScratchReveal />
        </div>

        {/* SECTION 7: DYNAMIC COUNTDOWN */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <Countdown />
        </div>

        {/* COUPLE EDITORIAL SHOWCASE GALLERY */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <CoupleGallery />
        </div>

        {/* SECTION 6: EVENT DETAILS & DIRECTIONS */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <EventDetails />
        </div>

        {/* SECTION 8: DRESS CODE */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <DressCode />
        </div>

        {/* INTERACTIVE GUEST WISHES WALL */}
        <div id="wishes-section" className="my-8 pt-6 border-t border-[#D6B477]/40">
          <GuestWishesWall />
        </div>

        {/* SECTION 9: RSVP EXPERIENCE */}
        <div id="rsvp-section" className="my-8 pt-6 border-t border-[#D6B477]/40">
          <RSVPForm />
        </div>

        {/* SECTION 12: CONTACT ACTIONS */}
        <div className="my-8 pt-6 border-t border-[#D6B477]/40">
          <ContactButtons />
        </div>

        {/* FOOTER & RE-OPEN CTA */}
        <footer className="mt-8 pt-6 border-t border-[#D6B477]/40 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onReopenEnvelope}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] bg-white border border-[#D6B477]/60 shadow-2xs hover:border-[#8FB5D1] transition-all cursor-pointer"
            >
              <MailOpen className="w-3.5 h-3.5 text-[#5687AD]" />
              <span>Replay Envelope</span>
            </button>

            <button
              onClick={() => setShowProgramme(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] bg-white border border-[#D6B477]/60 shadow-2xs hover:border-[#8FB5D1] transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Programme</span>
            </button>

            <button
              onClick={() => setShowGiftModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] bg-white border border-[#D6B477]/60 shadow-2xs hover:border-[#8FB5D1] transition-all cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#8FB5D1]" />
              <span>Registry</span>
            </button>
          </div>

          <div className="text-[11px] text-[#0E1B2E]/60 font-serif-luxury space-y-0.5">
            <p>Precious Uzoamaka Mark &amp; Ugochukwu Cyril Omeogu</p>
            <p>Abuja, Nigeria · #UgoAmaka26</p>
          </div>

          {/* Discreet Admin Portal Link */}
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              type="button"
              className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-[#0E1B2E]/50 hover:text-[#5687AD] transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#D6B477]" />
              <span>Admin Access</span>
            </button>
          </div>
        </footer>
      </motion.article>

      {/* Sticky Bottom Thumb Action Bar on Mobile */}
      <div className="fixed bottom-3 inset-x-3 max-w-sm mx-auto z-40 sm:hidden">
        <button
          onClick={scrollToRSVP}
          className="w-full h-12 rounded-2xl bg-[#0E1B2E] text-[#FAF7F2] font-display text-xs font-bold tracking-[0.2em] uppercase border border-[#D6B477] shadow-[0_8px_25px_rgba(14,27,46,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
          <span>RESPOND RSVP</span>
        </button>
      </div>

      {/* Modals */}
      <WeddingProgramme
        isOpen={showProgramme}
        onClose={() => setShowProgramme(false)}
      />

      <LoveStoryModal
        isOpen={showLoveStory}
        onClose={() => setShowLoveStory(false)}
      />

      <GiftRegistryModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
      />
    </div>
  );
};


