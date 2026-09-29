import React, { useState } from 'react';
import { HeroCinematicVideo } from './HeroCinematicVideo';
import { NavigationDrawer } from './NavigationDrawer';
import { ScratchReveal } from './ScratchReveal';
import { Countdown } from './Countdown';
import { EventDetails } from './EventDetails';
import { CoupleGoldenFrame } from './CoupleGoldenFrame';
import { CoupleIllustratedMedallion } from './CoupleIllustratedMedallion';
import { WhatWeHavePlannedTimeline } from './WhatWeHavePlannedTimeline';
import { DressCodeShowcase } from './DressCodeShowcase';
import { GiftsShowcase } from './GiftsShowcase';
import { FAQShowcase } from './FAQShowcase';
import { ScrollToRsvpGuide } from './ScrollToRsvpGuide';
import { RSVPForm } from './RSVPForm';
import { ContactButtons } from './ContactButtons';
import { LoveStoryModal } from './LoveStoryModal';
import { GiftRegistryModal } from './GiftRegistryModal';
import { AudioPlayerToggle } from './AudioPlayerToggle';
import { ParallaxContentContainer } from './ParallaxContentContainer';
import { ScrollReveal } from './ScrollReveal';
import { Menu, Shield } from 'lucide-react';

interface InvitationCardProps {
  onReopenEnvelope: () => void;
  onOpenAdmin: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  onReopenEnvelope,
  onOpenAdmin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoveStory, setShowLoveStory] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const scrollToRSVP = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden selection:bg-[#8FB5D1]/30">
      {/* 1. DISCREET FLOATING TOP NAVIGATION CONTROLS (Clean, Uncluttered, Pure Icons with No Cards) */}
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Discreet Audio Player (Pure Icon) */}
        <div className="pointer-events-auto">
          <AudioPlayerToggle />
        </div>

        {/* Right: Sleek Minimalist Hamburger Menu Button (Pure Icon) */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 text-white/95 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] active:scale-90 transition-transform cursor-pointer select-none focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
          </button>
        </div>
      </header>

      {/* 2. FULL-BLEED BACKGROUND HERO VIDEO (Spreads edge-to-edge, not in a card) */}
      <HeroCinematicVideo onOpenMenu={() => setIsMenuOpen(true)} />

      {/* 3. CONTINUOUS ILLUMINATED PARCHMENT SCROLL (Immediately after video fade) */}
      <div className="relative w-full max-w-xl mx-auto px-4 sm:px-6 pt-4 pb-12 sm:pb-20 text-center space-y-12 sm:space-y-16">
        {/* SECTION 1: MAKE OUR DAY SPECIAL / SCRATCH-TO-REVEAL GOLD FOIL */}
        <ParallaxContentContainer
          id="scratch-section"
          offsetRange={[18, -18]}
          depthScale={[0.985, 1.015]}
          revealDistance={24}
        >
          <ScratchReveal />
        </ParallaxContentContainer>

        {/* SECTION 2: DYNAMIC COUNTDOWN */}
        <ParallaxContentContainer
          offsetRange={[12, -12]}
          revealDistance={20}
        >
          <Countdown />
        </ParallaxContentContainer>

        {/* SECTION 3: ILLUSTRATED COUPLE MEDALLION (Screenshot 6) */}
        <ParallaxContentContainer
          offsetRange={[24, -24]}
          depthScale={[0.988, 1.012]}
          revealDistance={26}
        >
          <CoupleIllustratedMedallion />
        </ParallaxContentContainer>

        {/* SECTION 4: WHAT WE HAVE PLANNED FOR YOU (Screenshot 2) */}
        <ParallaxContentContainer
          id="timeline-section"
          offsetRange={[18, -18]}
          revealDistance={24}
        >
          <WhatWeHavePlannedTimeline />
        </ParallaxContentContainer>

        {/* SECTION 5: CELEBRATION DATE & CALENDAR INTEGRATION */}
        <ParallaxContentContainer
          offsetRange={[14, -14]}
          revealDistance={22}
        >
          <EventDetails />
        </ParallaxContentContainer>

        {/* SECTION 6: THE BELOVED COUPLE IN GOLDEN FRAME */}
        <ParallaxContentContainer
          id="couple-section"
          offsetRange={[16, -16]}
          depthScale={[0.985, 1.015]}
          revealDistance={24}
        >
          <CoupleGoldenFrame />
        </ParallaxContentContainer>

        {/* SECTION 7: ATTIRE & NUPTIAL PALETTE (Fully Elaborated with Silhouettes) */}
        <ParallaxContentContainer
          id="attire-section"
          offsetRange={[14, -14]}
          revealDistance={22}
        >
          <DressCodeShowcase />
        </ParallaxContentContainer>

        {/* SECTION 7: GIFTS & BLESSINGS (Screenshot 4) */}
        <ParallaxContentContainer
          id="gifts-section"
          offsetRange={[16, -16]}
          revealDistance={22}
        >
          <GiftsShowcase />
        </ParallaxContentContainer>

        {/* SECTION 8: FAQ ACCORDION (Screenshot 8) */}
        <ParallaxContentContainer
          id="faq-section"
          offsetRange={[16, -16]}
          revealDistance={22}
        >
          <FAQShowcase />
        </ParallaxContentContainer>

        {/* SCROLL TO RSVP GUIDE */}
        <ScrollReveal direction="up" distance={16} duration={700}>
          <ScrollToRsvpGuide label="SCROLL TO CONFIRM RSVP" />
        </ScrollReveal>

        {/* SECTION 9: RSVP EXPERIENCE */}
        <ParallaxContentContainer
          id="rsvp-section"
          offsetRange={[20, -20]}
          depthScale={[0.985, 1.015]}
          revealDistance={28}
        >
          <div className="py-2">
            <RSVPForm />
          </div>
        </ParallaxContentContainer>

        {/* SECTION 10: WHATSAPP DIRECT CONTACT */}
        <ParallaxContentContainer
          id="contact-section"
          offsetRange={[12, -12]}
          revealDistance={18}
        >
          <ContactButtons />
        </ParallaxContentContainer>

        {/* SECTION 11: FOOTER (Mentored by Love · #UgoAmaka26) */}
        <ParallaxContentContainer
          offsetRange={[8, -8]}
          revealDistance={16}
        >
          <footer className="pt-8 pb-10 border-t border-[#D6B477]/40 text-center space-y-2">
            <ScrollReveal direction="up" distance={18} duration={850}>
              <p className="font-script-romantic text-4xl sm:text-5xl text-[#0E1B2E] tracking-wide">
                Mentored by Love
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={12} delay={180} duration={800}>
              <p className="font-display text-xs sm:text-sm tracking-[0.35em] font-extrabold text-[#D6B477] uppercase">
                #UgoAmaka26
              </p>
            </ScrollReveal>

            {/* Discreet Admin Portal Link */}
            <div className="pt-4">
              <button
                onClick={onOpenAdmin}
                type="button"
                className="inline-flex items-center gap-1 text-[9px] tracking-wider uppercase text-[#0E1B2E]/35 hover:text-[#5687AD] transition-colors cursor-pointer"
              >
                <Shield className="w-2.5 h-2.5 text-[#D6B477]/60" />
                <span>Admin Access</span>
              </button>
            </div>
          </footer>
        </ParallaxContentContainer>
      </div>

      {/* Sticky Bottom Thumb Action Bar on Mobile */}
      <div className="fixed bottom-3 inset-x-3 max-w-sm mx-auto z-30 sm:hidden">
        <button
          onClick={scrollToRSVP}
          className="w-full h-12 rounded-2xl bg-[#0E1B2E] text-[#FAF7F2] font-display text-xs font-bold tracking-[0.2em] uppercase border border-[#D6B477] shadow-[0_8px_25px_rgba(14,27,46,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>RESPOND RSVP</span>
        </button>
      </div>

      {/* Navigation Drawer Menu */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenStory={() => setShowLoveStory(true)}
        onOpenGifts={() => setShowGiftModal(true)}
        onReopenEnvelope={onReopenEnvelope}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Modals */}
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
