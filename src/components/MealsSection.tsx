import React, { useState } from 'react';
import { FoodItem, TimeBlocks } from '../types';
import { weeklyReportData } from '../data/weeklyReportData';

interface SlotDef {
  key: 'morning' | 'afternoon' | 'evening';
  timeEmoji: string;
  label: string;
  accent: string;
}

const SLOT_DEFS: SlotDef[] = [
  { key: 'morning', timeEmoji: '🌅', label: 'Nonushta', accent: '#F6C453' },
  { key: 'afternoon', timeEmoji: '🍽️', label: 'Tushlik', accent: '#E07A6B' },
  { key: 'evening', timeEmoji: '🌙', label: 'Kechki ovqat', accent: '#6B8FF6' },
];

interface Props {
  foods: TimeBlocks<FoodItem>;
  onMarkDone: (key: string) => void;
}

export const MealsSection: React.FC<Props> = ({ foods, onMarkDone }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({
    morning: 0,
    afternoon: 0,
    evening: 0,
  });

  const handleCardClick = (i: number) => {
    setActiveIndex(prev => (prev === i ? null : i));
  };

  return (
    <div style={{ padding: '0 14px' }}>
      <p style={styles.sectionTitle}>Ovqatlanish</p>
      <WeeklyCalorieProgress />
      <div style={styles.outerCard}>
        <div style={{ display: 'flex', gap: activeIndex !== null ? 0 : 10 }}>
          {SLOT_DEFS.map((def, i) => {
            const items = foods[def.key];
            if (items.length === 0) return null;
            const cIdx = carouselIndex[def.key];
            const currentItem = items[cIdx] ?? items[0];
            const isActive = activeIndex === i;
            const isHidden = activeIndex !== null && !isActive;

            return (
              <div
                key={def.key}
                style={{
                  ...styles.cardWrapper,
                  flex: isActive ? 1 : isHidden ? 0 : 1,
                  opacity: isHidden ? 0 : 1,
                  overflow: 'hidden',
                  transition: 'flex 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease',
                }}
              >
                <div
                  onClick={() => handleCardClick(i)}
                  style={{ ...styles.card, cursor: 'pointer' }}
                >
                  {isActive ? (
                    <ExpandedFoodCard
                      def={def}
                      items={items}
                      currentIndex={cIdx}
                      onPrev={() => setCarouselIndex(prev => ({
                        ...prev,
                        [def.key]: (cIdx - 1 + items.length) % items.length,
                      }))}
                      onNext={() => setCarouselIndex(prev => ({
                        ...prev,
                        [def.key]: (cIdx + 1) % items.length,
                      }))}
                      onDone={() => onMarkDone(currentItem.key)}
                      onCollapse={() => setActiveIndex(null)}
                    />
                  ) : (
                    <CompactFoodCard def={def} item={currentItem} count={items.length} />
                  )}
                </div>
                {!isActive && (
                  <p style={styles.cardLabel}>{currentItem.name}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DAYS_UZ = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];

const WeeklyCalorieProgress: React.FC = () => {
  const { days, avgCalories } = weeklyReportData;
  const dailyGoal = days[0]?.calorieGoal ?? 2000;
  const totalConsumed = days.reduce((s, d) => s + d.calories, 0);
  const totalGoal = dailyGoal * days.length;
  const progressPct = Math.min(totalConsumed / totalGoal, 1);

  const moodColor = (pct: number) => {
    if (pct >= 0.95 && pct <= 1.05) return '#4CAF50';
    if (pct > 1.05) return '#FF6B6B';
    return '#F6C453';
  };

  return (
    <div style={styles.weeklyCard}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2745', margin: 0, letterSpacing: -0.2 }}>
            Haftalik kalori
          </p>
          <p style={{ fontSize: 11, color: 'rgba(45,39,69,0.5)', margin: '2px 0 0', fontWeight: 500 }}>
            Kunlik maqsad: {dailyGoal.toLocaleString()} kkal
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2745', margin: 0, letterSpacing: -0.3 }}>
            {totalConsumed.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(45,39,69,0.45)', margin: '1px 0 0' }}>
            / {totalGoal.toLocaleString()} kkal
          </p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ height: 7, borderRadius: 4, background: 'rgba(45,39,69,0.08)', marginBottom: 12, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progressPct * 100}%`,
          borderRadius: 4,
          background: progressPct > 1.05
            ? 'linear-gradient(90deg,#FF6B6B,#FF8E53)'
            : progressPct >= 0.85
              ? 'linear-gradient(90deg,#4CAF50,#7BC47F)'
              : 'linear-gradient(90deg,#F6C453,#F6A053)',
          transition: 'width 0.8s ease',
        }} />
      </div>

      {/* Day bars */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60, marginBottom: 8 }}>
        {days.map((d, i) => {
          const pct = Math.min(d.calories / d.calorieGoal, 1.2);
          const barH = Math.round(pct * 48);
          const col = moodColor(d.calories / d.calorieGoal);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <div style={{
                width: '100%', height: barH, borderRadius: 4,
                background: col === '#4CAF50'
                  ? 'linear-gradient(180deg,#4CAF50,#7BC47F)'
                  : col === '#FF6B6B'
                    ? 'linear-gradient(180deg,#FF6B6B,#FF8E53)'
                    : 'linear-gradient(180deg,#F6C453,#F6A053)',
                opacity: 0.85,
              }} />
              <span style={{ fontSize: 9, color: 'rgba(45,39,69,0.45)', fontWeight: 600 }}>
                {DAYS_UZ[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={styles.chip}>
          <span style={{ fontSize: 11 }}>📊</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2D2745' }}>
            O'rtacha: {avgCalories} kkal
          </span>
        </div>
        <div style={styles.chip}>
          <span style={{ fontSize: 11 }}>
            {progressPct >= 0.85 ? '✅' : '⚠️'}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2D2745' }}>
            {Math.round(progressPct * 100)}% bajarildi
          </span>
        </div>
      </div>
    </div>
  );
};

const CompactFoodCard: React.FC<{ def: SlotDef; item: FoodItem; count: number }> = ({ def, item, count }) => (
  <div style={{
    position: 'relative', width: '100%', aspectRatio: '1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `linear-gradient(135deg, ${def.accent}30, ${def.accent}15)`,
    borderRadius: 20,
  }}>
    <span style={{ fontSize: 40 }}>{item.emoji}</span>
    <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 14 }}>{def.timeEmoji}</span>
    {item.isCompleted && (
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        background: 'rgba(76,175,80,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
      }}>✓</div>
    )}
    {count > 1 && (
      <div style={{
        position: 'absolute', bottom: 6, right: 6,
        background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '2px 5px',
        fontSize: 10, color: '#fff', fontWeight: 600,
      }}>
        1/{count}
      </div>
    )}
  </div>
);

const ExpandedFoodCard: React.FC<{
  def: SlotDef;
  items: FoodItem[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDone: () => void;
  onCollapse: () => void;
}> = ({ def, items, currentIndex, onPrev, onNext, onDone, onCollapse }) => {
  const item = items[currentIndex];
  const isCompleted = item.isCompleted;
  const hasMultiple = items.length > 1;

  return (
    <div style={{ padding: 10, position: 'relative' }}>
      <button onClick={e => { e.stopPropagation(); onCollapse(); }} style={styles.closeBtn}>✕</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Food image/emoji */}
        <div style={{
          width: 100, height: 100, borderRadius: 20, flexShrink: 0, overflow: 'hidden',
          background: `linear-gradient(135deg, ${def.accent}30, ${def.accent}15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 48 }}>{item.emoji}</span>
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#2D2745', margin: '0 0 6px', lineHeight: 1.25, letterSpacing: -0.3 }}>
            {item.name}
          </p>
          <p style={{ fontSize: 11, fontWeight: 600, color: def.accent, margin: '0 0 4px' }}>
            {def.timeEmoji} {def.label}
          </p>
          <p style={{ fontSize: 12, color: '#2D274570', margin: 0 }}>🔥 {item.kkal} kkal</p>
        </div>
      </div>

      {/* Carousel controls */}
      {hasMultiple && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <button onClick={e => { e.stopPropagation(); onPrev(); }} style={styles.arrowBtn}>‹</button>
          <div style={{ display: 'flex', gap: 4 }}>
            {items.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? 14 : 6,
                height: 6, borderRadius: 3,
                background: i === currentIndex ? def.accent : `${def.accent}50`,
                transition: 'width 200ms ease',
              }} />
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); onNext(); }} style={styles.arrowBtn}>›</button>
        </div>
      )}

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
          {isCompleted ? '✓ Yedim' : 'Yedim'}
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
  weeklyCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.2))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.6)',
    padding: '14px 14px 12px',
    marginBottom: 10,
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(45,39,69,0.07)',
    borderRadius: 20,
    padding: '4px 10px',
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
  arrowBtn: {
    background: 'rgba(0,0,0,0.08)',
    border: 'none',
    borderRadius: 8,
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: 18,
    color: '#2D2745',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
