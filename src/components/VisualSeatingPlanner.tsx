import React, { useState, useMemo } from 'react';
import { RSVPRecord } from '../types/rsvp';
import { WeddingTable, getWeddingTables, saveWeddingTables } from '../lib/tableStorage';
import { updateRSVPStatus } from '../lib/supabase';
import { VisualBanquetFloorMap } from './VisualBanquetFloorMap';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  ChevronDown,
  Map as MapIcon,
  LayoutGrid,
} from 'lucide-react';

interface VisualSeatingPlannerProps {
  records: RSVPRecord[];
  onRefreshRecords: () => void;
  onShowToast: (msg: string) => void;
}

export const VisualSeatingPlanner: React.FC<VisualSeatingPlannerProps> = ({
  records,
  onRefreshRecords,
  onShowToast,
}) => {
  const [tables, setTables] = useState<WeddingTable[]>(getWeddingTables());
  const [plannerMode, setPlannerMode] = useState<'map' | 'cards'>('map');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(8);
  const [newTableCategory, setNewTableCategory] = useState<WeddingTable['category']>('VIP');

  const [editingTable, setEditingTable] = useState<WeddingTable | null>(null);
  const [activeTableDropdown, setActiveTableDropdown] = useState<string | null>(null);

  // Filter approved records only (since only approved guests get seats)
  const approvedGuests = useMemo(() => {
    return records.filter((r) => r.status === 'approved');
  }, [records]);

  // Group seated guests by table name
  const seatedMap = useMemo(() => {
    const map = new Map<string, RSVPRecord[]>();
    tables.forEach((t) => map.set(t.name, []));

    approvedGuests.forEach((guest) => {
      const assigned = guest.table_assignment?.trim();
      if (assigned) {
        if (!map.has(assigned)) {
          map.set(assigned, []);
        }
        map.get(assigned)!.push(guest);
      }
    });
    return map;
  }, [tables, approvedGuests]);

  // Unassigned approved guests (waiting for a table)
  const unassignedGuests = useMemo(() => {
    return approvedGuests.filter((g) => !g.table_assignment || !g.table_assignment.trim());
  }, [approvedGuests]);

  // Total stats
  const totalConfiguredCapacity = useMemo(() => {
    return tables.reduce((acc, t) => acc + t.capacity, 0);
  }, [tables]);

  const totalSeatsOccupied = useMemo(() => {
    let count = 0;
    approvedGuests.forEach((g) => {
      if (g.table_assignment && g.table_assignment.trim()) {
        count += g.allocated_seats || g.guest_count || 1;
      }
    });
    return count;
  }, [approvedGuests]);

  // Assign a guest to a table
  const handleAssignGuest = async (guest: RSVPRecord, tableName: string) => {
    const seats = guest.allocated_seats || guest.guest_count || 1;
    const res = await updateRSVPStatus(guest.id, {
      status: 'approved',
      table_assignment: tableName,
      allocated_seats: seats,
    });
    if (res.success) {
      onShowToast(`Seated ${guest.full_name} (${seats} seats) at ${tableName}`);
      onRefreshRecords();
      setActiveTableDropdown(null);
    }
  };

  // Unseat a guest
  const handleUnseatGuest = async (guest: RSVPRecord) => {
    const res = await updateRSVPStatus(guest.id, {
      status: 'approved',
      table_assignment: '',
    });
    if (res.success) {
      onShowToast(`Removed ${guest.full_name} from table`);
      onRefreshRecords();
    }
  };

  // Add a new table
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTable: WeddingTable = {
      id: `tbl-${Date.now()}`,
      name: newTableName.trim(),
      capacity: Number(newTableCapacity),
      category: newTableCategory,
    };

    const updated = [...tables, newTable];
    setTables(updated);
    saveWeddingTables(updated);
    setNewTableName('');
    setNewTableCapacity(8);
    setShowAddTableModal(false);
    onShowToast(`Created ${newTable.name}`);
  };

  // Delete a table
  const handleDeleteTable = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}? Any guests at this table will become unassigned.`)) {
      return;
    }
    // Unseat all guests currently at this table
    const guestsAtTable = seatedMap.get(name) || [];
    guestsAtTable.forEach((g: RSVPRecord) => handleUnseatGuest(g));

    const updated = tables.filter((t) => t.id !== id);
    setTables(updated);
    saveWeddingTables(updated);
    onShowToast(`Removed ${name}`);
  };

  // Save edited table
  const handleSaveEditTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name.trim()) return;

    const updated = tables.map((t) => (t.id === editingTable.id ? editingTable : t));
    setTables(updated);
    saveWeddingTables(updated);
    setEditingTable(null);
    onShowToast(`Updated table details`);
  };

  // Export Seating Chart as CSV
  const exportSeatingChartCSV = () => {
    const headers = ['Table Name', 'Category', 'Seat Number / Range', 'Guest Full Name', 'Plus One Name', 'Seats Occupied', 'Affiliation', 'Ref Code'];
    const rows: (string | number)[][] = [];

    tables.forEach((table) => {
      const guests = seatedMap.get(table.name) || [];
      if (guests.length === 0) {
        rows.push([`"${table.name}"`, table.category, 'Empty', 'None', '', 0, '', '']);
      } else {
        let seatOffset = 1;
        guests.forEach((g: RSVPRecord) => {
          const seats = g.allocated_seats || g.guest_count || 1;
          const range = seats === 1 ? `Seat ${seatOffset}` : `Seats ${seatOffset} - ${seatOffset + seats - 1}`;
          rows.push([
            `"${table.name}"`,
            table.category,
            `"${range}"`,
            `"${(g.full_name || '').replace(/"/g, '""')}"`,
            `"${(g.guest_names || '').replace(/"/g, '""')}"`,
            seats,
            `"${g.relationship || 'Guest'}"`,
            g.reference_code,
          ]);
          seatOffset += seats;
        });
      }
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UgoAmaka26_Visual_Seating_Plan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* SEATING CAPACITY OVERVIEW CARD */}
      <div className="p-5 rounded-2xl bg-white border border-[#D6B477]/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
            Visual Seating Arrangement Planner
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-display text-2xl sm:text-3xl font-black text-[#0E1B2E]">
              {totalSeatsOccupied}
            </span>
            <span className="text-xs text-gray-600 font-semibold">
              of {totalConfiguredCapacity} Seats Assigned across {tables.length} Tables
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Couples with +1 are automatically counted as 2 seats. Allocate where every honoured couple will sit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-view switcher: Floor Map vs Cards Grid */}
          <div className="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200">
            <button
              onClick={() => setPlannerMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                plannerMode === 'map'
                  ? 'bg-[#0E1B2E] text-[#ECC880] shadow-sm'
                  : 'text-gray-600 hover:text-[#0E1B2E]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Ballroom Floor Map</span>
            </button>

            <button
              onClick={() => setPlannerMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                plannerMode === 'cards'
                  ? 'bg-[#0E1B2E] text-[#ECC880] shadow-sm'
                  : 'text-gray-600 hover:text-[#0E1B2E]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Table Cards</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddTableModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0E1B2E] hover:bg-[#142338] text-[#ECC880] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ECC880]" />
            <span>Add New Table</span>
          </button>

          <button
            onClick={exportSeatingChartCSV}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export Seating Arrangement for Ushers & Decorators"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline">Export Plan (CSV)</span>
          </button>
        </div>
      </div>

      {/* UNASSIGNED GUESTS POOL */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-300/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-700" />
            <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950">
              Unassigned Approved Guests ({unassignedGuests.length})
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-800">
            Select a table to seat them
          </span>
        </div>

        {unassignedGuests.length === 0 ? (
          <div className="p-3 text-center rounded-xl bg-white/70 border border-amber-200 text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All approved guests have been allocated a table!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {unassignedGuests.map((guest) => {
              const seats = guest.allocated_seats || guest.guest_count || 1;
              const hasPlusOne = seats > 1;

              return (
                <div
                  key={guest.id}
                  className="p-3 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-xs font-bold text-[#0E1B2E] truncate block">
                        {guest.full_name}
                      </span>
                      {hasPlusOne ? (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-[#0E1B2E] text-[#ECC880] text-[9px] font-mono font-bold">
                          2 Seats (+1)
                        </span>
                      ) : (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] font-mono">
                          1 Seat
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 block truncate">
                      {guest.relationship || 'Guest'} · Ref: {guest.reference_code}
                    </span>
                  </div>

                  {/* Seat at Table Selector */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignGuest(guest, e.target.value);
                      }
                    }}
                    className="shrink-0 px-2 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Assign Table ▾
                    </option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} (Cap: {t.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOOR MAP OR CARDS VIEW */}
      {plannerMode === 'map' ? (
        <VisualBanquetFloorMap
          tables={tables}
          seatedMap={seatedMap}
          unassignedGuests={unassignedGuests}
          onAssignGuest={handleAssignGuest}
          onUnseatGuest={handleUnseatGuest}
        />
      ) : (
        /* VISUAL TABLES GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {tables.map((table) => {
          const seatedGuests = seatedMap.get(table.name) || [];
          const occupiedSeats = seatedGuests.reduce(
            (acc: number, g: RSVPRecord) => acc + (g.allocated_seats || g.guest_count || 1),
            0
          );
          const remainingSeats = table.capacity - occupiedSeats;
          const isFull = occupiedSeats >= table.capacity;
          const isOverCapacity = occupiedSeats > table.capacity;

          return (
            <div
              key={table.id}
              className={`rounded-2xl border-2 transition-all p-5 shadow-sm flex flex-col justify-between ${
                isOverCapacity
                  ? 'bg-red-50/50 border-red-400'
                  : isFull
                  ? 'bg-white border-emerald-400/80 shadow-emerald-50'
                  : 'bg-white border-[#D6B477]/60'
              }`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                        {table.category}
                      </span>
                      {isFull && !isOverCapacity && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Full
                        </span>
                      )}
                      {isOverCapacity && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800 animate-pulse">
                          Over Capacity!
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-sm sm:text-base font-bold text-[#0E1B2E] uppercase truncate mt-1">
                      {table.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingTable(table)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      title="Edit Table Name / Capacity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table.id, table.name)}
                      className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Capacity Counter */}
                <div className="my-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Occupancy:</span>
                  <span className="font-mono font-bold text-[#0E1B2E]">
                    {occupiedSeats} / {table.capacity} Seats ({remainingSeats >= 0 ? `${remainingSeats} open` : `${Math.abs(remainingSeats)} extra`})
                  </span>
                </div>

                {/* Seated Guests List */}
                <div className="space-y-2 my-3 min-h-[90px]">
                  {seatedGuests.length === 0 ? (
                    <div className="py-6 text-center text-gray-400 text-xs italic bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
                      No guests seated here yet.
                    </div>
                  ) : (
                    seatedGuests.map((guest: RSVPRecord) => {
                      const guestSeats = guest.allocated_seats || guest.guest_count || 1;
                      const hasPlusOne = guestSeats > 1;

                      return (
                        <div
                          key={guest.id}
                          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/70 transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#0E1B2E] truncate block">
                                {guest.full_name}
                              </span>
                              {hasPlusOne ? (
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-[#0E1B2E] text-[#ECC880] text-[9px] font-mono font-bold">
                                  2 Seats (+1)
                                </span>
                              ) : (
                                <span className="shrink-0 px-1 py-0.5 rounded bg-gray-200 text-gray-700 text-[9px] font-mono">
                                  1 Seat
                                </span>
                              )}
                            </div>
                            {guest.guest_names && guest.guest_names !== guest.full_name && (
                              <span className="text-[10px] text-gray-500 italic block truncate">
                                + {guest.guest_names}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleUnseatGuest(guest)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                            title="Remove guest from this table"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Guest to Table Dropdown */}
              <div className="pt-3 border-t border-gray-100">
                {activeTableDropdown === table.id ? (
                  <div className="space-y-2">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const found = unassignedGuests.find((g) => g.id === e.target.value);
                        if (found) {
                          handleAssignGuest(found, table.name);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#D6B477] text-xs font-semibold text-[#0E1B2E] focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose an unassigned guest...
                      </option>
                      {unassignedGuests.map((g) => {
                        const s = g.allocated_seats || g.guest_count || 1;
                        return (
                          <option key={g.id} value={g.id}>
                            {g.full_name} ({s} seat{s > 1 ? 's' : ''})
                          </option>
                        );
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveTableDropdown(null)}
                      className="w-full text-center text-[10px] text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTableDropdown(table.id)}
                    disabled={unassignedGuests.length === 0}
                    className="w-full py-1.5 px-3 rounded-xl bg-[#0E1B2E]/5 hover:bg-[#0E1B2E] text-[#0E1B2E] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Seat Guest Here</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* MODAL: ADD NEW TABLE */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-display text-sm font-bold uppercase text-[#0E1B2E]">
                Add New Table
              </h3>
              <button
                onClick={() => setShowAddTableModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Table Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. Table 9 - High School Friends"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Seat Capacity
                  </label>
                  <select
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none"
                  >
                    <option value={6}>6 Seats</option>
                    <option value={8}>8 Seats</option>
                    <option value={10}>10 Seats</option>
                    <option value={12}>12 Seats</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newTableCategory}
                    onChange={(e) => setNewTableCategory(e.target.value as WeddingTable['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold hover:bg-[#142338]"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TABLE */}
      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-display text-sm font-bold uppercase text-[#0E1B2E]">
                Edit Table
              </h3>
              <button
                onClick={() => setEditingTable(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTable} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  required
                  value={editingTable.name}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Seat Capacity
                  </label>
                  <select
                    value={editingTable.capacity}
                    onChange={(e) => setEditingTable({ ...editingTable, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none"
                  >
                    <option value={6}>6 Seats</option>
                    <option value={8}>8 Seats</option>
                    <option value={10}>10 Seats</option>
                    <option value={12}>12 Seats</option>
                    <option value={14}>14 Seats</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingTable.category}
                    onChange={(e) => setEditingTable({ ...editingTable, category: e.target.value as WeddingTable['category'] })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold hover:bg-[#142338]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
