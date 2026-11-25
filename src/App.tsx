import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  List,
  Power,
  ChevronLeft,
  Home,
  RotateCcw,
  Sliders,
  Lock,
} from 'lucide-react';
import {
  CarId,
  CARS,
  WHEEL_SLOTS,
  GamePhase,
  BetMap,
  AdminSettings,
  LeaderboardUser,
} from './types/game';
import { GameWheel } from './components/GameWheel';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdminControlModal } from './components/AdminControlModal';
import { WinCelebrationModal } from './components/WinCelebrationModal';
import { VipSeatModal } from './components/VipSeatModal';
import { CarLogoComponent } from './components/CarLogos';
import { sounds } from './utils/soundEffects';

// Luxury Palace VIP Room image path generated
const PALACE_BG_IMG = '/src/assets/images/luxury_palace_vip_room_1791460318778.jpg';

// Initial Mock Leaderboard
const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'u-101',
    name: 'سلطان القحطاني',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    todayProfit: 34_800_000,
    vipLevel: 8,
  },
  {
    rank: 2,
    id: 'u-102',
    name: 'عبدالعزيز VIP',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    todayProfit: 19_500_000,
    vipLevel: 7,
  },
  {
    rank: 3,
    id: 'u-103',
    name: 'المهيب',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    todayProfit: 12_400_000,
    vipLevel: 6,
  },
  {
    rank: 4,
    id: 'u-104',
    name: 'فارس الظلام',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    todayProfit: 8_900_000,
    vipLevel: 5,
  },
  {
    rank: 5,
    id: 'u-105',
    name: 'Tiger',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    todayProfit: 4_200_000,
    vipLevel: 5,
    isMe: true,
  },
];

// Initial recent winners matching Image 1 bottom strip exactly
const INITIAL_HISTORY: CarId[] = [
  'porsche',
  'ferrari',
  'vw',
  'vw',
  'mercedes',
  'vw',
  'bmw',
  'vw',
];

