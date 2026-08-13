"use client";

import { useMemo } from "react";

interface SpeedChartProps {
  width?: number;
  height?: number;
  data: number[];
  label?: string;
}

export function SpeedChart({ width = 320, height = 100, data, label = "Speed (Mbps)" }: SpeedChartProps) {
  const path = useMemo(() => {
    if (data.length === 0) return "";
    const padding = 20;
    const usableWidth = width - 2 * padding;
    const usableHeight = height - 2 * padding;
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;
    const xStep = usableWidth / (data.length - 1 || 1);

    const points = data.map((val, idx) => {
      const x = padding + idx * xStep;
      const y = padding + usableHeight - ((val - minVal) / range) * usableHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  }, [data, width, height]);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#f5f5f5]">Bandwidth Monitor</h3>
          <span className="text-xs text-[#7f8c99]">Unavailable</span>
        </div>
        <div className="h-[100px] flex items-center justify-center text-xs text-[#7f8c99]">
          No traffic data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[#f5f5f5]">Bandwidth Monitor</h3>
          <span className="text-xs text-[#7f8c99]">
            Data available
        </span>
      </div>
      <div className="relative w-full h-[100px]">
        <svg className="absolute inset-0" width={width} height={height}>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "#2aabee", stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: "#2aabee", stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="2"
            points={path}
            className="transition-all duration-500 ease-in-out"
          />
          {data.map((val, idx) => {
            const padding = 20;
            const usableWidth = width - 2 * padding;
            const usableHeight = height - 2 * padding;
            const maxVal = Math.max(...data);
            const minVal = Math.min(...data);
            const range = maxVal - minVal || 1;
            const xStep = usableWidth / (data.length - 1 || 1);
            const x = padding + idx * xStep;
            const y = padding + usableHeight - ((val - minVal) / range) * usableHeight;
            return <circle key={idx} cx={x} cy={y} r="3" fill="#2aabee" />;
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-[#7f8c99]">
          {label}
        </div>
      </div>
    </div>
  );
}
