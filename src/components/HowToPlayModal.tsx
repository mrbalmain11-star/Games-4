import React from 'react';
import { X } from 'lucide-react';
import { CarLogoComponent } from './CarLogos';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#212356] via-[#1a1b42] to-[#12132e] rounded-2xl border-2 border-indigo-400/50 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header matching Image 2 & 3 */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 py-2.5 px-4 flex items-center justify-between border-b border-indigo-300/30">
          <div className="w-7" />
          <h2 className="text-lg font-black tracking-wide text-white drop-shadow">
            طريقة اللعب
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-md bg-blue-500/80 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Text Body matching Image 2 & 3 verbatim */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs leading-relaxed text-slate-200 text-right">
          <p className="font-semibold text-slate-100">
            هدف اللعبة هو توقع شعار السيارة الفائزة في الجولة التالية.
          </p>
          <p>
            يمكنك الرهان خلال فترة الرهان في كل جولة من اللعبة.
          </p>
          <p>
            عندما تود الرهان، يرجى أولاً اختيار المبلغ الذي ترغب في الرهان به، ثم اختيار شعار السيارة التي تحبها، وبذلك ستتمكن من الرهان
          </p>
          <p className="text-emerald-300">
            إذا كانت نتيجة السحب تتطابق مع شعار السيارة التي قمت بالرهان عليها، ستحصل على مكافأة مالية بمضاعفة المبلغ الرهان
          </p>
          <p className="text-amber-200">
            عند تحديد خيار التشغيل التلقائي، بمجرد أن تكون لديك النقود الكافية، ستقوم النظام تلقائياً بتكرار الرهان السابق في كل جولة جديدة من اللعبة
          </p>
          <p className="text-purple-200">
            سيتم عرض أصحاب أعلى الأرباح لهذا اليوم في قائمة تصنيف الأرباح اليومية. نأمل أن تكون من بين العشرة الأوائل
          </p>

          {/* Multiplier 2-Column Grid matching Screenshot 2 & 3 exactly */}
          <div className="border border-indigo-400/40 rounded-xl overflow-hidden bg-[#18193d]">
            <div className="divide-y divide-indigo-500/30">
              {/* Row 1: Bugatti x100 (left) | Bentley x88 (right) */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-indigo-500/30 items-center py-2 px-3">
                <div className="flex items-center justify-between px-1">
                  <div className="w-10 h-6 flex items-center">
                    <CarLogoComponent carId="bugatti" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x100</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="w-10 h-6 flex items-center">
                    <CarLogoComponent carId="bentley" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x88</span>
                </div>
              </div>

              {/* Row 2: Ferrari x66 (left) | Lamborghini x50 (right) */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-indigo-500/30 items-center py-2 px-3">
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="ferrari" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x66</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="lamborghini" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x50</span>
                </div>
              </div>

              {/* Row 3: Porsche x30 (left) | Land Rover x20 (right) */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-indigo-500/30 items-center py-2 px-3">
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="porsche" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x30</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="w-10 h-6 flex items-center">
                    <CarLogoComponent carId="landrover" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x20</span>
                </div>
              </div>

              {/* Row 4: Jaguar x18 (left) | Mercedes x8 (right) */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-indigo-500/30 items-center py-2 px-3">
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="jaguar" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x18</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="mercedes" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x8</span>
                </div>
              </div>

              {/* Row 5: BMW x5 (left) | VW x2 (right) */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-indigo-500/30 items-center py-2 px-3">
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="bmw" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x5</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="w-8 h-7 flex items-center">
                    <CarLogoComponent carId="vw" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-amber-300 text-base font-['Outfit']">x2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            ترتيب الأرباح لهذه الجولة
          </div>
        </div>
      </div>
    </div>
  );
};
