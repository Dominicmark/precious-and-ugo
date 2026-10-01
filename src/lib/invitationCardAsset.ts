// Manages the Official Invitation Card image asset (PNG / JPEG / WebP / PDF preview)
// Can be customized by the couple in the Admin Dashboard via file upload or Cloudinary URL

const STORAGE_KEY = 'ugoamaka26_official_invitation_card';

// Default luxury invitation stationery card asset (high-res Cloudinary artwork)
export const DEFAULT_OFFICIAL_CARD_URL =
  'https://res.cloudinary.com/dbbw8jsjc/image/upload/f_auto,q_auto:best,w_1400/v1790687899/IMG-20260920-WA0002_joro3i.jpg';

export function getOfficialCardUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (err) {
    console.warn('Error reading official card url:', err);
  }
  return DEFAULT_OFFICIAL_CARD_URL;
}

export function setOfficialCardUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url);
    window.dispatchEvent(
      new CustomEvent('wedding-card-updated', { detail: { url } })
    );
  } catch (err) {
    console.warn('Error saving official card url:', err);
  }
}

export function resetOfficialCardUrl(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('wedding-card-updated', { detail: { url: DEFAULT_OFFICIAL_CARD_URL } })
    );
  } catch (err) {
    console.warn('Error resetting official card url:', err);
  }
}
