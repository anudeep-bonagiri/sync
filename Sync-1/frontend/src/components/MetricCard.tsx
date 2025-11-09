
import React from 'react';
import { TrendingUp, TrendingDown } from './icons';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendLabel?: string;
  isLoading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendLabel, isLoading }) => {
  const trendColor = trend === 'up' ? 'text-[#1DE55A]' : 'text-[#FF1744]';
  
  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <h3 className="text-base font-medium text-gray-500 dark:text-[#B3B3B3]">{title}</h3>
        {icon}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{value}</p>
            {isLoading && (
                 <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-[#2979FF]"></div>
            )}
        </div>
        {trend && trendLabel && (
          <div className={`mt-2 flex items-center gap-1 text-sm ${trendColor}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
