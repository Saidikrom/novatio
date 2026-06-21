import React, { useState, useEffect, useRef, useCallback } from 'react';
import { week2ReportData } from '../data/week2ReportData';

const TOTAL_SLIDES = 5;

// ─── Design tokens (Light Mode) ─────────────────────────────────────────────
const T = {
  bgDeep: '#E8EEF8',
  bgBase: '#F0EDFF',
  bgElevated: '#FFFFFF',
  surface: 'rgba(255,255,255,0.72)',
  surfaceMd: 'rgba(255,255,255,0.88)',
  surfaceHigh: 'rgba(255,255,255,0.95)',
  fg: '#1A1035',
  fgMuted: '#6B7280',
  fgSubtle: 'rgba(0,0,0,0.35)',
  accent: '#7C3AED',
  accentGlow: 'rgba(124,58,237,0.18)',
  accentGreen: '#059669',
  accentGreenGlow: 'rgba(5,150,105,0.18)',
  accentAmber: '#D97706',
  accentAmberGlow: 'rgba(217,119,6,0.18)',
  accentRed: '#E11D48',
  accentRedGlow: 'rgba(225,29,72,0.16)',
  border: 'rgba(0,0,0,0.08)',
  borderMd: 'rgba(0,0,0,0.13)',
  radius: '16px',
  radiusSm: '10px',
  radiusLg: '24px',
  easing: 'cubic-bezier(0.16,1,0.3,1)',
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
};

// ─── Ambient glow blobs ──────────────────────────────────────────────────
function AmbientBlobs({ colors }: { colors: [string, string, string] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: colors[0], filter: 'blur(80px)', opacity: 0.35,
        top: '-10%', left: '-15%',
        animation: 'blobFloat1 12s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 220, height: 220, borderRadius: '50%',
        background: colors[1], filter: 'blur(70px)', opacity: 0.28,
        bottom: '5%', right: '-10%',
        animation: 'blobFloat2 15s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 160, height: 160, borderRadius: '50%',
        background: colors[2], filter: 'blur(60px)', opacity: 0.22,
        top: '40%', left: '30%',
        animation: 'blobFloat1 18s ease-in-out infinite alternate-reverse',
      }} />
    </div>
  );
}

// ─── Animated number ─────────────────────────────────────────────────────
function AnimNum({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.round(ease * to));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ─── Ring progress ────────────────────────────────────────────────────────
function RingProgress({ value, max, size = 100, stroke = 8, color, bg = T.surface, label, sublabel }: {
  value: number; max: number; size?: number; stroke?: number;
  color: string; bg?: string; label: string; sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            style={{ transition: `stroke-dashoffset 1.4s ${T.easing}`, filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 100 ? 22 : 16, fontWeight: 800, color: T.fg, lineHeight: 1 }}>{label}</span>
          {sublabel && <span style={{ fontSize: 9, color: T.fgMuted, marginTop: 2 }}>{sublabel}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Delta pill ───────────────────────────────────────────────────────────
function DeltaPill({ value, unit = '', positiveIsGood = true }: {
  value: number; unit?: string; positiveIsGood?: boolean;
}) {
  const good = positiveIsGood ? value > 0 : value < 0;
  const neutral = value === 0;
  const color = neutral ? T.fgMuted : good ? T.accentGreen : T.accentRed;
  const glow = neutral ? 'transparent' : good ? T.accentGreenGlow : T.accentRedGlow;
  const icon = neutral ? '→' : value > 0 ? '↑' : '↓';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: glow, border: `1px solid ${color}44`,
      borderRadius: 20, padding: '3px 10px',
      fontSize: 11, fontWeight: 700, color,
      boxShadow: `0 0 10px ${glow}`,
    }}>
      {icon} {neutral ? '=' : Math.abs(value).toLocaleString()}{unit}
    </span>
  );
}

// ─── Surface card ─────────────────────────────────────────────────────────
const Card = ({ children, style, accent }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}) => (
  <div style={{
    background: T.surfaceMd,
    border: `1px solid ${accent ? `${accent}30` : T.border}`,
    borderRadius: T.radius,
    padding: '14px 16px',
    boxShadow: accent ? `0 0 30px ${accent}10` : 'none',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Label chip ───────────────────────────────────────────────────────────
const _Chip = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    fontSize: 9, fontWeight: 700, padding: '2px 8px',
    background: `${color}18`, border: `1px solid ${color}40`,
    borderRadius: 20, color,
  }}>{label}</span>
);

