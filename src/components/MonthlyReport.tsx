import React, { useState, useEffect, useRef, useCallback } from 'react';
import { monthlyReportData } from '../data/monthlyReportData';

// ─── Tokens ─────────────────────────────────────────────────────────────────
const T = {
  fg:          '#1A1035',
  fgMid:       '#4A3F72',
  fgMuted:     '#8878B8',
  white:       '#FFFFFF',
  violet:      '#8B5CF6',
  violetLight: '#C4B5FD',
  violetGlow:  'rgba(139,92,246,0.25)',
  green:       '#059669',
  greenLight:  '#A7F3D0',
  greenGlow:   'rgba(5,150,105,0.22)',
  amber:       '#D97706',
  amberLight:  '#FDE68A',
  amberGlow:   'rgba(217,119,6,0.22)',
  rose:        '#E11D48',
  roseLight:   '#FECDD3',
  roseGlow:    'rgba(225,29,72,0.18)',
  sky:         '#0284C7',
  skyLight:    '#BAE6FD',
  skyGlow:     'rgba(2,132,199,0.18)',
  teal:        '#0D9488',
  tealLight:   '#99F6E4',
  tealGlow:    'rgba(13,148,136,0.20)',
  easeOut:     'cubic-bezier(0.16,1,0.3,1)',
  easeSpring:  'cubic-bezier(0.34,1.56,0.64,1)',
  font:        '"Raleway", -apple-system, BlinkMacSystemFont, sans-serif',
  fontHead:    '"Lora", Georgia, serif',
};

const WEEK_COLORS = [T.sky, T.violet, T.green, '#F59E0B'];
const WEEK_GLOWS  = [T.skyGlow, T.violetGlow, T.greenGlow, 'rgba(245,158,11,0.22)'];

// ─── AnimNum ─────────────────────────────────────────────────────────────────
function AnimNum({ to, suffix = '', decimals = 0, delay = 0, duration = 1300 }: {
  to: number; suffix?: string; decimals?: number; delay?: number; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(0);
  useEffect(() => {
    let startTs: number;
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4);
        setVal(parseFloat((e * to).toFixed(decimals)));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [to, delay, duration, decimals]);
  return <>{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}{suffix}</>;
}

// ─── ArcRing ─────────────────────────────────────────────────────────────────
function ArcRing({ value, max, size, stroke, color, glow, children, delay = 0 }: {
  value: number; max: number; size: number; stroke: number;
  color: string; glow: string; children?: React.ReactNode; delay?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const target = Math.min(value / max, 1);
    let s: number;
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 1300, 1);
        setPct((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}22`} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
function Sparkline({ values, color, w = 200, h = 48 }: { values: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...values), max = Math.max(...values), rng = max - min || 1;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * (w - 20) + 10,
    y: h - ((v - min) / rng) * (h - 20) - 10,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  const id = `sp${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${id})`} />
      <path d={pathD} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke={color} strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 4px ${color}99)` }} />
      ))}
    </svg>
  );
}

// ─── AnimBar ─────────────────────────────────────────────────────────────────
function AnimBar({ pct, color, glow, delay = 0, height = 10 }: {
  pct: number; color: string; glow: string; delay?: number; height?: number;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ flex: 1, height, background: `${color}18`, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 999,
        width: `${w}%`,
        background: `linear-gradient(90deg, ${color}BB, ${color})`,
        boxShadow: `0 0 10px ${glow}`,
        transition: `width 1.1s ${T.easeOut}`,
      }} />
    </div>
  );
}

// ─── Blobs ───────────────────────────────────────────────────────────────────
function Blobs({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {[
        { color: c1, w: 340, h: 340, top: '-80px', right: '-80px', br: '62% 38% 70% 30% / 45% 55% 45% 55%', anim: 'mbBlob1 14s ease-in-out infinite alternate', blur: 3 },
        { color: c2, w: 260, h: 260, bottom: '5%', left: '-60px', br: '40% 60% 30% 70% / 55% 45% 65% 35%', anim: 'mbBlob2 18s ease-in-out infinite alternate', blur: 3 },
        { color: c3, w: 180, h: 180, top: '42%', right: '8%', br: '50%', anim: 'mbBlob1 22s ease-in-out infinite alternate-reverse', blur: 2 },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: b.w, height: b.h,
          borderRadius: b.br,
          background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          top: (b as any).top, right: (b as any).right,
          bottom: (b as any).bottom, left: (b as any).left,
          filter: `blur(${b.blur}px)`,
          animation: b.anim,
        }} />
      ))}
    </div>
  );
}

