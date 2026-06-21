import React from 'react';

const DAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const today = new Date().getDay();
const todayIndex = today === 0 ? 6 : today - 1;

const SAMPLE_PROGRESS = [0.9, 0.7, 1.0, 0.5, 0.8, todayIndex === 5 ? 0.4 : 0, todayIndex === 6 ? 0.2 : 0];

export const WeeklyProgress: React.FC = () => (
  <div style={{ padding: '0 14px' }}>
    <p style={styles.title}>Haftalik maqsadlar</p>
    <div style={styles.card}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {DAYS.map((day, i) => {
          const progress = Math.min(SAMPLE_PROGRESS[i] ?? 0, 1);
          const isToday = i === todayIndex;
          const barHeight = Math.max(progress * 48, 4);

          return (
            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 48, borderRadius: 8,
                background: 'rgba(45,39,69,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: barHeight,
                  background: isToday
                    ? 'linear-gradient(180deg, #6B8FF6, #845EF7)'
                    : progress >= 1
                    ? 'linear-gradient(180deg, #7BC47F, #4CAF50)'
                    : 'rgba(107,143,246,0.45)',
                  borderRadius: 8,
                  transition: 'height 400ms ease',
                }} />
              </div>
              <p style={{
                fontSize: 11, fontWeight: isToday ? 700 : 500,
                color: isToday ? '#6B8FF6' : 'rgba(45,39,69,0.5)',
                margin: 0,
              }}>{day}</p>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: 'rgba(45,39,69,0.45)', margin: '10px 0 0', textAlign: 'center', fontWeight: 500 }}>
        Bu hafta 4/7 kun maqsad bajarildi
      </p>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2D2745',
    letterSpacing: -0.2,
    margin: '0 0 10px 4px',
  },
  card: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.16))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.55)',
    padding: 14,
  },
};
