export interface HerbItem {
  activityId: number;
  name: string;
  emoji: string;
  image: string;
  when: 'morning' | 'afternoon' | 'evening';
  quantity: number;
  quantityType: string;
  isCompleted: boolean;
}

export interface FoodItem {
  key: string;
  name: string;
  emoji: string;
  kkal: number;
  image: string;
  isCompleted: boolean;
}

export interface ActivityItem {
  activityId: number;
  name: string;
  emoji: string;
  image: string;
  requiredDuration: number;
  quantityType: string;
  isCompleted: boolean;
  when: 'morning' | 'afternoon' | 'evening';
}

export interface MedicineSlot {
  label: string;
  isCompleted: boolean;
}

export interface MedicineItem {
  id: number;
  name: string;
  emoji: string;
  imageUrl: string;
  dosage: number;
  unit: string;
  slots: MedicineSlot[];
}

export interface TimeBlocks<T> {
  morning: T[];
  afternoon: T[];
  evening: T[];
}
