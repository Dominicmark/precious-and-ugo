import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleBackgroundMusic, isBgMusicPlaying, primeAudio, WEDDING_SONG_TITLE } from '../lib/audio';

export const AudioPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(isBgMusicPlaying());

    const handleStateChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ isPlaying: boolean }>;
      const playing = customEvt.detail?.isPlaying ?? isBgMusicPlaying();
      setIsPlaying(playing);
    };

    window.addEventListener('wedding-music-state-change', handleStateChange);
    return () => window.removeEventListener('wedding-music-state-change', handleStateChange);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    primeAudio();
    const newState = toggleBackgroundMusic();
    setIsPlaying(newState);
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="p-2 sm:p-2.5 text-white/95 hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] active:scale-90 transition-transform cursor-pointer select-none focus:outline-none flex items-center justify-center"
      title={isPlaying ? `Music Playing: ${WEDDING_SONG_TITLE} (Tap to Mute)` : 'Tap to Play Music'}
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
    >
      {isPlaying ? (
        <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#ECC880] drop-shadow-[0_2px_12px_rgba(214,180,119,0.9)] transition-colors" />
      ) : (
        <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 drop-shadow-md group-hover:text-white transition-colors" />
      )}
    </button>
  );
};
