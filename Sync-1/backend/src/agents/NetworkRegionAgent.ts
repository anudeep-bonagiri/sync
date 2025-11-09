/**
 * NetworkRegionAgent - Generates geographic network region data
 *
 * Takes network analysis results and produces structured regional metadata
 * with geographic coordinates, health status, and contextual information.
 * Designed to be map-provider agnostic for easy migration to Google Maps/Mapbox.
 */

import { BaseAgent, AgentLog } from './BaseAgent.js';
import { getRAGSystem } from '../rag/ragSystem.js';

// Map-agnostic region data structure
export interface NetworkRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'healthy' | 'warning' | 'critical';
  explanation: string;
  metrics?: {
    latency: number;
    errorRate: number;
    uptime: number;
  };
}

interface NetworkRegionInput {
  networkAnalysis: any; // Output from NetworkAnalysisAgent
  includeRAG?: boolean;
}

interface NetworkRegionOutput {
  regions: NetworkRegion[];
  timestamp: number;
}

export class NetworkRegionAgent extends BaseAgent<NetworkRegionInput, NetworkRegionOutput> {
  constructor() {
    super('network_region');
  }

  async execute(input: NetworkRegionInput): Promise<NetworkRegionOutput> {
    this.updateState('running', 'Initializing regional mapping...', 10);

    // Extract regions from network analysis
    const analysisRegions = input.networkAnalysis?.regions || [];

    this.log('info', `Processing ${analysisRegions.length} regions from network analysis`);
    this.updateState('running', 'Mapping network topology to geographic coordinates...', 30);

    // Optional RAG context for regional insights
    let ragContext = null;
    if (input.includeRAG) {
      this.updateState('running', 'Retrieving regional context from knowledge base...', 40);
      const ragSystem = getRAGSystem();
      ragContext = await ragSystem.retrieve(
        'regional network performance, geographic outages, location-based failures',
        2
      );
      this.log('info', 'RAG context retrieved for regional mapping', { sources: ragContext?.sources });
    }

    await this.delay(800); // Simulate processing

    this.updateState('running', 'Generating geographic metadata...', 60);

    // Map regions to geographic coordinates with realistic variance
    const regions = this.generateRegionData(analysisRegions, ragContext);

    this.updateState('running', 'Finalizing regional map data...', 90);

    this.log('info', 'Regional mapping complete', {
      totalRegions: regions.length,
      healthyCount: regions.filter(r => r.status === 'healthy').length,
      warningCount: regions.filter(r => r.status === 'warning').length,
      criticalCount: regions.filter(r => r.status === 'critical').length,
    });

    return {
      regions,
      timestamp: Date.now(),
    };
  }

