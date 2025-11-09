// Fix: Create full content for the useMockData hook to provide application state and logic.
import { useState, useEffect, useCallback } from 'react';
import { syncAPI, type NetworkAnalysisResult } from '../services/apiClient';
import type {
  Metrics,
  CustomerIssue,
  NetworkRegion,
  Simulation,
  RepairPlan,
  CustomerTrendData,
  ToastState,
  CustomerTrendDataPoint,
  RegionStatus
} from '../types';

// --- Mock Data Generation ---

// Seeded random number generator for consistent but varied numbers
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// Generate random numbers in hundreds of thousands (100,000 - 999,999)
// Each issue gets a unique seed based on its ID to ensure consistency
const generateRandomMentions = (id: number, baseRange: [number, number] = [150000, 850000]): number => {
  const random = seededRandom(id * 12345 + 67890);
  const range = baseRange[1] - baseRange[0];
  const baseValue = baseRange[0] + random() * range;
  
  // Add some variation to make it look more organic (vary last few digits)
  const variation = Math.round((random() - 0.5) * 25000);
  const finalValue = Math.round(baseValue + variation);
  
  // Ensure it stays in hundreds of thousands range
  return Math.max(120000, Math.min(950000, finalValue));
};

const generateInitialData = () => {
  const initialMetrics: Metrics = {
    activeIssues: 0,
    aiAgentsRunning: 0,
    costSavings: 14.2,
    avgResolutionTime: 4.1,
  };

  // Generate random mentions for pain points (higher range for top issues)
  const painPoint1Mentions = generateRandomMentions(1, [380000, 720000]);
  const painPoint2Mentions = generateRandomMentions(2, [280000, 620000]);
  const painPoint3Mentions = generateRandomMentions(3, [180000, 480000]);
  
  // Generate random mentions for delights (higher range for top issues)
  const delight1Mentions = generateRandomMentions(4, [420000, 780000]);
  const delight2Mentions = generateRandomMentions(5, [320000, 680000]);
  const delight3Mentions = generateRandomMentions(6, [240000, 580000]);

  const initialCustomerIssues: CustomerIssue[] = [
    { id: 1, type: 'negative', description: 'Network Outages', mentions: painPoint1Mentions, sentiment: 85, trend: 'up', summary: 'Even short disruptions impact customer trust and retention. Users expect zero downtime.' },
    { id: 2, type: 'negative', description: 'Customer Sentiment Drops', mentions: painPoint2Mentions, sentiment: 78, trend: 'up', summary: 'Negative reviews spike quickly after performance issues, hurting brand reputation and loyalty.' },
    { id: 3, type: 'negative', description: 'Reactive Maintenance', mentions: painPoint3Mentions, sentiment: 72, trend: 'up', summary: 'Engineers respond after problems occur, wasting time and resources without predictive insight.' },
    { id: 4, type: 'positive', description: 'Predictive Reliability', mentions: delight1Mentions, sentiment: 0, trend: 'up', summary: 'Early detection and simulation prevent outages before they affect customers.' },
    { id: 5, type: 'positive', description: 'Operational Efficiency', mentions: delight2Mentions, sentiment: 0, trend: 'up', summary: 'Automated repair recommendations reduce manual troubleshooting and labor costs.' },
    { id: 6, type: 'positive', description: 'Customer Retention', mentions: delight3Mentions, sentiment: 0, trend: 'up', summary: 'Continuous uptime and quick recovery drive stronger loyalty and higher conversions.' },
  ];

  const initialNetworkRegions: NetworkRegion[] = [
    // United States - East Coast (reduced for cleaner map)
    { id: 'us-east-1', name: 'Washington DC / N. Virginia', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'us-east-2', name: 'New York City', status: 'warning', details: 'Elevated latency detected during peak hours. Network optimization in progress.' },
    { id: 'us-east-5', name: 'Atlanta', status: 'critical', details: 'High packet loss and increased latency detected. Investigating network infrastructure issues.' },
    { id: 'us-east-6', name: 'Miami', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'us-east-8', name: 'Austin', status: 'warning', details: 'Minor network congestion detected. Monitoring traffic patterns.' },
    { id: 'us-east-10', name: 'Dallas', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    
    // United States - Midwest (reduced)
    { id: 'us-midwest-1', name: 'Chicago', status: 'warning', details: 'Elevated latency detected. Investigating network congestion during peak traffic.' },
    { id: 'us-midwest-5', name: 'Detroit', status: 'critical', details: 'Network infrastructure issues detected. High error rates and packet loss. Emergency response team dispatched.' },
    { id: 'us-midwest-3', name: 'Minneapolis', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    
    // United States - West Coast (reduced)
    { id: 'us-west-1', name: 'San Francisco / N. California', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'us-west-3', name: 'Los Angeles', status: 'warning', details: 'Network congestion during peak hours. Traffic shaping enabled.' },
    { id: 'us-west-4', name: 'Seattle', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'us-west-7', name: 'Phoenix', status: 'critical', details: 'Severe network degradation detected. Multiple tower outages reported. Emergency restoration in progress.' },
    { id: 'us-west-8', name: 'Denver', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    
    // Canada - Major Cities (reduced)
    { id: 'ca-east-1', name: 'Toronto', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'ca-east-2', name: 'Montreal', status: 'warning', details: 'Minor network congestion during peak hours. Monitoring traffic patterns.' },
    { id: 'ca-west-1', name: 'Vancouver', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'ca-west-2', name: 'Calgary', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    
    // Mexico - Major Cities (reduced)
    { id: 'mx-central-1', name: 'Mexico City', status: 'critical', details: 'High network congestion and increased error rates. Infrastructure upgrade in progress.' },
    { id: 'mx-central-2', name: 'Guadalajara', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'mx-north-1', name: 'Monterrey', status: 'warning', details: 'Minor packet loss detected. Primary systems operational.' },
    { id: 'mx-north-2', name: 'Tijuana', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
    { id: 'mx-south-1', name: 'Cancun', status: 'healthy', details: 'All systems operational. Latency and error rates are nominal.' },
  ];

  return { initialMetrics, initialCustomerIssues, initialNetworkRegions };
};

const generateCustomerTrendData = (): CustomerTrendData => {
    const generateData = (points: number, daysAgo: number) => {
        const data: CustomerTrendDataPoint[] = [];
        for (let i = 0; i < points; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (daysAgo / points) * (points - 1 - i));
            data.push({
                date: i % 7 === 0 ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
                leaving: Math.max(100, Math.floor(Math.random() * 200 + (Math.cos(i / (points/12)) * 100) + 300)),
                loyalty: Math.max(200, Math.floor(Math.random() * 150 + (Math.sin(i / (points/10)) * 120) + 450)),
            });
        }
        return data;
    };

    return {
        '24h': generateData(24, 1),
        '7d': generateData(28, 7),
        '1m': generateData(30, 30),
        '1y': generateData(52, 365),
    };
};

// --- Custom Hook ---

const {
  initialMetrics,
  initialCustomerIssues,
  initialNetworkRegions,
} = generateInitialData();


export const useMockData = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [customerIssues, setCustomerIssues] = useState<CustomerIssue[]>(initialCustomerIssues);
  const [networkRegions, setNetworkRegions] = useState<NetworkRegion[]>(initialNetworkRegions);
  const [activeRegion, setActiveRegion] = useState<NetworkRegion>(initialNetworkRegions[0]);
  const [simulation, setSimulation] = useState<Simulation>({
    stage: 'Awaiting network anomaly...',
    progress: 0,
    isActive: false,
    agents: [],
  });
  const [repairPlans, setRepairPlans] = useState<RepairPlan[]>([]);
  const [customerTrendData] = useState<CustomerTrendData>(generateCustomerTrendData());
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', isVisible: false });
  const [latestNetworkAnalysis, setLatestNetworkAnalysis] = useState<NetworkAnalysisResult | null>(null);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const showToast = useCallback((message: string, type: ToastState['type']) => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => closeToast(), 5000);
  }, [closeToast]);

  const deployPlan = useCallback(() => {
    showToast('Deployment of repair plan initiated successfully!', 'success');
    setSimulation(prev => ({...prev, isActive: false, progress: 100, stage: 'Monitoring post-deployment stability...'}));
    setTimeout(() => {
        setMetrics(prev => ({...prev, activeIssues: 0, aiAgentsRunning: 0}));
        setRepairPlans([]);
        setSimulation({
            stage: 'Awaiting network anomaly...',
            progress: 0,
            isActive: false,
            agents: [],
        });
        showToast('Network stability confirmed. All systems nominal.', 'info');
    }, 8000);
  }, [showToast]);
  
  // Update last updated time
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 2000);
    return () => clearInterval(interval);
  }, []);

  // Send customer voices to backend for RAG indexing when they change
  useEffect(() => {
    const sendCustomerVoicesToRAG = async () => {
      if (customerIssues.length > 0) {
        try {
          console.log('[Frontend] Sending customer voices to RAG system...', customerIssues.length);
          const result = await syncAPI.sendCustomerVoices(customerIssues);
          if (result.success) {
            console.log('[Frontend] Customer voices successfully indexed in RAG:', result.data);
          } else {
            console.warn('[Frontend] Failed to index customer voices:', result.error);
          }
        } catch (error) {
          // Silently fail - backend might not be available yet, or this is just for demo
          console.warn('[Frontend] Could not send customer voices to RAG (this is OK for demo):', error);
        }
      }
    };

    // Send customer voices to RAG system
    // Use a small delay to avoid sending on every render
    const timeoutId = setTimeout(() => {
      sendCustomerVoicesToRAG();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [customerIssues]);

  // Manual trigger function for network analysis
  const triggerNetworkAnalysis = useCallback(async (targetRegionId?: string) => {
    // Randomly select a region if not specified - using North American regions
    const regionIds = [
      'us-east-1', 'us-east-2', 'us-east-5', 'us-east-8',
      'us-midwest-1', 'us-midwest-5', 'us-midwest-8',
      'us-west-1', 'us-west-3', 'us-west-7', 'us-west-10',
      'ca-east-1', 'ca-east-2', 'ca-west-3',
      'mx-central-1', 'mx-north-1', 'mx-east-1'
    ];
    const selectedRegionId = targetRegionId || regionIds[Math.floor(Math.random() * regionIds.length)];
    
    showToast(`Critical anomaly detected in ${selectedRegionId.toUpperCase()}. Initiating AI analysis.`, 'warning');

    // Update UI to show critical status
    const updatedRegions = networkRegions.map(r => 
      r.id === selectedRegionId 
        ? {...r, status: 'critical' as RegionStatus, details: 'High latency and packet loss detected. AI agents analyzing...'} 
        : r
    );
    setNetworkRegions(updatedRegions);
    const newActiveRegion = updatedRegions.find(r => r.id === selectedRegionId);
    if (newActiveRegion) setActiveRegion(newActiveRegion);

    setMetrics(prev => ({...prev, activeIssues: 1, aiAgentsRunning: 4}));

    setSimulation({
      stage: 'Calling Gemini LLM for network analysis...',
      progress: 10,
      isActive: true,
      agents: [
        { name: 'Network Analyzer (Gemini)', status: 'running', message: 'Analyzing network topology and health...' },
        { name: 'RAG System', status: 'running', message: 'Retrieving historical context...' },
        { name: 'Self-Healing Agent', status: 'waiting', message: 'Waiting for analysis results...' },
        { name: 'Repair Planner', status: 'waiting', message: 'Waiting for analysis results...' },
      ],
    });

    try {
      // Show initial progress
      setSimulation(prev => ({...prev, progress: 20, stage: 'Initializing AI agents...'}));
      await new Promise(resolve => setTimeout(resolve, 800));

      // REAL LLM CALL: NetworkAnalysisAgent with Gemini
      setSimulation(prev => ({...prev, progress: 30, stage: 'Gemini LLM analyzing network data...'}));

      // Randomize scenario for variety in RAG retrieval
      const scenarios = [
        {
          issue_description: 'High latency and intermittent packet loss detected on fiber links',
          affected_devices: ['router-us-east-1-core', 'switch-us-east-1-edge', 'load-balancer-01'],
          topology_data: 'Multi-region mesh topology with dual redundancy paths',
        },
        {
          issue_description: 'DNS resolution failures and increased TCP reset rates',
          affected_devices: ['dns-server-primary', 'dns-server-secondary', 'edge-router-03'],
          topology_data: 'Star topology with centralized DNS infrastructure',
        },
        {
          issue_description: 'Memory pressure and CPU saturation on critical infrastructure nodes',
          affected_devices: ['compute-node-12', 'storage-cluster-A', 'router-core-02'],
          topology_data: 'Hybrid cloud mesh with on-prem and cloud resources',
        },
        {
          issue_description: 'Elevated HTTP 5xx errors and database connection timeouts',
          affected_devices: ['app-server-cluster', 'database-primary', 'cache-layer-01'],
          topology_data: 'Three-tier architecture with load balancing',
        },
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      const networkAnalysisResult = await syncAPI.analyzeNetwork({
        network_id: selectedRegionId,
        includeRAG: true, // Explicitly enable RAG retrieval
        focusRegion: selectedRegionId,
        ...scenario,
      });

      if (networkAnalysisResult.success && networkAnalysisResult.data) {
        const analysisData = networkAnalysisResult.data;

        // Store the network analysis result for detailed view
        setLatestNetworkAnalysis(analysisData);

        // Update network regions with REAL LLM analysis
        const llmUpdatedRegions = analysisData.regions.map(region => ({
          id: region.id,
          name: region.name,
          status: region.status,
          details: region.details,
        }));
        setNetworkRegions(llmUpdatedRegions);

        // Update metrics with REAL data
        setMetrics(prev => ({
          ...prev,
          activeIssues: analysisData.metrics.activeIssues,
          avgResolutionTime: parseFloat((analysisData.metrics.avgLatency / 5).toFixed(1)),
          costSavings: prev.costSavings, // Keep existing
        }));

        // Show completion with delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setSimulation(prev => ({
          ...prev,
          progress: 60,
          stage: 'AI analysis complete. Generating repair plans...',
          agents: prev.agents.map((agent, idx) =>
            idx === 0 ? {...agent, status: 'complete', message: `Analyzed ${analysisData.regions.length} regions, found ${analysisData.issues.length} issues`} :
            idx === 1 ? {...agent, status: 'complete', message: `Retrieved ${analysisData.issues.length > 0 ? 'repair strategies' : 'historical patterns'} from knowledge base`} :
            agent
          ),
        }));

        await new Promise(resolve => setTimeout(resolve, 600));

        // REAL LLM CALL: SelfHealingAgent for repair plans
        setSimulation(prev => ({
          ...prev,
          progress: 70,
          agents: prev.agents.map((agent, idx) =>
            idx === 2 ? {...agent, status: 'running', message: 'Generating remediation plans with AI...'} :
            idx === 3 ? {...agent, status: 'running', message: 'Planning repair strategies...'} :
            agent
          ),
        }));

        const repairResult = await syncAPI.generateRepairPlans(analysisData);

        // Show repair generation progress
        await new Promise(resolve => setTimeout(resolve, 800));
        setSimulation(prev => ({...prev, progress: 85, stage: 'Finalizing repair strategies...'}));
        await new Promise(resolve => setTimeout(resolve, 500));

        if (repairResult.success && repairResult.data) {
          // Convert backend repair actions to frontend RepairPlan
          const llmRepairPlans: RepairPlan[] = repairResult.data.repairActions.map((action: any, idx: number) => ({
            id: idx + 1,
            name: action.name,
            cost: action.estimatedCost,
            downtime: action.estimatedDowntime,
            affectedCustomers: action.affectedCustomers,
            isRecommended: action.isRecommended,
          }));

          setRepairPlans(llmRepairPlans);

          setSimulation(prev => ({
            ...prev,
            progress: 90,
            agents: prev.agents.map((agent, idx) =>
              idx === 2 ? {...agent, status: 'complete', message: `Generated ${llmRepairPlans.length} repair plans with RAG context`} :
              idx === 3 ? {...agent, status: 'complete', message: `${llmRepairPlans.length} strategies ready for deployment`} :
              agent
            ),
          }));

          showToast(`AI generated ${llmRepairPlans.length} repair plans using real LLM analysis`, 'info');
        }

        setSimulation(prev => ({
          ...prev,
          progress: 100,
          stage: 'LLM analysis complete. Recommendations ready.',
          isActive: false,
          agents: prev.agents.map(agent => ({...agent, status: 'complete', message: agent.status === 'complete' ? agent.message : 'Analysis complete'})),
        }));

      } else {
        throw new Error('Network analysis returned no data');
      }
    } catch (error) {
      console.error('LLM Integration Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`LLM analysis failed: ${errorMessage}. Check console for details.`, 'error');

      // Show detailed error state
      setSimulation(prev => ({
        ...prev,
        progress: 100,
        isActive: false,
        stage: `Analysis failed: ${errorMessage}`,
        agents: prev.agents.map(agent => ({
          ...agent,
          status: 'error' as any,
          message: 'Backend connection failed',
        })),
      }));
    }
  }, [networkRegions, setActiveRegion, showToast]);


  // Old mock simulation effect removed - now using real LLM calls above


  return {
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
  };
};