// ─── Story progress bar ───────────────────────────────────────────────────────
const TOTAL = 8;
function StoryBar({ current, onTap }: { current: number; onTap: (i: number) => void }) {
  return (
    <div style={{ position: 'absolute', top: 14, left: 16, right: 16, zIndex: 30, display: 'flex', gap: 4 }}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div key={i} onClick={() => onTap(i)} style={{
          flex: 1, height: 3, borderRadius: 2, cursor: 'pointer',
          background: i < current ? 'rgba(0,0,0,0.5)' : i === current ? 'transparent' : 'rgba(0,0,0,0.14)',
          overflow: 'hidden',
        }}>
          {i === current && (
            <div style={{ height: '100%', borderRadius: 2, background: 'rgba(0,0,0,0.5)', animation: 'storyFill 9s linear forwards' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 0 — Intro
// ══════════════════════════════════════════════════════════════════════════════
function Slide0() {
  const d = monthlyReportData;
  const score = d.totalMonthScore;
  const great = score >= 80, good = score >= 65;
  const color = great ? T.green : good ? T.violet : T.amber;
  const glow  = great ? T.greenGlow : good ? T.violetGlow : T.amberGlow;
  const headline = great ? 'Bu oy siz o\'zingizni yengdingiz.' : good ? 'Siz to\'g\'ri yo\'lda davom etyapsiz.' : 'Har bir qadam muhim.';
  const sub = great
    ? 'Butun bir oy davomida harakatda bo\'ldingiz. Bu oddiy narsa emas.'
    : good ? 'Kichik o\'zgarishlar katta natijaga olib keladi. Isbotladingiz.'
    : 'Bir oylik harakat — bu allaqachon g\'alaba.';

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Blobs c1={`${color}44`} c2={`${T.violetLight}55`} c3={`${T.greenLight}33`} />
      <div style={{ position: 'relative', zIndex: 2, padding: '0 28px' }}>
        <div style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
          textTransform: 'uppercase', color: T.white,
          background: `${color}55`, border: `1px solid ${T.white}30`,
          borderRadius: 999, padding: '5px 16px', marginBottom: 28, backdropFilter: 'blur(8px)',
        }}>
          {d.monthLabel} · Oylik Hisobot
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <ArcRing value={score} max={100} size={180} stroke={16} color={color} glow={glow} delay={200}>
            <div>
              <div style={{ fontSize: 52, fontWeight: 900, color, fontFamily: T.fontHead, textShadow: `0 0 40px ${glow}`, lineHeight: 1 }}>
                <AnimNum to={score} delay={400} />
              </div>
              <div style={{ fontSize: 13, color: `${color}BB`, fontWeight: 700 }}>/ 100 ball</div>
            </div>
          </ArcRing>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.25, marginBottom: 12, animation: 'mbFadeUp 0.7s 0.6s both' }}>
          {headline}
        </div>
        <div style={{ fontSize: 15, color: T.fgMid, lineHeight: 1.7, fontWeight: 500, maxWidth: 300, margin: '0 auto', animation: 'mbFadeUp 0.7s 0.8s both' }}>
          {sub}
        </div>
        <div style={{ marginTop: 28, fontSize: 12, color: T.fgMuted }}>{d.dateRange}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Haftalik Ball
// ══════════════════════════════════════════════════════════════════════════════
function Slide1() {
  const { weeks } = monthlyReportData;
  const scores = weeks.map(w => w.weekScore);
  const rising = scores[3] > scores[0];
  const bestW  = weeks.reduce((a, b) => a.weekScore > b.weekScore ? a : b);
  const headline = rising ? 'Har hafta yaxshilab bordingiz!' : 'Oxirgi haftalarda qiyinchilik bo\'ldi.';
  const sub = rising
    ? `${bestW.label} eng yaxshi hafta bo'ldi — ${bestW.weekScore} ball. Bu so'nmaydigan nur!`
    : `${bestW.label} eng yaxshi bo'ldi — ${bestW.weekScore} ball. Shu ruhni keyingi oyga olib o'ting.`;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${T.violetLight}44`} c2={`${T.skyLight}33`} c3={`${T.greenLight}22`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 22px 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.violet, textTransform: 'uppercase', marginBottom: 6 }}>Haftalik Ball</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 6 }}>{headline}</div>
        <div style={{ fontSize: 14, color: T.fgMid, lineHeight: 1.6, marginBottom: 28 }}>{sub}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {weeks.map((w, i) => {
            const isBest = w.weekScore === bestW.weekScore;
            return (
              <div key={i} style={{ animation: `mbFadeUp 0.5s ${i * 0.1 + 0.3}s both` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: `${WEEK_COLORS[i]}22`, border: `1.5px solid ${WEEK_COLORS[i]}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: WEEK_COLORS[i],
                  }}>{w.week}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.fgMid }}>{w.label} · {w.dateRange}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {isBest && <span style={{ fontSize: 10, color: WEEK_COLORS[i], fontWeight: 800 }}>★ ENG YAXSHI</span>}
                        <span style={{ fontSize: 16, fontWeight: 900, color: WEEK_COLORS[i] }}>{w.weekScore}</span>
                      </div>
                    </div>
                    <AnimBar pct={w.weekScore} color={WEEK_COLORS[i]} glow={WEEK_GLOWS[i]} delay={i * 100 + 400} height={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, opacity: 0.85 }}>
          <Sparkline values={scores} color={T.violet} w={220} h={50} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Dorilar
