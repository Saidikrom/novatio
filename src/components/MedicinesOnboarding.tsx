import React, { useState, useEffect, useRef, useCallback } from 'react';

const PURPLE = '#845EF7';
const GREEN = '#4CAF50';
const PURPLE_LIGHT = 'rgba(132,94,247,0.12)';
const GREEN_LIGHT = 'rgba(76,175,80,0.14)';

interface Step {
  id: number;
  title: string;
  description: string;
  highlight: 'avatar' | 'name' | 'slots' | 'toggle' | 'expand';
}

const STEPS: Step[] = [
  {
    id: 0,
    title: "Dori-darmonlar ro'yxati",
    description: "Bu yerda kunlik dori va vitaminlaringiz ko'rsatiladi. Har biri uchun vaqt rejalari belgilangan.",
    highlight: 'avatar',
  },
  {
    id: 1,
    title: "Dori nomi va dozasi",
    description: "Har bir dorining nomi va qancha miqdorda ichish kerakligi ko'rsatilgan. Masalan: 2× 1 dona.",
    highlight: 'name',
  },
  {
    id: 2,
    title: "Vaqt slotlari",
    description: "Har bir dori uchun vaqt slotlari bor — ertalab 🌅, tushlik ☀️ yoki kechqurun 🌙. Bir dorini bir necha marta ichish mumkin.",
    highlight: 'slots',
  },
  {
    id: 3,
    title: "Bajarildi deb belgilash",
    description: "Dorini ichganingizdan so'ng tugmani bosing. Yashil rang — bajarildi! Dori nomi ustidan chiziq chiqadi.",
    highlight: 'toggle',
  },
  {
    id: 4,
    title: "Ko'proq ko'rish",
    description: "Agar dorilar ko'p bo'lsa, qolganlarini ko'rish uchun quyidagi tugmani bosing. Barchasi bir joyda!",
    highlight: 'expand',
  },
];

const DEMO_MEDICINE = {
  name: 'Magniy B6',
  emoji: '💊',
  dosage: 1,
  unit: 'dona',
  slots: [
    { label: 'Ertalab', icon: '🌅' },
    { label: 'Kechqurun', icon: '🌙' },
  ],
};

const EXTRA_MEDICINES = [
  { name: 'D3 Vitamini', emoji: '🌞', dosage: 1, unit: 'dona', icon: '🌅' },
  { name: 'Omega-3', emoji: '🐟', dosage: 2, unit: 'dona', icon: '☀️' },
];

interface ArrowPos {
  x: number;
  y: number;
  visible: boolean;
}

