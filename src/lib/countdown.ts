/**
 * Wedding Countdown Calculator
 * Target: 13 November 2026 at 10:00 AM (Africa/Lagos, UTC+1)
 */

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasPassed: boolean;
  totalSeconds: number;
}

// 13 November 2026, 10:00:00 Africa/Lagos (UTC+1)
export const WEDDING_DATE = new Date('2026-11-13T10:00:00+01:00');
export const RSVP_DEADLINE = new Date('2026-10-15T23:59:59+01:00');

export function calculateTimeRemaining(targetDate: Date = WEDDING_DATE): CountdownTime {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasPassed: true,
      totalSeconds: 0,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    hasPassed: false,
    totalSeconds: Math.floor(diff / 1000),
  };
}

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
