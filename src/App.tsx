/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTransactions } from './hooks/useTransactions';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { ChartsView } from './components/ChartsView';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { LoginScreen } from './components/LoginScreen';
import { Transaction } from './types';
import { Loader2, Plus } from 'lucide-react';

function ExpenseTrackerApp() {
  const { user, userProfile, loading: authLoading, updateMonthlyBudget } = useAuth();
  const {
    transactions,
    monthlyTransactions,
    monthlyStats,
    selectedMonth,
    setSelectedMonth,
    loading: dataLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    seedSampleData,
    exportToCSV,
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500">กำลังโหลดข้อมูลระบบ...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }
  };

  const monthlyBudget = userProfile?.monthlyBudget || 0;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        onOpenAddModal={handleOpenAddModal}
        onExportCSV={exportToCSV}
        hasTransactions={monthlyTransactions.length > 0}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {dataLoading && transactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-sm font-medium text-slate-500">
              กำลังเชื่อมต่อและดึงข้อมูลจาก Firebase...
            </span>
          </div>
        ) : (
          <>
            {/* Financial Overview Cards */}
            <SummaryCards
              stats={monthlyStats}
              monthlyBudget={monthlyBudget}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            {/* Statistical Charts Section */}
            <ChartsView stats={monthlyStats} selectedMonth={selectedMonth} />

            {/* Transactions History & Filter Section */}
            <TransactionList
              transactions={monthlyTransactions}
              onEdit={handleOpenEditModal}
              onDelete={deleteTransaction}
              onAddNew={handleOpenAddModal}
              onSeedData={seedSampleData}
              selectedMonth={selectedMonth}
            />
          </>
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={handleOpenAddModal}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Noobit Expense Tracker &bull; บันทึกรายรับรายจ่ายอัตโนมัติ</span>
          <span>Firebase Project: noobit-expense-tracker-d-15637</span>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingTransaction={editingTransaction}
        defaultDate={`${selectedMonth}-01`}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={monthlyBudget}
        onSave={updateMonthlyBudget}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExpenseTrackerApp />
    </AuthProvider>
  );
}
