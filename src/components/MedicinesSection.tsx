import React, { useState } from 'react';
import { MedicineItem } from '../types';

const INITIAL_COUNT = 3;
const PURPLE = '#845EF7';
const GREEN = '#4CAF50';

function timeIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('ertalab') || l.includes('nonushta') || l.includes('tong')) return '🌅';
  if (l.includes('tushlik') || l.includes('kunduzi')) return '☀️';
  if (l.includes('kechki') || l.includes('kechqurun') || l.includes('kech')) return '🌙';
  return '⏰';
}

interface Props {
  medicines: MedicineItem[];
  onToggleSlot: (id: number, slotIndex: number) => void;
}

export const MedicinesSection: React.FC<Props> = ({ medicines, onToggleSlot }) => {
  const [expanded, setExpanded] = useState(false);

  if (medicines.length === 0) return null;

  const hasMore = medicines.length > INITIAL_COUNT;
  const visible = expanded ? medicines : medicines.slice(0, INITIAL_COUNT);
  const hiddenCount = medicines.length - INITIAL_COUNT;

  return (
    <div style={{ padding: '0 14px' }}>
      <p style={styles.sectionTitle}>Dori-darmonlar</p>
      <div style={styles.outerCard}>
        {visible.map((item, i) => (
          <React.Fragment key={item.id}>
            {i > 0 && <div style={styles.divider} />}
            <MedicineRow item={item} onToggleSlot={(si) => onToggleSlot(item.id, si)} />
          </React.Fragment>
        ))}
        {hasMore && (
          <>
            <div style={styles.divider} />
            <button onClick={() => setExpanded(e => !e)} style={styles.showMoreBtn}>
              <span style={{ color: PURPLE, fontSize: 13, fontWeight: 600 }}>
                {expanded ? "Kamroq ko'rish" : `+${hiddenCount} ta ko'proq`}
              </span>
              <span style={{
                display: 'inline-block',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 250ms ease',
                color: PURPLE,
                marginLeft: 4,
              }}>▼</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const MedicineRow: React.FC<{ item: MedicineItem; onToggleSlot: (i: number) => void }> = ({ item, onToggleSlot }) => {
  const fullyDone = item.slots.every(s => s.isCompleted);

  return (
    <div style={styles.row}>
      {/* Avatar */}
      <div style={{
        ...styles.avatar,
        background: fullyDone ? `${GREEN}22` : `${PURPLE}18`,
        position: 'relative',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>{item.emoji}</span>
        {fullyDone && (
          <div style={styles.avatarCheck}>✓</div>
        )}
      </div>

      {/* Name + dosage */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 15, fontWeight: 700, color: '#2D2745',
          letterSpacing: -0.2, margin: 0,
          textDecoration: fullyDone ? 'line-through' : 'none',
          opacity: fullyDone ? 0.45 : 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </p>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#2D274570', margin: '3px 0 0' }}>
          {item.slots.length}× {item.dosage} {item.unit}
        </p>
      </div>

      {/* Slot buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        {item.slots.map((slot, i) => (
          <SlotButton key={i} slot={slot} onTap={() => onToggleSlot(i)} />
        ))}
      </div>
    </div>
  );
};

const SlotButton: React.FC<{ slot: { label: string; isCompleted: boolean }; onTap: () => void }> = ({ slot, onTap }) => {
  const done = slot.isCompleted;
  const color = done ? GREEN : PURPLE;

  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'center',
        background: done ? `${GREEN}14` : `${PURPLE}12`,
        border: `1px solid ${done ? `${GREEN}40` : `${PURPLE}35`}`,
        borderRadius: 12, padding: 0, cursor: 'pointer',
        transition: 'all 220ms ease',
      }}
    >
      {/* Time icon part */}
      <div style={{
        padding: '7px 9px',
        background: done ? `${GREEN}18` : `${PURPLE}18`,
        borderRadius: '11px 0 0 11px',
      }}>
        <span style={{ fontSize: 13 }}>{timeIcon(slot.label)}</span>
      </div>
      {/* Divider */}
      <div style={{ width: 1, height: 28, background: done ? `${GREEN}35` : `${PURPLE}25` }} />
      {/* Checkbox */}
      <div style={{ padding: '7px 9px' }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: done ? color : 'transparent',
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 220ms ease',
        }}>
          {done && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
        </div>
      </div>
    </button>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2D2745',
    letterSpacing: -0.2,
    margin: '0 0 10px 4px',
  },
  outerCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.16))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.55)',
    padding: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 6px',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  avatarCheck: {
    position: 'absolute',
    inset: 0,
    background: `${GREEN}35`,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: GREEN,
    fontWeight: 700,
  },
  divider: {
    height: 1,
    background: 'rgba(45,39,69,0.06)',
  },
  showMoreBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
};
