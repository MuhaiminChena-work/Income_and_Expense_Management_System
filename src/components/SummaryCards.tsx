import React from 'react';
import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  Edit2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SummaryCardsProps {
  stats: MonthlyStats;
  monthlyBudget: number;
  onOpenBudgetModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  stats,
  monthlyBudget,
  onOpenBudgetModal,
}) => {
  const { totalIncome, totalExpense, balance, savingsRate } = stats;

  const budgetProgress = monthlyBudget > 0 ? (totalExpense / monthlyBudget) * 100 : 0;
  const isOverBudget = monthlyBudget > 0 && totalExpense > monthlyBudget;
  const budgetRemaining = monthlyBudget > 0 ? monthlyBudget - totalExpense : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {/* 1. Total Income */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            รายรับรวม
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
          +{formatCurrency(totalIncome)}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>ยอดรับเข้าในเดือนนี้</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full blur-xl pointer-events-none opacity-60"></div>
      </div>

      {/* 2. Total Expense */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            รายจ่ายรวม
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
          -{formatCurrency(totalExpense)}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>ยอดจ่ายออกทั้งหมด</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-50 rounded-full blur-xl pointer-events-none opacity-60"></div>
      </div>

      {/* 3. Net Balance */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            คงเหลือสุทธิ
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              balance >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            balance >= 0 ? 'text-indigo-600' : 'text-amber-600'
          }`}
        >
          {balance >= 0 ? '+' : ''}
          {formatCurrency(balance)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">อัตราการออม</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              savingsRate >= 20
                ? 'bg-emerald-100 text-emerald-800'
                : savingsRate > 0
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {savingsRate}%
          </span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-xl pointer-events-none opacity-60"></div>
      </div>

      {/* 4. Monthly Budget Target */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            งบประมาณรายเดือน
          </span>
          <button
            onClick={onOpenBudgetModal}
            title="ตั้งงบประมาณ"
            className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            {monthlyBudget > 0 ? formatCurrency(monthlyBudget) : 'ยังไม่ตั้งงบ'}
          </div>
          {monthlyBudget > 0 && (
            <span
              className={`text-xs font-bold ${
                isOverBudget ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {Math.round(budgetProgress)}%
            </span>
          )}
        </div>

        {monthlyBudget > 0 ? (
          <div className="mt-3">
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isOverBudget
                    ? 'bg-rose-500'
                    : budgetProgress > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, budgetProgress)}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs flex items-center justify-between">
              {isOverBudget ? (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  เกินงบ {formatCurrency(Math.abs(budgetRemaining))}
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  เหลืองบ {formatCurrency(budgetRemaining)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <button
              onClick={onOpenBudgetModal}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              + กำหนดเป้าหมายงบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
