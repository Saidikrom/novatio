// 4 haftalik oylik hisobot ma'lumotlari
export interface WeekSummary {
  week: number;
  label: string;
  dateRange: string;
  // Dorilar
  medicineAdherence: number;
  medicinesTaken: number;
  medicinesRequired: number;
  // Oziq-ovqat
  avgCalories: number;
  calorieGoal: number;
  fattyMealDays: number;
  totalCalories: number;
  // Umumiy
  weekScore: number;
  totalSteps: number;
  avgWater: number;
  totalActivityMinutes: number;
  // Vazn
  weightKg: number; // hafta boshidagi vazn
}

export const monthlyReportData = {
  userName: 'Saidikrom',
  monthLabel: 'Iyun 2025',
  dateRange: '2 Iyun — 29 Iyun 2025',
  goal: 'lose' as const,

  // Boshlang'ich va yakuniy vazn
  startWeightKg: 92.4,
  endWeightKg: 90.1,

  weeks: [
    {
      week: 1,
      label: '1-hafta',
      dateRange: '2–8 Iyun',
      medicineAdherence: 71,
      medicinesTaken: 40,
      medicinesRequired: 56,
      avgCalories: 2257,
      calorieGoal: 1800,
      fattyMealDays: 3,
      totalCalories: 15800,
      weekScore: 72,
      totalSteps: 51200,
      avgWater: 2.0,
      totalActivityMinutes: 285,
      weightKg: 92.4,
    },
    {
      week: 2,
      label: '2-hafta',
      dateRange: '9–15 Iyun',
      medicineAdherence: 79,
      medicinesTaken: 44,
      medicinesRequired: 56,
      avgCalories: 2457,
      calorieGoal: 1800,
      fattyMealDays: 3,
      totalCalories: 17200,
      weekScore: 68,
      totalSteps: 57500,
      avgWater: 2.17,
      totalActivityMinutes: 315,
      weightKg: 91.8,
    },
    {
      week: 3,
      label: '3-hafta',
      dateRange: '16–22 Iyun',
      medicineAdherence: 86,
      medicinesTaken: 48,
      medicinesRequired: 56,
      avgCalories: 2100,
      calorieGoal: 1800,
      fattyMealDays: 2,
      totalCalories: 14700,
      weekScore: 76,
      totalSteps: 63800,
      avgWater: 2.35,
      totalActivityMinutes: 340,
      weightKg: 91.2,
    },
    {
      week: 4,
      label: '4-hafta',
      dateRange: '23–29 Iyun',
      medicineAdherence: 93,
      medicinesTaken: 52,
      medicinesRequired: 56,
      avgCalories: 1950,
      calorieGoal: 1800,
      fattyMealDays: 1,
      totalCalories: 13650,
      weekScore: 84,
      totalSteps: 71200,
      avgWater: 2.5,
      totalActivityMinutes: 390,
      weightKg: 90.1,
    },
  ] as WeekSummary[],

  // Oylik umumiy
  totalMonthScore: 75,
  bestWeek: 4,
  mostImprovedMetric: 'Dorilar',
  totalSteps: 243700,
  totalActivityMinutes: 1330,
  avgMonthlyCalories: 2191,
  avgMonthlyWater: 2.25,
  avgMedicineAdherence: 82,

  // Vazn hisob-kitobi
  // Kaloriya defitsiti: (2191 - 1800) * 28 = 10948 kkal
  // Umumiy iste'mol: 61350 kkal | Maqsad edi: 50400 kkal
  // 7700 kkal = 1 kg yog'
  calorieDeficit: -10948,       // manfiy = deficit (oz)
  weightLostKg: 2.3,            // startWeight - endWeight
  fatBurnedKg: 1.4,             // kaloriya defitsitidan hisoblangan
  // Agar maqsadga to'liq rioya qilinganida
  potentialWeightLossKg: 3.8,   // 29 000 deficit / 7700

  // Motivatsiya
  personalMessage: 'Har hafta yaxshilanib bordingiz! 4-hafta eng yaxshi natija — dori tartibingiz 93% ga yetdi.',
  nextMonthGoal: 'Har kuni 1800 kkal chegarasida turing va suv me\'yorini to\'liq bajaring',

  // Doktor maslahati
  doctorAdvice: {
    doctorName: 'Dr. Azimova Nodira',
    specialty: 'Dietolog va sog\'liqni saqlash mutaxassisi',
    avatarInitials: 'AN',
    tips: [
      {
        icon: '🥗',
        title: 'Oqsil ko\'proq',
        text: 'Har ovqatda kamida 25–30g oqsil qo\'shing — tuxum, tovuq, baliq. To\'yinganlikni uzaytiradi.',
      },
      {
        icon: '💧',
        title: 'Suv — avval',
        text: 'Har ovqat oldidan 1 stakan suv iching. Bu 200–300 kkal kam iste\'mol qilishingizga yordam beradi.',
      },
      {
        icon: '🌙',
        title: 'Kechqurun chegaralang',
        text: 'Kechki soat 20:00 dan keyin ovqat iste\'mol qilmang. Bu yog\' to\'planishini sezilarli kamaytiradi.',
      },
    ],
    closingNote: 'Siz to\'g\'ri yo\'lda ketayapsiz. Bu maslahatlarni qo\'shsangiz, keyingi oyda natija yanada yaxshilanadi.',
  },
};
