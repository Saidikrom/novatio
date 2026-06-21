import React from 'react';

interface StatItem {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const STATS: StatItem[] = [
  { emoji: '🔥', label: 'Kaloriya', value: '1,840 kkal', color: '#F6C453' },
  { emoji: '💧', label: 'Suv', value: '1.4 / 2 L', color: '#6B8FF6' },
  { emoji: '🚶', label: 'Qadamlar', value: '6,240', color: '#7BC47F' },
  { emoji: '😴', label: 'Uyqu', value: '7.5 soat', color: '#B59E8E' },
];

export const StatsCard: React.FC = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={styles.card}>
      {STATS.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div style={styles.divider} />}
          <div style={styles.statItem}>
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#2D2745', margin: '4px 0 0', letterSpacing: -0.2 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(45,39,69,0.5)', margin: '2px 0 0', fontWeight: 500 }}>{s.label}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.2))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.6)',
    padding: '14px 4px',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 4px',
  },
  divider: {
    width: 1,
    background: 'rgba(45,39,69,0.08)',
    margin: '4px 0',
  },
};
