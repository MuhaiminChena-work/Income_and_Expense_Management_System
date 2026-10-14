import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  PieChart,
  BarChart3,
  ShieldCheck,
  Zap,
  CheckCircle,
  Database,
  ArrowRight,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, authError, clearAuthError } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Noobit Expense
            </h1>
            <p className="text-xs text-slate-500">
              ระบบจัดการรายรับ-รายจ่าย & วิเคราะห์การเงิน
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Firebase Database Connected</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left Column: Copy & Login Button */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>จัดการเงินอย่างฉลาด บันทึกง่าย สรุปชัดเจน</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            วางแผนการเงิน{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              รู้ทุกรายรับ-รายจ่าย
            </span>{' '}
            พร้อมสถิติรายเดือน
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            ระบบติดตามการใช้จ่ายที่ออกแบบมาเพื่อความง่าย รองรับการจัดหมวดหมู่ กราฟวิเคราะห์สัดส่วนรายรับรายจ่ายแบบเรียลไทม์ และเก็บข้อมูลปลอดภัยด้วย Firebase
          </p>

          {/* Error Message */}
          {authError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{authError}</span>
              <button
                onClick={clearAuthError}
                className="text-xs font-bold underline hover:text-rose-900"
              >
                ปิด
              </button>
            </div>
          )}

          {/* Google Sign In CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-3.5 px-7 py-3.5 rounded-2xl text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Gmail / Google'}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Benefits bullets */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ล็อกอินง่ายด้วย Gmail ไม่ต้องจำรหัสผ่าน</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>จัดเก็บข้อมูลใน Firebase แยกบัญชีผู้ใช้</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>สรุปผลรายเดือน พร้อมกราฟโดนัท & แท่ง</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ส่งออกไฟล์ข้อมูลเป็น CSV ได้ทุกเมื่อ</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Mockup Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ตัวอย่างสรุปผล
                </span>
                <h3 className="font-extrabold text-base text-slate-800">
                  ตุลาคม 2026
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                +42,300 ฿ สุทธิ
              </span>
            </div>

            {/* Income & Expense mock bars */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700">รายรับรวม</span>
                <div className="text-lg font-black text-emerald-700 mt-0.5">+55,000 ฿</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-[11px] font-semibold text-rose-700">รายจ่ายรวม</span>
                <div className="text-lg font-black text-rose-700 mt-0.5">-12,700 ฿</div>
              </div>
            </div>

            {/* Category sample list */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-slate-700">อาหารและเครื่องดื่ม</span>
                </div>
                <span className="font-bold text-slate-800">4,850 ฿ (38%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[38%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-slate-700">บิล & ค่าไฟ/เน็ต</span>
                </div>
                <span className="font-bold text-slate-800">3,200 ฿ (25%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[25%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="font-semibold text-slate-700">ช้อปปิ้ง / ของใช้</span>
                </div>
                <span className="font-bold text-slate-800">2,650 ฿ (21%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[21%] rounded-full"></div>
              </div>
            </div>

            {/* Security badge */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Firebase Cloud Firestore
              </span>
              <span>เข้ารหัสข้อมูลตาม UID</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>Noobit Expense Tracker &bull; Powered by Firebase & Google Workspace</p>
      </footer>
    </div>
  );
};
