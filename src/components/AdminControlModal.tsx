import React from 'react';
import { Settings, X, Sliders, DollarSign, Bot, ShieldCheck, RefreshCw, Zap, Award } from 'lucide-react';
import { CarId, CARS, AdminSettings, BetMap } from '../types/game';
import { CarLogoComponent } from './CarLogos';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSettings;
  onUpdateSettings: (newSettings: Partial<AdminSettings>) => void;
  userBalance: number;
  onSetBalance: (newBalance: number) => void;
  userBets: BetMap;
  tableBets: BetMap;
  onTriggerSpinNow: () => void;
  isSpinning: boolean;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  adminSettings,
  onUpdateSettings,
  userBalance,
  onSetBalance,
  userBets,
  tableBets,
  onTriggerSpinNow,
  isSpinning,
}) => {
  if (!isOpen) return null;

  const carList = Object.values(CARS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0b0f19] rounded-2xl border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 py-3 px-4 flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-yellow-100" />
            <h2 className="text-lg font-black text-white tracking-wide">
              لوحة التحكم وإدارة الرهانات (Admin Dashboard)
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* Section 1: Winner Manipulation / Fair RNG */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                تحديد نتيجة الجولة القادمة (Next Round Winner)
              </span>
              <span className="text-xs text-slate-400">
                {adminSettings.forcedWinnerCar === 'FAIR_RNG' ? 'عشوائي عادل (Fair RNG)' : 'مُحددة يدويًا'}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ forcedWinnerCar: 'FAIR_RNG' })}
                className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                  adminSettings.forcedWinnerCar === 'FAIR_RNG'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                🎲 عشوائي عادل (RNG)
              </button>

              {carList.map((car) => {
                const isSelected = adminSettings.forcedWinnerCar === car.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => onUpdateSettings({ forcedWinnerCar: car.id })}
                    className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-amber-500/20 text-yellow-300 border-yellow-400 ring-2 ring-yellow-400/40 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <CarLogoComponent carId={car.id} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-right truncate flex-1">
                      <div className="text-[10px] truncate leading-tight">{car.name}</div>
                      <div className="text-[10px] font-black text-amber-400">x{car.multiplier}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Wallet Management */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                إدارة رصيد الحساب (Player Wallet)
              </span>
              <span className="font-mono text-xs text-yellow-400 font-bold">
                الحالي: {userBalance.toLocaleString()} ذهب
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onSetBalance(userBalance + 100_000)}
                className="py-1.5 px-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-300"
              >
                +100K ذهب
              </button>
              <button
                type="button"
                onClick={() => onSetBalance(userBalance + 1_000_000)}
                className="py-1.5 px-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-300"
              >
                +1M ذهب
              </button>
              <button
                type="button"
                onClick={() => onSetBalance(userBalance + 10_000_000)}
                className="py-1.5 px-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-300"
              >
                +10M ذهب
              </button>
              <button
                type="button"
                onClick={() => onSetBalance(1_000_000)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-300"
              >
                إعادة ضبط (1M)
              </button>
            </div>
          </div>

          {/* Section 3: Timers & Spin Dynamics */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              توقيت وسرعة الجولات
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  مدة وقت الرهان (Countdown): {adminSettings.bettingTimeSeconds} ثواني
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 25].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateSettings({ bettingTimeSeconds: sec })}
                      className={`flex-1 py-1 rounded border font-mono font-bold ${
                        adminSettings.bettingTimeSeconds === sec
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  مدة دوران العجلة: {adminSettings.spinDurationSeconds} ثواني
                </label>
                <div className="flex gap-2">
                  {[4, 6, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateSettings({ spinDurationSeconds: sec })}
                      className={`flex-1 py-1 rounded border font-mono font-bold ${
                        adminSettings.spinDurationSeconds === sec
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Trigger Spin */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">بدء الدوران فوراً دون انتظار المؤقت:</span>
              <button
                type="button"
                disabled={isSpinning}
                onClick={onTriggerSpinNow}
                className="py-1.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                دوران الآن فوراً
              </button>
            </div>
          </div>

          {/* Section 4: Bots & Live Room Activity */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                محاكاة رهانات اللاعبين (Simulated Players)
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ botsEnabled: !adminSettings.botsEnabled })}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  adminSettings.botsEnabled
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {adminSettings.botsEnabled ? 'مُفعّل (نشط)' : 'مُعطّل'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              يقوم بوضع رهانات عشوائية ذكية من لاعبين وهميين في الغرفة لتوفير تجربة لعب حية تشبه كبرى الألعاب.
            </p>
          </div>

          {/* Section 5: Current Round Active Bets Table */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              مراقبة الرهانات الحالية للجولة
            </span>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-slate-800/80 p-2 font-bold text-slate-300 text-center">
                <span>السيارة</span>
                <span>المضاعف</span>
                <span>رهاني</span>
                <span>إجمالي الطاولة</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-36 overflow-y-auto">
                {carList.map((car) => {
                  const myBet = userBets[car.id] || 0;
                  const pool = tableBets[car.id] || 0;
                  if (myBet === 0 && pool === 0) return null;

                  return (
                    <div key={car.id} className="grid grid-cols-4 p-2 items-center text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-4 h-4">
                          <CarLogoComponent carId={car.id} className="w-full h-full object-contain" />
                        </div>
                        <span className="truncate">{car.name}</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">x{car.multiplier}</span>
                      <span className="font-mono text-emerald-400 font-bold">{myBet.toLocaleString()}</span>
                      <span className="font-mono text-yellow-300">{pool.toLocaleString()}</span>
                    </div>
                  );
                })}
                {Object.values(tableBets).every((v) => v === 0) && (
                  <div className="p-3 text-center text-slate-500">لا توجد رهانات نشطة حاليًا</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">لوحة تحكم المشرف - روليت السيارات</span>
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs"
          >
            إغلاق وحفظ
          </button>
        </div>
      </div>
    </div>
  );
};