export default function App() {
  // Game State
  const [roundNumber, setRoundNumber] = useState(1160);
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [countdown, setCountdown] = useState(12);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [winnerSlotIndex, setWinnerSlotIndex] = useState<number | null>(null);

  // Player State
  const [balance, setBalance] = useState<number>(392_000); // starts around authentic amount
  const [selectedChip, setSelectedChip] = useState<number>(100_000); // 100K chip
  const [userBets, setUserBets] = useState<BetMap>({});
  const [lastRoundBets, setLastRoundBets] = useState<BetMap>({});
  const [tableBets, setTableBets] = useState<BetMap>({});
  const [autoBetEnabled, setAutoBetEnabled] = useState<boolean>(false);
  const [vipSeatOccupied, setVipSeatOccupied] = useState<number | null>(null);

  // Modals & Sound
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showVipSeatModal, setShowVipSeatModal] = useState<number | null>(null);
  const [lastWinInfo, setLastWinInfo] = useState<{
    carId: CarId;
    userBet: number;
    payout: number;
  } | null>(null);

  // History & Leaderboard
  const [history, setHistory] = useState<CarId[]>(INITIAL_HISTORY);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Admin Config
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    forcedWinnerCar: 'FAIR_RNG',
    bettingTimeSeconds: 12,
    spinDurationSeconds: 6,
    botsEnabled: true,
    botsBetFactor: 1,
    soundEnabled: true,
  });

  const spinIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Simulate bot bets dropping during betting phase
  useEffect(() => {
    if (phase !== 'BETTING' || !adminSettings.botsEnabled) return;

    const interval = window.setInterval(() => {
      const carKeys = Object.keys(CARS) as CarId[];
      const randomCar = carKeys[Math.floor(Math.random() * carKeys.length)];
      const botAmounts = [10_000, 50_000, 100_000, 200_000];
      const randomAmount = botAmounts[Math.floor(Math.random() * botAmounts.length)];

      setTableBets((prev) => ({
        ...prev,
        [randomCar]: (prev[randomCar] || 0) + randomAmount,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [phase, adminSettings.botsEnabled]);

  // Wheel Spin Animation
  const startSpinAnimation = useCallback(() => {
    setPhase('SPINNING');
    sounds.playSpinStart();

    let targetIndex: number;
    if (adminSettings.forcedWinnerCar !== 'FAIR_RNG') {
      const matchingIndices: number[] = [];
      WHEEL_SLOTS.forEach((car, idx) => {
        if (car === adminSettings.forcedWinnerCar) {
          matchingIndices.push(idx);
        }
      });
      targetIndex =
        matchingIndices.length > 0
          ? matchingIndices[Math.floor(Math.random() * matchingIndices.length)]
          : 0;
    } else {
      targetIndex = Math.floor(Math.random() * WHEEL_SLOTS.length);
    }

    const totalWheelSlots = WHEEL_SLOTS.length; // 16
    const fullSpins = 4;
    const totalSteps =
      fullSpins * totalWheelSlots +
      ((targetIndex - currentSlotIndex + totalWheelSlots) % totalWheelSlots);

    let currentStep = 0;
    let slotIdx = currentSlotIndex;
    const duration = adminSettings.spinDurationSeconds * 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Deceleration curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const calculatedStep = Math.floor(easeOut * totalSteps);

      if (calculatedStep > currentStep) {
        currentStep = calculatedStep;
        slotIdx = (currentSlotIndex + currentStep) % totalWheelSlots;
        setCurrentSlotIndex(slotIdx);
        sounds.playWheelTick(1 - progress * 0.35);
      }

      if (progress < 1) {
        spinIntervalRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentSlotIndex(targetIndex);
        setWinnerSlotIndex(targetIndex);
        setPhase('RESULT');

        const winnerCar = WHEEL_SLOTS[targetIndex];
        const carConfig = CARS[winnerCar];
        const myBet = userBets[winnerCar] || 0;
        const payout = myBet * carConfig.multiplier;

        if (payout > 0) {
          setBalance((b) => b + payout);
          sounds.playWinChime(carConfig.multiplier >= 50);
          setLeaderboard((prev) =>
            prev.map((item) =>
              item.isMe
                ? { ...item, todayProfit: item.todayProfit + (payout - myBet) }
                : item
            )
          );
        }

        setLastWinInfo({
          carId: winnerCar,
          userBet: myBet,
          payout,
        });

        setHistory((prev) => [winnerCar, ...prev.slice(0, 11)]);
        setLastRoundBets({ ...userBets });

        setTimeout(() => {
          setShowWinModal(true);
        }, 500);

        setTimeout(() => {
          setShowWinModal(false);
          setRoundNumber((r) => r + 1);
          setWinnerSlotIndex(null);
          setUserBets({});
          setTableBets({});
          setCountdown(adminSettings.bettingTimeSeconds);
          setPhase('BETTING');

          if (autoBetEnabled && Object.keys(userBets).length > 0) {
            const totalLastBets = Object.values(userBets).reduce((a, b) => a + b, 0);
            if (balance >= totalLastBets) {
              setBalance((b) => b - totalLastBets);
              setUserBets({ ...userBets });
              setTableBets((prev) => {
                const updated = { ...prev };
                Object.entries(userBets).forEach(([cId, val]) => {
                  updated[cId] = (updated[cId] || 0) + val;
                });
                return updated;
              });
            }
          }
        }, 4500);
      }
    };

    spinIntervalRef.current = requestAnimationFrame(animate);
  }, [adminSettings, currentSlotIndex, userBets, autoBetEnabled, balance]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'BETTING') return;

    if (countdown <= 0) {
      startSpinAnimation();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 4 && c > 1) {
          sounds.playCountdownHurry(c - 1);
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, countdown, startSpinAnimation]);

  const handlePlaceBet = (carId: CarId) => {
    if (phase !== 'BETTING') return;
    if (balance < selectedChip) {
      alert('عذراً، رصيدك غير كافٍ للرهان!');
      return;
    }

    setBalance((b) => b - selectedChip);
    setUserBets((prev) => ({
      ...prev,
      [carId]: (prev[carId] || 0) + selectedChip,
    }));
    setTableBets((prev) => ({
      ...prev,
      [carId]: (prev[carId] || 0) + selectedChip,
    }));
    sounds.playChipClick();
  };

  const handleRepeatBet = () => {
    if (phase !== 'BETTING') return;
    const totalRepeat = Object.values(lastRoundBets).reduce((a, b) => a + b, 0);
    if (totalRepeat === 0) return;
    if (balance < totalRepeat) {
      alert('الرصيد غير كافٍ لإعادة الرهان السابق!');
      return;
    }

    setBalance((b) => b - totalRepeat);
    setUserBets((prev) => {
      const merged = { ...prev };
      Object.entries(lastRoundBets).forEach(([cId, val]) => {
        merged[cId] = (merged[cId] || 0) + val;
      });
      return merged;
    });
    setTableBets((prev) => {
      const merged = { ...prev };
      Object.entries(lastRoundBets).forEach(([cId, val]) => {
        merged[cId] = (merged[cId] || 0) + val;
      });
      return merged;
    });
    sounds.playChipClick();
  };

  return (
    <div className="min-h-screen bg-[#111229] text-white flex flex-col justify-between max-w-[430px] mx-auto shadow-2xl relative overflow-x-hidden border-x border-[#1e1f42] select-none">
      {/* 0. ANDROID PHONE STATUS BAR (Matching Image 1 top) */}
      <div className="w-full flex items-center justify-between px-4 pt-1.5 pb-1 text-[11px] font-sans text-slate-300 font-semibold opacity-90">
        <div className="flex items-center gap-1.5">
          <span className="font-bold">M</span>
          <span>ılı.lıl.</span>
          <span className="text-[10px] bg-slate-800 px-1 rounded">4G</span>
        </div>
        <div className="flex items-center gap-2">
          <span>2:30</span>
          <span>🔋</span>
        </div>
      </div>

      {/* 1. TOP HEADER (Power button, user profile, green balance pill, matching Image 1) */}
      <header className="relative z-40 flex items-center justify-between px-3 py-1">
        {/* Left Side: Power button & Seat #1 avatar */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => setShowAdmin(true)}
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white shadow"
            title="إعدادات الرهان"
          >
            <Power className="w-4 h-4" />
          </button>
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
                alt="Seat 1"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -left-1 bg-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
              1
            </span>
          </div>
        </div>

        {/* Right Side: Back arrow, green cash pill, User Fahad & ID (Matching Image 1) */}
        <div className="flex items-center gap-2">
          {/* Green Cash / Note Badge with "0" */}
          <div className="flex items-center gap-1 bg-[#064e3b]/80 border border-emerald-400/60 rounded-full px-2.5 py-0.5">
            <span className="text-emerald-300 font-mono font-bold text-xs">0</span>
            <span className="text-emerald-300 text-xs">💵</span>
          </div>

          {/* Green Circular Back Button */}
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="w-7 h-7 rounded-full bg-[#059669] border border-emerald-300 flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>

          {/* User Name & ID & Avatar */}
          <div className="flex items-center gap-1.5 text-right">
            <div>
              <div className="text-xs font-black text-white leading-none">فهد</div>
              <div className="text-[10px] text-slate-300 font-mono leading-none mt-0.5">
                ID:4180424
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Fahad Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. PALACE VIP ROOM & TWO ARMCHAIRS WITH LOCKS (1 & 2) (Matching Image 1) */}
      <section className="relative w-full h-36 sm:h-40 overflow-hidden shrink-0">
        <img
          src={PALACE_BG_IMG}
          alt="Palace Interior"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111229] via-transparent to-black/30" />

        {/* Two Armchairs with Padlocks (2 on left, 1 on right) */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center items-center gap-10 z-10">
          {/* Chair #2 */}
          <button
            type="button"
            onClick={() => setShowVipSeatModal(2)}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#831843]/90 to-[#4c0519]/90 border-2 border-yellow-500/70 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400/90 border border-white flex items-center justify-center shadow">
                <Lock className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                2
              </span>
            </div>
          </button>

          {/* Chair #1 */}
          <button
            type="button"
            onClick={() => setShowVipSeatModal(1)}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#831843]/90 to-[#4c0519]/90 border-2 border-yellow-500/70 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400/90 border border-white flex items-center justify-center shadow">
                <Lock className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                1
              </span>
            </div>
          </button>
        </div>

        {/* Mini-Games Carousel Row: Junior icons, Jackpot, Yummy, Fishing Star (Image 1) */}
        <div className="absolute top-1 inset-x-2 flex items-center justify-between opacity-90 text-[9px] font-bold">
          <div className="flex gap-2 items-center overflow-x-hidden">
            <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/60 text-amber-300">Junior</span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/60 text-amber-300">Junior</span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/60 text-amber-300">Junior</span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/60 text-amber-300">Junior</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/30 border border-yellow-300 text-yellow-300">Jackpot</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-900/50 border border-sky-400 text-sky-200">YUMMY</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-900/50 border border-indigo-400 text-indigo-200">Fishing Star</span>
          </div>
        </div>
      </section>

      {/* 3. GAME HEADER BAR (Home, 2026/10/08 1160 لعبة, Trophy, Menu) */}
      <section className="flex items-center justify-between px-3 py-1.5 bg-[#181a3d] border-y border-indigo-950/60 text-xs">
        {/* Left: Home Button in purple rounded square */}
        <button
          type="button"
          onClick={() => setShowAdmin(true)}
          className="w-8 h-8 rounded-xl bg-[#2e316e] border border-indigo-400/40 flex items-center justify-center text-indigo-200 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Center: Date & Game round (Image 1: 2026 / 10 / 08 1160 لعبة) */}
        <div className="text-center">
          <span className="font-mono text-slate-100 font-bold tracking-wider text-xs sm:text-sm drop-shadow">
            2026 / 10 / 08 <span className="text-white font-extrabold">{roundNumber}</span> لعبة
          </span>
        </div>

        {/* Right: Trophy button & Menu List button in purple rounded squares */}
        <div className="flex items-center gap-2">
          {/* Leaderboard Trophy */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="w-8 h-8 rounded-xl bg-[#2e316e] border border-indigo-400/40 flex items-center justify-center text-indigo-100 shadow-sm transition-transform active:scale-95"
            title="جدول الصدارة"
          >
            <Trophy className="w-4 h-4 text-indigo-300" />
          </button>

          {/* Menu / Rules Button */}
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="w-8 h-8 rounded-xl bg-[#2e316e] border border-indigo-400/40 flex items-center justify-center text-indigo-100 shadow-sm transition-transform active:scale-95"
            title="طريقة اللعب"
          >
            <List className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      </section>

      {/* 4. MAIN CIRCULAR CAR ROULETTE WHEEL */}
      <main className="flex-1 flex flex-col justify-center py-0.5">
        <GameWheel
          currentSlotIndex={currentSlotIndex}
          winnerSlotIndex={winnerSlotIndex}
          phase={phase}
          countdown={countdown}
          userBets={userBets}
          tableBets={tableBets}
          selectedChip={selectedChip}
          onPlaceBet={handlePlaceBet}
          isSpinning={phase === 'SPINNING'}
        />
      </main>

      {/* 5. CHIPS BAR & RE-BET BUTTON ("تجديد") (Matching Image 1) */}
      <section className="px-3 pt-1 pb-1">
        <div className="flex items-center justify-between gap-2">
          {/* Chips: 5K (green), 10K (blue), 100K (purple), 1M (red) matching Screenshot 1 */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* 5K Green */}
            <button
              type="button"
              onClick={() => {
                setSelectedChip(5_000);
                sounds.playChipClick();
              }}
              className={`relative w-11 h-11 rounded-full bg-gradient-to-b from-green-500 to-emerald-700 border-2 border-emerald-200 flex items-center justify-center font-black font-['Outfit'] text-xs text-white shadow-md transition-all ${
                selectedChip === 5_000 ? 'ring-3 ring-yellow-400 scale-110 z-10' : 'opacity-90'
              }`}
            >
              5K
            </button>

            {/* 10K Blue */}
            <button
              type="button"
              onClick={() => {
                setSelectedChip(10_000);
                sounds.playChipClick();
              }}
              className={`relative w-11 h-11 rounded-full bg-gradient-to-b from-sky-500 to-blue-700 border-2 border-sky-200 flex items-center justify-center font-black font-['Outfit'] text-xs text-white shadow-md transition-all ${
                selectedChip === 10_000 ? 'ring-3 ring-yellow-400 scale-110 z-10' : 'opacity-90'
              }`}
            >
              10K
            </button>

            {/* 100K Purple */}
            <button
              type="button"
              onClick={() => {
                setSelectedChip(100_000);
                sounds.playChipClick();
              }}
              className={`relative w-11 h-11 rounded-full bg-gradient-to-b from-purple-500 to-indigo-800 border-2 border-purple-200 flex items-center justify-center font-black font-['Outfit'] text-xs text-white shadow-md transition-all ${
                selectedChip === 100_000 ? 'ring-3 ring-yellow-400 scale-110 z-10' : 'opacity-90'
              }`}
            >
              100K
            </button>

            {/* 1M Red */}
            <button
              type="button"
              onClick={() => {
                setSelectedChip(1_000_000);
                sounds.playChipClick();
              }}
              className={`relative w-11 h-11 rounded-full bg-gradient-to-b from-rose-500 to-red-800 border-2 border-rose-200 flex items-center justify-center font-black font-['Outfit'] text-xs text-white shadow-md transition-all ${
                selectedChip === 1_000_000 ? 'ring-3 ring-yellow-400 scale-110 z-10' : 'opacity-90'
              }`}
            >
              1M
            </button>
          </div>

          {/* Orange "تجديد" Button (Matching Image 1: orange rectangular with square icon) */}
          <button
            type="button"
            disabled={phase === 'SPINNING' || Object.keys(lastRoundBets).length === 0}
            onClick={handleRepeatBet}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:brightness-110 disabled:opacity-40 text-amber-100 font-extrabold rounded-xl border-2 border-[#fdba74] shadow-md text-sm transition-transform active:scale-95 shrink-0"
          >
            <div className="w-3.5 h-3.5 rounded border-2 border-[#fed7aa] bg-[#c2410c]" />
            <span className="tracking-wide text-white drop-shadow font-bold">تجديد</span>
          </button>
        </div>
      </section>

      {/* 6. BOTTOM PLAYER CARD & LEADERBOARD BUTTON (Matching Image 1) */}
      <section className="px-3 py-1 flex items-center justify-between gap-3 bg-[#151739]">
        {/* Left: Player Tiger Card with Gold Coin balance 392 (Image 1) */}
        <div className="flex items-center gap-2 bg-[#222557] px-3 py-1.5 rounded-xl border border-indigo-400/30 flex-1">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
            alt="Tiger"
            className="w-8 h-8 rounded-lg object-cover border border-amber-400/80"
          />
          <div>
            <div className="text-xs font-bold text-white">Tiger</div>
            <div className="flex items-center gap-1 text-xs font-mono text-yellow-400 font-bold">
              <span>🪙</span>
              <span>{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right: "جدول الصدارة >" Button (Image 1) */}
        <button
          type="button"
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center justify-between px-3 py-2 bg-[#222557] hover:bg-[#2c3070] border border-indigo-400/30 rounded-xl text-xs font-bold text-indigo-200 flex-1 transition-colors"
        >
          <span>جدول الصدارة</span>
          <ChevronLeft className="w-4 h-4 text-indigo-300" />
        </button>
      </section>

      {/* 7. BOTTOM HISTORY STRIP ("سجل" with [NEW] badge matching Image 1) */}
      <footer className="px-3 py-1 bg-[#0e1026] flex items-center gap-2 border-t border-slate-900 overflow-x-hidden">
        <span className="text-xs font-bold text-slate-300 shrink-0">سجل:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {history.map((carId, idx) => (
            <div key={`${carId}-${idx}`} className="relative shrink-0">
              {idx === 0 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-sm leading-none border border-white">
                  NEW
                </span>
              )}
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center p-0.5 shadow-sm">
                <CarLogoComponent carId={carId} className="w-full h-full object-contain" />
              </div>
            </div>
          ))}
        </div>
      </footer>

      {/* 8. VIRTUAL ANDROID NAVIGATION BAR (||| ⬭ <) */}
      <div className="w-full bg-black py-1 flex justify-around items-center text-slate-400 text-sm select-none">
        <span className="font-bold text-base tracking-widest">|||</span>
        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 inline-block" />
        <span className="font-bold text-base">&gt;</span>
      </div>

      {/* MODALS */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        users={leaderboard}
        currentUserBalance={balance}
      />

      <AdminControlModal
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        adminSettings={adminSettings}
        onUpdateSettings={(newSet) => setAdminSettings((prev) => ({ ...prev, ...newSet }))}
        userBalance={balance}
        onSetBalance={setBalance}
        userBets={userBets}
        tableBets={tableBets}
        onTriggerSpinNow={() => {
          setShowAdmin(false);
          startSpinAnimation();
        }}
        isSpinning={phase === 'SPINNING'}
      />

      {showWinModal && lastWinInfo && (
        <WinCelebrationModal
          isOpen={showWinModal}
          onClose={() => setShowWinModal(false)}
          winnerCarId={lastWinInfo.carId}
          userBetOnWinner={lastWinInfo.userBet}
          totalPayout={lastWinInfo.payout}
        />
      )}

      {showVipSeatModal !== null && (
        <VipSeatModal
          isOpen={showVipSeatModal !== null}
          onClose={() => setShowVipSeatModal(null)}
          seatNumber={showVipSeatModal}
          userBalance={balance}
          isOccupiedByMe={vipSeatOccupied === showVipSeatModal}
          onTakeSeat={(seatNum) => {
            setBalance((b) => b - 500_000);
            setVipSeatOccupied(seatNum);
            setShowVipSeatModal(null);
            sounds.playWinChime();
          }}
        />
      )}
    </div>
  );
}
