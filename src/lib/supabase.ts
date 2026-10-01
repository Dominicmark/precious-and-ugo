import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RSVPRecord, RSVPStats, RSVPApprovalStatus, GuestRelationship } from '../types/rsvp';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('example.com')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'ugoamaka26_rsvps_v2';

// Helper to generate a memorable security reference code (e.g. PU-8429)
export function generateReferenceCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PU-${num}`;
}

// Initial curated seed list demonstrating Pending, Approved, and Declined records
const SEED_RSVPS: RSVPRecord[] = [
  {
    id: 'seed-1',
    reference_code: 'PU-7241',
    full_name: 'Dr. Chinedu Eze & Wife',
    phone: '+234 803 123 4567',
    email: 'chinedu.eze@example.ng',
    attendance: 'accepted',
    status: 'approved',
    guest_count: 2,
    allocated_seats: 2,
    relationship: "Groom's Family / Guest",
    table_assignment: 'Table 2 - Diamond',
    guest_names: 'Dr. Chinedu Eze, Mrs. Ngozi Eze',
    dietary_or_notes: 'Looking forward to celebrating with the lovely couple!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-10T14:32:00Z',
    reviewed_at: '2026-09-10T16:00:00Z',
  },
  {
    id: 'seed-2',
    reference_code: 'PU-5832',
    full_name: 'Barrister Ifeanyi Okafor',
    phone: '+234 802 987 6543',
    email: 'i.okafor@juris.ng',
    attendance: 'accepted',
    status: 'approved',
    guest_count: 1,
    allocated_seats: 1,
    relationship: 'Mutual Friend / Colleague',
    table_assignment: 'Table 4 - Sapphire',
    guest_names: 'Barrister Ifeanyi Okafor',
    dietary_or_notes: 'Honoured to witness this blessed union.',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-12T09:15:00Z',
    reviewed_at: '2026-09-12T11:20:00Z',
  },
  {
    id: 'seed-3',
    reference_code: 'PU-9104',
    full_name: 'Amina Bello & Guest',
    phone: '+234 809 555 4321',
    email: 'amina.bello@lagosbiz.com',
    attendance: 'accepted',
    status: 'pending',
    guest_count: 2,
    allocated_seats: 2,
    relationship: "Bride's Family / Guest",
    table_assignment: '',
    guest_names: 'Amina Bello, Tariq Bello',
    dietary_or_notes: 'Halal meal preferred please. So excited for Amaka!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-28T18:44:00Z',
  },
  {
    id: 'seed-4',
    reference_code: 'PU-3320',
    full_name: 'Engr. Emeka Nwosu',
    phone: '+234 818 444 3322',
    email: 'enwosu@engineering.ng',
    attendance: 'declined',
    status: 'declined',
    guest_count: 1,
    allocated_seats: 0,
    relationship: 'Mutual Friend / Colleague',
    table_assignment: '',
    guest_names: '',
    dietary_or_notes: 'So sorry I will be abroad on official duties. Wishing you a blessed marriage!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-16T11:20:00Z',
  },
  {
    id: 'seed-5',
    reference_code: 'PU-1188',
    full_name: 'Chief & Lolo Kenneth Mark',
    phone: '+234 803 777 8899',
    email: 'kenneth.mark@abuja.ng',
    attendance: 'accepted',
    status: 'approved',
    guest_count: 2,
    allocated_seats: 2,
    relationship: 'VIP Dignitary',
    table_assignment: 'Table 1 - Presidential VIP',
    guest_names: 'Chief Kenneth Mark, Lolo Joy Mark',
    dietary_or_notes: 'Special table reservation requested.',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-18T10:00:00Z',
    reviewed_at: '2026-09-18T12:00:00Z',
  },
  {
    id: 'seed-6',
    reference_code: 'PU-6450',
    full_name: 'Nneka Okoli',
    phone: '+234 805 222 1100',
    email: 'nneka.okoli@gmail.com',
    attendance: 'accepted',
    status: 'pending',
    guest_count: 1,
    allocated_seats: 1,
    relationship: "Bride's Family / Guest",
    table_assignment: '',
    guest_names: '',
    dietary_or_notes: 'Can not wait to dance with the bride!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-30T15:20:00Z',
  }
];

function getLocalRSVPs(): RSVPRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RSVPS));
      return SEED_RSVPS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Local storage error reading RSVPs:', err);
    return SEED_RSVPS;
  }
}

function saveLocalRSVPs(list: RSVPRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Local storage error saving RSVPs:', err);
  }
}

/**
 * Fetch all RSVP records from Supabase (or fallback local database)
 */
export async function getRSVPs(): Promise<RSVPRecord[]> {
  const localList = getLocalRSVPs();

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const idMap = new Map<string, RSVPRecord>();
        data.forEach((item: RSVPRecord) => idMap.set(item.id || item.phone, item));
        localList.forEach(item => {
          if (!idMap.has(item.id) && !idMap.has(item.phone)) {
            idMap.set(item.id, item);
          }
        });
        const merged = Array.from(idMap.values());
        saveLocalRSVPs(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetch error, using local database:', err);
    }
  }

  return localList;
}

/**
 * Save new RSVP response with Option 3 default status ('pending' for accepted, 'declined' for regrets)
 */
export async function submitRSVP(
  input: Omit<RSVPRecord, 'id' | 'created_at' | 'wedding_slug' | 'reference_code' | 'status' | 'allocated_seats'> & {
    reference_code?: string;
    status?: RSVPApprovalStatus;
    allocated_seats?: number;
  }
): Promise<{ success: boolean; data?: RSVPRecord; error?: string }> {
  // In Option 3, all attendance submissions enter as 'pending' for couple approval
  const defaultStatus: RSVPApprovalStatus = input.attendance === 'declined' ? 'declined' : (input.status || 'pending');
  const refCode = input.reference_code || generateReferenceCode();
  const seatsAllocated = input.allocated_seats !== undefined ? input.allocated_seats : (input.attendance === 'accepted' ? Number(input.guest_count) : 0);

  const newRecord: RSVPRecord = {
    ...input,
    id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    reference_code: refCode,
    status: defaultStatus,
    allocated_seats: seatsAllocated,
    wedding_slug: 'ugoamaka26',
    created_at: new Date().toISOString(),
  };

  const current = getLocalRSVPs();
  const cleanPhone = (p: string) => p.replace(/\D/g, '');
  
  // If same phone or email exists, update record
  const existingIdx = current.findIndex(
    r => (cleanPhone(r.phone) && cleanPhone(r.phone) === cleanPhone(newRecord.phone)) ||
         (r.email && r.email.toLowerCase() === newRecord.email.toLowerCase())
  );

  let updatedList: RSVPRecord[];
  if (existingIdx >= 0) {
    // Preserve existing reference code and approval status if previously approved
    const existing = current[existingIdx];
    current[existingIdx] = {
      ...existing,
      ...newRecord,
      id: existing.id,
      reference_code: existing.reference_code || newRecord.reference_code,
      status: existing.status === 'approved' ? 'approved' : newRecord.status,
      allocated_seats: existing.status === 'approved' ? existing.allocated_seats : newRecord.allocated_seats,
      table_assignment: existing.table_assignment || newRecord.table_assignment,
    };
    updatedList = [...current];
  } else {
    updatedList = [newRecord, ...current];
  }
  saveLocalRSVPs(updatedList);

  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.from('rsvps').insert([
        {
          id: newRecord.id,
          reference_code: newRecord.reference_code,
          full_name: newRecord.full_name,
          phone: newRecord.phone,
          email: newRecord.email,
          attendance: newRecord.attendance,
          status: newRecord.status,
          guest_count: newRecord.guest_count,
          allocated_seats: newRecord.allocated_seats,
          relationship: newRecord.relationship || '',
          table_assignment: newRecord.table_assignment || '',
          guest_names: newRecord.guest_names || '',
          dietary_or_notes: newRecord.dietary_or_notes || '',
          wedding_slug: 'ugoamaka26',
        }
      ]);
    } catch (err) {
      console.warn('Supabase remote sync warning:', err);
    }
  }

  return { success: true, data: newRecord };
}

/**
 * Admin action: Approve, Waitlist, or Decline a guest, with custom seat allocation & table note
 */
export async function updateRSVPStatus(
  id: string,
  updates: {
    status: RSVPApprovalStatus;
    allocated_seats?: number;
    table_assignment?: string;
  }
): Promise<{ success: boolean; data?: RSVPRecord }> {
  const current = getLocalRSVPs();
  const idx = current.findIndex(r => r.id === id);
  if (idx < 0) return { success: false };

  const target = current[idx];
  const updated: RSVPRecord = {
    ...target,
    status: updates.status,
    allocated_seats: updates.allocated_seats !== undefined ? updates.allocated_seats : target.allocated_seats,
    table_assignment: updates.table_assignment !== undefined ? updates.table_assignment : target.table_assignment,
    reviewed_at: new Date().toISOString(),
  };

  current[idx] = updated;
  saveLocalRSVPs(current);

  if (supabase && isSupabaseConfigured) {
    try {
      await supabase
        .from('rsvps')
        .update({
          status: updated.status,
          allocated_seats: updated.allocated_seats,
          table_assignment: updated.table_assignment,
          reviewed_at: updated.reviewed_at,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase update note:', err);
    }
  }

  return { success: true, data: updated };
}

/**
 * Lookup guest RSVP by Phone, Email, or Reference Code (for Guest Status & Digital Pass lookup)
 */
export async function lookupRSVP(query: string): Promise<RSVPRecord | null> {
  const trimmed = query.trim().toLowerCase();
  const cleanPhone = trimmed.replace(/\D/g, '');
  const all = await getRSVPs();

  return all.find(r => {
    if (r.reference_code && r.reference_code.toLowerCase() === trimmed) return true;
    if (r.email && r.email.toLowerCase() === trimmed) return true;
    if (cleanPhone && cleanPhone.length >= 6) {
      const targetPhone = r.phone.replace(/\D/g, '');
      if (targetPhone.endsWith(cleanPhone) || cleanPhone.endsWith(targetPhone)) return true;
    }
    return false;
  }) || null;
}

/**
 * Calculate detailed RSVP stats for Option 3 dashboard
 */
export function calculateRSVPStats(list: RSVPRecord[], plannedTotalInvited = 100): RSVPStats {
  let pendingCount = 0;
  let approvedCount = 0;
  let declinedCount = 0;
  let waitlistedCount = 0;
  let totalAllocatedSeats = 0;

  list.forEach(item => {
    if (item.status === 'approved') {
      approvedCount += 1;
      totalAllocatedSeats += item.allocated_seats || item.guest_count || 1;
    } else if (item.status === 'pending') {
      pendingCount += 1;
    } else if (item.status === 'declined') {
      declinedCount += 1;
    } else if (item.status === 'waitlisted') {
      waitlistedCount += 1;
    }
  });

  return {
    total_invited: plannedTotalInvited,
    total_requests: list.length,
    pending_review: pendingCount,
    approved_guests: approvedCount,
    total_allocated_seats: totalAllocatedSeats,
    declined: declinedCount,
    waitlisted: waitlistedCount,
  };
}

/**
 * Export RSVP records as standard RFC-4180 CSV for Bouncers / Event Planners
 */
export function exportRSVPsToCSV(records: RSVPRecord[]): void {
  const headers = [
    'Ref Code',
    'Guest Full Name',
    'Status',
    'Allocated Seats',
    'Table Assignment',
    'Relationship',
    'Phone',
    'Email',
    'Plus-One Names',
    'Special Wishes / Notes',
    'Date Requested',
    'Date Reviewed'
  ];

  const rows = records.map(r => [
    `"${r.reference_code || ''}"`,
    `"${(r.full_name || '').replace(/"/g, '""')}"`,
    `"${r.status.toUpperCase()}"`,
    r.status === 'approved' ? (r.allocated_seats || 1) : 0,
    `"${(r.table_assignment || 'Unassigned').replace(/"/g, '""')}"`,
    `"${(r.relationship || 'Guest').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.guest_names || '').replace(/"/g, '""')}"`,
    `"${(r.dietary_or_notes || '').replace(/"/g, '""')}"`,
    `"${r.created_at ? new Date(r.created_at).toLocaleString('en-GB') : ''}"`,
    `"${r.reviewed_at ? new Date(r.reviewed_at).toLocaleString('en-GB') : ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `UgoAmaka26_Guest_Security_List_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const SUPABASE_SETUP_SQL = `-- Supabase Table Schema for #UgoAmaka26 Wedding RSVP (Option 3 Approval Model)
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  reference_code text unique not null,
  full_name text not null,
  phone text not null,
  email text not null,
  attendance text not null check (attendance in ('accepted', 'declined')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'waitlisted')),
  guest_count integer default 1,
  allocated_seats integer default 1,
  relationship text,
  table_assignment text,
  guest_names text,
  dietary_or_notes text,
  wedding_slug text default 'ugoamaka26',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_at timestamp with time zone
);

alter table public.rsvps enable row level security;
create policy "Allow public RSVP insert" on public.rsvps for insert with check (true);
create policy "Allow reading RSVPs" on public.rsvps for select using (true);
create policy "Allow update RSVPs" on public.rsvps for update using (true);
`;
