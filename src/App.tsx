import React, { useState } from 'react';
import { HomeHeader } from './components/HomeHeader';
import { StatsCard } from './components/StatsCard';
import { WeeklyProgress } from './components/WeeklyProgress';
import { MedicinesSection } from './components/MedicinesSection';
import { MealsSection } from './components/MealsSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { HerbsSection } from './components/HerbsSection';
import { WeeklyReport } from './components/WeeklyReport';
import { WeeklyReport2 } from './components/WeeklyReport2';
import { MonthlyReport } from './components/MonthlyReport';
import { MedicinesOnboarding } from './components/MedicinesOnboarding';
import { mockHerbs, mockFoods, mockActivities, mockMedicines } from './data/mockData';
import { HerbItem, FoodItem, ActivityItem, MedicineItem, TimeBlocks } from './types';

export default function App() {
  const isReportRoute = window.location.pathname === '/report';
  const [herbs, setHerbs] = useState<HerbItem[]>(mockHerbs);
  const [foods, setFoods] = useState<TimeBlocks<FoodItem>>(mockFoods);
  const [activities, setActivities] = useState<TimeBlocks<ActivityItem>>(mockActivities);
  const [medicines, setMedicines] = useState<MedicineItem[]>(mockMedicines);

  const handleHerbDone = (activityId: number) => {
    setHerbs(prev => prev.map(h => h.activityId === activityId ? { ...h, isCompleted: true } : h));
  };

  const handleFoodDone = (key: string) => {
    const markInBlock = (items: FoodItem[]) =>
      items.map(f => f.key === key ? { ...f, isCompleted: true } : f);
    setFoods(prev => ({
      morning: markInBlock(prev.morning),
      afternoon: markInBlock(prev.afternoon),
      evening: markInBlock(prev.evening),
    }));
  };

  const handleActivityDone = (activityId: number) => {
    const markInBlock = (items: ActivityItem[]) =>
      items.map(a => a.activityId === activityId ? { ...a, isCompleted: true } : a);
    setActivities(prev => ({
      morning: markInBlock(prev.morning),
      afternoon: markInBlock(prev.afternoon),
      evening: markInBlock(prev.evening),
    }));
  };

  const handleMedicineToggle = (id: number, slotIndex: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id !== id) return m;
      const newSlots = m.slots.map((s, i) =>
        i === slotIndex ? { ...s, isCompleted: !s.isCompleted } : s
      );
      return { ...m, slots: newSlots };
    }));
  };

  if (window.location.pathname === '/onboarding') {
    return <MedicinesOnboarding />;
  }

  if (isReportRoute) {
    return <WeeklyReport />;
  }

  if (window.location.pathname === '/report2') {
    return <WeeklyReport2 />;
  }

  if (window.location.pathname === '/monthly' || window.location.pathname === '/report3') {
    return <MonthlyReport />;
  }

  return (
    <div style={styles.root}>
      {/* Background blobs */}
      <div style={{ ...styles.blob, top: -80, right: -60, background: 'rgba(107,143,246,0.25)' }} />
      <div style={{ ...styles.blob, top: 200, left: -80, background: 'rgba(123,196,127,0.20)', width: 280, height: 280 }} />
      <div style={{ ...styles.blob, bottom: 300, right: -40, background: 'rgba(181,158,142,0.18)', width: 220, height: 220 }} />

      {/* Scrollable content */}
      <div style={styles.scrollArea}>
        <div style={styles.phoneFrame}>
          <HomeHeader userName="Saidikrom" />

          <div style={styles.section}>
            <StatsCard />
          </div>

          <div style={styles.section}>
            <WeeklyProgress />
          </div>

          <div style={styles.section}>
            <MedicinesSection medicines={medicines} onToggleSlot={handleMedicineToggle} />
          </div>

          <div style={styles.section}>
            <MealsSection foods={foods} onMarkDone={handleFoodDone} />
          </div>

          <div style={styles.section}>
            <ActivitiesSection activities={activities} onMarkDone={handleActivityDone} />
          </div>

          <div style={styles.section}>
            <HerbsSection herbs={herbs} onMarkDone={handleHerbDone} />
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
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
  scrollArea: {
    width: '100%',
    maxWidth: 430,
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  phoneFrame: {
    width: '100%',
    paddingTop: 8,
  },
  section: {
    marginBottom: 16,
  },
};
