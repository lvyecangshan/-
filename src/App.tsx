/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, RotateCcw, Sparkles, Heart } from 'lucide-react';

// --- Types ---
type DigitPosition = 0 | 1 | 2 | 3 | 4; // 0 is ones, 4 is ten-thousands

// --- Constants ---
const POSITIONS: { pos: DigitPosition; label: string; color: string }[] = [
  { pos: 4, label: '万位', color: 'bg-rose-400' },
  { pos: 3, label: '千位', color: 'bg-pink-400' },
  { pos: 2, label: '百位', color: 'bg-fuchsia-400' },
  { pos: 1, label: '十位', color: 'bg-purple-400' },
  { pos: 0, label: '个位', color: 'bg-rose-500' },
];

// --- Components ---

interface BeadProps {
  active: boolean;
  color: string;
  onClick: () => void;
  key?: React.Key;
}

const Bead = ({ 
  active, 
  color, 
  onClick 
}: BeadProps) => {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        y: active ? -20 : 0,
        scale: active ? 1.1 : 1,
        filter: active ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'brightness(1)',
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-12 h-8 rounded-full cursor-pointer border-2 border-white/30 ${color} relative flex items-center justify-center shadow-inner`}
    >
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-3 h-3 text-white" />
        </motion.div>
      )}
      <div className="w-full h-1 bg-white/20 absolute top-1/2 -translate-y-1/2" />
    </motion.div>
  );
};

interface DigitColumnProps {
  value: number;
  label: string;
  color: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetValue: (val: number) => void;
  key?: React.Key;
}

const DigitColumn = ({ 
  value, 
  label, 
  color, 
  onIncrement, 
  onDecrement,
  onSetValue
}: DigitColumnProps) => {
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-6 bg-white/40 rounded-3xl backdrop-blur-sm border border-white/60 shadow-xl">
      <span className="text-rose-600 font-bold text-lg mb-2">{label}</span>
      
      <button
        onClick={onIncrement}
        className="p-2 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 transition-colors shadow-sm"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="relative h-[360px] w-16 flex flex-col-reverse items-center gap-1 py-4 bg-rose-50/50 rounded-2xl border border-rose-100">
        {/* The wire */}
        <div className="absolute inset-y-0 w-1 bg-rose-200 left-1/2 -translate-x-1/2 rounded-full" />
        
        {Array.from({ length: 9 }).map((_, i) => (
          <Bead 
            key={i} 
            active={i < value} 
            color={color} 
            onClick={() => onSetValue(i + 1 === value ? i : i + 1)}
          />
        ))}
      </div>

      <button
        onClick={onDecrement}
        className="p-2 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 transition-colors shadow-sm"
      >
        <Minus className="w-6 h-6" />
      </button>

      <motion.div 
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl font-black text-rose-700 mt-2 bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-inner border border-rose-100"
      >
        {value}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0, 0]); // [ones, tens, hundreds, thousands, ten-thousands]

  const updateValue = useCallback((newVal: number) => {
    // Clamp between 0 and 99999
    const clamped = Math.max(0, Math.min(99999, newVal));
    const newDigits = clamped.toString().padStart(5, '0').split('').reverse().map(Number);
    setDigits(newDigits);
  }, []);

  const getCurrentValue = () => {
    return digits.reduce((acc, digit, idx) => acc + digit * Math.pow(10, idx), 0);
  };

  const handleIncrement = (pos: DigitPosition) => {
    const currentVal = getCurrentValue();
    const increment = Math.pow(10, pos);
    updateValue(currentVal + increment);
  };

  const handleDecrement = (pos: DigitPosition) => {
    const currentVal = getCurrentValue();
    const decrement = Math.pow(10, pos);
    updateValue(currentVal - decrement);
  };

  const handleSetDigit = (pos: DigitPosition, val: number) => {
    const newDigits = [...digits];
    newDigits[pos] = val;
    const newVal = newDigits.reduce((acc, digit, idx) => acc + digit * Math.pow(10, idx), 0);
    updateValue(newVal);
  };

  const reset = () => updateValue(0);

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-4 font-sans selection:bg-rose-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-10 left-10 text-rose-200 opacity-50"
        >
          <Heart size={120} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-10 right-10 text-rose-200 opacity-50"
        >
          <Heart size={160} fill="currentColor" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-black text-rose-600 mb-4 tracking-tight flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <Heart className="fill-rose-500 text-rose-500" />
            小仙女数字计数器
            <Heart className="fill-rose-500 text-rose-500" />
          </motion.h1>
          <p className="text-rose-400 text-lg font-medium">拨动珠子，发现数字的奥秘吧！✨</p>
        </div>

        {/* Main Counter Board */}
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border-4 border-white flex flex-col gap-8">
          
          {/* Total Display */}
          <div className="flex justify-center">
            <div className="bg-rose-500 px-12 py-6 rounded-3xl shadow-lg border-b-8 border-rose-700 flex items-center gap-4">
              <span className="text-rose-100 text-xl font-bold uppercase tracking-widest">当前数字</span>
              <div className="flex gap-2">
                {digits.slice().reverse().map((d, i) => (
                  <motion.span 
                    key={`${i}-${d}`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl font-black text-white drop-shadow-md"
                  >
                    {d}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Abacus Columns */}
          <div className="grid grid-cols-5 gap-4 md:gap-8">
            {POSITIONS.map(({ pos, label, color }) => (
              <DigitColumn
                key={pos}
                value={digits[pos]}
                label={label}
                color={color}
                onIncrement={() => handleIncrement(pos)}
                onDecrement={() => handleDecrement(pos)}
                onSetValue={(val) => handleSetDigit(pos, val)}
              />
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="flex justify-center gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="flex items-center gap-2 px-8 py-4 bg-white text-rose-500 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all border-2 border-rose-100"
            >
              <RotateCcw className="w-5 h-5" />
              重新开始
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateValue(Math.floor(Math.random() * 100000))}
              className="flex items-center gap-2 px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all border-b-4 border-rose-700"
            >
              <Sparkles className="w-5 h-5" />
              随机数字
            </motion.button>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '满十进一', desc: '当个位满10个珠子时，就要给十位加1个珠子哦！' },
            { title: '数位顺序', desc: '从右往左分别是：个、十、百、千、万。' },
            { title: '快乐学习', desc: '每一个大数字都是由这些小珠子组成的。' }
          ].map((tip, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-2xl border border-rose-100 shadow-sm"
            >
              <h3 className="text-rose-600 font-bold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                {tip.title}
              </h3>
              <p className="text-rose-400 text-sm leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-rose-300 text-sm font-medium">
        用爱心和智慧点亮数学之路 ❤️
      </footer>
    </div>
  );
}
