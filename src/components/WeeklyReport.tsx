import React, { useState, useEffect, useRef, useCallback } from 'react';
import { weeklyReportData, DayReport } from '../data/weeklyReportData';

// ─── Slide index constants ─────────────────────────────────────────
const TOTAL_SLIDES = 6;

// ─── Particle floating animation ──────────────────────────────────
function Particles({ count = 12, colors }: { count?: number; colors: string[] }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 4 + Math.sin(i * 2.3) * 4,
    x: (i / count) * 100,
    delay: i * 0.4,
    duration: 4 + (i % 3),
    color: colors[i % colors.length],
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0.6,
            animation: `floatUp ${p.duration}s ease-in infinite ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Progress ring ─────────────────────────────────────────────────
function RingProgress({
  value,
  max,
  size = 100,
  stroke = 8,
  color,
  bg = 'rgba(255,255,255,0.15)',
  label,
  sublabel,
  animate = true,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color: string;
  bg?: string;
  label: string;
  sublabel?: string;
  animate?: boolean;
}) {
  const [displayed, setDisplayed] = useState(animate ? 0 : value);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(displayed / max, 1);

  useEffect(() => {
    if (!animate) return;
    let start: number;
    const target = value;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisplayed(Math.round(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, animate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: LT.fg, lineHeight: 1 }}>{label}</span>
          {sublabel && <span style={{ fontSize: 10, color: LT.fgMuted, marginTop: 2 }}>{sublabel}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Animated number ───────────────────────────────────────────────
function AnimNum({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number;
    const duration = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 4);
      setVal(Math.round(ease * to));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ─── Bar chart for calories ────────────────────────────────────────
function CalorieBar({ day, value, goal, isHighlight }: { day: string; value: number; goal: number; isHighlight: boolean }) {
  const [h, setH] = useState(0);
  const MAX_H = 90;
  const pct = Math.min(value / goal, 1.4);
  const targetH = Math.max(Math.round(pct * MAX_H), 8);
  const overGoal = value > goal;
  const diff = value - goal;

  useEffect(() => {
    const t = setTimeout(() => setH(targetH), 120);
    return () => clearTimeout(t);
  }, [targetH]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
      {/* Value label */}
      <div style={{
        fontSize: 8,
        color: overGoal ? '#E11D48' : 'transparent',
        fontWeight: 700,
        lineHeight: 1,
        minHeight: 10,
      }}>
        {overGoal ? `+${Math.abs(diff)}` : ''}
      </div>

      {/* Bar */}
      <div style={{ position: 'relative', height: MAX_H, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Goal line */}
        <div style={{
          position: 'absolute',
          bottom: Math.round(MAX_H / 1.4),
          left: '10%', right: '10%',
          height: 1,
          background: 'rgba(0,0,0,0.15)',
          borderRadius: 1,
        }} />

        <div style={{
          width: '65%',
          height: h,
          borderRadius: '6px 6px 4px 4px',
          background: overGoal
            ? 'linear-gradient(180deg,#E11D48 0%,#FB923C 100%)'
            : isHighlight
              ? 'linear-gradient(180deg,#7C3AED 0%,#6D28D9 100%)'
              : 'linear-gradient(180deg,rgba(0,0,0,0.14) 0%,rgba(0,0,0,0.07) 100%)',
          transition: 'height 1s cubic-bezier(0.34,1.1,0.64,1)',
          boxShadow: overGoal
            ? '0 0 10px rgba(225,29,72,0.30)'
            : isHighlight
              ? '0 0 10px rgba(124,58,237,0.35)'
              : 'none',
        }} />
      </div>

      {/* Day label */}
      <div style={{
        fontSize: 9,
        color: isHighlight ? LT.violet : overGoal ? LT.rose : LT.fgMuted,
        fontWeight: isHighlight ? 800 : 500,
        letterSpacing: 0.3,
      }}>
        {day}
      </div>
    </div>
  );
}

// ─── Medicine dot grid ─────────────────────────────────────────────
function MedicineDotGrid({ days }: { days: DayReport[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {days.map((d, di) => (
        <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', width: 22, textAlign: 'right', flexShrink: 0 }}>
            {d.dayShort}
          </div>
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {Array.from({ length: d.medicinesTotal }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 20,
                  borderRadius: 4,
                  background: i < d.medicinesTaken
                    ? 'linear-gradient(135deg,#34D399,#059669)'
                    : 'rgba(255,255,255,0.1)',
                  transition: `background ${0.1 + i * 0.05}s ease ${di * 0.08 + i * 0.04}s`,
                  boxShadow: i < d.medicinesTaken ? '0 0 6px rgba(52,211,153,0.4)' : 'none',
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', width: 30, textAlign: 'left', flexShrink: 0 }}>
            {d.medicinesTaken}/{d.medicinesTotal}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mood emoji row ────────────────────────────────────────────────
const moodMap = { excellent: '🤩', good: '😊', okay: '😐', bad: '😔' };
const moodLabel = { excellent: 'Ajoyib', good: 'Yaxshi', okay: 'Normal', bad: "Og'ir" };
const moodColor = {
  excellent: 'linear-gradient(135deg,#F59E0B,#EF4444)',
  good: 'linear-gradient(135deg,#34D399,#059669)',
  okay: 'linear-gradient(135deg,#60A5FA,#3B82F6)',
  bad: 'linear-gradient(135deg,#9CA3AF,#6B7280)',
};

// ─── Light mode tokens ─────────────────────────────────────────────
const LT = {
  fg:          '#1A1035',
  fgMid:       '#4A3F72',
  fgMuted:     '#8878B8',
  white:       '#FFFFFF',
  violet:      '#7C3AED',
  violetLight: '#C4B5FD',
  violetGlow:  'rgba(124,58,237,0.20)',
  green:       '#059669',
  greenGlow:   'rgba(5,150,105,0.20)',
  amber:       '#D97706',
  amberGlow:   'rgba(217,119,6,0.20)',
  rose:        '#E11D48',
  roseGlow:    'rgba(225,29,72,0.16)',
  sky:         '#0284C7',
  skyGlow:     'rgba(2,132,199,0.16)',
  border:      'rgba(0,0,0,0.08)',
  borderMd:    'rgba(0,0,0,0.14)',
  surface:     'rgba(255,255,255,0.70)',
  surfaceMd:   'rgba(255,255,255,0.85)',
  easeOut:     'cubic-bezier(0.16,1,0.3,1)',
  easeSpring:  'cubic-bezier(0.34,1.56,0.64,1)',
  font:        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
};

// ─── Slide layouts ─────────────────────────────────────────────────

function Slide0Intro({ userName }: { userName: string }) {
  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#F3F0FF 0%,#EDF9F4 50%,#FFF8F0 100%)',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
    }}>
      <Particles count={20} colors={['rgba(124,58,237,0.25)', 'rgba(2,132,199,0.2)', 'rgba(217,119,6,0.2)']} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 64, marginBottom: 8, filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.4))' }}>✨</div>
        <div style={{ fontSize: 13, letterSpacing: 4, color: LT.violet, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
          Haftalik Hisobot
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, color: LT.fg, lineHeight: 1.1, marginBottom: 8 }}>
          Sizning<br />
          <span style={{ background: 'linear-gradient(135deg,#7C3AED,#0284C7,#D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sog'liq Yo'lingiz
          </span>
        </div>
        <div style={{ fontSize: 16, color: LT.fgMuted, marginBottom: 32 }}>
          {weeklyReportData.dateRange}
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: LT.surfaceMd, backdropFilter: 'blur(20px)',
          border: `1px solid ${LT.borderMd}`, borderRadius: 20, padding: '10px 20px',
          boxShadow: `0 4px 20px ${LT.violetGlow}`,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7C3AED,#0284C7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            👤
          </div>
          <span style={{ fontSize: 15, color: LT.fg, fontWeight: 700 }}>{userName}</span>
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 3,
              background: i === 0 ? LT.violet : 'rgba(0,0,0,0.12)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide1Score() {
  const score = weeklyReportData.weekScore;
  const scoreLabel = score >= 85 ? 'Superstar! 🌟' : score >= 70 ? 'Zo\'r ketdi! 💪' : score >= 50 ? 'Yaxshi harakat 👍' : "Ko'proq harakat 🎯";

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#FFFBEB 0%,#FFF8F0 50%,#F3F0FF 100%)',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
    }}>
      <Particles count={15} colors={['rgba(217,119,6,0.25)', 'rgba(124,58,237,0.2)', 'rgba(245,158,11,0.2)']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: LT.amber, fontWeight: 600, marginBottom: 24, textTransform: 'uppercase' }}>
          Hafta Ball
        </div>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <RingProgress
            value={score}
            max={100}
            size={180}
            stroke={14}
            color="url(#scoreGrad)"
            bg="rgba(0,0,0,0.08)"
            label={`${score}`}
            sublabel="/100"
          />
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={{ fontSize: 28, fontWeight: 900, color: LT.amber, marginBottom: 8 }}>{scoreLabel}</div>
        <div style={{ fontSize: 14, color: LT.fgMid, lineHeight: 1.6, maxWidth: 280 }}>
          {weeklyReportData.personalMessage}
        </div>

        <div style={{
          marginTop: 28, padding: '14px 20px',
          background: `${LT.amber}15`,
          border: `1px solid ${LT.amber}35`,
          borderRadius: 16,
          boxShadow: `0 4px 16px ${LT.amberGlow}`,
        }}>
          <div style={{ fontSize: 22 }}>{weeklyReportData.achievementEmoji}</div>
          <div style={{ fontSize: 13, color: LT.amber, fontWeight: 700, marginTop: 4 }}>
            {weeklyReportData.achievement}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide2Calories() {
  const data = weeklyReportData;
  const weeklyGoal = data.days.reduce((s, d) => s + d.calorieGoal, 0);
  const netDiff = data.totalCalories - weeklyGoal;
  const isLose = data.goal === 'lose';
  const overDaysCount = data.days.filter(d => d.calories > d.calorieGoal).length;
  const bestDay = data.days.reduce((a, b) => Math.abs(a.calories - a.calorieGoal) < Math.abs(b.calories - b.calorieGoal) ? a : b);

  type FB = { emoji: string; title: string; body: string; color: string; bg: string };
  let fb: FB;

  if (isLose) {
    if (netDiff > 200) {
      const kg = (netDiff / 7700).toFixed(2);
      fb = {
        emoji: '⚠️',
        title: `${netDiff.toLocaleString()} kkal oshib ketdi`,
        body: `Bu taxminan ${kg} kg yog'ga teng. ${overDaysCount} kunda maqsaddan chiqdingiz — keyingi hafta ehtiyot bo'ling.`,
        color: '#FF5C5C',
        bg: 'rgba(255,92,92,0.10)',
      };
    } else if (netDiff < -200) {
      fb = {
        emoji: '🔥',
        title: `${Math.abs(netDiff).toLocaleString()} kkal tejadingiz!`,
        body: `Juda zo'r! Tana yog'ini yoqyapsiz. Shu temp bilan davom eting — natija albatta ko'rinadi!`,
        color: '#34D399',
        bg: 'rgba(52,211,153,0.10)',
      };
    } else {
      fb = {
        emoji: '✅',
        title: `Maqsadga deyarli to'liq erishdingiz`,
        body: `Ajoyib intizom! Kalori balansini bu darajada saqlash — katta yutuq.`,
        color: '#FBBF24',
        bg: 'rgba(251,191,36,0.10)',
      };
    }
  } else {
    if (netDiff >= 0) {
      fb = {
        emoji: '💪',
        title: `${netDiff > 0 ? netDiff.toLocaleString() + ' kkal ortiqcha' : 'Aynan keraklicha'}`,
        body: `Mushaklaringiz o'sish uchun yetarli "qurilish materiali" bor. Mashqlarni unuting!`,
        color: '#60A5FA',
        bg: 'rgba(96,165,250,0.10)',
      };
    } else {
      fb = {
        emoji: '📉',
        title: `${Math.abs(netDiff).toLocaleString()} kkal yetishmadi`,
        body: `Semirish uchun kunlik normani to'ldirish shart. Ovqat miqdorini biroz ko'paytiring.`,
        color: '#FBBF24',
        bg: 'rgba(251,191,36,0.10)',
      };
    }
  }

  const goalPct = Math.min(Math.round((data.totalCalories / weeklyGoal) * 100), 999);
  const barColor = isLose
    ? (netDiff > 200 ? '#FF5C5C' : '#34D399')
    : (netDiff >= 0 ? '#60A5FA' : '#FBBF24');

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(170deg,#FFFBEB 0%,#FFF3E0 45%,#F3F0FF 100%)',
    }}>
      <Particles count={10} colors={['rgba(217,119,6,0.2)', 'rgba(225,29,72,0.15)', 'rgba(245,158,11,0.15)']} />

      <div style={{
        position: 'relative', zIndex: 2,
        padding: '48px 20px 20px',
        display: 'flex', flexDirection: 'column', height: '100%', gap: 14,
      }}>

        {/* ── Sarlavha ── */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: LT.amber, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            🍽️ Oziq-ovqat · Bu hafta
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: LT.fg, lineHeight: 1 }}>
              <AnimNum to={data.totalCalories} />
            </span>
            <span style={{ fontSize: 16, color: LT.fgMuted, fontWeight: 500 }}>kkal</span>
            <span style={{ fontSize: 11, color: LT.fgMuted, marginLeft: 4 }}>
              / {weeklyGoal.toLocaleString()} maqsad
            </span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: LT.fgMuted }}>Haftalik maqsad bajarilishi</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: barColor }}>{goalPct}%</span>
          </div>
          <div style={{ height: 7, background: 'rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(goalPct, 100)}%`,
              background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
              borderRadius: 10,
              transition: 'width 1.2s cubic-bezier(0.34,1.1,0.64,1)',
              boxShadow: `0 0 10px ${barColor}55`,
            }} />
          </div>
        </div>

        {/* ── Feedback visual block ── */}
        <div style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${fb.color}12 0%, ${fb.color}06 100%)`,
          border: `1.5px solid ${fb.color}35`,
          padding: '20px 18px 18px',
          boxShadow: `0 4px 20px ${fb.color}18`,
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: `radial-gradient(circle, ${fb.color}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              position: 'relative',
              width: 72, height: 72, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: `2px solid ${fb.color}40`,
                animation: 'pulseRing 2s ease-out infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 6,
                borderRadius: '50%',
                background: `${fb.color}12`,
                border: `1.5px solid ${fb.color}40`,
              }} />
              <span style={{ fontSize: 34, position: 'relative', zIndex: 1 }}>{fb.emoji}</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 20, fontWeight: 900, color: fb.color,
                lineHeight: 1.15, marginBottom: 4,
              }}>
                {fb.title}
              </div>
              <div style={{ fontSize: 11, color: LT.fgMid, lineHeight: 1.5 }}>
                {fb.body}
              </div>
            </div>
          </div>

        </div>

        {/* ── Bar chart ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
            {data.days.map((d, i) => (
              <CalorieBar
                key={i}
                day={d.dayShort}
                value={d.calories}
                goal={d.calorieGoal}
                isHighlight={d.day === bestDay.day}
              />
            ))}
          </div>
          <div style={{
            marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'linear-gradient(135deg,#FF4D4D,#FF8C42)' }} />
            <span style={{ fontSize: 9, color: LT.fgMuted }}>Maqsaddan oshdi</span>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(0,0,0,0.12)', marginLeft: 8 }} />
            <span style={{ fontSize: 9, color: LT.fgMuted }}>Maqsad ichida</span>
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, padding: '10px 12px',
            background: LT.surface,
            border: `1px solid ${LT.border}`,
            borderRadius: 14,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#D97706' }}>{data.avgCalories}</div>
            <div style={{ fontSize: 9, color: LT.fgMuted, marginTop: 2 }}>Kun o'rtachasi</div>
          </div>
          <div style={{
            flex: 2, padding: '10px 12px',
            background: LT.surface,
            border: `1px solid ${LT.border}`,
            borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: 22 }}>{bestDay.topMealEmoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: LT.fg, lineHeight: 1.2 }}>{bestDay.topMeal}</div>
              <div style={{ fontSize: 9, color: LT.fgMuted, marginTop: 2 }}>Eng yaxshi kun ovqati</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Slide3Medicines() {
  const data = weeklyReportData;
  const pct = Math.round((data.totalMedicinesTaken / data.totalMedicinesRequired) * 100);

  const color = pct >= 80 ? '#34D399' : pct >= 50 ? '#FBBF24' : '#FB923C';
  const bigEmoji = pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪';
  const msg = pct >= 80 ? "Juda yaxshi!" : pct >= 50 ? "Yaxshi harakat!" : "Davom eting!";

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(170deg,#EDFCF5 0%,#F0FDF4 50%,#EEF8FF 100%)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        padding: '48px 20px 20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>

        {/* ── Sarlavha ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: LT.green, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
            💊 Dorilar
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: LT.fg }}>
            Bu hafta dori ichish natijasi
          </div>
        </div>

        {/* ── Streak + eng yaxshi kun ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1,
            background: 'rgba(217,119,6,0.08)',
            border: `1px solid ${LT.amber}35`,
            borderRadius: 18, padding: '12px 10px', textAlign: 'center',
            boxShadow: `0 2px 10px ${LT.amberGlow}`,
          }}>
            <div style={{ fontSize: 26 }}>🔥</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: LT.amber, lineHeight: 1.1 }}>{data.medicineStreak}</div>
            <div style={{ fontSize: 11, color: LT.fgMuted, marginTop: 2 }}>ketma-ket kun</div>
          </div>
          <div style={{
            flex: 2,
            background: 'rgba(5,150,105,0.06)',
            border: `1px solid ${LT.green}30`,
            borderRadius: 18, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
            boxShadow: `0 2px 10px ${LT.greenGlow}`,
          }}>
            <div style={{ fontSize: 22 }}>🏆</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: LT.green, lineHeight: 1.2 }}>
              {data.bestMedicineDay}
            </div>
            <div style={{ fontSize: 11, color: LT.fgMuted }}>
              Barcha dori ichilgan kun
            </div>
          </div>
        </div>

        {/* ── Asosiy ko'rsatkich ── */}
        <div style={{
          background: LT.surface,
          border: `1.5px solid ${color}40`,
          borderRadius: 24,
          padding: '20px 16px',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: `0 4px 20px ${color}18`,
        }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>
            {bigEmoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ fontSize: 15, color: LT.fg, fontWeight: 700, marginTop: 2 }}>
              {msg}
            </div>
            <div style={{ fontSize: 13, color: LT.fgMuted, marginTop: 3 }}>
              {data.totalMedicinesTaken} ta ichildi · {data.totalMedicinesRequired} ta kerak edi
            </div>
          </div>
        </div>

        {/* ── Hafta kunlari (to'liq nom) ── */}
        <div style={{
          background: LT.surface,
          borderRadius: 20,
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
          border: `1px solid ${LT.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          {data.days.map((d, i) => {
            const p = d.medicinesTaken / d.medicinesTotal;
            const c = p === 1 ? LT.green : p >= 0.6 ? LT.amber : LT.rose;
            const e = p === 1 ? '✅' : p >= 0.5 ? '🟡' : '🔴';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{e}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: LT.fgMid, width: 96, flexShrink: 0 }}>{d.day}</div>
                <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${Math.round(p * 100)}%`,
                    background: c,
                    transition: `width 0.9s ease ${i * 0.07}s`,
                  }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: c, width: 32, textAlign: 'right', flexShrink: 0 }}>
                  {d.medicinesTaken}/{d.medicinesTotal}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function Slide4Activities() {
  const data = weeklyReportData;
  const hours = Math.floor(data.totalActivityMinutes / 60);
  const mins = data.totalActivityMinutes % 60;

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#F3F0FF 0%,#EEF8FF 40%,#F0FDF4 100%)',
    }}>
      <Particles count={14} colors={['rgba(124,58,237,0.2)', 'rgba(2,132,199,0.18)', 'rgba(5,150,105,0.15)']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: LT.violet, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
          Jismoniy faollik
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, color: LT.fg, lineHeight: 1.1, marginBottom: 4 }}>
          <AnimNum to={hours} suffix={`s ${mins}d`} />
        </div>
        <div style={{ fontSize: 12, color: LT.fgMuted, marginBottom: 28 }}>
          hafta davomida harakat qilindi
        </div>

        {/* Activity rings */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
          {data.days.slice(0, 7).map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <RingProgress
                value={d.activitiesCompleted}
                max={d.activitiesTotal}
                size={42}
                stroke={5}
                color={d.activitiesCompleted === d.activitiesTotal ? LT.green : LT.violet}
                bg="rgba(0,0,0,0.08)"
                label={`${d.activitiesCompleted}`}
                animate={false}
              />
              <div style={{ fontSize: 8, color: LT.fgMuted }}>{d.dayShort}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div style={{ ...statBox, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: LT.violet }}>
                <AnimNum to={data.totalSteps} />
              </div>
              <div style={{ fontSize: 10, color: LT.fgMuted }}>Jami qadam</div>
            </div>
            <div style={{ fontSize: 36 }}>👣</div>
          </div>
        </div>

        <div style={{ ...statBox }}>
          <div style={{ fontSize: 12, color: LT.violet, fontWeight: 700 }}>🌟 Eng aktiv kun: {data.bestActivityDay}</div>
          <div style={{ fontSize: 10, color: LT.fgMuted, marginTop: 2 }}>Barcha mashqlarni bajardingiz!</div>
        </div>
      </div>
    </div>
  );
}

