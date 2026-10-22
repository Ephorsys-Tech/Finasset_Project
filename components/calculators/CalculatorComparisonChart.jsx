'use client';

import React, { useState, useMemo } from 'react';
import { formatCompactINR, formatINR } from '@/lib/utils';

/**
 * Modern Multi-Bar Comparison Chart Diagram matching reference design
 * @param {string} title - Chart title (e.g. "Lumpsum Comparison")
 * @param {Array<{ label: string, series1: number, series2: number }>} data - Year-on-year data
 * @param {string} series1Name - e.g. "Total Investment"
 * @param {string} series1Color - e.g. "#2376b8"
 * @param {string} series2Name - e.g. "Return Amount"
 * @param {string} series2Color - e.g. "#89b441"
 */
export default function CalculatorComparisonChart({
  title = 'Comparison',
  data = [],
  series1Name = 'Total Investment',
  series1Color = '#2376b8',
  series2Name = 'Return Amount',
  series2Color = '#89b441',
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Compute maximum value for scaling Y-axis
  const maxVal = useMemo(() => {
    let m = 0;
    data.forEach((d) => {
      if (Number(d.series1) > m) m = Number(d.series1);
      if (Number(d.series2) > m) m = Number(d.series2);
    });
    return m > 0 ? m * 1.15 : 10000;
  }, [data]);

  // Generate 4-5 nice round Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks = [];
    const steps = 4;
    for (let i = steps; i >= 0; i--) {
      ticks.push((maxVal / steps) * i);
    }
    return ticks;
  }, [maxVal]);

  const formatTickLabel = (val) => {
    if (val === 0) return '₹0';
    if (val >= 100000) return formatCompactINR(val);
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const svgHeight = 185;
  const svgWidth = 430;
  const paddingLeft = 58;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  const barGroupWidth = data.length > 0 ? chartWidth / data.length : chartWidth;
  const singleBarWidth = Math.min(16, Math.max(6, barGroupWidth * 0.30));

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-full">
      {/* Title with grey badge on the word Comparison */}
      <div className="flex items-center gap-1.5 mb-2">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          {title.replace('Comparison', '').trim()}{' '}
          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs font-semibold">
            Comparison
          </span>
        </h3>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 sm:h-52 drop-shadow-sm min-w-[320px]"
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + (chartHeight * (maxVal - tick)) / maxVal;
            return (
              <g key={'tick-' + i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {formatTickLabel(tick)}
                </text>
              </g>
            );
          })}

          {/* Left Y Axis line */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={paddingTop + chartHeight}
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* X Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Bars */}
          {data.map((item, idx) => {
            const groupCenterX = paddingLeft + (idx + 0.5) * barGroupWidth;

            const val1 = Number(item.series1) || 0;
            const val2 = Number(item.series2) || 0;

            const h1 = Math.max(val1 > 0 ? 3 : 0, (chartHeight * val1) / maxVal);
            const y1 = paddingTop + chartHeight - h1;
            const x1 = groupCenterX - singleBarWidth - 1.5;

            const h2 = Math.max(val2 > 0 ? 3 : 0, (chartHeight * val2) / maxVal);
            const y2 = paddingTop + chartHeight - h2;
            const x2 = groupCenterX + 1.5;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={'bar-group-' + idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hover indicator background column */}
                {isHovered && (
                  <rect
                    x={groupCenterX - barGroupWidth / 2}
                    y={paddingTop}
                    width={barGroupWidth}
                    height={chartHeight}
                    fill="#f1f5f9"
                    rx="4"
                    opacity="0.6"
                  />
                )}

                {/* Bar 1 (Left bar, e.g. Blue Total Investment) */}
                <rect
                  x={x1}
                  y={y1}
                  width={singleBarWidth}
                  height={h1}
                  fill={series1Color}
                  rx="2.5"
                  className="transition-all duration-300"
                />

                {/* Bar 2 (Right bar, e.g. Green Return Amount) */}
                <rect
                  x={x2}
                  y={y2}
                  width={singleBarWidth}
                  height={h2}
                  fill={series2Color}
                  rx="2.5"
                  className="transition-all duration-300"
                />

                {/* X-axis label (Year) */}
                <text
                  x={groupCenterX}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  className={`text-[10px] ${
                    isHovered ? 'fill-[#0f2b44] font-bold' : 'fill-slate-500 font-medium'
                  }`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovering over a year column */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="absolute top-1 right-2 bg-slate-900/95 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-slate-700 pointer-events-none z-20 backdrop-blur-sm animate-in fade-in">
            <div className="font-bold border-b border-slate-700 pb-1 mb-1.5 text-slate-300">
              Year {data[hoveredIdx].label}
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: series1Color }} />
                {series1Name}:
              </span>
              <span className="font-bold">{formatINR(data[hoveredIdx].series1)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-200 mt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: series2Color }} />
                {series2Name}:
              </span>
              <span className="font-bold text-emerald-400">
                {formatINR(data[hoveredIdx].series2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend Below Chart matching Image 1 */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 mt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: series2Color }} />
          <span className="text-slate-700 font-medium text-[11px] sm:text-xs">{series2Name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: series1Color }} />
          <span className="text-slate-700 font-medium text-[11px] sm:text-xs">{series1Name}</span>
        </div>
      </div>
    </div>
  );
}
