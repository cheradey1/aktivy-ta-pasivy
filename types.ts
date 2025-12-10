export type Currency = '₴' | '$' | '€';
export type Frequency = 'day' | 'week' | 'month';
export type ItemType = 'asset' | 'liability';

export interface FinanceItem {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  type: ItemType;
  icon?: string;
  isPerPerson?: boolean; // If true, multiplies by family members count
}

export interface Settings {
  currency: Currency;
  familyMembers: number;
  hasJob: boolean;
  theme: 'light' | 'dark';
}

export const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  day: 30,
  week: 4,
  month: 1,
};