export type RSVPStatus = 'accepted' | 'declined';

export interface RSVPRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  attendance: RSVPStatus;
  guest_count: number;
  guest_names?: string;
  dietary_or_notes?: string;
  wedding_slug: string;
  created_at: string;
}

export interface RSVPStats {
  total_invited: number;
  confirmed: number;
  declined: number;
  pending: number;
  total_attending: number;
}
