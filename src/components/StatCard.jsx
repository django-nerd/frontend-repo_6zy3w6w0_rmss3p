import React from "react";

export default function StatCard({ title, value, unit, subtitle, children }) {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 shadow hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-300 text-xs uppercase tracking-wide">{title}</div>
          <div className="text-2xl font-semibold text-white">
            {value}
            {unit ? <span className="text-slate-400 text-sm ml-1">{unit}</span> : null}
          </div>
        </div>
        {children ? <div className="ml-4">{children}</div> : null}
      </div>
      {subtitle ? <div className="text-slate-400 text-xs mt-2">{subtitle}</div> : null}
    </div>
  );
}
