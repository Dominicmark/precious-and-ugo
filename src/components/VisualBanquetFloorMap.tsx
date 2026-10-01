import React, { useState } from 'react';
import { WeddingTable } from '../lib/tableStorage';
import { RSVPRecord } from '../types/rsvp';
import {
  Users,
  X,
  Plus,
  Sparkles,
  Check,
  Crown,
  ChevronRight,
  Info,
  UserCheck,
} from 'lucide-react';

interface VisualBanquetFloorMapProps {
  tables: WeddingTable[];
  seatedMap: Map<string, RSVPRecord[]>;
  unassignedGuests: RSVPRecord[];
  onAssignGuest: (guest: RSVPRecord, tableName: string) => void;
  onUnseatGuest: (guest: RSVPRecord) => void;
}

export const VisualBanquetFloorMap: React.FC<VisualBanquetFloorMapProps> = ({
  tables,
  seatedMap,
  unassignedGuests,
  onAssignGuest,
  onUnseatGuest,
}) => {
  const [selectedTable, setSelectedTable] = useState<WeddingTable | null>(null);
  const [guestToAssignId, setGuestToAssignId] = useState<string>('');

  // Identify High Table vs Regular Tables
  const highTable = tables.find(
    (t) => t.id === 'tbl-1' || t.name.toLowerCase().includes('high table') || t.name.toLowerCase().includes('presidential')
  ) || tables[0];

  const regularTables = tables.filter((t) => t.id !== highTable?.id);

  // Divide tables into Bridal Wing (Left) and Groom Wing (Right)
  const bridalWingTables = regularTables.filter((_, idx) => idx % 2 === 0);
  const groomWingTables = regularTables.filter((_, idx) => idx % 2 !== 0);

  const renderTableGraphic = (table: WeddingTable, isHighTable = false) => {
    const seated = seatedMap.get(table.name) || [];
    const occupiedSeats = seated.reduce(
      (acc, g) => acc + (g.allocated_seats || g.guest_count || 1),
      0
    );
    const capacity = table.capacity || 10;
    const isFull = occupiedSeats >= capacity;
    const isOver = occupiedSeats > capacity;
    const isSelected = selectedTable?.id === table.id;

    // Generate chair positions around circle
    const chairs = Array.from({ length: capacity }, (_, i) => {
      const angle = (i * (360 / capacity) - 90) * (Math.PI / 180);
      const radius = isHighTable ? 64 : 52; // distance from center
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));
      const isOccupied = i < occupiedSeats;

      return { i, x, y, isOccupied };
    });

    return (
      <div
        key={table.id}
        onClick={() => setSelectedTable(table)}
        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer group select-none ${
          isSelected
            ? 'ring-3 ring-[#ECC880] bg-amber-50/70 scale-105'
            : 'hover:bg-white/80 hover:shadow-md'
        }`}
      >
        {/* Table & Surrounding Chairs Diagram */}
        <div className={`relative flex items-center justify-center ${isHighTable ? 'w-36 h-36' : 'w-32 h-32'}`}>
          {/* Chairs orbiting the table */}
          {chairs.map((chair) => (
            <div
              key={chair.i}
              style={{
                transform: `translate(${chair.x}px, ${chair.y}px)`,
              }}
              title={chair.isOccupied ? `Seat ${chair.i + 1}: Occupied` : `Seat ${chair.i + 1}: Open`}
              className={`absolute w-4 h-4 rounded-full transition-transform group-hover:scale-110 shadow-xs flex items-center justify-center text-[8px] font-bold ${
                chair.isOccupied
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-white border-2 border-dashed border-[#D6B477]/80 text-[#D6B477]'
              }`}
            >
              {chair.isOccupied ? '✓' : ''}
            </div>
          ))}

          {/* Center Table Disk */}
          <div
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-lg border-2 transition-all ${
              isHighTable
                ? 'bg-gradient-to-b from-[#0E1B2E] to-[#142338] border-[#ECC880] text-white'
                : isFull
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-white border-[#D6B477] text-[#0E1B2E]'
            }`}
          >
            {isHighTable && <Crown className="w-3.5 h-3.5 text-[#ECC880] mb-0.5" />}
            <span className="font-display text-[9px] font-black uppercase tracking-wider line-clamp-1">
              {table.name.replace(/Table \d+ - /i, '').replace(/High Table - /i, '')}
            </span>

            <span
              className={`text-[9px] font-mono font-extrabold mt-0.5 px-1.5 py-0.5 rounded-full ${
                isHighTable
                  ? 'bg-white/20 text-[#ECC880]'
                  : isFull
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {occupiedSeats}/{capacity}
            </span>
          </div>
        </div>

        {/* Caption */}
        <div className="text-center mt-1">
          <p className="font-display text-xs font-bold text-[#0E1B2E] tracking-wide">
            {table.name.split('-')[0].trim()}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold block">
            {isFull ? (
              <span className="text-emerald-700 font-bold">100% Full</span>
            ) : (
              `${capacity - occupiedSeats} open seats`
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* MAP LEGEND & CONTROLS */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#D6B477]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-emerald-400 text-white flex items-center justify-center text-[7px] font-bold">
              ✓
            </div>
            <span className="text-gray-700 font-medium">Occupied Seat</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-dashed border-[#D6B477] text-[8px]" />
            <span className="text-gray-700 font-medium">Available Seat</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#D6B477]" />
            <span className="text-gray-700 font-medium">High Table Dais</span>
          </div>
        </div>

        <p className="text-[11px] text-[#5687AD] font-semibold italic">
          💡 Click any round table to inspect seats, view seated couples, or seat unassigned guests.
        </p>
      </div>

      {/* THE ARCHITECTURAL BALLROOM FLOOR MAP */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#FAF5EA] via-white to-[#FAF5EA] border-2 border-[#D6B477] p-5 sm:p-8 shadow-xl overflow-x-auto min-w-[320px]">
        {/* Top Dais: Main Stage & High Table */}
        <div className="max-w-md mx-auto text-center mb-8">
          {/* Stage Platform Graphic */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0E1B2E] via-[#142338] to-[#0E1B2E] border-2 border-[#D6B477] text-white p-3 shadow-xl mb-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ECC880]" />
              <span className="font-display text-xs font-black tracking-[0.25em] text-[#ECC880] uppercase">
                Main Stage · Royal Couple&apos;s Dais
              </span>
              <Sparkles className="w-4 h-4 text-[#ECC880]" />
            </div>
            <p className="text-[10px] text-white/70 tracking-widest uppercase mt-0.5">
              Precious &amp; Ugochukwu · #UgoAmaka26
            </p>
          </div>

          {/* The High Table (Presidential VIP) */}
          {highTable && (
            <div className="flex justify-center">
              {renderTableGraphic(highTable, true)}
            </div>
          )}
        </div>

        {/* Central Floor Plan: Left (Bridal Wing), Center (Dancefloor / Aisle), Right (Groom Wing) */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          {/* LEFT: BRIDAL WING */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-center pb-2 border-b border-[#D6B477]/40">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#5687AD]">
                👰 Bridal Wing (Amaka&apos;s Guests)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 justify-items-center">
              {bridalWingTables.map((table) => renderTableGraphic(table))}
            </div>
          </div>

          {/* CENTER: ILLUMINATED DANCE FLOOR & BRIDAL AISLE */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-4">
            <div className="w-full h-full min-h-[340px] rounded-2xl bg-gradient-to-b from-[#ECC880]/20 via-[#D6B477]/10 to-[#8FB5D1]/20 border-2 border-dashed border-[#D6B477]/60 flex flex-col items-center justify-center p-3 text-center shadow-inner">
              <Sparkles className="w-6 h-6 text-[#D6B477] mb-2 animate-pulse" />
              <span className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-[#0E1B2E] writing-mode-vertical">
                Main Dance Floor &amp; Bridal Walkway
              </span>
            </div>
          </div>

          {/* RIGHT: GROOM WING */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-center pb-2 border-b border-[#D6B477]/40">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#0E1B2E]">
                🤵 Groom&apos;s Wing (Ugo&apos;s Guests)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 justify-items-center">
              {groomWingTables.map((table) => renderTableGraphic(table))}
            </div>
          </div>
        </div>

        {/* Entrance Gate at the Bottom */}
        <div className="mt-8 pt-4 border-t border-[#D6B477]/40 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white border border-[#D6B477] text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest">
            🚪 VIP Security &amp; Bouncer Reception Entrance
          </span>
        </div>
      </div>

      {/* TABLE INSPECTOR MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white border-2 border-[#D6B477] p-6 shadow-2xl space-y-4 text-left my-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#0E1B2E] text-[#ECC880]">
                  {selectedTable.category} Table
                </span>
                <h3 className="font-display text-base font-bold uppercase text-[#0E1B2E] mt-1">
                  {selectedTable.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Capacity: {selectedTable.capacity} Seats ·{' '}
                  {(seatedMap.get(selectedTable.name) || []).reduce(
                    (acc, g) => acc + (g.allocated_seats || g.guest_count || 1),
                    0
                  )}{' '}
                  Occupied
                </p>
              </div>

              <button
                onClick={() => setSelectedTable(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Seated Guests at this Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                Seated Guests &amp; Couples:
              </span>

              {(() => {
                const guests = seatedMap.get(selectedTable.name) || [];
                if (guests.length === 0) {
                  return (
                    <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-gray-400 border border-dashed border-gray-200">
                      No guests seated at this table yet.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {guests.map((g) => {
                      const seats = g.allocated_seats || g.guest_count || 1;
                      const hasPlusOne = seats > 1;

                      return (
                        <div
                          key={g.id}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display text-xs font-bold text-[#0E1B2E] truncate block">
                                {g.full_name}
                              </span>
                              {hasPlusOne ? (
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-[#0E1B2E] text-[#ECC880] text-[9px] font-mono font-bold">
                                  2 Seats (+1)
                                </span>
                              ) : (
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[9px] font-mono">
                                  1 Seat
                                </span>
                              )}
                            </div>

                            {g.guest_names && g.guest_names !== g.full_name && (
                              <p className="text-[10px] text-gray-500 italic truncate">
                                + {g.guest_names}
                              </p>
                            )}

                            <span className="text-[10px] text-gray-400 block">
                              Ref: {g.reference_code} · {g.relationship || 'Guest'}
                            </span>
                          </div>

                          <button
                            onClick={() => onUnseatGuest(g)}
                            className="px-2 py-1 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from this table"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Quick Seat an Unassigned Guest */}
            {unassignedGuests.length > 0 && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase">
                  Add Unassigned Guest to this Table:
                </label>
                <div className="flex gap-2">
                  <select
                    value={guestToAssignId}
                    onChange={(e) => setGuestToAssignId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-xs text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]"
                  >
                    <option value="">Choose an unassigned guest...</option>
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
                    disabled={!guestToAssignId}
                    onClick={() => {
                      const found = unassignedGuests.find((g) => g.id === guestToAssignId);
                      if (found) {
                        onAssignGuest(found, selectedTable.name);
                        setGuestToAssignId('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0E1B2E] text-[#ECC880] text-xs font-bold hover:bg-[#142338] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Seat
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
