import React from "react";

export default function SolarDial({ target = 0, panel = 0, lux = 0 }) {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-300 text-xs uppercase">Solar tracking</div>
        <div className="text-slate-400 text-xs">{Math.round(lux).toLocaleString()} lux</div>
      </div>
      <div className="relative w-full flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border border-slate-700 flex items-center justify-center">
          <div className="w-1 h-16 bg-yellow-400 origin-bottom" style={{ transform: `rotate(${target}deg)` }} />
          <div className="w-1 h-16 bg-cyan-400 origin-bottom absolute" style={{ transform: `rotate(${panel}deg)` }} />
        </div>
      </div>
      <div className="text-center mt-2 text-slate-400 text-xs">Yellow = sun • Cyan = panel</div>
    </div>
  );
}
