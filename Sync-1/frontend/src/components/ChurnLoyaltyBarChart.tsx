import React, { useState, memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CustomerTrendData, TimeRange } from '../types';
import { ChurnInsightsModal } from './ChurnInsightsModal';

interface ChurnLoyaltyBarChartProps {
  data: CustomerTrendData;
  theme: string;
}

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '1m', label: '1M' },
  { id: '1y', label: '1Y' },
];

interface BarData {
  name: string;
  churn: number;
  loyalty: number;
  category: string;
}

const ChurnLoyaltyBarChartComponent: React.FC<ChurnLoyaltyBarChartProps> = ({ data, theme }) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('1y');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRangeContext, setTimeRangeContext] = useState<TimeRange | null>(null);

  const isDark = theme === 'dark';

  const textColor = isDark ? '#9A9A9A' : '#6B7281';
  const labelColor = isDark ? '#B3B3B3' : '#374151';
  const gridColor = isDark ? '#333' : '#E5E7EB';
  const tooltipBg = isDark ? '#111' : '#FFF';
  const tooltipBorder = isDark ? '#333' : '#E5E7EB';

  // Aggregate data for bar charts - create 2 separate charts
  const churnData = useMemo<BarData[]>(() => {
    const currentData = data[activeRange];
    const totalChurn = currentData.reduce((sum, point) => sum + point.leaving, 0);
    
    return [
      {
        name: 'Customers Leaving',
        churn: totalChurn,
        loyalty: 0,
        category: 'Churn',
      },
      {
        name: 'Competitor Loss',
        churn: Math.round(totalChurn * 0.68),
        loyalty: 0,
        category: 'Competitor Loss',
      },
    ];
  }, [data, activeRange]);

  const loyaltyData = useMemo<BarData[]>(() => {
    const currentData = data[activeRange];
    const totalLoyalty = currentData.reduce((sum, point) => sum + point.loyalty, 0);
    
    return [
      {
        name: 'New & Loyal',
        churn: 0,
        loyalty: totalLoyalty,
        category: 'Customer Loyalty',
      },
      {
        name: 'T-Mobile Gains',
        churn: 0,
        loyalty: Math.round(totalLoyalty * 0.72),
        category: 'T-Mobile Gains',
      },
    ];
  }, [data, activeRange]);

  const handleChartClick = (data: any, chartType: 'churn' | 'loyalty') => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload;
      const clickedBar = chartType === 'churn' 
        ? churnData.find(item => item.name === payload.name)
        : loyaltyData.find(item => item.name === payload.name);
      if (clickedBar?.category) {
        setSelectedCategory(clickedBar.category);
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setTimeRangeContext(null);
  };

  // Colors matching the design system
  const churnColor = '#FF6D00';
  const loyaltyColor = '#1DE55A';

  return (
    <>
      <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Churn & Customer Loyalty</h2>
            <p className="text-sm text-gray-500 dark:text-[#9A9A9A]">Customer retention metrics overview</p>
          </div>
          <div className="bg-gray-100 dark:bg-[#111111] p-1 rounded-lg flex items-center gap-1 mt-4 sm:mt-0">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRange(range.id);
                  // Open modal with time-range specific insights
                  setTimeRangeContext(range.id);
                  setSelectedCategory('Churn & Loyalty');
                  setIsModalOpen(true);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                  activeRange === range.id
                    ? 'bg-[#E20074] text-white shadow-sm'
                    : 'text-gray-600 dark:text-[#9A9A9A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] hover:text-gray-800 dark:hover:text-white'
                }`}
                title={`Click to view insights for ${range.label}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Churn Chart */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[#B3B3B3] mb-4 text-center">Customer Churn</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={churnData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 40,
                  }}
                  barCategoryGap="20%"
                  onClick={(data) => handleChartClick(data, 'churn')}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor}
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={textColor} 
                    dy={10}
                    tick={{ fill: labelColor, fontSize: 11, fontWeight: 500 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    stroke={textColor}
                    tick={{ fill: textColor, fontSize: 11 }}
                    width={50}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '0.5rem',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ 
                      color: isDark ? '#fff' : '#374151',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar
                    dataKey="churn"
                    fill={churnColor}
                    cursor="pointer"
                    radius={[6, 6, 0, 0]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(255, 109, 0, 0.2))',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Loyalty Chart */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[#B3B3B3] mb-4 text-center">Customer Loyalty</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={loyaltyData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 40,
                  }}
                  barCategoryGap="20%"
                  onClick={(data) => handleChartClick(data, 'loyalty')}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor}
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={textColor} 
                    dy={10}
                    tick={{ fill: labelColor, fontSize: 11, fontWeight: 500 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    stroke={textColor}
                    tick={{ fill: textColor, fontSize: 11 }}
                    width={50}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '0.5rem',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ 
                      color: isDark ? '#fff' : '#374151',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar
                    dataKey="loyalty"
                    fill={loyaltyColor}
                    cursor="pointer"
                    radius={[6, 6, 0, 0]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(29, 229, 90, 0.2))',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#9A9A9A] mt-4 text-center italic">
          Click on any bar or time range to view detailed AI-powered insights
        </p>
      </div>

      <ChurnInsightsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory || ''}
        timeRange={timeRangeContext || undefined}
      />
    </>
  );
};

export const ChurnLoyaltyBarChart = memo(ChurnLoyaltyBarChartComponent);

