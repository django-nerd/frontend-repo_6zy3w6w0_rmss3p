import React from "react";

// Simple sparkline/line chart using SVG, with responsive width
export default function Chart({ data = [], color = "#22c55e", height = 80, minY, maxY, label }) {
  const padding = 6;
  const w = 300; // viewBox width
  const h = height; // viewBox height

  const values = data.map((d) => (typeof d === "number" ? d : Number(d) || 0));
  const yMin = minY ?? Math.min(...values, 0);
  const yMax = maxY ?? Math.max(...values, 1);

  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * (w - padding * 2) + padding;
    const y = h - padding - ((v - yMin) / Math.max(yMax - yMin, 1)) * (h - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="text-slate-300 text-xs uppercase">{label}</div>
        <div className="text-slate-400 text-xs">{values.length} pts</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={`M${padding},${h - padding} L${points.join(" ")} L${w - padding},${h - padding} Z`}
          fill="url(#grad)"
          stroke="none"
        />
        {/* Line */}
        <polyline fill="none" stroke={color} strokeWidth="2" points={points.join(" ")} />
      </svg>
    </div>
  );
}
