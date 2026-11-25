import React from 'react';
import { Crown, Lock, X, Check, Sparkles } from 'lucide-react';

interface VipSeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatNumber: number;
  userBalance: number;
  isOccupiedByMe: boolean;
  onTakeSeat: (seatNumber: number) => void;
}

export const VipSeatModal: React.FC<VipSeatModalProps> = ({
  isOpen,
  onClose,
  seatNumber,
  userBalance,
  isOccupiedByMe,
  onTakeSeat,
}) => {
  if (!isOpen) return null;

  const vipCost = 500_000;
  const canAfford = userBalance >= vipCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2e1065] via-[#1e1b4b] to-[#0f172a] rounded-3xl border-2 border-yellow-500/40 p-6 text-center text-white shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-300 mb-3 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          <Crown className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-black text-yellow-300 mb-1">
          مقعد كبار الشخصيات VIP #{seatNumber}
        </h3>
        <p className="text-xs text-purple-200 mb-4">
          احجز مقعد العرش الفاخر داخل القاعة الملكية واحصل على هالة ذهبية وتأثيرات حصرية أثناء الرهان!
        </p>

        <div className="bg-black/30 p-3 rounded-xl border border-purple-500/30 text-xs space-y-2 mb-5 text-right">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">تكلفة التثبيت VIP:</span>
            <span className="font-mono font-bold text-yellow-300">500,000 ذهب</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">الميزة:</span>
            <span className="text-emerald-300 font-bold">عرض صورتك في صدر المجلس الملكي</span>
          </div>
        </div>

        {isOccupiedByMe ? (
          <div className="p-3 bg-emerald-900/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" /> أنت جالس حالياً في هذا المقعد الفاخر
          </div>
        ) : (
          <button
            type="button"
            disabled={!canAfford}
            onClick={() => onTakeSeat(seatNumber)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
          >
            {canAfford ? 'الجلوس في مقعد العرش الملكي 👑' : 'الرصيد غير كافٍ للحجز'}
          </button>
        )}
      </div>
    </div>
  );
};
