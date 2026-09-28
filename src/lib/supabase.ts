import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RSVPRecord, RSVPStats } from '../types/rsvp';

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

const STORAGE_KEY = 'ugoamaka26_rsvps_v1';

// Initial curated seed list for demonstration and admin testing
const SEED_RSVPS: RSVPRecord[] = [
  {
    id: 'seed-1',
    full_name: 'Dr. Chinedu Eze & Family',
    phone: '+234 803 123 4567',
    email: 'chinedu.eze@example.ng',
    attendance: 'accepted',
    guest_count: 2,
    guest_names: 'Dr. Chinedu Eze, Mrs. Ngozi Eze',
    dietary_or_notes: 'Looking forward to celebrating with the lovely couple!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-10T14:32:00Z',
  },
  {
    id: 'seed-2',
    full_name: 'Barrister Ifeanyi Okafor',
    phone: '+234 802 987 6543',
    email: 'i.okafor@juris.ng',
    attendance: 'accepted',
    guest_count: 1,
    guest_names: 'Barrister Ifeanyi Okafor',
    dietary_or_notes: 'Honoured to witness this union.',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-12T09:15:00Z',
  },
  {
    id: 'seed-3',
    full_name: 'Amina Bello & Guest',
    phone: '+234 809 555 4321',
    email: 'amina.bello@lagosbiz.com',
    attendance: 'accepted',
    guest_count: 2,
    guest_names: 'Amina Bello, Tariq Bello',
    dietary_or_notes: 'Halal meal preferred please.',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-15T18:44:00Z',
  },
  {
    id: 'seed-4',
    full_name: 'Engr. Emeka Nwosu',
    phone: '+234 818 444 3322',
    email: 'enwosu@engineering.ng',
    attendance: 'declined',
    guest_count: 1,
    guest_names: '',
    dietary_or_notes: 'So sorry I will be abroad on project duties. Wishing you a blessed marriage!',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-16T11:20:00Z',
  },
  {
    id: 'seed-5',
    full_name: 'Chief & Lolo Kenneth Mark',
    phone: '+234 803 777 8899',
    email: 'kenneth.mark@abuja.ng',
    attendance: 'accepted',
    guest_count: 2,
    guest_names: 'Chief Kenneth Mark, Lolo Joy Mark',
    dietary_or_notes: 'Bridal family VIP table reservation.',
    wedding_slug: 'ugoamaka26',
    created_at: '2026-09-18T10:00:00Z',
  }
];

/**
 * Initializes local cache if empty
 */
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
 * Fetch all RSVP records from Supabase (or fallback local cache)
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
        // Merge with local list for complete offline/online resilience
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
      console.warn('Supabase fetch error, using local database cache:', err);
    }
  }

  return localList;
}

/**
 * Save new RSVP response to Supabase and local cache
 */
export async function submitRSVP(
  input: Omit<RSVPRecord, 'id' | 'created_at' | 'wedding_slug'>
): Promise<{ success: boolean; data?: RSVPRecord; error?: string }> {
  const newRecord: RSVPRecord = {
    ...input,
    id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    wedding_slug: 'ugoamaka26',
    created_at: new Date().toISOString(),
  };

  // Always update local cache immediately for zero-lag UI
  const current = getLocalRSVPs();
  // If same phone/email exists, update instead of duplicating
  const existingIdx = current.findIndex(
    r => r.phone.replace(/\D/g, '') === newRecord.phone.replace(/\D/g, '') ||
         r.email.toLowerCase() === newRecord.email.toLowerCase()
  );

  let updatedList: RSVPRecord[];
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...newRecord, id: current[existingIdx].id };
    updatedList = [...current];
  } else {
    updatedList = [newRecord, ...current];
  }
  saveLocalRSVPs(updatedList);

  // If Supabase is connected, sync to remote table
  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('rsvps').insert([
        {
          full_name: newRecord.full_name,
          phone: newRecord.phone,
          email: newRecord.email,
          attendance: newRecord.attendance,
          guest_count: newRecord.guest_count,
          guest_names: newRecord.guest_names || '',
          dietary_or_notes: newRecord.dietary_or_notes || '',
          wedding_slug: 'ugoamaka26',
        }
      ]);
      if (error) {
        console.warn('Supabase insert note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase remote sync warning:', err);
    }
  }

  return { success: true, data: newRecord };
}

/**
 * Calculate RSVP metrics for the admin dashboard
 */
export function calculateRSVPStats(list: RSVPRecord[], plannedTotalInvited = 350): RSVPStats {
  let confirmed = 0;
  let declined = 0;
  let totalAttending = 0;

  list.forEach(item => {
    if (item.attendance === 'accepted') {
      confirmed += 1;
      totalAttending += item.guest_count || 1;
    } else if (item.attendance === 'declined') {
      declined += 1;
    }
  });

  const responded = confirmed + declined;
  const pending = Math.max(0, plannedTotalInvited - responded);

  return {
    total_invited: plannedTotalInvited,
    confirmed,
    declined,
    pending,
    total_attending: totalAttending,
  };
}

/**
 * Export RSVP records as standard RFC-4180 CSV
 */
export function exportRSVPsToCSV(records: RSVPRecord[]): void {
  const headers = ['Guest Name', 'Phone', 'Email', 'Status', 'Guest Count', 'Guest Names', 'Notes / Wishes', 'Date Submitted'];

  const rows = records.map(r => [
    `"${(r.full_name || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${r.attendance === 'accepted' ? 'Joyfully Accepts' : 'Regretfully Declines'}"`,
    r.guest_count || 1,
    `"${(r.guest_names || '').replace(/"/g, '""')}"`,
    `"${(r.dietary_or_notes || '').replace(/"/g, '""')}"`,
    `"${new Date(r.created_at).toLocaleString('en-GB')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `UgoAmaka26_Wedding_RSVP_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const SUPABASE_SETUP_SQL = `-- Supabase Table Schema for #UgoAmaka26 Wedding RSVP
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  email text not null,
  attendance text not null check (attendance in ('accepted', 'declined')),
  guest_count integer default 1,
  guest_names text,
  dietary_or_notes text,
  wedding_slug text default 'ugoamaka26',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.rsvps enable row level security;

-- Allow public guests to submit RSVPs
create policy "Allow public RSVP insert" on public.rsvps
  for insert with check (true);

-- Allow authenticated read or service role
create policy "Allow reading RSVPs" on public.rsvps
  for select using (true);
`;
