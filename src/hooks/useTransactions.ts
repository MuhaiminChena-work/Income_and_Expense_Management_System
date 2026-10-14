import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Transaction, MonthlyStats } from '../types';
import confetti from 'canvas-confetti';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Selected Month state: YYYY-MM
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = `users/${user.uid}/transactions`;
    const q = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Transaction, 'id'>),
          });
        });
        setTransactions(items);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add transaction
  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ');
    setActionError(null);
    const path = `users/${user.uid}/transactions`;
    try {
      const payload = {
        userId: user.uid,
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        note: data.note || '',
        date: data.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'users', user.uid, 'transactions'), payload);

      if (data.type === 'income') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#34D399', '#6EE7B7'],
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id' | 'userId'>>) => {
    if (!user) throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ');
    setActionError(null);
    const path = `users/${user.uid}/transactions/${id}`;
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(docRef, {
        ...data,
        amount: data.amount !== undefined ? Number(data.amount) : undefined,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ');
    setActionError(null);
    const path = `users/${user.uid}/transactions/${id}`;
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Seed sample transactions
  const seedSampleData = async () => {
    if (!user) return;
    const yearMonth = selectedMonth;
    const samples = [
      { type: 'income' as const, amount: 45000, category: 'เงินเดือน / ค่าจ้าง', note: 'เงินเดือนประจำเดือน', date: `${yearMonth}-01` },
      { type: 'income' as const, amount: 7500, category: 'ฟรีแลนซ์ / รายได้เสริม', note: 'รับงานออกแบบเว็บ', date: `${yearMonth}-12` },
      { type: 'expense' as const, amount: 8500, category: 'ที่อยู่อาศัย / เช่าห้อง', note: 'ค่าเช่าคอนโด', date: `${yearMonth}-02` },
      { type: 'expense' as const, amount: 1250, category: 'บิล / น้ำ-ไฟ-เน็ต', note: 'ค่าไฟและอินเทอร์เน็ต', date: `${yearMonth}-04` },
      { type: 'expense' as const, amount: 450, category: 'อาหารและเครื่องดื่ม', note: 'กาแฟและอาหารเช้า', date: `${yearMonth}-05` },
      { type: 'expense' as const, amount: 980, category: 'อาหารและเครื่องดื่ม', note: 'ชาบูมื้อเย็นกับเพื่อน', date: `${yearMonth}-08` },
      { type: 'expense' as const, amount: 1200, category: 'การเดินทาง / ยานพาหนะ', note: 'เติมน้ำมันรถ', date: `${yearMonth}-10` },
      { type: 'expense' as const, amount: 2350, category: 'ช้อปปิ้ง / ของใช้', note: 'ของใช้ในบ้านและซูเปอร์มาร์เก็ต', date: `${yearMonth}-14` },
      { type: 'expense' as const, amount: 790, category: 'ความบันเทิง / ท่องเที่ยว', note: 'ดูหนังและสตรีมมิ่ง', date: `${yearMonth}-16` },
      { type: 'expense' as const, amount: 650, category: 'สุขภาพ / ยา / ประกัน', note: 'วิตามินและยาแก้แพ้', date: `${yearMonth}-20` },
      { type: 'expense' as const, amount: 520, category: 'อาหารและเครื่องดื่ม', note: 'สเต็กและสลัด', date: `${yearMonth}-24` },
    ];

    for (const item of samples) {
      await addTransaction(item);
    }
  };

  // Monthly filtered transactions
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Monthly statistics
  const monthlyStats: MonthlyStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses: Record<string, number> = {};
    const dailyExpenses: Record<string, number> = {};
    const dailyIncome: Record<string, number> = {};

    monthlyTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      const day = t.date.split('-')[2] || '01';

      if (t.type === 'income') {
        totalIncome += amt;
        dailyIncome[day] = (dailyIncome[day] || 0) + amt;
      } else {
        totalExpense += amt;
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + amt;
        dailyExpenses[day] = (dailyExpenses[day] || 0) + amt;
      }
    });

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((balance / totalIncome) * 100)) : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      categoryExpenses,
      dailyExpenses,
      dailyIncome,
    };
  }, [monthlyTransactions]);

  // Export to CSV
  const exportToCSV = () => {
    if (monthlyTransactions.length === 0) return;
    const headers = ['วันที่ (Date)', 'ประเภท (Type)', 'หมวดหมู่ (Category)', 'บันทึก (Note)', 'จำนวนเงิน (Amount บาท)'];
    const rows = monthlyTransactions.map((t) => [
      t.date,
      t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      `"${t.category.replace(/"/g, '""')}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expense_report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    transactions,
    monthlyTransactions,
    monthlyStats,
    selectedMonth,
    setSelectedMonth,
    loading,
    actionError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    seedSampleData,
    exportToCSV,
  };
}