// ══════════════════════════════════════════════════════════════════════════════
function MedRingRow({ week, index }: { week: typeof monthlyReportData.weeks[0]; index: number }) {
  const pct = week.medicineAdherence;
  const color = pct >= 90 ? T.green : pct >= 75 ? T.violet : pct >= 60 ? T.amber : T.rose;
  const glow  = pct >= 90 ? T.greenGlow : pct >= 75 ? T.violetGlow : pct >= 60 ? T.amberGlow : T.roseGlow;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: `mbFadeUp 0.5s ${index * 0.12 + 0.4}s both` }}>
      <ArcRing value={pct} max={100} size={76} stroke={8} color={color} glow={glow} delay={index * 130 + 350}>
        <span style={{ fontSize: 15, fontWeight: 900, color, lineHeight: 1 }}>
          <AnimNum to={pct} suffix="%" delay={index * 130 + 450} />
        </span>
      </ArcRing>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.fg }}>{week.label}</div>
        <div style={{ fontSize: 9, color: T.fgMuted }}>{week.medicinesTaken}/{week.medicinesRequired}</div>
      </div>
    </div>
  );
}

function Slide2() {
  const { weeks } = monthlyReportData;
  const adhs = weeks.map(w => w.medicineAdherence);
  const avg  = Math.round(adhs.reduce((a, b) => a + b, 0) / adhs.length);
  const great = avg >= 88, good = avg >= 70;
  const headline = great ? 'Dorilar bo\'yicha — champion!' : good ? 'Dorilar yo\'lida qadam tashlayapsiz.' : 'Dorini unutish — salomatlikni unutish.';
  const sub = great
    ? `O'rtacha ${avg}% — bu shifokorlar ham tavsiya qiladigan daraja. Davom eting!`
    : good
      ? `${avg}% — yaxshi boshlang'ich. Har kuni bitta qo'shimcha dori katta farq qiladi.`
      : `${avg}% — bu ko'rsatkich oshishi kerak. Telefonga eslatma o'rnating, o'zingizni asrang.`;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${T.greenLight}44`} c2={`${T.violetLight}33`} c3={`${T.greenLight}22`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 22px 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.green, textTransform: 'uppercase', marginBottom: 6 }}>Dorilar Ijrosi</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 6 }}>{headline}</div>
        <div style={{ fontSize: 14, color: T.fgMid, lineHeight: 1.6, marginBottom: 32 }}>{sub}</div>

        <div style={{ display: 'flex', justifyContent: 'space-around', flex: 1, alignItems: 'center' }}>
          {weeks.map((w, i) => <MedRingRow key={i} week={w} index={i} />)}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: T.fgMuted, marginBottom: 8, textAlign: 'center' }}>4 haftalik tendensiya</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Sparkline values={adhs} color={T.green} w={220} h={50} />
          </div>
        </div>

        <div style={{
          marginTop: 16, alignSelf: 'center',
          background: great ? `${T.green}18` : good ? `${T.violet}15` : `${T.rose}12`,
          border: `1.5px solid ${great ? T.green : good ? T.violet : T.rose}35`,
          borderRadius: 999, padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: great ? T.green : good ? T.violet : T.rose }}>
            <AnimNum to={avg} suffix="%" delay={600} />
          </span>
          <span style={{ fontSize: 11, color: T.fgMuted }}>oylik o'rtacha</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Oziq-Ovqat + Vazn yo'qotish
// ══════════════════════════════════════════════════════════════════════════════
function CalBar({ week, index, maxCal }: { week: typeof monthlyReportData.weeks[0]; index: number; maxCal: number }) {
  const [h, setH] = useState(0);
  const targetH = (week.avgCalories / maxCal) * 100;
  const goalH   = (week.calorieGoal  / maxCal) * 100;
  const over    = week.avgCalories > week.calorieGoal;
  useEffect(() => {
    const t = setTimeout(() => setH(targetH), index * 110 + 450);
    return () => clearTimeout(t);
  }, [targetH, index]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: `mbFadeUp 0.5s ${index * 0.12 + 0.3}s both` }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: over ? T.rose : T.green, textAlign: 'center', lineHeight: 1.2 }}>
        {week.avgCalories}<br /><span style={{ fontSize: 8, fontWeight: 600, color: T.fgMuted }}>kkal</span>
      </div>
      <div style={{ width: 40, height: 96, background: `${WEEK_COLORS[index]}14`, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${goalH}%`, height: 2, background: `${T.fg}30`, zIndex: 2 }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: `${h}%`, borderRadius: 12,
          background: over ? `linear-gradient(0deg, ${T.rose}EE, ${T.rose}77)` : `linear-gradient(0deg, ${T.green}EE, ${T.green}77)`,
          transition: `height 1.1s ${T.easeOut}`,
          boxShadow: `0 -3px 10px ${over ? T.roseGlow : T.greenGlow}`,
        }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: WEEK_COLORS[index] }}>{week.label}</div>
    </div>
  );
}

