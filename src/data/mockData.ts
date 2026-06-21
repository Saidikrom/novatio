import { HerbItem, FoodItem, ActivityItem, MedicineItem, TimeBlocks } from '../types';

export const mockHerbs: HerbItem[] = [
  {
    activityId: 1,
    name: 'Ashwagandha',
    emoji: '🌿',
    image: '',
    when: 'morning',
    quantity: 1,
    quantityType: 'kapsul',
    isCompleted: false,
  },
  {
    activityId: 2,
    name: "Limon balzami",
    emoji: '🍵',
    image: '',
    when: 'afternoon',
    quantity: 1,
    quantityType: 'piyola',
    isCompleted: true,
  },
  {
    activityId: 3,
    name: 'Valerian',
    emoji: '💊',
    image: '',
    when: 'evening',
    quantity: 2,
    quantityType: 'kapsul',
    isCompleted: false,
  },
];

export const mockFoods: TimeBlocks<FoodItem> = {
  morning: [
    { key: 'f1', name: 'Tuxum va non', emoji: '🍳', kkal: 320, image: '', isCompleted: false },
    { key: 'f2', name: 'Yovsiz sut bilan jo\'xori', emoji: '🥣', kkal: 280, image: '', isCompleted: false },
  ],
  afternoon: [
    { key: 'f3', name: 'Tovuq sho\'rva', emoji: '🍲', kkal: 450, image: '', isCompleted: false },
    { key: 'f4', name: 'Sabzavotli salat', emoji: '🥗', kkal: 180, image: '', isCompleted: true },
  ],
  evening: [
    { key: 'f5', name: "Qo'zi go'shti bilan guruch", emoji: '🍚', kkal: 520, image: '', isCompleted: false },
  ],
};

export const mockActivities: TimeBlocks<ActivityItem> = {
  morning: [
    { activityId: 10, name: 'Ertalabki yugurish', emoji: '🏃', image: '', requiredDuration: 1800, quantityType: 'daqiqa', isCompleted: false, when: 'morning' },
    { activityId: 11, name: 'Yoga', emoji: '🧘', image: '', requiredDuration: 900, quantityType: 'daqiqa', isCompleted: true, when: 'morning' },
  ],
  afternoon: [
    { activityId: 12, name: 'Suzish', emoji: '🏊', image: '', requiredDuration: 2700, quantityType: 'daqiqa', isCompleted: false, when: 'afternoon' },
  ],
  evening: [
    { activityId: 13, name: 'Sayr qilish', emoji: '🚶', image: '', requiredDuration: 1200, quantityType: 'daqiqa', isCompleted: false, when: 'evening' },
    { activityId: 14, name: "Ko'tarish mashqlari", emoji: '💪', image: '', requiredDuration: 2400, quantityType: 'daqiqa', isCompleted: false, when: 'evening' },
  ],
};

export const mockMedicines: MedicineItem[] = [
  {
    id: 1,
    name: 'Magniy B6',
    emoji: '💊',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [
      { label: 'Ertalab', isCompleted: false },
      { label: 'Kechqurun', isCompleted: false },
    ],
  },
  {
    id: 2,
    name: 'D3 Vitamini',
    emoji: '🌞',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [{ label: 'Ertalab', isCompleted: false }],
  },
  {
    id: 3,
    name: 'Omega-3',
    emoji: '🐟',
    imageUrl: '',
    dosage: 2,
    unit: 'dona',
    slots: [{ label: 'Tushlik', isCompleted: true }],
  },
  {
    id: 4,
    name: 'Sink (Zinc)',
    emoji: '⚡',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [{ label: 'Kechki ovqat', isCompleted: false }],
  },
  {
    id: 5,
    name: 'Vitamin C',
    emoji: '🍊',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [
      { label: 'Ertalab', isCompleted: true },
      { label: 'Tushlik', isCompleted: false },
    ],
  },
  {
    id: 6,
    name: 'Ashwagandha',
    emoji: '🌿',
    imageUrl: '',
    dosage: 1,
    unit: 'kapsul',
    slots: [{ label: 'Kechqurun', isCompleted: false }],
  },
  {
    id: 7,
    name: 'B12 Vitamini',
    emoji: '🔴',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [{ label: 'Nonushta', isCompleted: true }],
  },
  {
    id: 8,
    name: 'Temir (Iron)',
    emoji: '🫀',
    imageUrl: '',
    dosage: 1,
    unit: 'dona',
    slots: [
      { label: 'Ertalab', isCompleted: false },
      { label: 'Tushlik', isCompleted: false },
      { label: 'Kechqurun', isCompleted: false },
    ],
  },
];
