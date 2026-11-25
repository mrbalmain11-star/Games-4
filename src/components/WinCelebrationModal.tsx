import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { CarId, CARS } from '../types/game';
import { CarLogoComponent } from './CarLogos';

interface WinCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerCarId: CarId;
  userBetOnWinner: number;
  totalPayout: number;
}

export const WinCelebrationModal: React.FC<WinCelebrationModalProps> = ({
  isOpen,
  onClose,
  winnerCarId,
  userBetOnWinner,
  totalPayout,
}) => {
  const car = CARS[winnerCarId];
  const isWinner = userBetOnWinner > 0;

  useEffect(() => {
    if (isOpen && isWinner) {
      // Trigger festive confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#EC4899', '#3B82F6', '#10B981', '#FFFFFF'],
      });
    }
  }, [isOpen, isWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1e1b4b] via-[#111827] to-[#030712] rounded-3xl border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(250,204,21,0.3)] p-6 text-center text-white overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-yellow-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-4">
          {isWinner ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              تهانينا! فوز ساحق!
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-2">
              نتيجة السحب للجولة
            </div>
          )}
          <h2 className="text-2xl font-black tracking-tight text-yellow-300">
            {car.name} ({car.enName})
          </h2>
        </div>

        {/* Winning Car Icon Badge */}
        <div className="relative mx-auto my-4 w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center justify-center">
          <CarLogoComponent carId={winnerCarId} className="w-16 h-16 object-contain" />
          <div className="absolute -bottom-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-3 py-0.5 rounded-full text-sm font-['Outfit'] shadow-md border border-white/60">
            x{car.multiplier}
          </div>
        </div>

        {/* Earnings Breakdown */}
        {isWinner ? (
          <div className="mt-6 space-y-2 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span>مبلغ رهانك:</span>
              <span className="font-mono font-bold">{userBetOnWinner.toLocaleString()} ذهب</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span>المضاعف المستحق:</span>
              <span className="font-mono font-bold text-yellow-400 font-['Outfit']">x{car.multiplier}</span>
            </div>
            <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between text-sm sm:text-base font-black text-emerald-300">
              <span>إجمالي الأرباح المكتسبة:</span>
              <span className="font-mono text-yellow-300 text-lg">+{totalPayout.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-white/10 text-xs text-slate-400">
            لم يحالفك الحظ في هذه الجولة، راهن في الجولة القادمة لمضاعفة رصيدك حتى x100!
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          type="button"
          className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg transition-transform active:scale-95 text-base"
        >
          {isWinner ? 'استلام ومتابعة اللعب 💰' : 'الجولة التالية ⚡'}
        </button>
      </div>
    </div>
  );
};
