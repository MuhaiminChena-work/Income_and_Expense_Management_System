import React, { useState } from 'react';
import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getCategoryMeta } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingDown,
  Sparkles,
  Info,
} from 'lucide-react';

interface ChartsViewProps {
  stats: MonthlyStats;
  selectedMonth: string;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ stats, selectedMonth }) => {
  const [activeTab, setActiveTab] = useState<'category' | 'daily' | 'compare'>('category');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { totalExpense, totalIncome, categoryExpenses, dailyExpenses, dailyIncome } = stats;

  // Prepare sorted categories
  const sortedCategories = Object.entries(categoryExpenses)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      meta: getCategoryMeta(category, 'expense'),
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate Donut Segments
  let cumulativeAngle = 0;
  const donutSegments = sortedCategories.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;
    return {
      ...item,
      startAngle,
      endAngle,
    };
  });

  // Days in month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const daysInMonth = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

  // Max daily value for chart scale
  const maxDailyValue = Math.max(
    ...daysArray.map((d) => Math.max(dailyExpenses[d] || 0, dailyIncome[d] || 0)),
    500
  );

  const dailyAverageExpense = daysInMonth > 0 ? totalExpense / daysInMonth : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-8">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            กราฟสถิติและการวิเคราะห์
          </h3>
          <p className="text-xs text-slate-500">
            แสดงสัดส่วนค่าใช้จ่ายและแนวโน้มการเงินในรอบเดือน
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('category')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'category'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>ตามหมวดหมู่</span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>แนวโน้มรายวัน</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>รับ vs จ่าย</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Category Breakdown */}
      {activeTab === 'category' && (
        <div className="pt-6">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <PieIcon className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
              <p className="text-sm font-medium">ยังไม่มีข้อมูลรายจ่ายในเดือนนี้</p>
              <p className="text-xs text-slate-400 mt-1">
                เริ่มบันทึกรายจ่ายเพื่อดูกราฟสัดส่วนการเงิน
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Donut Chart SVG */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                    {donutSegments.map((seg, idx) => {
                      const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                      const strokeDashoffset = -seg.startAngle / 3.6;
                      const isHovered = hoveredCategory === seg.category;

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={seg.meta.color}
                          strokeWidth={isHovered ? '18' : '15'}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          pathLength="100"
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredCategory(seg.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Donut Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                    <span className="text-[11px] font-semibold uppercase text-slate-400">
                      {hoveredCategory || 'รายจ่ายรวม'}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                      {hoveredCategory
                        ? formatCurrency(categoryExpenses[hoveredCategory] || 0)
                        : formatCurrency(totalExpense)}
                    </span>
                    {hoveredCategory && (
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            sortedCategories.find((c) => c.category === hoveredCategory)?.meta.color ||
                            '#EF4444',
                        }}
                      >
                        {((categoryExpenses[hoveredCategory] / totalExpense) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Top spending callout matching chart slice color */}
                {sortedCategories[0] && (
                  <div
                    className="mt-4 px-3.5 py-1.5 rounded-full border text-xs flex items-center gap-2 transition-all shadow-xs"
                    style={{
                      backgroundColor: sortedCategories[0].meta.bgLight,
                      borderColor: `${sortedCategories[0].meta.color}50`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                      style={{ backgroundColor: sortedCategories[0].meta.color }}
                    ></span>
                    <span className="text-slate-600 font-medium">หมวดหมู่สูงสุด:</span>
                    <strong style={{ color: sortedCategories[0].meta.color }}>
                      {sortedCategories[0].category}
                    </strong>
                    <span className="font-semibold text-slate-700">
                      ({sortedCategories[0].percentage.toFixed(0)}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Category Breakdown Progress List */}
              <div className="lg:col-span-7 space-y-3">
                {sortedCategories.map((item) => {
                  const isHovered = hoveredCategory === item.category;
                  return (
                    <div
                      key={item.category}
                      onMouseEnter={() => setHoveredCategory(item.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                        isHovered
                          ? 'bg-slate-50 border-slate-300 shadow-xs'
                          : 'border-transparent hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: item.meta.bgLight, color: item.meta.color }}
                          >
                            <CategoryIcon name={item.meta.icon} className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800 truncate">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-slate-900">
                            {formatCurrency(item.amount)}
                          </span>
                          <span className="text-xs font-medium text-slate-400 w-12 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.meta.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Daily Spending Trend Bar Chart */}
      {activeTab === 'daily' && (
        <div className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
                <span className="text-slate-600 font-medium">รายจ่าย</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">รายรับ</span>
              </div>
            </div>
            <div className="text-slate-500">
              เฉลี่ยรายจ่ายต่อวัน: <strong className="text-slate-800">{formatCurrency(dailyAverageExpense)}</strong>
            </div>
          </div>

          {/* Daily Bars Container with Horizontal Scroll on mobile */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[640px] h-52 flex items-end gap-1.5 pt-6 px-1 border-b border-slate-200">
              {daysArray.map((day) => {
                const exp = dailyExpenses[day] || 0;
                const inc = dailyIncome[day] || 0;
                const expHeight = maxDailyValue > 0 ? (exp / maxDailyValue) * 160 : 0;
                const incHeight = maxDailyValue > 0 ? (inc / maxDailyValue) * 160 : 0;
                const hasActivity = exp > 0 || inc > 0;

                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip */}
                    {hasActivity && (
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg py-1 px-2 pointer-events-none whitespace-nowrap z-20 shadow-md">
                        <div>วันที่ {parseInt(day, 10)}</div>
                        {exp > 0 && <div className="text-rose-400">จ่าย: -{formatCurrency(exp)}</div>}
                        {inc > 0 && <div className="text-emerald-400">รับ: +{formatCurrency(inc)}</div>}
                      </div>
                    )}

                    {/* Bars */}
                    <div className="w-full flex items-end justify-center gap-0.5">
                      {inc > 0 && (
                        <div
                          className="w-1/2 bg-emerald-500 rounded-t-xs hover:bg-emerald-400 transition-all"
                          style={{ height: `${Math.max(incHeight, 4)}px` }}
                        ></div>
                      )}
                      {exp > 0 && (
                        <div
                          className="w-1/2 bg-rose-500 rounded-t-xs hover:bg-rose-400 transition-all"
                          style={{ height: `${Math.max(expHeight, 4)}px` }}
                        ></div>
                      )}
                      {!hasActivity && (
                        <div className="w-full bg-slate-100 h-1 rounded-full"></div>
                      )}
                    </div>

                    {/* Day Label */}
                    <span
                      className={`text-[10px] mt-2 transition-colors ${
                        hasActivity ? 'font-bold text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {parseInt(day, 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Compare Income vs Expense */}
      {activeTab === 'compare' && (
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Ratio visual */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                สัดส่วนรายรับเทียบรายจ่าย
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-700">รายรับ ({formatCurrency(totalIncome)})</span>
                    <span className="text-slate-600">
                      {totalIncome + totalExpense > 0
                        ? `${Math.round((totalIncome / (totalIncome + totalExpense)) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          totalIncome + totalExpense > 0
                            ? (totalIncome / (totalIncome + totalExpense)) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-700">รายจ่าย ({formatCurrency(totalExpense)})</span>
                    <span className="text-slate-600">
                      {totalIncome + totalExpense > 0
                        ? `${Math.round((totalExpense / (totalIncome + totalExpense)) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          totalIncome + totalExpense > 0
                            ? (totalExpense / (totalIncome + totalExpense)) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                {totalIncome >= totalExpense ? (
                  <p className="text-emerald-700 font-medium">
                    🎉 ยอดเยี่ยม! คุณมีรายรับมากกว่ารายจ่าย {formatCurrency(totalIncome - totalExpense)} โดยมีอัตราการออมอยู่ที่ {stats.savingsRate}%
                  </p>
                ) : (
                  <p className="text-rose-700 font-medium">
                    ⚠️ คำเตือน: เดือนนี้รายจ่ายมากกว่ารายรับ {formatCurrency(totalExpense - totalIncome)} ลองตรวจสอบหมวดหมู่ที่ใช้จ่ายสูงเพื่อปรับลด
                  </p>
                )}
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3">สรุปดัชนีสำคัญประจำเดือน</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs py-2 border-b border-slate-200">
                    <span className="text-slate-600">จำนวนวันที่มีการใช้จ่าย:</span>
                    <span className="font-bold text-slate-800">
                      {Object.keys(dailyExpenses).length} วัน
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-2 border-b border-slate-200">
                    <span className="text-slate-600">รายจ่ายเฉลี่ยต่อวัน:</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(dailyAverageExpense)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200">
                    <span className="text-slate-600">หมวดหมู่รายจ่ายสูงสุด:</span>
                    {sortedCategories[0] ? (
                      <span
                        className="font-bold flex items-center gap-1.5"
                        style={{ color: sortedCategories[0].meta.color }}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: sortedCategories[0].meta.color }}
                        ></span>
                        {sortedCategories[0].category}
                      </span>
                    ) : (
                      <span className="font-bold text-slate-400">ไม่มี</span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-slate-600">สถานะกระแสเงินสด:</span>
                    <span
                      className={`font-bold ${
                        stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {stats.balance >= 0 ? 'บวก (เกินดุล)' : 'ติดลบ (ขาดดุล)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
