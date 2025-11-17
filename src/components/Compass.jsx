import React from "react";

export default function Compass({ heading = 0 }) {
  return (
    <div className="relative w-32 h-32 rounded-full border border-slate-700 bg-slate-800/70 flex items-center justify-center">
      <div className="absolute top-1 text-xs text-slate-400">N</div>
      <div className="absolute bottom-1 text-xs text-slate-400">S</div>
      <div className="absolute left-1 text-xs text-slate-400">W</div>
      <div className="absolute right-1 text-xs text-slate-400">E</div>
      <div
        className="w-1 h-12 bg-rose-500 origin-bottom rounded"
        style={{ transform: `rotate(${heading}deg) translateY(-8px)` }}
      />
      <div className="absolute bottom-1/2 translate-y-5 text-xs text-slate-300">
        {Math.round(heading)}°
      </div>
    </div>
  );
}
