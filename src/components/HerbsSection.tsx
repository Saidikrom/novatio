import React, { useState } from 'react';
import { HerbItem } from '../types';

interface SlotDef {
  when: 'morning' | 'afternoon' | 'evening';
  timeEmoji: string;
  label: string;
  fallbackEmoji: string;
  accent: string;
}

const SLOT_DEFS: SlotDef[] = [
  { when: 'morning', timeEmoji: '🌅', label: 'Ertalab', fallbackEmoji: '🌿', accent: '#7BC47F' },
  { when: 'afternoon', timeEmoji: '☀️', label: 'Tushlik', fallbackEmoji: '🍵', accent: '#B59E8E' },
  { when: 'evening', timeEmoji: '🌙', label: 'Kechqurun', fallbackEmoji: '💊', accent: '#6B8FF6' },
];

interface Props {
  herbs: HerbItem[];
  onMarkDone: (activityId: number) => void;
}

export const HerbsSection: React.FC<Props> = ({ herbs, onMarkDone }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCardClick = (i: number) => {
    setActiveIndex(prev => (prev === i ? null : i));
  };

  return (
    <div style={{ padding: '0 14px' }}>
      <p style={styles.sectionTitle}>O'tlar va tavsiyalar</p>
      <div style={styles.outerCard}>
        <div style={{ display: 'flex', gap: activeIndex !== null ? 0 : 10 }}>
          {SLOT_DEFS.map((def, i) => {
            const herb = herbs.find(h => h.when === def.when) ?? null;
            const isActive = activeIndex === i;
            const isHidden = activeIndex !== null && !isActive;
            const emoji = herb?.emoji || def.fallbackEmoji;

            return (
              <div
                key={def.when}
                style={{
                  ...styles.cardWrapper,
                  flex: isActive ? 1 : isHidden ? 0 : 1,
                  opacity: isHidden ? 0 : 1,
                  overflow: 'hidden',
                  transition: 'flex 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease',
                }}
              >
                {/* Card */}
                <div
                  onClick={() => handleCardClick(i)}
                  style={{
                    ...styles.card,
                    cursor: 'pointer',
                    height: isActive ? 'auto' : undefined,
                  }}
                >
                  {isActive ? (
                    <ExpandedCard
                      def={def}
                      herb={herb}
                      emoji={emoji}
                      onDone={() => herb && onMarkDone(herb.activityId)}
                      onCollapse={() => setActiveIndex(null)}
                    />
                  ) : (
                    <CompactCard def={def} emoji={emoji} />
                  )}
                </div>
                {/* Label below card */}
                {!isActive && (
                  <p style={styles.cardLabel}>{herb?.name ?? '—'}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CompactCard: React.FC<{ def: SlotDef; emoji: string }> = ({ def, emoji }) => (
  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 20,
      background: `linear-gradient(135deg, ${def.accent}30, ${def.accent}15)`,
    }} />
    <span style={{ fontSize: 40, zIndex: 1 }}>{emoji}</span>
    <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 14 }}>{def.timeEmoji}</span>
  </div>
);

const ExpandedCard: React.FC<{
  def: SlotDef;
  herb: HerbItem | null;
  emoji: string;
  onDone: () => void;
  onCollapse: () => void;
}> = ({ def, herb, emoji, onDone, onCollapse }) => {
  const isCompleted = herb?.isCompleted ?? false;
  const name = herb?.name ?? def.label;

  return (
    <div style={{ padding: 10, position: 'relative' }}>
      {/* Close button */}
      <button onClick={e => { e.stopPropagation(); onCollapse(); }} style={styles.closeBtn}>✕</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Image / emoji */}
        <div style={{
          width: 100, height: 100, borderRadius: 20, overflow: 'hidden', flexShrink: 0,
          background: `linear-gradient(135deg, ${def.accent}30, ${def.accent}15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 48 }}>{emoji}</span>
        </div>
        {/* Info */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#2D2745', margin: '0 0 8px', lineHeight: 1.25 }}>{name}</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: def.accent, margin: 0 }}>
            {def.timeEmoji} {def.label}
          </p>
          {herb && (
            <p style={{ fontSize: 11, color: '#2D274580', margin: '4px 0 0' }}>
              {herb.quantity} {herb.quantityType}
            </p>
          )}
        </div>
      </div>
      {/* Action button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button
          onClick={e => { e.stopPropagation(); if (!isCompleted) onDone(); }}
          disabled={isCompleted}
          style={{
            ...styles.actionBtn,
            background: isCompleted ? '#4CAF5030' : `${def.accent}30`,
            border: `1px solid ${isCompleted ? '#4CAF5070' : `${def.accent}60`}`,
            color: isCompleted ? '#4CAF50' : def.accent,
            cursor: isCompleted ? 'default' : 'pointer',
          }}
        >
          {isCompleted ? '✓ Ichildi' : 'Ichish'}
        </button>
      </div>
    </div>
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.55)',
    padding: 8,
  },
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 0,
  },
  card: {
    width: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.2))',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.65)',
    overflow: 'hidden',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2D2745',
    letterSpacing: -0.2,
    margin: '6px 0 0',
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionBtn: {
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 14,
    padding: '8px 12px',
    letterSpacing: -0.2,
    border: 'none',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0,0,0,0.08)',
    border: 'none',
    borderRadius: 10,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 11,
    color: '#2D2745',
    zIndex: 2,
  },
};
