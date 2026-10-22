'use client';

import React, { useMemo, useState } from 'react';
import { formatINR } from '@/lib/utils';

/**
 * Modern SVG Donut / Pie Chart matching reference design (Image 1)
 * Features:
 * - Symmetrical centering of the primary slice at the top (12 o'clock)
 * - Razor-sharp white radial slit dividers between slices
 * - Clean white inner hole without layout-shifting text
 * - Floating tooltip on hover
 * - Bottom legend with square color markers and clean typography
 */
export default function CalculatorPieChart({ title = 'Breakup - Pie Chart', data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const validData = useMemo(() => {
    return data.filter((d) => Number(d.value) > 0);
  }, [data]);

  const total = useMemo(() => {
    return validData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
  }, [validData]);

  // Compute SVG arc paths & white radial divider lines
  const { slices, dividers } = useMemo(() => {
    if (total === 0 || validData.length === 0) {
      return { slices: [], dividers: [] };
    }

    const cx = 120;
    const cy = 120;
    const outerR = 86;
    const innerR = 50;

    // Symmetrical alignment: if 2 slices, center the first slice at 12 o'clock (-PI / 2)
    let startAngle = -Math.PI / 2;
    if (validData.length === 2) {
      const firstFraction = Number(validData[0].value) / total;
      const firstAngle = firstFraction * 2 * Math.PI;
      startAngle = -Math.PI / 2 - firstAngle / 2;
    }

    let currentAngle = startAngle;
    const divList = [];

    const sliceList = validData.map((item, idx) => {
      const value = Number(item.value);
      const fraction = value / total;
      const angle = fraction * 2 * Math.PI;

      const a1 = currentAngle;
      const a2 = currentAngle + angle;
      currentAngle = a2;

      // Radial divider seam between this slice and the next/previous one
      divList.push({
        x1: cx + (innerR - 1) * Math.cos(a1),
        y1: cy + (innerR - 1) * Math.sin(a1),
        x2: cx + (outerR + 1) * Math.cos(a1),
        y2: cy + (outerR + 1) * Math.sin(a1),
      });

      // 100% full circle case
      if (fraction >= 0.999) {
        return {
          ...item,
          path: `
            M ${cx} ${cy - outerR}
            A ${outerR} ${outerR} 0 1 1 ${cx} ${cy + outerR}
            A ${outerR} ${outerR} 0 1 1 ${cx} ${cy - outerR}
            M ${cx} ${cy - innerR}
            A ${innerR} ${innerR} 0 1 0 ${cx} ${cy + innerR}
            A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR}
            Z
          `,
          percentage: 100,
        };
      }

      const x1 = cx + outerR * Math.cos(a1);
      const y1 = cy + outerR * Math.sin(a1);
      const x2 = cx + outerR * Math.cos(a2);
      const y2 = cy + outerR * Math.sin(a2);

      const x3 = cx + innerR * Math.cos(a2);
      const y3 = cy + innerR * Math.sin(a2);
      const x4 = cx + innerR * Math.cos(a1);
      const y4 = cy + innerR * Math.sin(a1);

      const largeArc = angle > Math.PI ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      return {
        ...item,
        path: pathData,
        percentage: Math.round(fraction * 100),
      };
    });

    return { slices: sliceList, dividers: divList };
  }, [validData, total]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-full">
      {/* Chart Title */}
      <div className="text-center mb-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
      </div>

      {/* SVG Donut Container */}
      <div className="relative flex items-center justify-center my-auto py-2">
        <svg
          viewBox="0 0 240 240"
          className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-xs select-none"
        >
          {slices.length === 0 ? (
            <circle cx="120" cy="120" r="68" fill="none" stroke="#e2e8f0" strokeWidth="36" />
          ) : (
            <>
              {/* Donut Slices */}
              {slices.map((slice, idx) => {
                const isHovered = hoveredIndex === idx;
                const isFaded = hoveredIndex !== null && !isHovered;

                return (
                  <path
                    key={slice.label + idx}
                    d={slice.path}
                    fill={slice.color}
                    className="cursor-pointer transition-opacity duration-200"
                    style={{
                      opacity: isFaded ? 0.45 : 1,
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}

              {/* Crisp white radial slit dividers between slices matching Image 1 */}
              {slices.length > 1 &&
                dividers.map((d, i) => (
                  <line
                    key={'divider-' + i}
                    x1={d.x1}
                    y1={d.y1}
                    x2={d.x2}
                    y2={d.y2}
                    stroke="#ffffff"
                    strokeWidth="4.5"
                    strokeLinecap="butt"
                    className="pointer-events-none"
                  />
                ))}
            </>
          )}

          {/* Clean White Center Cutout Hole */}
          <circle cx="120" cy="120" r="49.5" fill="#ffffff" className="pointer-events-none" />
        </svg>

        {/* Floating Tooltip When Hovered */}
        {hoveredIndex !== null && slices[hoveredIndex] && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 pointer-events-none z-10 text-center backdrop-blur-xs animate-in fade-in duration-150">
            <div className="font-semibold text-slate-300 text-[10px]">
              {slices[hoveredIndex].label}
            </div>
            <div className="font-bold text-white text-xs mt-0.5">
              {formatINR(slices[hoveredIndex].value)}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              {slices[hoveredIndex].percentage}% of total
            </div>
          </div>
        )}
      </div>

      {/* Legend Below Chart matching Image 1 */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 mt-1 border-t border-slate-100 text-xs">
        {validData.map((item, idx) => {
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          return (
            <div
              key={item.label + idx}
              className={`flex items-center gap-2 transition-opacity cursor-pointer ${
                isFaded ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="w-3 h-3 rounded-[2px] shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 font-medium text-[11px] sm:text-xs">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
