export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  monthlyBudget?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  bgLight: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  categoryExpenses: Record<string, number>;
  dailyExpenses: Record<string, number>;
  dailyIncome: Record<string, number>;
}
