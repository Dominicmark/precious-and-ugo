import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { toggleBackgroundMusic, isBgMusicPlaying, WEDDING_SONG_TITLE } from '../lib/audio';

export const AudioPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(isBgMusicPlaying());

    const handleStateChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ isPlaying: boolean }>;
      setIsPlaying(customEvt.detail?.isPlaying ?? isBgMusicPlaying());
    };

    window.addEventListener('wedding-music-state-change', handleStateChange);
    return () => window.removeEventListener('wedding-music-state-change', handleStateChange);
  }, []);

  const handleToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsPlaying(newState);
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D6B477]/60 text-xs font-semibold text-[#0E1B2E] shadow-sm hover:border-[#8FB5D1] active:scale-95 transition-all cursor-pointer group"
      title={isPlaying ? `Pause: ${WEDDING_SONG_TITLE}` : `Play: ${WEDDING_SONG_TITLE}`}
      aria-label="Toggle wedding soundtrack"
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-3 bg-[#5687AD] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
            <span className="w-0.5 h-2 bg-[#D6B477] rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]" />
            <span className="w-0.5 h-3 bg-[#5687AD] rounded-full animate-[pulse_0.7s_ease-in-out_0.1s_infinite]" />
          </div>
          <span className="text-[11px] font-medium tracking-wide">Rewrite The Stars ♪</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#0E1B2E]/60 group-hover:text-[#5687AD] transition-colors" />
          <span className="text-[11px] font-medium tracking-wide text-[#0E1B2E]/80">Music</span>
        </>
      )}
    </button>
  );
};
