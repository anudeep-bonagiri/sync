import React from 'react';
import type { RepairPlan } from '../types';
import type { NetworkAnalysisResult } from '../services/apiClient';
import { DollarSign, Clock, Users, CheckCircle } from './icons';

interface RepairRecommendationsProps {
  plans: RepairPlan[];
  onDeploy: () => void;
  isSimulating: boolean;
  onViewDetails?: () => void;
  canViewDetails?: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
}

const PlanCard: React.FC<{ 
  plan: RepairPlan; 
  onDeploy: () => void; 
  isRecommended?: boolean;
  onViewDetails?: () => void;
  canViewDetails?: boolean;
}> = ({ plan, onDeploy, isRecommended = false, onViewDetails, canViewDetails = false }) => {
  const cardClasses = isRecommended
    ? 'bg-white dark:bg-[#1A1A1A] border-2 border-[#E20074] shadow-2xl shadow-[#E20074]/20'
    : 'bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/10';

  return (
    <div className={`p-5 rounded-xl ${cardClasses} flex flex-col`}>
      {isRecommended && (
        <div className="flex items-center gap-2 mb-3 text-[#1DE55A] font-semibold">
          <CheckCircle className="w-5 h-5" />
          <span>Recommended Plan</span>
        </div>
      )}
      <h3 className={`font-bold text-lg ${isRecommended ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-[#F7F7F7]'}`}>{plan.name}</h3>
      
      <div className="my-4 space-y-3 text-sm">
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-500 dark:text-[#B3B3B3]"><DollarSign className="w-4 h-4"/> Est. Cost</span>
            <span className="font-semibold text-green-500 dark:text-green-400">{formatCurrency(plan.cost)}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-500 dark:text-[#B3B3B3]"><Clock className="w-4 h-4"/> Exp. Downtime</span>
            <span className="font-semibold text-yellow-500 dark:text-yellow-400">{plan.downtime} min</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-500 dark:text-[#B3B3B3]"><Users className="w-4 h-4"/> Affected Customers</span>
            <span className="font-semibold text-orange-500 dark:text-orange-400">{formatNumber(plan.affectedCustomers)}</span>
        </div>
      </div>
      
      {isRecommended && (
        <div className="mt-auto pt-4">
          <button 
            onClick={onDeploy}
            className="w-full bg-[#E20074] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#C60062] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1A1A1A] focus:ring-[#E20074]"
          >
            Deploy Plan
          </button>
          {canViewDetails && onViewDetails && (
            <button 
              onClick={onViewDetails}
              className="w-full text-center mt-2 text-sm text-gray-500 dark:text-[#B3B3B3] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};


export const RepairRecommendations: React.FC<RepairRecommendationsProps> = ({ 
  plans, 
  onDeploy, 
  isSimulating, 
  onViewDetails, 
  canViewDetails = false 
}) => {
  const recommendedPlan = plans.find(p => p.isRecommended);
  const alternativePlans = plans.filter(p => !p.isRecommended);

  if (isSimulating && plans.length === 0) {
    return (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#E20074]"></div>
            <p className="mt-4 text-gray-600 dark:text-[#B3B3B3]">Generating repair recommendations...</p>
        </div>
    )
  }

  if (plans.length === 0) {
      return (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center h-full min-h-[300px]">
            <CheckCircle className="w-10 h-10 text-[#00C853] mb-4"/>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Active Simulations</h3>
            <p className="mt-2 text-gray-600 dark:text-[#B3B3B3]">Repair plans will appear here during a network event.</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      {recommendedPlan && (
        <PlanCard 
          plan={recommendedPlan} 
          onDeploy={onDeploy} 
          isRecommended 
          onViewDetails={onViewDetails}
          canViewDetails={canViewDetails}
        />
      )}
      
      {alternativePlans.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Alternative Plans</h3>
          <div className="space-y-4">
            {alternativePlans.map(plan => <PlanCard key={plan.id} plan={plan} onDeploy={onDeploy} />)}
          </div>
        </div>
      )}
    </div>
  );
};