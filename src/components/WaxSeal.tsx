import React from 'react';

interface WaxSealProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const LUXURY_SEAL_URL =
  'https://res.cloudinary.com/dbbw8jsjc/image/upload/c_crop,w_520,h_520,x_633,y_961/f_auto,q_auto/v1790565701/Luxury_wedding_invitation_envelope_2K_20260928021559_o25ezt.png';
const LOCAL_SEAL_URL = '/images/luxury_seal.png';

export const WaxSeal: React.FC<WaxSealProps> = ({
  className = '',
  size = 80,
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`relative inline-flex items-center justify-center select-none group ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      aria-label="Luxury Wedding Seal: Precious & Ugochukwu (#UgoAmaka26)"
    >
      <img
        src={LOCAL_SEAL_URL}
        onError={(e) => {
          // Fallback to Cloudinary URL if local asset fails
          (e.currentTarget as HTMLImageElement).src = LUXURY_SEAL_URL;
        }}
        alt="Precious & Ugochukwu Luxury Wedding Seal"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_22px_rgba(14,27,46,0.35)] transition-all duration-300 group-hover:drop-shadow-[0_14px_28px_rgba(214,180,119,0.5)]"
        draggable={false}
      />
    </div>
  );
};
