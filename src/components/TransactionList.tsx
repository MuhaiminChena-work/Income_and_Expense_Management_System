import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import { getCategoryMeta, ALL_DEFAULT_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  ArrowUpDown,
  FileSpreadsheet,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onSeedData: () => void;
  selectedMonth: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAddNew,
  onSeedData,
  selectedMonth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deleteIdConfirm, setDeleteIdConfirm] = useState<string | null>(null);

  // Filter & Sort
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        const matchSearch =
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));

        // Type
        const matchType = typeFilter === 'all' || t.type === typeFilter;

        // Category
        const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;

        return matchSearch && matchType && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);

  // Unique categories in this month's transactions
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats);
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900">
            รายการบันทึกทั้งหมด ({transactions.length} รายการ)
          </h3>
          <p className="text-xs text-slate-500">
            ประวัติการรับเข้าและจ่ายออกประจำเดือนนี้
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาหมวดหมู่หรือบันทึก..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips & Sorters */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 text-xs">
        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              typeFilter === 'expense'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            เฉพาะรายจ่าย
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              typeFilter === 'income'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            เฉพาะรายรับ
          </button>
        </div>

        {/* Category & Sort selectors */}
        <div className="flex items-center gap-2">
          {/* Category dropdown */}
          {availableCategories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">ทุกหมวดหมู่</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="date-desc">วันที่ (ใหม่ไปเก่า)</option>
              <option value="date-asc">วันที่ (เก่าไปใหม่)</option>
              <option value="amount-desc">จำนวนเงิน (มากไปน้อย)</option>
              <option value="amount-asc">จำนวนเงิน (น้อยไปมาก)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-100 mt-2">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <FileSpreadsheet className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">ไม่พบรายการบันทึกในเดือนนี้</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              ยังไม่มีการบันทึกรายรับหรือรายจ่าย คุณสามารถเพิ่มรายการใหม่ หรือกดเพิ่มข้อมูลตัวอย่างเพื่อดูผลลัพธ์กราฟสถิติได้ทันที
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={onAddNew}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>เพิ่มรายการแรก</span>
              </button>
              <button
                onClick={onSeedData}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>เพิ่มข้อมูลตัวอย่าง</span>
              </button>
            </div>
          </div>
        ) : (
          filteredTransactions.map((item) => {
            const meta = getCategoryMeta(item.category, item.type);
            const isExpense = item.type === 'expense';

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
              >
                {/* Left: Icon & Meta */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: meta.bgLight, color: meta.color }}
                  >
                    <CategoryIcon name={meta.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800 truncate">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {formatThaiDate(item.date)}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xs sm:max-w-md">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-extrabold text-sm sm:text-base tracking-tight ${
                      isExpense ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(item.amount)}
                  </span>

                  {/* Actions (visible on hover / mobile) */}
                  <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(item)}
                      title="แก้ไข"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {deleteIdConfirm === item.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        <span className="text-[10px] text-rose-700 font-bold">ลบ?</span>
                        <button
                          onClick={() => {
                            onDelete(item.id);
                            setDeleteIdConfirm(null);
                          }}
                          className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-sm hover:bg-rose-700 font-medium"
                        >
                          ยืนยัน
                        </button>
                        <button
                          onClick={() => setDeleteIdConfirm(null)}
                          className="text-[10px] text-slate-500 hover:text-slate-700 px-1"
                        >
                          ไม่
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteIdConfirm(item.id)}
                        title="ลบรายการ"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
