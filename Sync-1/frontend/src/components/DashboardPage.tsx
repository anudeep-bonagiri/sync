import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MetricCard } from './MetricCard';
import { AISimulation } from './AISimulation';
import { RepairRecommendations } from './RepairRecommendations';
import { HistoricalPerformanceChart } from './HistoricalPerformanceChart';
import { ChurnLoyaltyBarChart } from './ChurnLoyaltyBarChart';
import { Toast } from './Toast';
import { MainTabs, Tab } from './MainTabs';
import { LiveCustomerVoice } from './LiveCustomerVoice';
import { NetworkMap } from './NetworkMap';
import { AnalysisDetailsModal } from './AnalysisDetailsModal';
import { useMockData } from '../hooks/useMockData';
import { AlertTriangle, Cpu, DollarSign, Clock } from './icons';

export default function DashboardPage() {
  const {
    lastUpdated,
    metrics,
    customerIssues,
    networkRegions,
    activeRegion,
    setActiveRegion,
    simulation,
    repairPlans,
    customerTrendData,
    toast,
    deployPlan,
    closeToast,
    triggerNetworkAnalysis,
    latestNetworkAnalysis,
  } = useMockData();
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const canViewDetails = !simulation.isActive && simulation.progress === 100 && latestNetworkAnalysis;

  return (
    <div className="bg-gray-50 dark:bg-[#0A0A0A] min-h-screen text-gray-800 dark:text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Header lastUpdated={lastUpdated} theme={theme} toggleTheme={toggleTheme} />

        <main className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Active Issues" 
              value={metrics.activeIssues.toString()} 
              icon={<AlertTriangle className="w-8 h-8 text-[#FF6D00]" />}
              trend={metrics.activeIssues > 2 ? 'up' : 'down'}
              trendLabel={metrics.activeIssues > 2 ? "Anomaly detected" : "Nominal levels"}
            />
            <MetricCard 
              title="AI Agents Running" 
              value={metrics.aiAgentsRunning.toString()} 
              icon={<Cpu className="w-8 h-8 text-[#2979FF]" />}
              isLoading={simulation.isActive}
            />
            <MetricCard 
              title="Potential Cost Savings" 
              value={`$${metrics.costSavings}k`} 
              icon={<DollarSign className="w-8 h-8 text-[#00C853]" />}
              trend="up"
              trendLabel="vs. manual intervention"
            />
            <MetricCard 
              title="Avg. Resolution Time" 
              value={`${metrics.avgResolutionTime}h`} 
              icon={<Clock className="w-8 h-8 text-[#E20074]" />}
              trend="down"
              trendLabel="vs. 8.5h average"
            />
          </div>

          <div className="mt-8">
            <MainTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <LiveCustomerVoice issues={customerIssues} />
                  </div>
                  <div className="lg:col-span-1">
                    <ChurnLoyaltyBarChart data={customerTrendData} theme={theme} />
                  </div>
                </div>
                <NetworkMap embedded regions={networkRegions} />
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AISimulation 
                    simulation={simulation} 
                    onTriggerAnalysis={triggerNetworkAnalysis} 
                    isActive={simulation.isActive}
                  />
                </div>
                <div className="lg:col-span-1">
                  <RepairRecommendations 
                    plans={repairPlans} 
                    onDeploy={deployPlan} 
                    isSimulating={simulation.isActive}
                    onViewDetails={() => setIsDetailsModalOpen(true)}
                    canViewDetails={canViewDetails}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
               <div className="flex flex-col gap-6">
                <LiveCustomerVoice issues={customerIssues} />
                <HistoricalPerformanceChart data={customerTrendData} theme={theme} />
              </div>
            )}
          </div>
        </main>
      </div>
      <Toast 
        message={toast.message} 
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      <AnalysisDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        networkAnalysis={latestNetworkAnalysis || undefined}
        analysisTimestamp={latestNetworkAnalysis?.timestamp}
      />
    </div>
  );
}