function Slide5Water() {
  const data = weeklyReportData;
  const pct = Math.round((data.avgWater / 2.5) * 100);

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#EEF8FF 0%,#E0F2FE 50%,#F0FDF4 100%)',
      justifyContent: 'center', alignItems: 'center',
    }}>
      <Particles count={16} colors={['rgba(2,132,199,0.2)', 'rgba(14,165,233,0.18)', 'rgba(56,189,248,0.15)']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: LT.sky, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase' }}>
          Suv Ichish
        </div>

        {/* Water bottle visual */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <div style={{ fontSize: 80, filter: 'drop-shadow(0 0 20px rgba(2,132,199,0.30))' }}>💧</div>
          <div style={{
            position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
            background: LT.surface, border: `1px solid ${LT.sky}35`,
            borderRadius: 20, padding: '4px 14px',
            fontSize: 16, fontWeight: 800, color: LT.sky, whiteSpace: 'nowrap',
            boxShadow: `0 2px 10px ${LT.skyGlow}`,
          }}>
            {data.avgWater}L / kun
          </div>
        </div>

        <div style={{ fontSize: 38, fontWeight: 900, color: LT.fg, marginTop: 16, marginBottom: 4 }}>
          <AnimNum to={pct} suffix="%" />
        </div>
        <div style={{ fontSize: 13, color: LT.fgMuted, marginBottom: 28 }}>
          kunlik suv maqsadiga erishdingiz
        </div>

        {/* Wave bars */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 16 }}>
          {data.days.map((d, i) => {
            const h = Math.round((d.waterLiters / d.waterGoal) * 70);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: h,
                  borderRadius: 6,
                  background: d.waterLiters >= d.waterGoal
                    ? 'linear-gradient(180deg,#38BDF8,#0284C7)'
                    : 'rgba(2,132,199,0.15)',
                  transition: `height 0.8s ease ${i * 0.07}s`,
                  boxShadow: d.waterLiters >= d.waterGoal ? `0 0 8px ${LT.skyGlow}` : 'none',
                }} />
                <div style={{ fontSize: 8, color: LT.fgMuted }}>{d.dayShort}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: '12px 16px',
          background: `${LT.sky}10`,
          border: `1px solid ${LT.sky}28`,
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <span style={{ fontSize: 12, color: LT.fgMid }}>
            💡 Maqsad: <span style={{ color: LT.sky, fontWeight: 700 }}>{data.nextWeekGoal}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Slide6Mood() {
  const data = weeklyReportData;

  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#FDF4FF 0%,#F3F0FF 50%,#FFF8F0 100%)',
    }}>
      <Particles count={12} colors={['rgba(124,58,237,0.2)', 'rgba(217,119,6,0.18)', 'rgba(225,29,72,0.15)']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: LT.violet, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
          Kayfiyat
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: LT.fg, lineHeight: 1.1, marginBottom: 20 }}>
          Bu hafta qanday<br />o'tdingiz?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {data.days.filter(d => d.mood !== 'bad').map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: LT.surface,
              border: `1px solid ${LT.border}`,
              borderRadius: 14,
              animation: `slideInLeft 0.4s ease ${i * 0.07}s both`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 24 }}>{moodMap[d.mood]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: LT.fg }}>{d.day}</div>
                <div style={{ fontSize: 10, color: LT.fgMuted }}>{d.date}</div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20,
                background: moodColor[d.mood],
                color: '#fff',
              }}>
                {moodLabel[d.mood]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide7End({ userName }: { userName: string }) {
  return (
    <div style={{
      ...slideBase,
      background: 'linear-gradient(160deg,#FFFBEB 0%,#F3F0FF 40%,#EDFCF5 100%)',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
    }}>
      <Particles count={25} colors={['rgba(217,119,6,0.25)', 'rgba(124,58,237,0.2)', 'rgba(5,150,105,0.2)', 'rgba(225,29,72,0.15)']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(217,119,6,0.35))' }}>🌟</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: LT.fg, lineHeight: 1.1, marginBottom: 12 }}>
          Rahmat,<br />
          <span style={{
            background: 'linear-gradient(135deg,#D97706,#F59E0B,#FB923C)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{userName}!</span>
        </div>
        <div style={{ fontSize: 15, color: LT.fgMid, lineHeight: 1.7, marginBottom: 32, maxWidth: 280 }}>
          Siz bu hafta o'zingizga g'amxo'rlik qildingiz. Har bir qadam, har bir dori, har bir o'ylab iste'mol qilingan ovqat — bular barchasi siz uchun.
        </div>

        {/* Summary row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {[
            { emoji: '🍽️', val: `${weeklyReportData.avgCalories}`, sub: 'kkal/kun' },
            { emoji: '💊', val: `${weeklyReportData.totalMedicinesTaken}`, sub: 'dori' },
            { emoji: '📅', val: `${weeklyReportData.weekScore}`, sub: 'hafta ball' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 4px',
              background: LT.surface,
              border: `1px solid ${LT.border}`,
              borderRadius: 14,
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: LT.fg }}>{s.val}</div>
              <div style={{ fontSize: 9, color: LT.fgMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '14px 20px',
          background: `linear-gradient(135deg,${LT.amber}12,${LT.violet}0A)`,
          border: `1px solid ${LT.amber}35`,
          borderRadius: 16,
          boxShadow: `0 4px 16px ${LT.amberGlow}`,
        }}>
          <div style={{ fontSize: 13, color: LT.amber, fontWeight: 700 }}>Keyingi hafta maqsadi</div>
          <div style={{ fontSize: 12, color: LT.fgMid, marginTop: 4 }}>
            🎯 {weeklyReportData.nextWeekGoal}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────
const slideBase: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
};

const statBox: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 14,
  padding: '12px 14px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
};

// ─── Slides registry ───────────────────────────────────────────────
const SLIDES = [
  (args: { userName: string }) => <Slide0Intro userName={args.userName} />,
  () => <Slide1Score />,
  () => <Slide2Calories />,
  () => <Slide3Medicines />,
  () => <Slide6Mood />,
  (args: { userName: string }) => <Slide7End userName={args.userName} />,
];

const SLIDE_LABELS = [
  'Kirish', 'Ball', 'Kalori', 'Dorilar', 'Kayfiyat', 'Xulosa',
];

// ─── Progress bar strip ────────────────────────────────────────────
function StoryProgressBar({
  total,
  current,
  onSegmentClick,
}: {
  total: number;
  current: number;
  onSegmentClick: (i: number) => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 3, padding: '0 12px',
      position: 'absolute', top: 16, left: 0, right: 0, zIndex: 20,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSegmentClick(i)}
          style={{ flex: 1, height: 3, borderRadius: 2, cursor: 'pointer', background: 'rgba(0,0,0,0.14)', overflow: 'hidden' }}
        >
          <div style={{
            height: '100%', borderRadius: 2,
            background: 'rgba(0,0,0,0.55)',
            width: i < current ? '100%' : i === current ? '100%' : '0%',
            animation: i === current ? 'progressFill 8s linear forwards' : 'none',
            opacity: i < current ? 0.55 : 1,
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── Main WeeklyReport component ───────────────────────────────────
export function WeeklyReport() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = weeklyReportData;

  const goTo = useCallback((idx: number, dir: 'next' | 'prev' = 'next') => {
    if (isAnimating || idx < 0 || idx >= TOTAL_SLIDES) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
    }, 280);
  }, [isAnimating]);

  const goNext = useCallback(() => goTo(Math.min(current + 1, TOTAL_SLIDES - 1), 'next'), [current, goTo]);
  const goPrev = useCallback(() => goTo(Math.max(current - 1, 0), 'prev'), [current, goTo]);

  // Auto-advance every 8s
  useEffect(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (current < TOTAL_SLIDES - 1) {
      autoRef.current = setTimeout(goNext, 8000);
    }
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [current, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  const SlideComponent = SLIDES[current];
  const offsetX = isAnimating ? (direction === 'next' ? '-100%' : '100%') : '0%';

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          70% { opacity: 0.4; }
          100% { transform: translateY(-500px) scale(0.3); opacity: 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>

      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#E8EEF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        overflow: 'hidden',
      }}>
        {/* Story container — fills the full mobile screen */}
        <div style={{
          width: '100%',
          height: '100%',
          maxWidth: 430,
          position: 'relative',
          overflow: 'hidden',
        }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress bars */}
          <StoryProgressBar total={TOTAL_SLIDES} current={current} onSegmentClick={(i) => goTo(i, i > current ? 'next' : 'prev')} />

          {/* Slide content */}
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${offsetX})`,
            transition: isAnimating ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' : 'none',
            animation: !isAnimating ? 'fadeScale 0.35s ease both' : 'none',
          }}>
            <SlideComponent userName={data.userName} />
          </div>

          {/* Left / Right tap zones */}
          <div
            onClick={goPrev}
            style={{ position: 'absolute', left: 0, top: 44, bottom: 0, width: '38%', zIndex: 10, cursor: current > 0 ? 'w-resize' : 'default' }}
          />
          <div
            onClick={goNext}
            style={{ position: 'absolute', right: 0, top: 44, bottom: 0, width: '38%', zIndex: 10, cursor: current < TOTAL_SLIDES - 1 ? 'e-resize' : 'default' }}
          />
        </div>
      </div>
    </>
  );
}
