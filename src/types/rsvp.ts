export type RSVPAttendanceIntent = 'accepted' | 'declined';
export type RSVPApprovalStatus = 'pending' | 'approved' | 'declined' | 'waitlisted';

export type GuestRelationship = 
  | "Bride's Family / Guest"
  | "Groom's Family / Guest"
  | "Mutual Friend / Colleague"
  | "VIP Dignitary"
  | "Other";

export interface RSVPRecord {
  id: string;
  reference_code: string; // e.g. "PU-7482"
  full_name: string;
  phone: string;
  email: string;
  attendance: RSVPAttendanceIntent; // Guest's requested attendance
  status: RSVPApprovalStatus; // Couple's protocol decision
  guest_count: number; // Requested seats (1 or 2)
  allocated_seats: number; // Final approved seats granted by couple
  relationship?: GuestRelationship | string;
  table_assignment?: string; // e.g. "Table 4 - Presidential"
  guest_names?: string; // Plus-one full name
  dietary_or_notes?: string;
  wedding_slug: string;
  created_at: string;
  reviewed_at?: string;
}

export interface RSVPStats {
  total_invited: number;
  total_requests: number;
  pending_review: number;
  approved_guests: number;
  total_allocated_seats: number;
  declined: number;
  waitlisted: number;
}