function Slide3() {
  const d = monthlyReportData;
  const { weeks } = d;
  const maxCal = 3200;
  const improving = weeks[weeks.length-1].avgCalories < weeks[0].avgCalories;

  // Vazn hisob-kitobi
  const weightLost    = d.weightLostKg;          // 2.3 kg
  const fatBurned     = d.fatBurnedKg;           // 1.4 kg
  const potential     = d.potentialWeightLossKg; // 3.8 kg
  const deficit       = Math.abs(d.calorieDeficit);

  const weightGood = weightLost >= 1.5;
  const headline = weightGood
    ? `Siz ${weightLost} kg yo'qotdingiz!`
    : improving
      ? 'Ovqat nazorati yaxshilanmoqda!'
      : 'Ovqat nazorati hali qo\'lingizda.';
  const sub = weightGood
    ? `Yegan ovqatlaringiz asosida ${fatBurned} kg yog' yoqildi. Ajoyib natija!`
    : `Maqsad chegarasiga rioya qilsangiz ${potential} kg yo'qotish mumkin edi.`;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${T.amberLight}44`} c2={`${T.greenLight}33`} c3={`${T.roseLight}22`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 22px 22px' }}>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.amber, textTransform: 'uppercase', marginBottom: 6 }}>
          Oziq-Ovqat · Vazn
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 6 }}>
          {headline}
        </div>
        <div style={{ fontSize: 13, color: T.fgMid, lineHeight: 1.6, marginBottom: 16 }}>
          {sub}
        </div>

        {/* Vazn yo'qotish hero card */}
        <div style={{
          background: `linear-gradient(135deg, ${T.green}14, ${T.teal}0A)`,
          border: `1.5px solid ${T.green}30`,
          borderRadius: 20, padding: '14px 16px', marginBottom: 14,
          animation: 'mbFadeUp 0.6s 0.3s both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Weight diff visual */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ fontSize: 11, color: T.fgMuted, fontWeight: 600 }}>{d.startWeightKg} kg</div>
              <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${T.fgMuted}55, ${T.green})` }} />
              <div style={{ fontSize: 16, fontWeight: 900, color: T.green }}>{d.endWeightKg} kg</div>
            </div>
            <div style={{ width: 1, height: 52, background: `${T.fg}12` }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.fgMuted, marginBottom: 4 }}>1 oy davomida</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: T.green, fontFamily: T.fontHead, textShadow: `0 0 20px ${T.greenGlow}` }}>
                  −<AnimNum to={weightLost} decimals={1} delay={400} />
                </span>
                <span style={{ fontSize: 14, color: T.green, fontWeight: 700 }}>kg</span>
              </div>
              <div style={{ fontSize: 11, color: T.fgMid, marginTop: 2 }}>
                Shundan <b style={{ color: T.green }}>{fatBurned} kg</b> — sof yog' yoqildi
              </div>
            </div>
          </div>

          {/* Potential vs actual */}
          <div style={{ marginTop: 12, padding: '10px 12px', background: `${T.amber}0E`, borderRadius: 12 }}>
            <div style={{ fontSize: 10, color: T.amber, fontWeight: 700, marginBottom: 4 }}>
              Maqsad chegarasida yesangiz edi:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 3, alignItems: 'baseline' }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: T.amber }}>−{potential}</span>
                <span style={{ fontSize: 12, color: T.amber, fontWeight: 700 }}>kg</span>
              </div>
              <div style={{ fontSize: 10, color: T.fgMuted, textAlign: 'right', lineHeight: 1.4 }}>
                {deficit.toLocaleString()} kkal<br />me'yordan ko'p yedingiz
              </div>
            </div>
          </div>
        </div>

        {/* Calorie bars */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flex: 1 }}>
          {weeks.map((w, i) => <CalBar key={i} week={w} index={i} maxCal={maxCal} />)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 10, fontSize: 10, color: T.fgMuted }}>
          <div style={{ width: 24, height: 2, background: `${T.fg}30`, borderRadius: 1 }} />
          <span>Maqsad: 1800 kkal/kun</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Qadamlar
