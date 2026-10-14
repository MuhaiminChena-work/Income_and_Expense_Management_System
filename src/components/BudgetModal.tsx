import React, { useState } from 'react';
import { Target, X, Check } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (amount: number) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}) => {
  const [amount, setAmount] = useState<string>(currentBudget > 0 ? String(currentBudget) : '20000');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return;
    setLoading(true);
    try {
      await onSave(val);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            ตั้งงบประมาณรายเดือน
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            กำหนดวงเงินที่ต้องการจำกัดการใช้จ่ายต่อเดือน เพื่อให้ระบบช่วยแจ้งเตือนและคำนวณเปอร์เซ็นต์การใช้จ่าย
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              วงเงินงบประมาณ (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="20000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[15000, 20000, 30000, 50000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className="flex-1 py-1 px-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-center"
              >
                {preset / 1000}k
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'กำลังบันทึก...' : 'บันทึกงบประมาณ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
