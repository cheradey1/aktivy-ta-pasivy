import { FinanceItem, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  currency: '₴',
  familyMembers: 1,
  hasJob: true,
  theme: 'light',
};

export const INITIAL_ITEMS: FinanceItem[] = [
  { id: '1', name: 'Зарплата', amount: 20000, frequency: 'month', type: 'asset', icon: 'Wallet' },
  { id: '2', name: 'Продукти', amount: 300, frequency: 'day', type: 'liability', icon: 'ShoppingBasket', isPerPerson: true },
  { id: '3', name: 'Оренда', amount: 10000, frequency: 'month', type: 'liability', icon: 'Home' },
];

export const ICONS_LIST = [
  'Wallet', 'Briefcase', 'TrendingUp', 'DollarSign', 'Home', // Assets related
  'ShoppingBasket', 'Car', 'Zap', 'Smartphone', 'Coffee', 'Heart', 'BookOpen', 'Music' // Liabilities related
];

export const CATEGORY_SUGGESTIONS = {
  asset: ['Зарплата', 'Підробіток', 'Бізнес', 'Інвестиції', 'Оренда (дохід)', 'Соц. виплати'],
  liability: ['Продукти', 'Транспорт', 'Комуналка', 'Оренда (витрата)', 'Ліки', 'Розваги', 'Освіта', 'Підписки']
};