// ─── Section heading ──────────────────────────────────────────────────────
const SectionLabel = ({ children, color = 'rgba(124,106,246,0.75)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{
    fontSize: 10, letterSpacing: 3, fontWeight: 700,
    textTransform: 'uppercase', color, marginBottom: 10,
  }}>
    {children}
  </div>
);

// ─── Slide base ───────────────────────────────────────────────────────────
const slideBase: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: T.font,
  background: 'linear-gradient(160deg, #F3F0FF 0%, #EDF9F4 100%)',
};

// ══════════════════════════════════════════════════════════════════════════
// Slide 0 — Intro
// ══════════════════════════════════════════════════════════════════════════
function Slide0Intro({ userName }: { userName: string }) {
  const d = week2ReportData;
  const _improved = d.scoreChange >= 0;

  return (
    <div style={{ ...slideBase, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <AmbientBlobs colors={[T.accent, T.accentGreen, '#8B5CF6']} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 28px', width: '100%' }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: '0 auto 20px',
          background: `linear-gradient(135deg, ${T.accent}, #A78BFA)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${T.accentGlow}, 0 0 80px ${T.accentGlow}`,
          fontSize: 32,
        }}>
          📊
        </div>

        {/* Label */}
        <SectionLabel color={`${T.accent}CC`}>Haftalik Taqqoslama Hisobot</SectionLabel>

        {/* Title */}
        <div style={{ fontSize: 34, fontWeight: 900, color: T.fg, lineHeight: 1.1, marginBottom: 6 }}>
          {d.weekLabel}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, marginBottom: 6,
          background: `linear-gradient(135deg, ${T.accent}, #A78BFA, ${T.accentGreen})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Sog'liq Hisoboti
        </div>
        <div style={{ fontSize: 13, color: T.fgMuted, marginBottom: 32 }}>{d.dateRange}</div>

        {/* Score comparison */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16,
          background: T.surfaceMd, backdropFilter: 'blur(20px)',
          border: `1px solid ${T.borderMd}`, borderRadius: 28,
          padding: '16px 24px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: T.fgSubtle, marginBottom: 4 }}>O'tgan hafta</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: T.fgMuted }}>{d.week1.weekScore}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 20, color: T.fgSubtle }}>→</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: T.fgSubtle, marginBottom: 4 }}>Bu hafta</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: T.fg }}>{d.weekScore}</div>
          </div>
          <DeltaPill value={d.scoreChange} positiveIsGood />
        </div>

        {/* Dots */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 5 }}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <div key={i} style={{
              width: i === 0 ? 22 : 6, height: 6, borderRadius: 3,
              background: i === 0 ? T.accent : T.surface,
              boxShadow: i === 0 ? `0 0 8px ${T.accentGlow}` : 'none',
              transition: `width 0.3s ${T.easing}`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Slide 1 — Score
// ══════════════════════════════════════════════════════════════════════════
function Slide1Score() {
  const d = week2ReportData;
  const score = d.weekScore;
  const scoreLabel = score >= 85 ? 'Superstar!' : score >= 70 ? "Zo'r ketdi!" : score >= 50 ? 'Yaxshi harakat' : "Ko'proq harakat";
  const scoreColor = score >= 70 ? T.accentGreen : score >= 50 ? T.accentAmber : T.accentRed;

  return (
    <div style={{ ...slideBase, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <AmbientBlobs colors={[T.accentAmber, T.accent, '#F59E0B']} />
      <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', width: '100%' }}>
        <SectionLabel color={`${T.accentAmber}CC`}>Hafta Balli</SectionLabel>

        {/* Two rings */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, marginBottom: 24 }}>
          <div style={{ opacity: 0.45 }}>
            <RingProgress value={d.week1.weekScore} max={100} size={88} stroke={8} color={T.fgMuted} label={`${d.week1.weekScore}`} sublabel="o'tkan" />
          </div>
          <div style={{
            width: 1, height: 60, background: T.border,
          }} />
          <div>
            <RingProgress value={score} max={100} size={128} stroke={11} color={scoreColor} label={`${score}`} sublabel="bu hafta" />
          </div>
        </div>

        <div style={{
          fontSize: 24, fontWeight: 900, marginBottom: 8,
          color: scoreColor,
          textShadow: `0 0 20px ${scoreColor}66`,
        }}>
          {scoreLabel}
        </div>

        <div style={{ fontSize: 13, color: T.fgMuted, lineHeight: 1.7, maxWidth: 280, margin: '0 auto 20px' }}>
          {d.personalMessage}
        </div>

        <Card accent={T.accentAmber}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{d.achievementEmoji}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.accentAmber, lineHeight: 1.5 }}>{d.achievement}</div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Slide 2 — Calories (Visual-first redesign)
// ══════════════════════════════════════════════════════════════════════════

// Animated calorie bar column
function CalBar({ val, goal, dayShort, delay, isFatty }: {
  val: number; goal: number; dayShort: string; delay: number; isFatty?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  const maxPossible = 3600;
  const pct = Math.min(val / maxPossible, 1);
  const goalPct = Math.min(goal / maxPossible, 1);
  const over = val > goal;
  const barColor = over
    ? `linear-gradient(to top, ${T.accentRed}, #FB923C)`
    : `linear-gradient(to top, ${T.accentGreen}, #34D399)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: over ? T.accentRed : T.accentGreen }}>
        {over ? `+${val - goal}` : '✓'}
      </div>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 28,
        height: 80, background: 'rgba(0,0,0,0.06)', borderRadius: 8, overflow: 'hidden',
      }}>
        {/* goal line */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          bottom: `${goalPct * 100}%`,
          height: 1.5, background: 'rgba(0,0,0,0.25)', zIndex: 2,
        }} />
        {/* bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: mounted ? `${pct * 100}%` : '0%',
          background: barColor,
          transition: `height 0.9s ${T.easing} ${delay}ms`,
          borderRadius: 8,
          boxShadow: over ? `0 0 12px ${T.accentRed}55` : `0 0 10px #34D39955`,
        }} />
        {/* fatty meal pulse ring */}
        {isFatty && mounted && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 8,
            border: `2px solid ${T.accentRed}`,
            animation: 'fattyPulse 1.8s ease-in-out infinite',
          }} />
        )}
      </div>
      <div style={{ fontSize: 8, color: T.fgMuted, fontWeight: 600 }}>{dayShort}</div>
    </div>
  );
}

