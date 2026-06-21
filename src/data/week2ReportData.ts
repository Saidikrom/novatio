// Week 1 summary (reference for comparison)
export interface WeekComparison {
  totalCalories: number;
  avgCalories: number;
  totalMedicinesTaken: number;
  totalMedicinesRequired: number;
  medicineAdherence: number; // percent
  avgWater: number;
  totalSteps: number;
  weekScore: number;
  totalActivityMinutes: number;
  fattyMealDays: number; // days with high-fat meals
  fattyCaloriesExtra: number; // extra calories from fatty meals vs target
}

export const week1Summary: WeekComparison = {
  totalCalories: 15800,
  avgCalories: 2257,
  totalMedicinesTaken: 40,
  totalMedicinesRequired: 56,
  medicineAdherence: 71, // 40/56 * 100
  avgWater: 2.0,
  totalSteps: 51200,
  weekScore: 72,
  totalActivityMinutes: 285,
  fattyMealDays: 3, // Mon, Thu, Sat were high-fat days
  fattyCaloriesExtra: 2600, // total extra kkal from fatty meals
};

export interface DayReport2 {
  day: string;
  dayShort: string;
  date: string;
  calories: number;
  calorieGoal: number;
  fattyMeal?: string; // name of the fatty meal if any
  fattyMealCalories?: number; // extra calories this fatty meal added
  medicinesTaken: number;
  medicinesTotal: number;
  medicineNames?: string[]; // names of missed medicines
  activitiesCompleted: number;
  activitiesTotal: number;
  waterLiters: number;
  waterGoal: number;
  mood: 'excellent' | 'good' | 'okay' | 'bad';
  topMeal: string;
  topMealEmoji: string;
  steps: number;
}

export interface Week2ReportData {
  userName: string;
  weekLabel: string;
  dateRange: string;
  goal: 'lose' | 'gain';
  days: DayReport2[];
  // Totals
  totalCalories: number;
  avgCalories: number;
  totalMedicinesTaken: number;
  totalMedicinesRequired: number;
  medicineAdherence: number;
  medicineStreak: number;
  bestMedicineDay: string;
  worstMedicineDay: string;
  totalActivities: number;
  totalActivityMinutes: number;
  bestActivityDay: string;
  avgWater: number;
  totalSteps: number;
  weekScore: number;
  // Comparison fields
  week1: WeekComparison;
  calorieChange: number; // positive = worse for lose goal
  calorieChangePct: number;
  medicineChange: number; // positive = improved
  medicineChangePct: number;
  stepChange: number;
  waterChange: number;
  scoreChange: number;
  // Narrative
  personalMessage: string;
  achievement: string;
  achievementEmoji: string;
  nextWeekGoal: string;
  // Fat comparison detail
  fattyMealDays: number;
  fattyCaloriesExtra: number;
  fattyMealExamples: { day: string; meal: string; extraKkal: number }[];
  // Medicine detail
  missedMedicineDetails: { day: string; missed: number; names: string[] }[];
}

