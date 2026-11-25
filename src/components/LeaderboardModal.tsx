import React from 'react';
import { Trophy, X, Medal, Crown } from 'lucide-react';
import { LeaderboardUser } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: LeaderboardUser[];
  currentUserBalance: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1e1b4b] via-[#111827] to-[#030712] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-800 py-3.5 px-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300 drop-shadow" />
            <h2 className="text-lg font-black text-white tracking-wide">
              قائمة تصنيف الأرباح اليومية
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

        {/* Podium Top 3 */}
        <div className="pt-4 pb-2 px-4 bg-gradient-to-b from-indigo-950/60 to-transparent flex justify-center items-end gap-3 sm:gap-4 border-b border-indigo-900/30">
          {/* Rank 2 */}
          {users[1] && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <img
                  src={users[1].avatarUrl}
                  alt={users[1].name}
                  className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-300 text-slate-900 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center border border-white">
                  2
                </span>
              </div>
              <span className="text-xs font-bold mt-1 text-slate-200 truncate max-w-[80px]">
                {users[1].name}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                +{users[1].todayProfit.toLocaleString()}
              </span>
            </div>
          )}

          {/* Rank 1 */}
          {users[0] && (
            <div className="flex flex-col items-center flex-1 pb-2">
              <div className="relative">
                <Crown className="w-5 h-5 text-yellow-400 absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce" />
                <img
                  src={users[0].avatarUrl}
                  alt={users[0].name}
                  className="w-16 h-16 rounded-full border-2 border-yellow-400 object-cover shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                />
                <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center border-2 border-white">
                  1
                </span>
              </div>
              <span className="text-sm font-black mt-1 text-yellow-300 truncate max-w-[90px]">
                {users[0].name}
              </span>
              <span className="text-xs font-mono text-emerald-300 font-black">
                +{users[0].todayProfit.toLocaleString()}
              </span>
            </div>
          )}

          {/* Rank 3 */}
          {users[2] && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <img
                  src={users[2].avatarUrl}
                  alt={users[2].name}
                  className="w-12 h-12 rounded-full border-2 border-amber-600 object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white w-5 h-5 rounded-full text-xs font-black flex items-center justify-center border border-white">
                  3
                </span>
              </div>
              <span className="text-xs font-bold mt-1 text-slate-200 truncate max-w-[80px]">
                {users[2].name}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                +{users[2].todayProfit.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Rest of the list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-white/5">
          {users.map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                u.isMe
                  ? 'bg-purple-900/40 border border-purple-500/40'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-sm text-slate-400 font-mono">
                  {u.rank > 3 ? `#${u.rank}` : ''}
                  {u.rank === 1 && <Crown className="w-4 h-4 text-yellow-400 mx-auto" />}
                  {u.rank === 2 && <Medal className="w-4 h-4 text-slate-300 mx-auto" />}
                  {u.rank === 3 && <Medal className="w-4 h-4 text-amber-500 mx-auto" />}
                </span>
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-100">
                      {u.name}
                    </span>
                    {u.isMe && (
                      <span className="text-[10px] bg-purple-600 text-white px-1.5 rounded-full font-bold">
                        أنت
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">
                    VIP {u.vipLevel}
                  </span>
                </div>
              </div>

              <div className="text-left font-mono font-bold text-sm text-emerald-400">
                +{u.todayProfit.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-purple-900/30 text-center">
          <p className="text-xs text-slate-400">
            يتم تحديث قائمة الأوائل كل 24 ساعة بتوقيت اللعبة
          </p>
        </div>
      </div>
    </div>
  );
};