  private generateRegionData(analysisRegions: any[], ragContext: any): NetworkRegion[] {
    // Predefined geographic data for common AWS-style regions
    // This simulates real data but is map-provider agnostic
    const geoData: Record<string, { lat: number; lon: number; city: string }> = {
      // North America
      'us-east-1': { lat: 39.0481, lon: -77.4728, city: 'N. Virginia' },
      'us-east-2': { lat: 39.9612, lon: -82.9988, city: 'Ohio' },
      'us-west-1': { lat: 37.7749, lon: -122.4194, city: 'N. California' },
      'us-west-2': { lat: 45.5231, lon: -122.6765, city: 'Oregon' },
      'us-central-1': { lat: 41.8781, lon: -87.6298, city: 'Chicago' },
      'us-south-1': { lat: 32.7767, lon: -96.7970, city: 'Dallas' },
      'ca-central-1': { lat: 45.5017, lon: -73.5673, city: 'Montreal' },
      'ca-west-1': { lat: 49.2827, lon: -123.1207, city: 'Vancouver' },
      'mx-central-1': { lat: 19.4326, lon: -99.1332, city: 'Mexico City' },

      // South America
      'sa-east-1': { lat: -23.5505, lon: -46.6333, city: 'São Paulo' },
      'sa-south-1': { lat: -34.6037, lon: -58.3816, city: 'Buenos Aires' },
      'sa-west-1': { lat: -12.0464, lon: -77.0428, city: 'Lima' },

      // Europe
      'eu-west-1': { lat: 53.3498, lon: -6.2603, city: 'Ireland' },
      'eu-west-2': { lat: 51.5074, lon: -0.1278, city: 'London' },
      'eu-west-3': { lat: 48.8566, lon: 2.3522, city: 'Paris' },
      'eu-central-1': { lat: 50.1109, lon: 8.6821, city: 'Frankfurt' },
      'eu-north-1': { lat: 59.3293, lon: 18.0686, city: 'Stockholm' },
      'eu-south-1': { lat: 45.4642, lon: 9.1900, city: 'Milan' },
      'eu-east-1': { lat: 52.2297, lon: 21.0122, city: 'Warsaw' },

      // Asia-Pacific
      'ap-northeast-1': { lat: 35.6762, lon: 139.6503, city: 'Tokyo' },
      'ap-northeast-2': { lat: 37.5665, lon: 126.9780, city: 'Seoul' },
      'ap-northeast-3': { lat: 39.9042, lon: 116.4074, city: 'Beijing' },
      'ap-southeast-1': { lat: 1.3521, lon: 103.8198, city: 'Singapore' },
      'ap-southeast-2': { lat: -33.8688, lon: 151.2093, city: 'Sydney' },
      'ap-southeast-3': { lat: -6.2088, lon: 106.8456, city: 'Jakarta' },
      'ap-south-1': { lat: 19.0760, lon: 72.8777, city: 'Mumbai' },
      'ap-south-2': { lat: 28.6139, lon: 77.2090, city: 'Delhi' },
      'ap-east-1': { lat: 22.3193, lon: 114.1694, city: 'Hong Kong' },

      // Middle East & Africa
      'me-south-1': { lat: 26.2041, lon: 50.5854, city: 'Bahrain' },
      'me-central-1': { lat: 25.2048, lon: 55.2708, city: 'Dubai' },
      'af-south-1': { lat: -33.9249, lon: 18.4241, city: 'Cape Town' },
      'af-north-1': { lat: 30.0444, lon: 31.2357, city: 'Cairo' },
    };

    const regions: NetworkRegion[] = [];

    for (const region of analysisRegions) {
      const regionId = region.id || this.generateRandomRegionId();
      const geo = geoData[regionId] || this.generateRandomGeo();

      // Add small random variance for visual appeal
      const latVariance = (Math.random() - 0.5) * 0.5;
      const lonVariance = (Math.random() - 0.5) * 0.5;

      regions.push({
        id: regionId,
        name: region.name || `${geo.city} Region`,
        latitude: geo.lat + latVariance,
        longitude: geo.lon + lonVariance,
        status: region.status || 'healthy',
        explanation: this.generateExplanation(region, ragContext),
        metrics: region.metrics || {
          latency: Math.random() * 50 + 10,
          errorRate: Math.random() * 2,
          uptime: 99 + Math.random(),
        },
      });
    }

    // Generate diverse set of regions for comprehensive network visibility
    // Minimum 20 regions to create meaningful heatmap visualization
    const allRegionIds = Object.keys(geoData);
    const targetRegionCount = Math.max(20, analysisRegions.length);

    while (regions.length < targetRegionCount) {
      const randomRegionId = allRegionIds[Math.floor(Math.random() * allRegionIds.length)];
      const geo = geoData[randomRegionId];

      if (!regions.find(r => r.id === randomRegionId)) {
        // Generate varied status for realistic heatmap
        const statusRoll = Math.random();
        const status: 'healthy' | 'warning' | 'critical' =
          statusRoll > 0.85 ? 'critical' :
          statusRoll > 0.70 ? 'warning' :
          'healthy';

        regions.push({
          id: randomRegionId,
          name: `${geo.city} Region`,
          latitude: geo.lat + (Math.random() - 0.5) * 0.3,
          longitude: geo.lon + (Math.random() - 0.5) * 0.3,
          status,
          explanation: this.generateExplanation({ status }, ragContext),
          metrics: {
            latency: status === 'critical' ? Math.random() * 150 + 100 :
                     status === 'warning' ? Math.random() * 60 + 40 :
                     Math.random() * 30 + 10,
            errorRate: status === 'critical' ? Math.random() * 5 + 2 :
                       status === 'warning' ? Math.random() * 2 + 0.5 :
                       Math.random() * 0.5,
            uptime: status === 'critical' ? Math.random() * 5 + 94 :
                    status === 'warning' ? Math.random() * 1 + 98.5 :
                    99.5 + Math.random() * 0.5,
          },
        });
      }
    }

    return regions;
  }

  private generateExplanation(region: any, ragContext: any): string {
    const status = region.status || 'healthy';
    const details = region.details || '';

    if (status === 'critical') {
      return details || 'Critical issues detected. Network performance significantly degraded. Immediate remediation required.';
    } else if (status === 'warning') {
      return details || 'Performance degradation detected. Monitoring closely for potential escalation.';
    } else {
      return details || 'All systems operational. Network performance within normal parameters.';
    }
  }

  private generateRandomRegionId(): string {
    const regions = ['us-east-1', 'eu-west-1', 'ap-northeast-1', 'sa-east-1'];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  private generateRandomGeo(): { lat: number; lon: number; city: string } {
    return {
      lat: (Math.random() - 0.5) * 180,
      lon: (Math.random() - 0.5) * 360,
      city: 'Unknown Region',
    };
  }
}