function Slide2Calories() {
  const d = week2ReportData;
  const weeklyGoal = d.days.reduce((s, day) => s + day.calorieGoal, 0);
  const goalPct = Math.round((d.totalCalories / weeklyGoal) * 100);
  const overKkal = d.totalCalories - weeklyGoal;
  const kg = (overKkal / 7700).toFixed(1);
  const calorieWorse = d.calorieChange > 0;
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{ ...slideBase, background: 'linear-gradient(160deg, #FFF5F0 0%, #FFF9EC 50%, #F0FDF4 100%)' }}>
      <AmbientBlobs colors={['#FB923C', T.accentRed, '#FCD34D']} />

      <div style={{
        position: 'relative', zIndex: 2,
        padding: '52px 16px 14px',
        display: 'flex', flexDirection: 'column',
        height: '100%', gap: 10, overflow: 'hidden',
      }}>

        {/* ── Header hero ── */}
        <div style={{
          opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(-14px)',
          transition: `opacity 0.45s ${T.easing}, transform 0.45s ${T.easing}`,
        }}>
          <SectionLabel color="rgba(234,88,12,0.75)">OZIQ-OVQAT</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: T.fg, lineHeight: 1, letterSpacing: -2 }}>
              <AnimNum to={d.totalCalories} />
            </div>
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontSize: 11, color: T.fgMuted, lineHeight: 1.2 }}>kkal</div>
              <div style={{ fontSize: 11, color: T.fgMuted, lineHeight: 1.2 }}>bu hafta</div>
            </div>
            <div style={{ paddingBottom: 7, marginLeft: 2 }}>
              <DeltaPill value={d.calorieChange} unit=" kkal" positiveIsGood={false} />
            </div>
          </div>
        </div>

        {/* ── Day-by-day bar chart ── */}
        <div style={{
          background: T.surfaceMd,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusLg,
          padding: '12px 14px 10px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.5s ${T.easing} 0.1s, transform 0.5s ${T.easing} 0.1s`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.fgMuted }}>Kunlik kalori</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 9, color: T.accentGreen, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: T.accentGreen }} />
                Maqsad
              </span>
              <span style={{ fontSize: 9, color: T.accentRed, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: T.accentRed }} />
                Ortiq
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end' }}>
            {d.days.map((day, i) => (
              <CalBar
                key={i}
                val={day.calories}
                goal={day.calorieGoal}
                dayShort={day.dayShort}
                delay={120 + i * 80}
                isFatty={!!day.fattyMeal}
              />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 8, color: T.fgSubtle, textAlign: 'center' }}>
            — Maqsad chizig'i · Ramka = yog'li ovqat kuni
          </div>
        </div>

        {/* ── Fatty meals visual ── */}
        <div style={{
          borderRadius: T.radius,
          background: `linear-gradient(120deg, rgba(225,29,72,0.07) 0%, rgba(251,146,60,0.05) 100%)`,
          border: `1px solid ${T.accentRed}28`,
          padding: '10px 12px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(14px)',
          transition: `opacity 0.55s ${T.easing} 0.22s, transform 0.55s ${T.easing} 0.22s`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.accentRed }}>Yog'li ovqatlar</div>
            <div style={{
              fontSize: 9, color: '#FB923C', fontWeight: 700,
              background: 'rgba(251,146,60,0.12)', borderRadius: 10, padding: '2px 8px',
            }}>
              {d.fattyCaloriesExtra.toLocaleString()} kkal ortiqcha
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {d.fattyMealExamples.map((ex, i) => (
              <div key={i} style={{
                flex: 1, background: T.surfaceHigh,
                borderRadius: T.radiusSm, padding: '8px 8px 6px',
                border: `1px solid ${T.accentRed}22`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                opacity: show ? 1 : 0,
                transform: show ? 'scale(1)' : 'scale(0.88)',
                transition: `opacity 0.4s ${T.easing} ${0.32 + i * 0.08}s, transform 0.4s ${T.easing} ${0.32 + i * 0.08}s`,
              }}>
                <div style={{
                  fontSize: 7, fontWeight: 700, color: T.fgSubtle,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{ex.day.slice(0, 3)}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: T.accentRed, lineHeight: 1 }}>
                  +{ex.extraKkal}
                </div>
                <div style={{ fontSize: 7, color: T.fgMuted, textAlign: 'center', lineHeight: 1.3 }}>
                  {ex.meal.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom stat chips ── */}
        <div style={{
          display: 'flex', gap: 7, marginTop: 'auto',
          opacity: show ? 1 : 0,
          transition: `opacity 0.5s ${T.easing} 0.45s`,
        }}>
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              ),
              val: `${goalPct}%`,
              label: "Maqsad",
              color: goalPct > 100 ? T.accentRed : T.accentGreen,
              bg: goalPct > 100 ? `${T.accentRed}10` : `${T.accentGreen}10`,
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/>
                </svg>
              ),
              val: d.avgCalories.toLocaleString(),
              label: "O'rtacha/kun",
              color: '#EA580C',
              bg: 'rgba(234,88,12,0.08)',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              ),
              val: calorieWorse ? `${kg} kg` : '✓',
              label: calorieWorse ? "Yog' xavfi" : "Nazoratda",
              color: calorieWorse ? T.accentRed : T.accentGreen,
              bg: calorieWorse ? `${T.accentRed}10` : `${T.accentGreen}10`,
            },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: s.bg,
              border: `1px solid ${s.color}25`,
              borderRadius: T.radius, padding: '10px 8px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 8, color: T.fgMuted, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Slide 3 — Medicines (Visual-first redesign)
// ══════════════════════════════════════════════════════════════════════════

// Pill grid cell per medicine per day
function _MedCell({ taken, total, delay }: { taken: number; total: number; delay: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  const pct = taken / total;
  const color = pct === 1 ? T.accentGreen : pct >= 0.75 ? '#84CC16' : pct >= 0.5 ? T.accentAmber : T.accentRed;
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8,
      background: mounted
        ? pct === 1
          ? `linear-gradient(135deg, ${T.accentGreen}, #34D399)`
          : pct >= 0.5
          ? `linear-gradient(135deg, ${T.accentAmber}, #FCD34D)`
          : `linear-gradient(135deg, ${T.accentRed}, #FB923C)`
        : 'rgba(0,0,0,0.06)',
      transition: `background 0.5s ${T.easing} ${delay}ms`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: mounted ? `0 2px 8px ${color}44` : 'none',
      position: 'relative', overflow: 'hidden',
    }}>
      {mounted && pct === 1 && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {mounted && pct < 1 && (
        <span style={{ fontSize: 9, fontWeight: 800, color: 'white' }}>{taken}/{total}</span>
      )}
    </div>
  );
}

function Slide3Medicines() {
  const d = week2ReportData;
  const pct = d.medicineAdherence;
  const w1pct = d.week1.medicineAdherence;
  const _improved = pct > w1pct;
  const accentColor = pct >= 80 ? T.accentGreen : pct >= 50 ? T.accentAmber : T.accentRed;
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  // Build medicine name list from data
  const _allMedNames = Array.from(new Set(d.missedMedicineDetails.flatMap(m => m.names)));
  const coreMeds = ['Omega-3', 'D vitamini', 'B12', 'Magniy', 'Tsink'];

  return (
    <div style={{ ...slideBase, background: 'linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 50%, #F0F4FF 100%)' }}>
      <AmbientBlobs colors={[T.accentGreen, '#34D399', T.accent]} />

      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', padding: '52px 16px 14px',
        display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
      }}>

        {/* ── Hero header with dual ring ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(-12px)',
          transition: `opacity 0.45s ${T.easing}, transform 0.45s ${T.easing}`,
        }}>
          {/* Big ring — this week */}
          <div style={{ flexShrink: 0 }}>
            <RingProgress
              value={pct} max={100} size={96} stroke={10}
              color={accentColor}
              label={`${pct}%`}
              sublabel="bu hafta"
            />
          </div>

          <div style={{ flex: 1 }}>
            <SectionLabel color={`${T.accentGreen}CC`}>DORILAR</SectionLabel>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.fg, lineHeight: 1.1 }}>
              {d.totalMedicinesTaken}
              <span style={{ fontSize: 13, color: T.fgMuted, fontWeight: 500 }}>/{d.totalMedicinesRequired} ta</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <DeltaPill value={d.medicineChangePct} unit="%" positiveIsGood />
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: T.fgMuted }}>
              O'tkan hafta:{' '}
              <span style={{ fontWeight: 700, color: T.fgMuted }}>{w1pct}%</span>
              {' '}· {d.week1.totalMedicinesTaken}/{d.week1.totalMedicinesRequired} ta
            </div>
          </div>
        </div>

        {/* ── Heatmap grid: days × medicines ── */}
        <div style={{
          background: T.surfaceMd,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusLg,
          padding: '12px 12px 10px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ${T.easing} 0.1s, transform 0.5s ${T.easing} 0.1s`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.fgMuted, marginBottom: 8 }}>
            Kunlik dori ichish
          </div>

          {/* Day labels row */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
            <div style={{ width: 42, flexShrink: 0 }} />
            {d.days.map((day, i) => (
              <div key={i} style={{
                width: 26, textAlign: 'center',
                fontSize: 8, fontWeight: 700, color: T.fgSubtle,
              }}>{day.dayShort}</div>
            ))}
          </div>

          {/* One row per medicine — show taken/missed per day */}
          {coreMeds.map((medName, mi) => (
            <div key={mi} style={{
              display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4,
              opacity: show ? 1 : 0,
              transform: show ? 'translateX(0)' : 'translateX(-8px)',
              transition: `opacity 0.4s ${T.easing} ${0.18 + mi * 0.06}s, transform 0.4s ${T.easing} ${0.18 + mi * 0.06}s`,
            }}>
              <div style={{
                width: 42, fontSize: 8, color: T.fgMuted, fontWeight: 600,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flexShrink: 0,
              }}>{medName.split(' ')[0]}</div>
              {d.days.map((day, di) => {
                const missed = d.missedMedicineDetails.find(m => m.day === day.day);
                const wasMissed = missed ? missed.names.includes(medName) : false;
                return (
                  <div key={di} style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: wasMissed
                      ? `linear-gradient(135deg, ${T.accentRed}CC, #FB923CCC)`
                      : `linear-gradient(135deg, ${T.accentGreen}, #34D399)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    opacity: show ? 1 : 0,
                    transform: show ? 'scale(1)' : 'scale(0.7)',
                    transition: `opacity 0.35s ${T.easing} ${0.2 + mi * 0.06 + di * 0.04}s, transform 0.35s ${T.easing} ${0.2 + mi * 0.06 + di * 0.04}s`,
                    boxShadow: wasMissed ? `0 2px 6px ${T.accentRed}33` : `0 2px 6px ${T.accentGreen}33`,
                  }}>
                    {wasMissed ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 8, color: T.accentGreen, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: T.accentGreen }} />
              Ichildi
            </span>
            <span style={{ fontSize: 8, color: T.accentRed, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: T.accentRed }} />
              Qoldirildi
            </span>
          </div>
        </div>

        {/* ── Worst day highlight ── */}
        <div style={{
          borderRadius: T.radius,
          background: `linear-gradient(120deg, rgba(225,29,72,0.07), rgba(251,146,60,0.05))`,
          border: `1px solid ${T.accentRed}28`,
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ${T.easing} 0.5s, transform 0.5s ${T.easing} 0.5s`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14, flexShrink: 0,
            background: `${T.accentRed}15`, border: `1.5px solid ${T.accentRed}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accentRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.accentRed }}>
              {d.worstMedicineDay} — eng yomon kun
            </div>
            <div style={{ fontSize: 9, color: T.fgMuted, marginTop: 2 }}>
              {(() => {
                const worst = d.missedMedicineDetails.find(m => m.day === d.worstMedicineDay);
                return worst ? worst.names.join(', ') : '—';
              })()} qoldirildi
            </div>
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900, color: T.accentRed,
            textShadow: `0 0 16px ${T.accentRed}55`,
          }}>
            {(() => {
              const worst = d.missedMedicineDetails.find(m => m.day === d.worstMedicineDay);
              return worst ? `-${worst.missed}` : '';
            })()}
          </div>
        </div>

        {/* ── Best day celebration ── */}
        <div style={{
          borderRadius: T.radius,
          background: `linear-gradient(120deg, rgba(5,150,105,0.08), rgba(52,211,153,0.05))`,
          border: `1px solid ${T.accentGreen}28`,
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ${T.easing} 0.58s, transform 0.5s ${T.easing} 0.58s`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14, flexShrink: 0,
            background: `${T.accentGreen}15`, border: `1.5px solid ${T.accentGreen}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accentGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.accentGreen }}>
              {d.bestMedicineDay} — to'liq bajarildi
            </div>
            <div style={{ fontSize: 9, color: T.fgMuted, marginTop: 2 }}>
              Barcha {d.days.find(dd => dd.day === d.bestMedicineDay)?.medicinesTotal ?? 8} ta dori ichildi
            </div>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 900, color: T.accentGreen,
            textShadow: `0 0 14px ${T.accentGreen}55`,
          }}>8/8</div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Slide 4 — End
// ══════════════════════════════════════════════════════════════════════════
function Slide4End({ userName }: { userName: string }) {
  const d = week2ReportData;
  const items = [
    { icon: '🍽️', label: 'Kalori/kun', w1: `${d.week1.avgCalories}`, w2: `${d.avgCalories}`, better: d.avgCalories < d.week1.avgCalories },
    { icon: '💊', label: 'Dori %', w1: `${d.week1.medicineAdherence}%`, w2: `${d.medicineAdherence}%`, better: d.medicineAdherence > d.week1.medicineAdherence },
    { icon: '📅', label: 'Hafta balli', w1: `${d.week1.weekScore}`, w2: `${d.weekScore}`, better: d.weekScore > d.week1.weekScore },
  ];

  return (
    <div style={{ ...slideBase, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <AmbientBlobs colors={[T.accentAmber, T.accent, T.accentGreen]} />
      <div style={{ position: 'relative', zIndex: 2, padding: '0 22px', width: '100%' }}>

        {/* Trophy */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: '0 auto 18px',
          background: `linear-gradient(135deg, ${T.accentAmber}, #F59E0B)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${T.accentAmberGlow}, 0 0 80px ${T.accentAmberGlow}`,
          fontSize: 32,
        }}>
          🌟
        </div>

        <div style={{ fontSize: 28, fontWeight: 900, color: T.fg, lineHeight: 1.1, marginBottom: 8 }}>
          Rahmat,{' '}
          <span style={{
            background: `linear-gradient(135deg, ${T.accentAmber}, #F59E0B, #FB923C)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {userName}!
          </span>
        </div>

        <div style={{ fontSize: 13, color: T.fgMuted, lineHeight: 1.7, marginBottom: 20, maxWidth: 290, margin: '0 auto 20px' }}>
          {d.personalMessage}
        </div>

        {/* Comparison table */}
        <Card style={{ textAlign: 'left', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
            <span style={{ fontSize: 9, color: T.fgSubtle, flex: 2 }}>Ko'rsatkich</span>
            <span style={{ fontSize: 9, color: T.fgSubtle, flex: 1, textAlign: 'center' }}>O'tkan</span>
            <span style={{ fontSize: 9, color: T.fgSubtle, flex: 1, textAlign: 'center' }}>Bu hafta</span>
            <span style={{ fontSize: 9, color: T.fgSubtle, flex: 0.8, textAlign: 'center' }}>Holat</span>
          </div>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 2px',
              borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 15 }}>{it.icon}</span>
                <span style={{ fontSize: 11, color: T.fgMuted }}>{it.label}</span>
              </div>
              <span style={{ flex: 1, fontSize: 11, color: T.fgSubtle, textAlign: 'center' }}>{it.w1}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.fg, textAlign: 'center' }}>{it.w2}</span>
              <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: it.better ? `${T.accentGreen}20` : `${T.accentAmber}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                }}>
                  {it.better ? '✓' : '!'}
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Next goal */}
        <div style={{
          padding: '14px 18px',
          background: `linear-gradient(135deg, ${T.accentAmberGlow}, ${T.accentGlow})`,
          border: `1px solid ${T.accentAmber}35`,
          borderRadius: T.radius,
        }}>
          <div style={{ fontSize: 10, color: T.accentAmber, fontWeight: 700, marginBottom: 5, letterSpacing: 1, textTransform: 'uppercase' }}>
            Keyingi hafta maqsadi
          </div>
          <div style={{ fontSize: 13, color: T.fg, lineHeight: 1.5 }}>
            🎯 {d.nextWeekGoal}
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Story progress bar
// ══════════════════════════════════════════════════════════════════════════
function StoryProgressBar({ total, current, onSegmentClick }: {
  total: number; current: number; onSegmentClick: (i: number) => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: '0 14px',
      position: 'absolute', top: 18, left: 0, right: 0, zIndex: 20,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} onClick={() => onSegmentClick(i)} style={{
          flex: 1, height: 2.5, borderRadius: 2, cursor: 'pointer',
          background: i < current ? T.fg : T.surfaceHigh,
          overflow: 'hidden',
        }}>
          {i === current && (
            <div style={{
              height: '100%', borderRadius: 2, background: T.fg,
              animation: 'progressFill 8s linear forwards',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Slides registry
// ══════════════════════════════════════════════════════════════════════════
const SLIDES = [
  (args: { userName: string }) => <Slide0Intro userName={args.userName} />,
  () => <Slide1Score />,
  () => <Slide2Calories />,
  () => <Slide3Medicines />,
  (args: { userName: string }) => <Slide4End userName={args.userName} />,
];

// ══════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════
export function WeeklyReport2() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = week2ReportData;

  const goTo = useCallback((idx: number, dir: 'next' | 'prev' = 'next') => {
    if (isAnimating || idx < 0 || idx >= TOTAL_SLIDES) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 260);
  }, [isAnimating]);

  const goNext = useCallback(() => goTo(Math.min(current + 1, TOTAL_SLIDES - 1), 'next'), [current, goTo]);
  const goPrev = useCallback(() => goTo(Math.max(current - 1, 0), 'prev'), [current, goTo]);

  useEffect(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (current < TOTAL_SLIDES - 1) autoRef.current = setTimeout(goNext, 8000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [current, goNext]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  const SlideComponent = SLIDES[current];
  const translateX = isAnimating
    ? direction === 'next' ? '-100%' : '100%'
    : '0%';

  return (
    <>
      <style>{`
        @keyframes progressFill {
          from { width: 0% }
          to { width: 100% }
        }
        @keyframes blobFloat1 {
          from { transform: translate(0px, 0px) scale(1); }
          to { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes blobFloat2 {
          from { transform: translate(0px, 0px) scale(1); }
          to { transform: translate(-25px, 15px) scale(0.95); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fattyPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes pillPop {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      <div style={{
        width: '100vw', height: '100vh',
        background: '#E8EEF8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.font,
        overflow: 'hidden',
      }}>
        <div
          style={{ width: '100%', height: '100%', maxWidth: 430, position: 'relative', overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <StoryProgressBar total={TOTAL_SLIDES} current={current} onSegmentClick={(i) => goTo(i, i > current ? 'next' : 'prev')} />

          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${translateX})`,
            transition: isAnimating ? `transform 0.26s ${T.easing}` : 'none',
            animation: !isAnimating ? `slideIn 0.32s ${T.easing} both` : 'none',
          }}>
            <SlideComponent userName={data.userName} />
          </div>

          {/* Tap zones */}
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