export const week2ReportData: Week2ReportData = {
  userName: 'Saidikrom',
  weekLabel: '3-hafta',
  dateRange: '16 — 22 Iyun 2025',
  goal: 'lose',

  days: [
    {
      day: 'Dushanba',
      dayShort: 'Du',
      date: '16 Iyun',
      calories: 2150,
      calorieGoal: 1800,
      medicinesTaken: 6,
      medicinesTotal: 8,
      medicineNames: ['Omega-3', 'D vitamini'],
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 2.1,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Tovuq sho\'rva',
      topMealEmoji: '🍲',
      steps: 8200,
    },
    {
      day: 'Seshanba',
      dayShort: 'Se',
      date: '17 Iyun',
      calories: 2800,
      calorieGoal: 1800,
      fattyMeal: 'Qovurilgan go\'sht + kartoshka fri',
      fattyMealCalories: 680,
      medicinesTaken: 8,
      medicinesTotal: 8,
      activitiesCompleted: 3,
      activitiesTotal: 3,
      waterLiters: 1.9,
      waterGoal: 2.5,
      mood: 'okay',
      topMeal: 'Qovurilgan go\'sht',
      topMealEmoji: '🥩',
      steps: 9100,
    },
    {
      day: 'Chorshanba',
      dayShort: 'Ch',
      date: '18 Iyun',
      calories: 1700,
      calorieGoal: 1800,
      medicinesTaken: 7,
      medicinesTotal: 8,
      medicineNames: ['Magniy'],
      activitiesCompleted: 3,
      activitiesTotal: 3,
      waterLiters: 2.6,
      waterGoal: 2.5,
      mood: 'excellent',
      topMeal: 'Sabzavotli salat',
      topMealEmoji: '🥗',
      steps: 11400,
    },
    {
      day: 'Payshanba',
      dayShort: 'Pa',
      date: '19 Iyun',
      calories: 3200,
      calorieGoal: 1800,
      fattyMeal: 'Plov (go\'shtli, yog\'li)',
      fattyMealCalories: 920,
      medicinesTaken: 8,
      medicinesTotal: 8,
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 2.4,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Plov',
      topMealEmoji: '🍚',
      steps: 7800,
    },
    {
      day: 'Juma',
      dayShort: 'Ju',
      date: '20 Iyun',
      calories: 1850,
      calorieGoal: 1800,
      medicinesTaken: 5,
      medicinesTotal: 8,
      medicineNames: ['Omega-3', 'D vitamini', 'B12'],
      activitiesCompleted: 3,
      activitiesTotal: 3,
      waterLiters: 2.3,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Baliq va sabzavot',
      topMealEmoji: '🐟',
      steps: 9600,
    },
    {
      day: 'Shanba',
      dayShort: 'Sh',
      date: '21 Iyun',
      calories: 3500,
      calorieGoal: 1800,
      fattyMeal: 'Samsa + non + smetana',
      fattyMealCalories: 1100,
      medicinesTaken: 3,
      medicinesTotal: 8,
      medicineNames: ['Omega-3', 'D vitamini', 'B12', 'Magniy', 'Tsink'],
      activitiesCompleted: 1,
      activitiesTotal: 3,
      waterLiters: 1.4,
      waterGoal: 2.5,
      mood: 'bad',
      topMeal: 'Samsa',
      topMealEmoji: '🥟',
      steps: 2900,
    },
    {
      day: 'Yakshanba',
      dayShort: 'Ya',
      date: '22 Iyun',
      calories: 2000,
      calorieGoal: 1800,
      medicinesTaken: 7,
      medicinesTotal: 8,
      medicineNames: ['Tsink'],
      activitiesCompleted: 2,
      activitiesTotal: 3,
      waterLiters: 2.5,
      waterGoal: 2.5,
      mood: 'good',
      topMeal: 'Tuxum va non',
      topMealEmoji: '🍳',
      steps: 8500,
    },
  ],

  // Totals
  totalCalories: 17200,       // 2150+2800+1700+3200+1850+3500+2000
  avgCalories: 2457,          // 17200/7
  totalMedicinesTaken: 44,    // 6+8+7+8+5+3+7
  totalMedicinesRequired: 56,
  medicineAdherence: 79,      // 44/56*100
  medicineStreak: 3,
  bestMedicineDay: 'Seshanba',
  worstMedicineDay: 'Shanba',
  totalActivities: 16,
  totalActivityMinutes: 315,
  bestActivityDay: 'Chorshanba',
  avgWater: 2.17,             // sum/7
  totalSteps: 57500,
  weekScore: 68,

  // Comparison vs Week 1
  week1: week1Summary,
  calorieChange: +1400,       // 17200 - 15800 (worse — more calories)
  calorieChangePct: +9,       // ~+9%
  medicineChange: +4,         // 44 - 40 (better — more taken)
  medicineChangePct: +8,      // 79% - 71% = +8 points
  stepChange: +6300,          // 57500 - 51200
  waterChange: +0.17,
  scoreChange: -4,            // 68 - 72

  // Narrative
  personalMessage: 'Bu hafta dorilaringizni yaxshiroq ichib, qadamlarni ko\'paytirdingiz — bu katta o\'sish! Lekin shanba kuni ovqat nazoratdan chiqib ketdi. Keyingi hafta shanbani rejalashtiring.',
  achievement: 'Chorshanba kuni barcha mashqlarni bajardingiz va 11,400 qadam qo\'ydingiz!',
  achievementEmoji: '🏃',
  nextWeekGoal: 'Shanba kunlari ham 1800 kkal chegarasida tur',

  // Fat comparison detail
  fattyMealDays: 3,           // Tue, Thu, Sat
  fattyCaloriesExtra: 2700,   // 680+920+1100
  fattyMealExamples: [
    { day: 'Seshanba', meal: 'Qovurilgan go\'sht + kartoshka fri', extraKkal: 680 },
    { day: 'Payshanba', meal: 'Plov (go\'shtli, yog\'li)', extraKkal: 920 },
    { day: 'Shanba', meal: 'Samsa + non + smetana', extraKkal: 1100 },
  ],

  // Medicine miss detail
  missedMedicineDetails: [
    { day: 'Dushanba', missed: 2, names: ['Omega-3', 'D vitamini'] },
    { day: 'Chorshanba', missed: 1, names: ['Magniy'] },
    { day: 'Juma', missed: 3, names: ['Omega-3', 'D vitamini', 'B12'] },
    { day: 'Shanba', missed: 5, names: ['Omega-3', 'D vitamini', 'B12', 'Magniy', 'Tsink'] },
    { day: 'Yakshanba', missed: 1, names: ['Tsink'] },
  ],
};
