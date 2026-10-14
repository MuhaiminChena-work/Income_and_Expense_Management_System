import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Calendar, FileText, Check, AlertCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  editingTransaction?: Transaction | null;
  defaultDate?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
  defaultDate,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
    } else {
      setType('expense');
      setAmount('');
      const defaultCats = DEFAULT_EXPENSE_CATEGORIES;
      setCategory(defaultCats[0]?.name || '');
      // Format today or defaultDate
      const today = new Date().toISOString().split('T')[0];
      setDate(defaultDate && defaultDate.length === 10 ? defaultDate : today);
      setNote('');
    }
    setError(null);
  }, [editingTransaction, isOpen, defaultDate]);

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const firstCat = (newType === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES)[0]?.name || '';
    setCategory(firstCat);
  };

  const handleAddAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('กรุณากรอกจำนวนเงินที่ถูกต้อง (มากกว่า 0)');
      return;
    }
    if (!category) {
      setError('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!date) {
      setError('กรุณาระบุวันที่');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        type,
        amount: numAmount,
        category,
        date,
        note: note.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h3 className="font-bold text-lg text-slate-800">
            {editingTransaction ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector (รายจ่าย vs รายรับ) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white/80"></span>
              <span>รายจ่าย (Expense)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white/80"></span>
              <span>รายรับ (Income)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              จำนวนเงิน (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-2xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                autoFocus
              />
            </div>

            {/* Quick add chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[50, 100, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddAmount(val)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  +{val}฿
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              เลือกหมวดหมู่ *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgLight, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              วันที่ทำรายการ *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              บันทึกช่วยจำ / รายละเอียด (ถ้ามี)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <textarea
                rows={2}
                placeholder="เช่น ข้าวกะเพราหมูกรอบ, ค่าเน็ตเดือนนี้, งานพิเศษ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'กำลังบันทึก...' : editingTransaction ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
