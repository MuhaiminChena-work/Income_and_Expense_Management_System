import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatMonthYear } from '../utils/formatters';
import {
  Wallet,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  Calendar,
  Download,
  Database,
} from 'lucide-react';

interface NavbarProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  hasTransactions: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedMonth,
  onSelectMonth,
  onOpenAddModal,
  onExportCSV,
  hasTransactions,
}) => {
  const { user, userProfile, signOutUser } = useAuth();

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    const newMonthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onSelectMonth(newMonthStr);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    const newMonthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onSelectMonth(newMonthStr);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const currStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    onSelectMonth(currStr);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight truncate">
                  Noobit Expense
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  Firebase DB
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                ระบบจัดการรายรับ-รายจ่าย สรุปสถิติรายเดือน
              </p>
            </div>
          </div>

          {/* Month Navigator in Center */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={handlePrevMonth}
              title="เดือนก่อนหน้า"
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handleCurrentMonth}
              title="คลิกเพื่อกลับมาเดือนปัจจุบัน"
              className="px-2.5 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0 hidden sm:inline" />
              <span>{formatMonthYear(selectedMonth)}</span>
            </button>

            <button
              onClick={handleNextMonth}
              title="เดือนถัดไป"
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasTransactions && (
              <button
                onClick={onExportCSV}
                title="ส่งออกรายงานเป็น CSV"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>CSV</span>
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">บันทึกรายการ</span>
            </button>

            {/* User Profile avatar & Sign out */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="relative group">
                <img
                  src={
                    user?.photoURL ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || user?.email || 'User'}`
                  }
                  alt={user?.displayName || 'User'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-500/30 object-cover cursor-pointer"
                  title={`${user?.displayName || ''} (${user?.email || ''})`}
                />
              </div>

              <button
                onClick={signOutUser}
                title="ออกจากระบบ"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
