import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { toggleBackgroundMusic, isBgMusicPlaying, primeAudio, WEDDING_SONG_TITLE } from '../lib/audio';

export const AudioPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setIsPlaying(isBgMusicPlaying());

    const handleStateChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ isPlaying: boolean }>;
      const playing = customEvt.detail?.isPlaying ?? isBgMusicPlaying();
      setIsPlaying(playing);
      if (playing) {
        setShowBadge(true);
        const timer = setTimeout(() => setShowBadge(false), 3500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('wedding-music-state-change', handleStateChange);
    return () => window.removeEventListener('wedding-music-state-change', handleStateChange);
  }, []);

  const handleToggle = () => {
    primeAudio();
    const newState = toggleBackgroundMusic();
    setIsPlaying(newState);
    if (newState) {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 3500);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleToggle}
        type="button"
        className="relative group p-2.5 text-white/95 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] active:scale-90 transition-transform cursor-pointer select-none focus:outline-none flex items-center gap-2"
        title={isPlaying ? `Music Playing: ${WEDDING_SONG_TITLE} (Click to Mute)` : 'Click to Play Wedding Soundtrack'}
        aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <>
              {/* Subtle expanding gold pulse halo */}
              <span className="absolute -inset-1 rounded-full bg-[#D6B477]/35 animate-ping pointer-events-none" />
              <Volume2 className="relative w-6 h-6 sm:w-7 sm:h-7 text-[#ECC880] drop-shadow-[0_2px_10px_rgba(214,180,119,0.7)]" />
            </>
          ) : (
            <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 drop-shadow-md group-hover:text-white" />
          )}
        </div>

        {/* Animated Sound Wave Bars when Playing */}
        {isPlaying && (
          <div className="hidden xs:flex items-end gap-[3px] h-3.5 pb-0.5">
            <span className="w-1 bg-[#D6B477] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
            <span className="w-1 bg-[#ECC880] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3.5" />
            <span className="w-1 bg-[#D6B477] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
          </div>
        )}
      </button>

      {/* Floating subtle song toast when active */}
      {showBadge && (
        <div className="absolute left-full ml-2 whitespace-nowrap px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D6B477]/40 text-[10px] tracking-wider font-semibold text-[#FAF7F2] shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-200 flex items-center gap-1.5 z-50">
          <Music className="w-2.5 h-2.5 text-[#D6B477]" />
          <span>Rewrite The Stars</span>
        </div>
      )}
    </div>
  );
};
