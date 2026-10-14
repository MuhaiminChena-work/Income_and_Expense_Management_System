import { CategoryItem } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'cat-food', name: 'อาหารและเครื่องดื่ม', type: 'expense', icon: 'Utensils', color: '#EF4444', bgLight: '#FEE2E2' },
  { id: 'cat-transport', name: 'การเดินทาง / ยานพาหนะ', type: 'expense', icon: 'Car', color: '#F97316', bgLight: '#FFEDD5' },
  { id: 'cat-shopping', name: 'ช้อปปิ้ง / ของใช้', type: 'expense', icon: 'ShoppingBag', color: '#EC4899', bgLight: '#FCE7F3' },
  { id: 'cat-bills', name: 'บิล / น้ำ-ไฟ-เน็ต', type: 'expense', icon: 'Receipt', color: '#EAB308', bgLight: '#FEF9C3' },
  { id: 'cat-home', name: 'ที่อยู่อาศัย / เช่าห้อง', type: 'expense', icon: 'Home', color: '#8B5CF6', bgLight: '#EDE9FE' },
  { id: 'cat-entertainment', name: 'ความบันเทิง / ท่องเที่ยว', type: 'expense', icon: 'Film', color: '#06B6D4', bgLight: '#CFFAFE' },
  { id: 'cat-health', name: 'สุขภาพ / ยา / ประกัน', type: 'expense', icon: 'HeartPulse', color: '#10B981', bgLight: '#D1FAE5' },
  { id: 'cat-education', name: 'การศึกษา / หนังสือ', type: 'expense', icon: 'GraduationCap', color: '#3B82F6', bgLight: '#DBEAFE' },
  { id: 'cat-other-expense', name: 'ค่าใช้จ่ายอื่นๆ', type: 'expense', icon: 'MoreHorizontal', color: '#64748B', bgLight: '#F1F5F9' },
];

export const DEFAULT_INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'cat-salary', name: 'เงินเดือน / ค่าจ้าง', type: 'income', icon: 'Banknote', color: '#10B981', bgLight: '#D1FAE5' },
  { id: 'cat-business', name: 'ธุรกิจส่วนตัว / ค้าขาย', type: 'income', icon: 'Store', color: '#059669', bgLight: '#A7F3D0' },
  { id: 'cat-freelance', name: 'ฟรีแลนซ์ / รายได้เสริม', type: 'income', icon: 'Laptop', color: '#3B82F6', bgLight: '#DBEAFE' },
  { id: 'cat-bonus', name: 'โบนัส / ค่าคอมมิชชัน', type: 'income', icon: 'Award', color: '#8B5CF6', bgLight: '#EDE9FE' },
  { id: 'cat-investment', name: 'การลงทุน / ดอกเบี้ย / ปันผล', type: 'income', icon: 'TrendingUp', color: '#F59E0B', bgLight: '#FEF3C7' },
  { id: 'cat-other-income', name: 'รายรับอื่นๆ / ของขวัญ', type: 'income', icon: 'Gift', color: '#6366F1', bgLight: '#E0E7FF' },
];

export const ALL_DEFAULT_CATEGORIES = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

export function getCategoryMeta(name: string, type: 'income' | 'expense'): CategoryItem {
  const match = ALL_DEFAULT_CATEGORIES.find(c => c.name === name);
  if (match) return match;
  return {
    id: 'custom',
    name,
    type,
    icon: type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight',
    color: type === 'income' ? '#10B981' : '#EF4444',
    bgLight: type === 'income' ? '#D1FAE5' : '#FEE2E2',
  };
}