// ══════════════════════════════════════════════════════════════════════════════
function Slide4() {
  const { weeks } = monthlyReportData;
  const steps  = weeks.map(w => w.totalSteps);
  const maxSt  = Math.max(...steps);
  const total  = steps.reduce((a, b) => a + b, 0);
  const rising = steps[3] > steps[0];
  const bestW  = weeks.reduce((a, b) => a.totalSteps > b.totalSteps ? a : b);
  const headline = rising ? 'Har hafta ko\'proq qadim!' : 'Qadamlar hali o\'z ritmini topa olmadi.';
  const sub = rising
    ? `${bestW.label}da rekord — ${bestW.totalSteps.toLocaleString()} qadam. Oyda ${total.toLocaleString()} qadam qo'ydingiz!`
    : `${bestW.label} eng faol hafta bo'ldi — ${bestW.totalSteps.toLocaleString()} qadam. Shu ruhni uyg'oting!`;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${T.skyLight}44`} c2={`${T.violetLight}28`} c3={`${T.greenLight}22`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 22px 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.sky, textTransform: 'uppercase', marginBottom: 6 }}>Qadamlar</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 6 }}>{headline}</div>
        <div style={{ fontSize: 14, color: T.fgMid, lineHeight: 1.6, marginBottom: 28 }}>{sub}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `mbFadeUp 0.5s ${i * 0.1 + 0.3}s both` }}>
              <div style={{ width: 54, textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.fgMid }}>{w.label}</div>
                <div style={{ fontSize: 9, color: T.fgMuted }}>{w.dateRange}</div>
              </div>
              <div style={{ flex: 1 }}>
                <AnimBar pct={(w.totalSteps / maxSt) * 100} color={WEEK_COLORS[i]} glow={WEEK_GLOWS[i]} delay={i * 100 + 400} height={18} />
              </div>
              <div style={{ width: 44, fontSize: 11, fontWeight: 900, color: WEEK_COLORS[i], textShadow: `0 0 10px ${WEEK_GLOWS[i]}` }}>
                {(w.totalSteps / 1000).toFixed(1)}k
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24, textAlign: 'center',
          background: `${T.sky}12`, border: `1.5px solid ${T.sky}28`,
          borderRadius: 18, padding: '14px 0',
        }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: T.sky, fontFamily: T.fontHead, textShadow: `0 0 20px ${T.skyGlow}` }}>
            <AnimNum to={total} delay={600} />
          </div>
          <div style={{ fontSize: 11, color: T.fgMuted, fontWeight: 600 }}>oy davomida jami qadam</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Doktor Maslahatini Yutib Oldingiz
// ══════════════════════════════════════════════════════════════════════════════

// Confetti particle — har biri chap yoki o'ng tomondan otiladi
const CONFETTI_COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF922B','#CC5DE8','#F06595','#74C0FC'];

function ConfettiBlast({ side }: { side: 'left' | 'right' }) {
  // 14 ta zarrача har bir tomonga
  const particles = Array.from({ length: 14 }, (_, i) => i);
  return (
    <>
      {particles.map(i => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        // Chap tomonga: -40...-130deg, o'ng tomonga: -140...-50deg
        const baseAngle = side === 'left' ? -(40 + i * 7) : -(140 - i * 7);
        const dist = 90 + (i % 4) * 28;
        const dx = Math.cos((baseAngle * Math.PI) / 180) * dist;
        const dy = Math.sin((baseAngle * Math.PI) / 180) * dist;
        const delay = i * 38;
        const size = i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 5;
        const isRect = i % 2 === 0;
        return (
          <div key={i} style={{
            position: 'absolute',
            width: isRect ? size : size + 2,
            height: isRect ? size * 0.5 : size * 0.5,
            borderRadius: isRect ? 2 : '50%',
            background: color,
            top: '50%', left: '50%',
            transformOrigin: 'center',
            animation: `confettiFly${side === 'left' ? 'L' : 'R'}${i} 1.1s ${delay}ms cubic-bezier(0.2,0.8,0.4,1) forwards`,
            opacity: 0,
          }}>
            <style>{`
              @keyframes confettiFly${side === 'left' ? 'L' : 'R'}${i} {
                0%   { transform: translate(0,0) rotate(0deg) scale(0.3);  opacity: 1; }
                60%  { opacity: 1; }
                100% { transform: translate(${dx}px, ${dy + 60}px) rotate(${side === 'left' ? -1 : 1}${200 + i * 25}deg) scale(1); opacity: 0; }
              }
            `}</style>
          </div>
        );
      })}
    </>
  );
}

function Slide5() {
  const [phase, setPhase] = useState(0);
  // 0=idle → 1=poppers shoot → 2=doctor glows → 3=text appears
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Light blob decorations */}
      <Blobs c1={`${T.greenLight}55`} c2={`${T.violetLight}44`} c3={`${T.tealLight}33`} />

      {/* Ambient glow behind doctor */}
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.green}28 0%, transparent 70%)`,
        top: '15%', left: '50%', transform: 'translateX(-50%)',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 1s ease',
        filter: 'blur(2px)',
        animation: phase >= 2 ? 'docGlowPulse 2.8s ease-in-out infinite' : 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0 24px' }}>

        {/* ── Doctor + party poppers ── */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>

          {/* LEFT 🎉 popper */}
          <div style={{
            fontSize: 52,
            position: 'absolute', right: '100%', bottom: 8,
            marginRight: -8,
            transform: phase >= 1 ? 'rotate(-20deg) scale(1)' : 'rotate(10deg) scale(0.4)',
            transition: `transform 0.5s ${T.easeSpring}`,
            filter: phase >= 2 ? `drop-shadow(0 0 12px #FFD93D)` : 'none',
            animation: phase >= 1 ? 'popperShakeL 0.4s 0.4s ease-in-out 2' : 'none',
          }}>🎉</div>

          {/* LEFT confetti blast */}
          {phase >= 1 && (
            <div style={{ position: 'absolute', right: '100%', bottom: 8, marginRight: 10, zIndex: 10 }}>
              <ConfettiBlast side="left" />
            </div>
          )}

          {/* Doctor circle */}
          <div style={{
            width: 148, height: 148, borderRadius: '50%',
            background: phase >= 2
              ? `linear-gradient(135deg, ${T.green}22 0%, ${T.teal}18 100%)`
              : 'rgba(0,0,0,0.04)',
            border: `3px solid ${phase >= 2 ? T.green : 'rgba(0,0,0,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 74,
            transition: `all 0.9s ${T.easeOut}`,
            boxShadow: phase >= 2
              ? `0 0 40px ${T.greenGlow}, 0 12px 40px ${T.greenGlow}`
              : '0 4px 20px rgba(0,0,0,0.06)',
            transform: phase >= 2 ? 'scale(1.06)' : 'scale(1)',
            animation: phase >= 2 ? 'docBounce 0.5s ease-out' : 'none',
          }}>
            👨‍⚕️
          </div>

          {/* RIGHT confetti blast */}
          {phase >= 1 && (
            <div style={{ position: 'absolute', left: '100%', bottom: 8, marginLeft: 10, zIndex: 10 }}>
              <ConfettiBlast side="right" />
            </div>
          )}

          {/* RIGHT 🎉 popper */}
          <div style={{
            fontSize: 52,
            position: 'absolute', left: '100%', bottom: 8,
            marginLeft: -8,
            transform: phase >= 1 ? 'rotate(20deg) scale(1) scaleX(-1)' : 'rotate(-10deg) scale(0.4) scaleX(-1)',
            transition: `transform 0.5s ${T.easeSpring}`,
            filter: phase >= 2 ? `drop-shadow(0 0 12px #FFD93D)` : 'none',
            animation: phase >= 1 ? 'popperShakeR 0.4s 0.4s ease-in-out 2' : 'none',
          }}>🎉</div>
        </div>

        {/* Text block */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(18px)',
          transition: `all 0.7s ${T.easeOut}`,
        }}>
          <div style={{
            fontSize: 32, fontWeight: 900, color: T.fg,
            fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 12,
          }}>
            Doktor maslahatini<br/>yutib oldingiz!
          </div>
          <div style={{
            fontSize: 15, color: T.fgMid,
            lineHeight: 1.6, maxWidth: 260, margin: '0 auto',
          }}>
            Sog'ligingizni doktor bilan birga yaxshilang.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes docGlowPulse {
          0%,100% { transform: translateX(-50%) scale(1);    opacity: 0.8; }
          50%      { transform: translateX(-50%) scale(1.12); opacity: 0.5; }
        }
        @keyframes docBounce {
          0%   { transform: scale(0.88); }
          60%  { transform: scale(1.10); }
          100% { transform: scale(1.06); }
        }
        @keyframes popperShakeL {
          0%,100% { transform: rotate(-20deg) scale(1); }
          50%      { transform: rotate(-28deg) scale(1.15) translateY(-6px); }
        }
        @keyframes popperShakeR {
          0%,100% { transform: rotate(20deg) scale(1) scaleX(-1); }
          50%      { transform: rotate(28deg) scale(1.15) scaleX(-1) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Tarozi (Navbatdagi ko'rik)
// ══════════════════════════════════════════════════════════════════════════════
function Slide6() {
  const d = monthlyReportData;
  const [scaleAnim, setScaleAnim] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setScaleAnim(true), 400);
    const t2 = setTimeout(() => setPulseRing(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${T.violetLight}40`} c2={`${T.skyLight}35`} c3={`${T.greenLight}28`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 24px 32px' }}>

        {/* 7 days badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${T.violet}15`, border: `1.5px solid ${T.violet}35`,
          borderRadius: 999, padding: '5px 14px', marginBottom: 20,
          fontSize: 11, fontWeight: 700, color: T.violet,
          animation: 'mbFadeUp 0.5s 0.2s both',
        }}>
          <span>📅</span> 7 kun ichida
        </div>

        {/* Headline */}
        <div style={{ fontSize: 26, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.25, marginBottom: 10, animation: 'mbFadeUp 0.6s 0.35s both' }}>
          Oylik o'zgarishlarni aniqroq bilib oling
        </div>
        <div style={{ fontSize: 14, color: T.fgMid, lineHeight: 1.7, maxWidth: 300, marginBottom: 32, animation: 'mbFadeUp 0.6s 0.5s both' }}>
          Natijalaringiz to'liq rasmni ko'rsatishi uchun <b>bizning tarozi orqali yana ko'rikdan o'ting.</b>
        </div>

        {/* Animated scale illustration */}
        <div style={{
          position: 'relative', width: 160, height: 160, marginBottom: 28,
          animation: 'mbFadeUp 0.6s 0.6s both',
        }}>
          {/* Pulse rings */}
          {pulseRing && [0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: `2px solid ${T.violet}`,
              animation: `scaleRipple 2.4s ${i * 0.8}s ease-out infinite`,
              opacity: 0,
            }} />
          ))}
          {/* Scale body */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff 0%, #F3F0FF 100%)',
              border: `3px solid ${T.violet}30`,
              boxShadow: `0 8px 40px ${T.violetGlow}, 0 2px 0 rgba(255,255,255,0.9) inset`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: scaleAnim ? 'scale(1)' : 'scale(0.7)',
              transition: `transform 0.7s ${T.easeSpring}`,
            }}>
              <div style={{ fontSize: 44 }}>⚖️</div>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, animation: 'mbFadeUp 0.6s 0.75s both' }}>
          {[
            { icon: '📊', text: 'Haqiqiy vazn o\'zgarishi', sub: 'Suvdan tashqari sof natija' },
            { icon: '💪', text: 'Mushak vs yog\' nisbati', sub: 'Tana tarkibining o\'zgarishi' },
            { icon: '🎯', text: 'Keyingi oy maqsadi', sub: 'Aniq raqamga asoslangan reja' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)',
              border: `1.5px solid ${T.violet}18`,
              borderRadius: 14, padding: '10px 14px',
              boxShadow: `0 2px 12px ${T.violetGlow}`,
              animation: `mbFadeUp 0.5s ${i * 0.1 + 0.85}s both`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: `${T.violet}12`, border: `1.5px solid ${T.violet}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{item.icon}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{item.text}</div>
                <div style={{ fontSize: 11, color: T.fgMuted, marginTop: 1 }}>{item.sub}</div>
              </div>
              <div style={{ fontSize: 14, color: T.violet }}>›</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 20, width: '100%',
          background: `linear-gradient(135deg, ${T.violet}, #6D28D9)`,
          borderRadius: 18, padding: '16px',
          boxShadow: `0 8px 32px ${T.violetGlow}`,
          animation: 'mbFadeUp 0.6s 1.15s both',
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.white, marginBottom: 2 }}>
            Ko'rikka yoziling
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>
            {d.dateRange.split('—')[1]?.trim()} dan 7 kun ichida
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleRipple {
          0%   { transform: scale(0.65); opacity: 0.6; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Yakuniy
// ══════════════════════════════════════════════════════════════════════════════
function Slide7() {
  const d = monthlyReportData;
  const score = d.totalMonthScore;
  const great = score >= 80, good = score >= 65;
  const color = great ? T.green : good ? T.violet : T.amber;
  const glow  = great ? T.greenGlow : good ? T.violetGlow : T.amberGlow;
  const farewell = great
    ? 'Keyingi oy ham shunday davom eting. Siz allaqachon yaxshi yo\'lda!'
    : good ? 'Kichik o\'zgarishlar yetarli. Har kuni bir qadam olg\'a!'
    : 'Hech qachon kech emas. Ertangi kun yangi boshlanish!';

  const topItems = [
    {
      icon: '💊', label: 'Dorilar', val: `${d.avgMedicineAdherence}%`,
      color: d.avgMedicineAdherence >= 85 ? T.green : d.avgMedicineAdherence >= 70 ? T.violet : T.rose,
      note: d.avgMedicineAdherence >= 85 ? 'Mukammal!' : d.avgMedicineAdherence >= 70 ? 'Yaxshi' : 'Oshirish kerak',
    },
    {
      icon: '⚖️', label: 'Vazn', val: `−${d.weightLostKg} kg`,
      color: d.weightLostKg >= 1.5 ? T.green : d.weightLostKg >= 0.5 ? T.amber : T.rose,
      note: d.weightLostKg >= 1.5 ? 'Ajoyib!' : d.weightLostKg >= 0.5 ? 'Davom eting' : 'Harakat kerak',
    },
    {
      icon: '👣', label: 'Qadamlar', val: `${(d.totalSteps / 1000).toFixed(0)}k`,
      color: d.totalSteps >= 250000 ? T.green : d.totalSteps >= 180000 ? T.violet : T.amber,
      note: d.totalSteps >= 250000 ? 'Faol!' : d.totalSteps >= 180000 ? 'Yaxshi' : 'Ko\'proq yuring',
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Blobs c1={`${color}33`} c2={`${T.violetLight}33`} c3={`${T.amberLight}22`} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 22px 28px', alignItems: 'center', textAlign: 'center' }}>

        <div style={{
          width: 76, height: 76, borderRadius: 26, marginBottom: 16,
          background: `linear-gradient(135deg, ${color}33, ${color}18)`,
          border: `2px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
          boxShadow: `0 0 40px ${glow}`,
          animation: 'mbPop 0.6s 0.2s both',
        }}>
          {great ? '🏆' : good ? '⭐' : '💪'}
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color, textTransform: 'uppercase', marginBottom: 8 }}>Oylik Yakuniy Natija</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.fg, fontFamily: T.fontHead, lineHeight: 1.2, marginBottom: 8 }}>
          {d.userName}, rahmat sizga!
        </div>
        <div style={{ fontSize: 14, color: T.fgMid, lineHeight: 1.65, marginBottom: 24, maxWidth: 290 }}>
          {d.personalMessage}
        </div>

        <div style={{ display: 'flex', gap: 8, width: '100%', marginBottom: 16 }}>
          {topItems.map((item, i) => (
            <div key={i} style={{
              flex: 1, background: `${item.color}0E`, border: `1.5px solid ${item.color}28`,
              borderRadius: 16, padding: '12px 6px',
              animation: `mbFadeUp 0.5s ${i * 0.12 + 0.5}s both`,
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.val}</div>
              <div style={{ fontSize: 9, color: T.fgMuted, marginTop: 3 }}>{item.label}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <div style={{
          width: '100%',
          background: `linear-gradient(135deg, ${color}14, ${T.violet}0A)`,
          border: `1.5px solid ${color}28`,
          borderRadius: 18, padding: '14px 16px',
          animation: 'mbFadeUp 0.6s 0.9s both',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Keyingi oy maqsadi</div>
          <div style={{ fontSize: 13, color: T.fg, lineHeight: 1.6, fontWeight: 500 }}>🎯 {d.nextMonthGoal}</div>
        </div>

        <div style={{ marginTop: 14, fontSize: 13, color: T.fgMuted, fontStyle: 'italic', lineHeight: 1.6 }}>
          {farewell}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7];

const SLIDE_BG = [
  'linear-gradient(160deg, #F3F0FF 0%, #EDF9F4 50%, #FFF8F0 100%)',
  'linear-gradient(160deg, #F0EDFF 0%, #EEF6FF 100%)',
  'linear-gradient(160deg, #EDFCF5 0%, #F3F0FF 100%)',
  'linear-gradient(160deg, #FFFBEB 0%, #F0FDF4 100%)',
  'linear-gradient(160deg, #EEF8FF 0%, #EDF9F4 100%)',
  'linear-gradient(160deg, #EDFAF8 0%, #F3F0FF 50%, #EDF9F4 100%)',
  'linear-gradient(160deg, #F3F0FF 0%, #EEF8FF 50%, #F0FDF4 100%)',
  'linear-gradient(160deg, #FDF4FF 0%, #F0FDF4 50%, #FFFBEB 100%)',
];

export function MonthlyReport() {
  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(false);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback((idx: number, d: 'next' | 'prev' = 'next') => {
    if (idx < 0 || idx >= TOTAL || entering) return;
    setDir(d);
    setEntering(true);
    setTimeout(() => { setCurrent(idx); setEntering(false); }, 280);
  }, [entering]);

  const goNext = useCallback(() => goTo(Math.min(current + 1, TOTAL - 1), 'next'), [current, goTo]);
  const goPrev = useCallback(() => goTo(Math.max(current - 1, 0), 'prev'), [current, goTo]);

  useEffect(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (current < TOTAL - 1) autoRef.current = setTimeout(goNext, 9000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [current, goNext]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [goNext, goPrev]);

  const SlideComp = SLIDES[current];
  const slideTranslate = entering ? (dir === 'next' ? '-100%' : '100%') : '0%';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800;900&display=swap');

        @keyframes mbBlob1 {
          from { border-radius: 62% 38% 70% 30% / 45% 55% 45% 55%; transform: scale(1) rotate(0deg); }
          to   { border-radius: 38% 62% 30% 70% / 55% 45% 65% 35%; transform: scale(1.08) rotate(8deg); }
        }
        @keyframes mbBlob2 {
          from { border-radius: 40% 60% 30% 70% / 55% 45% 65% 35%; transform: scale(1); }
          to   { border-radius: 65% 35% 60% 40% / 40% 60% 40% 60%; transform: scale(1.06); }
        }
        @keyframes mbFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mbPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes storyFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0F0E17', fontFamily: T.font,
      }}>
        <div style={{
          width: '100%', height: '100%', maxWidth: 430,
          position: 'relative', overflow: 'hidden',
          background: SLIDE_BG[current],
          transition: 'background 0.5s ease',
        }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 44) dx < 0 ? goNext() : goPrev();
            touchX.current = null;
          }}
        >
          <StoryBar current={current} onTap={i => goTo(i, i > current ? 'next' : 'prev')} />

          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${slideTranslate})`,
            transition: entering ? `transform 0.28s ${T.easeOut}` : 'none',
            animation: !entering ? `mbFadeUp 0.32s ${T.easeOut} both` : 'none',
          }}>
            <SlideComp />
          </div>

          <div onClick={goPrev} style={{ position: 'absolute', left: 0, top: 44, bottom: 0, width: '35%', zIndex: 20, cursor: current > 0 ? 'w-resize' : 'default' }} />
          <div onClick={goNext} style={{ position: 'absolute', right: 0, top: 44, bottom: 0, width: '35%', zIndex: 20, cursor: current < TOTAL - 1 ? 'e-resize' : 'default' }} />
        </div>
      </div>
    </>
  );
}
