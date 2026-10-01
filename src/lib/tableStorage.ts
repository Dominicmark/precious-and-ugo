export interface WeddingTable {
  id: string;
  name: string;
  capacity: number; // e.g. 8 or 10 seats
  category: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General';
}

const STORAGE_KEY = 'ugoamaka26_tables_v2';

export const DEFAULT_TABLES: WeddingTable[] = [
  { id: 'tbl-1', name: 'High Table - Presidential VIP', capacity: 10, category: 'VIP' },
  { id: 'tbl-2', name: 'Table 1 - Bridal Family (Elders)', capacity: 10, category: 'Family' },
  { id: 'tbl-3', name: 'Table 2 - Groom\'s Family (Elders)', capacity: 10, category: 'Family' },
  { id: 'tbl-4', name: 'Table 3 - Diamond Dignitaries', capacity: 10, category: 'VIP' },
  { id: 'tbl-5', name: 'Table 4 - Sapphire Royals', capacity: 10, category: 'VIP' },
  { id: 'tbl-6', name: 'Table 5 - Emerald Friends (Bridal Tribe)', capacity: 10, category: 'Friends' },
  { id: 'tbl-7', name: 'Table 6 - Gold Colleagues', capacity: 10, category: 'Colleagues' },
  { id: 'tbl-8', name: 'Table 7 - Pearl VIPs', capacity: 10, category: 'VIP' },
  { id: 'tbl-9', name: 'Table 8 - Ruby Friends', capacity: 10, category: 'Friends' },
  { id: 'tbl-10', name: 'Table 9 - Silver VIPs', capacity: 10, category: 'General' },
];

export function getWeddingTables(): WeddingTable[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading wedding tables:', err);
  }
  return DEFAULT_TABLES;
}

export function saveWeddingTables(tables: WeddingTable[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
  } catch (err) {
    console.warn('Error saving wedding tables:', err);
  }
}
