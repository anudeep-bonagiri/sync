// Fix: Create full content for HistoricalPerformanceChart.tsx to provide the chart component.
import React, { useState, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CustomerTrendData, TimeRange } from '../types';

interface HistoricalPerformanceChartProps {
  data: CustomerTrendData;
  theme: string;
}

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '1m', label: '1M' },
  { id: '1y', label: '1Y' },
];

const HistoricalPerformanceChartComponent: React.FC<HistoricalPerformanceChartProps> = ({ data, theme }) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('1y');

  const currentData = data[activeRange];
  const isDark = theme === 'dark';

  const textColor = isDark ? '#9A9A9A' : '#6B7281';
  const labelColor = isDark ? '#B3B3B3' : '#374151';
  const gridColor = isDark ? '#333' : '#E5E7EB';
  const tooltipBg = isDark ? '#111' : '#FFF';
  const tooltipBorder = isDark ? '#333' : '#E5E7EB';

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Loyalty vs. Churn</h2>
        <div className="bg-gray-100 dark:bg-[#111111] p-1 rounded-lg flex items-center gap-1 mt-3 sm:mt-0">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                activeRange === range.id
                  ? 'bg-[#E20074] text-white'
                  : 'text-gray-600 dark:text-[#9A9A9A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={currentData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={textColor} dy={10} />
            <YAxis yAxisId="left" label={{ value: 'Customers Leaving', angle: -90, position: 'insideLeft', fill: labelColor, dx: -10 }} stroke={textColor} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'New & Loyal Customers', angle: -90, position: 'insideRight', fill: labelColor, dx: 10 }} stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '0.5rem'
              }}
              labelStyle={{ color: isDark ? '#fff' : '#374151' }}
            />
            <Legend wrapperStyle={{ bottom: 0, color: labelColor }} />
            <Line yAxisId="left" type="monotone" dataKey="leaving" stroke="#FF6D00" strokeWidth={2} activeDot={{ r: 8 }} name="Customers Leaving" />
            <Line yAxisId="right" type="monotone" dataKey="loyalty" stroke="#1DE55A" strokeWidth={2} activeDot={{ r: 8 }} name="New & Loyal Customers" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const HistoricalPerformanceChart = memo(HistoricalPerformanceChartComponent);