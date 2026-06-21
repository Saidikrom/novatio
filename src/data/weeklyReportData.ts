export interface DayReport {
  day: string;
  dayShort: string;
  date: string;
  calories: number;
  calorieGoal: number;
  medicinesTaken: number;
  medicinesTotal: number;
  activitiesCompleted: number;
  activitiesTotal: number;
  waterLiters: number;
  waterGoal: number;
  mood: 'excellent' | 'good' | 'okay' | 'bad';
  topMeal: string;
  topMealEmoji: string;
  steps: number;
}

export interface WeeklyReportData {
  userName: string;
  weekLabel: string;
  dateRange: string;
  goal: 'lose' | 'gain';
  days: DayReport[];
  totalCalories: number;
  avgCalories: number;
  totalMedicinesTaken: number;
  totalMedicinesRequired: number;
  medicineStreak: number;
  bestMedicineDay: string;
  totalActivities: number;
  totalActivityMinutes: number;
  bestActivityDay: string;
  avgWater: number;
  totalSteps: number;
  weekScore: number;
  weekMood: string;
  personalMessage: string;
  achievement: string;
  achievementEmoji: string;
  nextWeekGoal: string;
}

export const weeklyReportData: WeeklyReportData = {
  userName: 'Saidikrom',
  weekLabel: '2-hafta',
  dateRange: '9 — 15 Iyun 2025',
  goal: 'lose',
  days: [
    {
      day: 'Dushanba',
      dayShort: 'Du',
      date: '9 Iyun',
      calories: 2400,
      calorieGoal: 1800,
      medicinesTaken: 5,
      medicinesTotal: 8,
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 1.8,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Tovuq sho\'rva',
      topMealEmoji: '🍲',
      steps: 7400,
    },
    {
      day: 'Seshanba',
      dayShort: 'Se',
      date: '10 Iyun',
      calories: 1650,
      calorieGoal: 1800,
      medicinesTaken: 7,
      medicinesTotal: 8,
      activitiesCompleted: 3,
      activitiesTotal: 3,
      waterLiters: 2.4,
      waterGoal: 2.5,
      mood: 'excellent',
      topMeal: 'Sabzavotli salat',
      topMealEmoji: '🥗',
      steps: 10200,
    },
    {
      day: 'Chorshanba',
      dayShort: 'Ch',
      date: '11 Iyun',
      calories: 2250,
      calorieGoal: 1800,
      medicinesTaken: 4,
      medicinesTotal: 8,
      activitiesCompleted: 1,
      activitiesTotal: 3,
      waterLiters: 1.2,
      waterGoal: 2.5,
      mood: 'okay',
      topMeal: 'Tuxum va non',
      topMealEmoji: '🍳',
      steps: 4800,
    },
    {
      day: 'Payshanba',
      dayShort: 'Pa',
      date: '12 Iyun',
      calories: 2600,
      calorieGoal: 1800,
      medicinesTaken: 8,
      medicinesTotal: 8,
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 2.6,
      waterGoal: 2.5,
      mood: 'excellent',
      topMeal: 'Qo\'zi go\'shti bilan guruch',
      topMealEmoji: '🍚',
      steps: 9100,
    },
    {
      day: 'Juma',
      dayShort: 'Ju',
      date: '13 Iyun',
      calories: 1750,
      calorieGoal: 1800,
      medicinesTaken: 6,
      medicinesTotal: 8,
      activitiesCompleted: 3,
      activitiesTotal: 3,
      waterLiters: 2.2,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Baliq va sabzavot',
      topMealEmoji: '🐟',
      steps: 8600,
    },
    {
      day: 'Shanba',
      dayShort: 'Sh',
      date: '14 Iyun',
      calories: 3100,
      calorieGoal: 1800,
      medicinesTaken: 3,
      medicinesTotal: 8,
      activitiesCompleted: 1,
      activitiesTotal: 3,
      waterLiters: 1.5,
      waterGoal: 2.5,
      mood: 'bad',
      topMeal: 'Yovsiz sut bilan jo\'xori',
      topMealEmoji: '🥣',
      steps: 3200,
    },
    {
      day: 'Yakshanba',
      dayShort: 'Ya',
      date: '15 Iyun',
      calories: 2050,
      calorieGoal: 1800,
      medicinesTaken: 7,
      medicinesTotal: 8,
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 2.3,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Tovuq sho\'rva',
      topMealEmoji: '🍲',
      steps: 7900,
    },
  ],
  totalCalories: 15800,
  avgCalories: 2257,
  totalMedicinesTaken: 40,
  totalMedicinesRequired: 56,
  medicineStreak: 2,
  bestMedicineDay: 'Payshanba',
  totalActivities: 14,
  totalActivityMinutes: 285,
  bestActivityDay: 'Seshanba',
  avgWater: 2.0,
  totalSteps: 51200,
  weekScore: 72,
  weekMood: 'Yaxshi',
  personalMessage: 'Bu hafta sen o\'zing uchun kurashding. Ba\'zi kunlar og\'ir bo\'ldi, lekin to\'xtamading. Aynan shu iroda seni sog\'lom qiladi.',
  achievement: 'Payshanba kuni barcha dorilarni to\'liq ichdingiz!',
  achievementEmoji: '🏆',
  nextWeekGoal: 'Har kuni kamida 2L suv ich',
};