export const MedicinesOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [slotDone, setSlotDone] = useState([false, false]);
  const [entered, setEntered] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  // animating: true = currently pressing button (scale effect)
  const [btnPressing, setBtnPressing] = useState(false);
  const [arrowPos, setArrowPos] = useState<ArrowPos>({ x: 0, y: 0, visible: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toggleLoopRef = useRef<NodeJS.Timeout | null>(null);
  const expandLoopRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = STEPS[step];

  const getRefForHighlight = useCallback((h: string) => {
    if (h === 'avatar') return avatarRef;
    if (h === 'name') return nameRef;
    if (h === 'slots' || h === 'toggle') return slotsRef;
    if (h === 'expand') return expandRef;
    return null;
  }, []);

  const updateArrow = useCallback(() => {
    const ref = getRefForHighlight(currentStep.highlight);
    if (!ref?.current || !containerRef.current) return;
    const elRect = ref.current.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    setArrowPos({
      x: elRect.left + elRect.width / 2 - contRect.left,
      y: elRect.bottom - contRect.top + 6,
      visible: true,
    });
  }, [currentStep.highlight, getRefForHighlight]);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setCardVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPulseActive(false);
    setArrowPos(p => ({ ...p, visible: false }));
    timerRef.current = setTimeout(() => {
      updateArrow();
      setPulseActive(true);
    }, 420);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step, updateArrow]);

  // Re-measure arrow when expand opens/closes (card height changes)
  useEffect(() => {
    if (currentStep.highlight === 'expand') {
      setTimeout(updateArrow, 320);
    }
  }, [showExpand, currentStep.highlight, updateArrow]);

  // Loop: step 3 → auto check/uncheck slot[1]
  useEffect(() => {
    const clearLoop = () => { if (toggleLoopRef.current) clearTimeout(toggleLoopRef.current); };

    if (currentStep.highlight !== 'toggle') {
      clearLoop();
      setSlotDone([false, false]);
      return;
    }

    const runLoop = () => {
      toggleLoopRef.current = setTimeout(() => {
        setSlotDone([false, true]);
        toggleLoopRef.current = setTimeout(() => {
          setSlotDone([false, false]);
          toggleLoopRef.current = setTimeout(runLoop, 600);
        }, 1000);
      }, 700);
    };

    runLoop();
    return clearLoop;
  }, [currentStep.highlight]);

  // Loop: step 4 → auto press expand button → show 3 extras → collapse → repeat
  useEffect(() => {
    const clearLoop = () => { if (expandLoopRef.current) clearTimeout(expandLoopRef.current); };

    if (currentStep.highlight !== 'expand') {
      clearLoop();
      setShowExpand(false);
      setBtnPressing(false);
      return;
    }

    const runLoop = () => {
      expandLoopRef.current = setTimeout(() => {
        setBtnPressing(true);
        expandLoopRef.current = setTimeout(() => {
          setBtnPressing(false);
          setShowExpand(true);
          expandLoopRef.current = setTimeout(() => {
            setBtnPressing(true);
            expandLoopRef.current = setTimeout(() => {
              setBtnPressing(false);
              setShowExpand(false);
              expandLoopRef.current = setTimeout(runLoop, 800);
            }, 180);
          }, 1800);
        }, 180);
      }, 900);
    };

    runLoop();
    return clearLoop;
  }, [currentStep.highlight]);

  const isHighlighted = (target: string) =>
    pulseActive && currentStep.highlight === target;

  const highlightStyle = (target: string): React.CSSProperties => ({
    outline: isHighlighted(target) ? `2.5px solid ${PURPLE}` : '2.5px solid transparent',
    outlineOffset: 3,
    borderRadius: 12,
    transition: 'outline 300ms ease, transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
    transform: isHighlighted(target) ? 'scale(1.04)' : 'scale(1)',
  });

  const goNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleFinish();
  };

  const goPrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleFinish = () => {
    setEntered(false);
    setTimeout(() => { window.location.pathname = '/'; }, 400);
  };

  return (
    <div style={styles.root}>
      <div style={{ ...styles.blob, top: -80, right: -60, background: 'rgba(107,143,246,0.22)' }} />
      <div style={{ ...styles.blob, top: 200, left: -80, background: 'rgba(132,94,247,0.16)', width: 260, height: 260 }} />

      <div style={{
        ...styles.overlay,
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(20px)',
      }}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={handleFinish} style={styles.skipBtn}>O'tkazib yuborish</button>
          <div style={styles.dots}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                ...styles.dot,
                width: i === step ? 24 : 8,
                background: i === step ? PURPLE : 'rgba(132,94,247,0.25)',
              }} />
            ))}
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Demo card */}
        <div
          ref={containerRef}
          style={{
            ...styles.demoCard,
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(16px)',
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2745', letterSpacing: -0.2, margin: '0 0 12px 4px' }}>
            Dori-darmonlar
          </p>

          <div style={styles.outerCard}>
            {/* Main medicine row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 6px' }}>

              {/* Avatar */}
              <div ref={avatarRef} style={{
                ...styles.avatar,
                background: slotDone.every(Boolean) ? GREEN_LIGHT : PURPLE_LIGHT,
                ...highlightStyle('avatar'),
                position: 'relative',
              }}>
                <span style={{ fontSize: 28 }}>{DEMO_MEDICINE.emoji}</span>
                {slotDone.every(Boolean) && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `${GREEN}35`, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: GREEN, fontWeight: 700,
                    animation: 'popIn 300ms cubic-bezier(0.34,1.56,0.64,1)',
                  }}>✓</div>
                )}
              </div>

              {/* Name + dosage */}
              <div ref={nameRef} style={{ flex: 1, minWidth: 0, ...highlightStyle('name') }}>
                <p style={{
                  fontSize: 15, fontWeight: 700, color: '#2D2745',
                  letterSpacing: -0.2, margin: 0,
                  textDecoration: slotDone.every(Boolean) ? 'line-through' : 'none',
                  opacity: slotDone.every(Boolean) ? 0.45 : 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  transition: 'all 300ms ease',
                }}>
                  {DEMO_MEDICINE.name}
                </p>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#2D274570', margin: '3px 0 0' }}>
                  {DEMO_MEDICINE.slots.length}× {DEMO_MEDICINE.dosage} {DEMO_MEDICINE.unit}
                </p>
              </div>

              {/* Slots */}
              <div ref={slotsRef} style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                ...highlightStyle(
                  currentStep.highlight === 'slots' ? 'slots'
                  : currentStep.highlight === 'toggle' ? 'toggle'
                  : ''
                ),
                padding: 4,
              }}>
                {DEMO_MEDICINE.slots.map((slot, i) => {
                  const done = slotDone[i];
                  const color = done ? GREEN : PURPLE;
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center',
                      background: done ? `${GREEN}14` : `${PURPLE}12`,
                      border: `1px solid ${done ? `${GREEN}40` : `${PURPLE}35`}`,
                      borderRadius: 12,
                      transition: 'all 220ms ease',
                    }}>
                      <div style={{
                        padding: '7px 9px',
                        background: done ? `${GREEN}18` : `${PURPLE}18`,
                        borderRadius: '11px 0 0 11px',
                      }}>
                        <span style={{ fontSize: 13 }}>{slot.icon}</span>
                      </div>
                      <div style={{ width: 1, height: 28, background: done ? `${GREEN}35` : `${PURPLE}25` }} />
                      <div style={{ padding: '7px 9px' }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: done ? color : 'transparent',
                          border: `2px solid ${color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 220ms cubic-bezier(0.34,1.56,0.64,1)',
                          transform: done ? 'scale(1.1)' : 'scale(1)',
                        }}>
                          {done && (
                            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1, animation: 'popIn 220ms cubic-bezier(0.34,1.56,0.64,1)' }}>✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra medicines — animated reveal */}
            <div style={{
              overflow: 'hidden',
              maxHeight: showExpand ? `${EXTRA_MEDICINES.length * 80}px` : '0px',
              transition: 'max-height 400ms cubic-bezier(0.22,1,0.36,1)',
            }}>
              {EXTRA_MEDICINES.map((med, i) => (
                <React.Fragment key={med.name}>
                  <div style={{ height: 1, background: 'rgba(45,39,69,0.06)' }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 6px',
                    opacity: showExpand ? 1 : 0,
                    transform: showExpand ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 300ms ease ${80 + i * 60}ms, transform 300ms cubic-bezier(0.22,1,0.36,1) ${80 + i * 60}ms`,
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                      background: PURPLE_LIGHT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 28 }}>{med.emoji}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#2D2745', margin: 0, letterSpacing: -0.2 }}>
                        {med.name}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#2D274570', margin: '3px 0 0' }}>
                        1× {med.dosage} {med.unit}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: `${PURPLE}12`,
                      border: `1px solid ${PURPLE}35`,
                      borderRadius: 12,
                    }}>
                      <div style={{ padding: '7px 9px', background: `${PURPLE}18`, borderRadius: '11px 0 0 11px' }}>
                        <span style={{ fontSize: 13 }}>{med.icon}</span>
                      </div>
                      <div style={{ width: 1, height: 28, background: `${PURPLE}25` }} />
                      <div style={{ padding: '7px 9px' }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${PURPLE}`,
                        }} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(45,39,69,0.06)' }} />

            {/* Expand button */}
            <button
              ref={expandRef}
              style={{
                ...styles.showMoreBtn,
                ...highlightStyle('expand'),
                cursor: 'default',
                pointerEvents: 'none',
                transform: btnPressing
                  ? 'scale(0.95)'
                  : isHighlighted('expand') ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 150ms cubic-bezier(0.34,1.56,0.64,1), outline 300ms ease',
              }}
            >
              <span style={{ color: PURPLE, fontSize: 13, fontWeight: 600 }}>
                {showExpand ? "Kamroq ko'rish" : "+2 ta ko'proq"}
              </span>
              <span style={{
                display: 'inline-block',
                transform: showExpand ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease',
                color: PURPLE, marginLeft: 4,
              }}>▼</span>
            </button>
          </div>

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            left: arrowPos.x,
            top: arrowPos.y,
            transform: 'translateX(-50%)',
            fontSize: 16,
            color: PURPLE,
            opacity: arrowPos.visible && pulseActive ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 200ms ease, left 350ms cubic-bezier(0.34,1.56,0.64,1), top 350ms cubic-bezier(0.34,1.56,0.64,1)',
            animation: pulseActive && arrowPos.visible ? 'bounceArrow 1s ease-in-out infinite' : 'none',
            zIndex: 10,
          }}>▲</div>
        </div>

        {/* Info card */}
        <div style={{
          ...styles.infoCard,
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 400ms ease 100ms, transform 400ms cubic-bezier(0.22,1,0.36,1) 100ms',
        }}>
          <StepContent step={currentStep} stepIndex={step} total={STEPS.length} />
        </div>

        {/* Nav */}
        <div style={styles.navRow}>
          {step > 0 ? (
            <button onClick={goPrev} style={styles.prevBtn}>← Orqaga</button>
          ) : <div />}
          <button onClick={goNext} style={styles.nextBtn}>
            {step === STEPS.length - 1 ? 'Boshlash! 🚀' : 'Keyingisi →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

const StepContent: React.FC<{ step: Step; stepIndex: number; total: number }> = ({ step, stepIndex, total }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 180);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 280ms ease, transform 280ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={styles.stepBadge}>{stepIndex + 1}/{total}</div>
        <p style={styles.stepTitle}>{step.title}</p>
      </div>
      <p style={styles.stepDesc}>{step.description}</p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100dvh',
    background: 'linear-gradient(160deg, #E8EEF8 0%, #F0E8F5 40%, #EAF2EA 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
  blob: {
    position: 'fixed',
    width: 320,
    height: 320,
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  overlay: {
    width: '100%',
    maxWidth: 430,
    minHeight: '100dvh',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 32px',
    transition: 'opacity 350ms ease, transform 400ms cubic-bezier(0.22,1,0.36,1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '56px 20px 16px',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(45,39,69,0.4)',
    cursor: 'pointer',
    padding: '6px 0',
    width: 80,
    textAlign: 'left',
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 300ms cubic-bezier(0.34,1.56,0.64,1)',
  },
  demoCard: {
    margin: '16px 16px 0',
    position: 'relative',
    transition: 'opacity 400ms ease, transform 450ms cubic-bezier(0.22,1,0.36,1)',
  },
  outerCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.16))',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.55)',
    padding: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    flexShrink: 0,
  },
  showMoreBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  infoCard: {
    margin: '48px 16px 0',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.7)',
    padding: '20px 20px 24px',
    boxShadow: '0 8px 32px rgba(132,94,247,0.10)',
  },
  stepBadge: {
    background: 'rgba(132,94,247,0.12)',
    color: PURPLE,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 20,
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#2D2745',
    margin: 0,
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 1.65,
    color: 'rgba(45,39,69,0.72)',
    margin: 0,
    fontWeight: 400,
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 0',
    marginTop: 'auto',
  },
  prevBtn: {
    background: 'rgba(132,94,247,0.10)',
    border: 'none',
    borderRadius: 16,
    padding: '14px 20px',
    fontSize: 14,
    fontWeight: 600,
    color: PURPLE,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  nextBtn: {
    background: `linear-gradient(135deg, ${PURPLE}, #6B3FE4)`,
    border: 'none',
    borderRadius: 16,
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(132,94,247,0.35)',
    transition: 'all 200ms ease',
    letterSpacing: -0.2,
  },
};
