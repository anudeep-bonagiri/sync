/**
 * NetworkMap - Interactive geographic network visualization
 *
 * Displays network regions on an interactive Leaflet map with color-coded markers.
 * Supports both embedded and fullscreen modal views.
 * Designed to be map-provider agnostic for easy migration to Google Maps/Mapbox.
 */

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore - leaflet.heat doesn't export types correctly
import 'leaflet.heat';
import { X, Maximize2, MapPin } from './icons';
import type { NetworkRegion } from '../types';

// Map-specific region data structure (includes lat/lng for map rendering)
interface MapNetworkRegion {
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

interface NetworkMapProps {
  embedded?: boolean; // If true, shows small preview with expand button
  onExpand?: () => void;
  regions?: NetworkRegion[]; // Optional regions prop for real-time updates
}

// Map renderer component (provider-agnostic wrapper)
const MapRenderer: React.FC<{
  regions: MapNetworkRegion[];
  containerId: string;
  height: string;
}> = ({ regions, containerId, height }) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const aoeCirclesRef = useRef<L.Circle[]>([]);

  // Initialize map once on mount
  useEffect(() => {
    console.log('[MapRenderer] Initializing map with containerId:', containerId);
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        try {
          console.log('[MapRenderer] Creating Leaflet map...');
          const map = L.map(containerId, {
            center: [39.8283, -98.5795], // Center on North America (US)
            zoom: 4, // Closer zoom for better North America view
            zoomControl: true,
            scrollWheelZoom: true,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          }).addTo(map);

          mapRef.current = map;
          console.log('[MapRenderer] Map initialized successfully');
          
          // Invalidate size to ensure map renders properly
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize();
            }
          }, 200);
        } catch (error) {
          console.error('[MapRenderer] Leaflet map initialization error:', error);
        }
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerId]);

  // Update heatmap and markers when regions change
  useEffect(() => {
    console.log('[MapRenderer] Updating heatmap, regions:', regions.length, regions);
    
    // Only render if we have regions
    if (regions.length === 0) {
      console.log('[MapRenderer] No regions to display');
      return;
    }

    // Wait for map to be initialized, with retry logic
    const updateMapLayers = () => {
      if (!mapRef.current) {
        console.log('[MapRenderer] Map not initialized yet, retrying in 200ms...');
        setTimeout(updateMapLayers, 200);
        return;
      }

      console.log('[MapRenderer] Map ready, rendering', regions.length, 'regions');

      // Clear existing AOE circles
      aoeCirclesRef.current.forEach(circle => {
        try {
          mapRef.current?.removeLayer(circle);
        } catch (e) {
          console.warn('Error removing AOE circle:', e);
        }
      });
      aoeCirclesRef.current = [];

      // Clear existing heatmap layer
      if (heatLayerRef.current) {
        try {
          mapRef.current.removeLayer(heatLayerRef.current);
        } catch (e) {
          console.warn('Error removing heatmap layer:', e);
        }
        heatLayerRef.current = null;
      }

      // Clear existing markers
      markersRef.current.forEach(marker => {
        try {
          mapRef.current?.removeLayer(marker);
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markersRef.current = [];

      // Create AOE circles FIRST (so they appear under the heatmap)
      console.log('[MapRenderer] Creating AOE circles for', regions.length, 'regions');
      regions.forEach((region, index) => {
        // Softer, more appealing colors that match the status
        const color =
          region.status === 'critical' ? '#FF6B6B' :  // Soft red
          region.status === 'warning' ? '#FFB84D' :   // Soft orange
          '#66BB6A';  // Soft green

        // Radius in meters based on severity - more subtle sizes
        // Critical = 600km, Warning = 400km, Healthy = 250km
        const radius =
          region.status === 'critical' ? 600000 :
          region.status === 'warning' ? 400000 :
          250000;

        // Very subtle opacity for soft, appealing look - reduced further for cleaner visualization
        const fillOpacity =
          region.status === 'critical' ? 0.05 :
          region.status === 'warning' ? 0.04 :
          0.03;

        const borderOpacity =
          region.status === 'critical' ? 0.18 :
          region.status === 'warning' ? 0.16 :
          0.14;

        try {
          const aoeCircle = L.circle([region.latitude, region.longitude], {
            radius: radius,
            fillColor: color,
            color: color,
            weight: 1.5, // Thinner, more subtle border
            opacity: borderOpacity,
            fillOpacity: fillOpacity,
          });

          aoeCircle.addTo(mapRef.current!);
          aoeCirclesRef.current.push(aoeCircle);
          console.log(`[MapRenderer] Created AOE circle for ${region.name} (${region.status}) at [${region.latitude}, ${region.longitude}]`);
        } catch (e) {
          console.error(`[MapRenderer] Error creating AOE circle for ${region.name}:`, e);
        }
      });

      // Prepare heatmap data points with intelligent thinning strategy
      // Use fewer, well-distributed points for cleaner visualization
      const heatmapData: [number, number, number][] = [];
      
      console.log('[MapRenderer] Preparing heatmap data points with thinning strategy');
      
      // Thinning strategy: prioritize critical regions, then sample others for balance
      const criticalRegions = regions.filter(r => r.status === 'critical');
      const warningRegions = regions.filter(r => r.status === 'warning');
      const healthyRegions = regions.filter(r => r.status === 'healthy');
      
      // Always include all critical regions, sample warning and healthy regions
      // Sample rate: 100% critical, 75% warning, 55% healthy (reduced for cleaner look)
      const sampleWarning = Math.ceil(warningRegions.length * 0.75);
      const sampleHealthy = Math.ceil(healthyRegions.length * 0.55);
      
      // Deterministic sampling based on region ID hash for consistency
      // This ensures the same regions are selected on each render
      const hashId = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
          hash = ((hash << 5) - hash) + id.charCodeAt(i);
          hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
      };
      
      // Sort by hash for consistent, pseudo-random selection
      const sortedWarning = [...warningRegions].sort((a, b) => hashId(a.id) - hashId(b.id));
      const sortedHealthy = [...healthyRegions].sort((a, b) => hashId(a.id) - hashId(b.id));
      
      const selectedRegions = [
        ...criticalRegions,
        ...sortedWarning.slice(0, sampleWarning),
        ...sortedHealthy.slice(0, sampleHealthy)
      ];
      
      console.log(`[MapRenderer] Selected ${selectedRegions.length} of ${regions.length} regions (${criticalRegions.length} critical, ${sampleWarning} warning, ${sampleHealthy} healthy)`);
      
      selectedRegions.forEach(region => {
        // Balanced intensity values - closer together and lighter for better visual harmony
        const baseIntensity =
          region.status === 'critical' ? 0.62 :
          region.status === 'warning' ? 0.52 :
          0.38;

        // Add central point with base intensity
        heatmapData.push([region.latitude, region.longitude, baseIntensity]);
        
        // Reduced point count for cleaner visualization
        // Only 2-3 surrounding points instead of 4-6
        const pointsPerRegion = 
          region.status === 'critical' ? 3 :
          region.status === 'warning' ? 2 :
          2;
          
        for (let i = 0; i < pointsPerRegion; i++) {
          // Moderate spread for natural gradients without clutter
          const angle = (i / pointsPerRegion) * Math.PI * 2;
          const distance = 2.0 + Math.random() * 0.8; // Controlled spread
          const offsetLat = Math.cos(angle) * distance;
          const offsetLng = Math.sin(angle) * distance;
          // Lower intensity for surrounding points to create softer, lighter gradients
          const intensity = baseIntensity * (0.40 + Math.random() * 0.20);
          heatmapData.push([
            region.latitude + offsetLat,
            region.longitude + offsetLng,
            Math.max(0.15, intensity) // Ensure minimum visibility
          ]);
        }
      });

      console.log('[MapRenderer] Created', heatmapData.length, 'heatmap data points (reduced from full dataset)');

      // Create lighter, clearer heatmap layer with balanced colors
      try {
        // @ts-ignore - leaflet.heat types
        const heatLayer = L.heatLayer(heatmapData, {
          radius: 42,  // Reduced for cleaner, less cluttered look
          blur: 38,    // Increased blur for smoother, softer gradients
          maxZoom: 18,
          max: 1.0,
          minOpacity: 0.20, // Lighter overall for clearer map visibility
          gradient: {
            0.0: '#66BB6A',   // Soft green - healthy
            0.3: '#81C784',   // Light green
            0.45: '#A5D6A7',  // Very light green (transition)
            0.55: '#C4B89A',  // Muted, neutral beige-tan (soft warning - very desaturated)
            0.65: '#D9B89A',  // Soft, desaturated peach (moderate warning)
            0.75: '#E8C4A8',  // Light peach (gentle warning)
            0.85: '#F5A690',  // Soft, muted coral (transition to critical)
            0.92: '#FF8A80',  // Soft light red
            1.0: '#FF6B6B'    // Soft red - critical
          }
        }).addTo(mapRef.current);

        heatLayerRef.current = heatLayer;
        console.log('[MapRenderer] Heatmap layer created and added to map');
      } catch (e) {
        console.error('[MapRenderer] Error creating heatmap layer:', e);
      }
      
      // Invalidate map size to ensure heatmap renders properly
      // This is important for proper heatmap rendering after container resize or initial load
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          console.log('[MapRenderer] Map size invalidated');
        }
      }, 150);

      // Add smaller, subtle markers for precise location reference
      console.log('[MapRenderer] Creating markers for', regions.length, 'regions');
      regions.forEach((region, index) => {
        // Use same soft colors as AOE circles to match status
        const color =
          region.status === 'critical' ? '#FF6B6B' :  // Soft red
          region.status === 'warning' ? '#FFB84D' :   // Soft orange
          '#66BB6A';  // Soft green

        try {
          // Smaller, more subtle markers
          const marker = L.circleMarker([region.latitude, region.longitude], {
            radius: 5, // Smaller size
            fillColor: color,
            color: '#fff',
            weight: 1.5, // Thinner border
            opacity: 0.9,
            fillOpacity: 0.85,
          });

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${region.name}</h3>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${region.status.toUpperCase()}</span></p>
              ${region.metrics ? `
                <p style="margin: 4px 0; font-size: 12px;"><strong>Latency:</strong> ${(region.metrics.latency ?? 0).toFixed(1)}ms</p>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Error Rate:</strong> ${(region.metrics.errorRate ?? 0).toFixed(2)}%</p>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Uptime:</strong> ${(region.metrics.uptime ?? 0).toFixed(2)}%</p>
              ` : ''}
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">${region.explanation}</p>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(mapRef.current!);
          markersRef.current.push(marker);
          console.log(`[MapRenderer] Created marker for ${region.name} at [${region.latitude}, ${region.longitude}]`);
        } catch (e) {
          console.error(`[MapRenderer] Error creating marker for ${region.name}:`, e);
        }
      });

      console.log('[MapRenderer] Map update complete. AOE circles:', aoeCirclesRef.current.length, 'Markers:', markersRef.current.length);
    };

    // Start the update process
    updateMapLayers();
  }, [regions]);

  return <div id={containerId} style={{ height, width: '100%', borderRadius: '8px', backgroundColor: '#f0f0f0' }} />;
};

// Legend component with heatmap gradient
const MapLegend: React.FC = () => (
  <div className="absolute bottom-4 left-4 bg-white dark:bg-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 z-[1000]">
    <h4 className="text-xs font-bold mb-3 text-gray-900 dark:text-white">Network Health Intensity</h4>

    {/* Gradient bar - updated to match new muted gradient */}
    <div className="mb-2">
      <div
        className="h-6 w-32 rounded"
        style={{
          background: 'linear-gradient(to right, #66BB6A 0%, #81C784 30%, #A5D6A7 45%, #C4B89A 55%, #D9B89A 65%, #E8C4A8 75%, #F5A690 85%, #FF8A80 92%, #FF6B6B 100%)'
        }}
      ></div>
    </div>

    {/* Labels */}
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] text-gray-600 dark:text-[#9A9A9A]">Healthy</span>
      <span className="text-[10px] text-gray-600 dark:text-[#9A9A9A]">Warning</span>
      <span className="text-[10px] text-gray-600 dark:text-[#9A9A9A]">Critical</span>
    </div>

    {/* Markers info */}
    <div className="pt-2 border-t border-gray-200 dark:border-white/10 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 border border-white"></div>
        <span className="text-[10px] text-gray-600 dark:text-[#9A9A9A]">Data center locations</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#FF6B6B', opacity: 0.08 }}></div>
          <div className="absolute inset-0 w-4 h-4 rounded-full border" style={{ borderColor: '#FF6B6B', opacity: 0.25 }}></div>
        </div>
        <span className="text-[10px] text-gray-600 dark:text-[#9A9A9A]">Area of Effect (AOE)</span>
      </div>
    </div>
  </div>
);

// Helper function to convert NetworkRegion to MapNetworkRegion
const convertToMapRegion = (region: NetworkRegion): MapNetworkRegion => {
  // Comprehensive T-Mobile coverage map - US, Canada, Mexico hotspots
  const regionCoords: Record<string, { lat: number; lng: number }> = {
    // United States - East Coast
    'us-east-1': { lat: 38.9072, lng: -77.0369 }, // Washington DC / N. Virginia
    'us-east-2': { lat: 40.7128, lng: -74.0060 }, // New York City
    'us-east-3': { lat: 42.3601, lng: -71.0589 }, // Boston
    'us-east-4': { lat: 39.9526, lng: -75.1652 }, // Philadelphia
    'us-east-5': { lat: 33.7490, lng: -84.3880 }, // Atlanta
    'us-east-6': { lat: 25.7617, lng: -80.1918 }, // Miami
    'us-east-7': { lat: 35.2271, lng: -80.8431 }, // Charlotte
    'us-east-8': { lat: 30.2672, lng: -97.7431 }, // Austin
    'us-east-9': { lat: 29.7604, lng: -95.3698 }, // Houston
    'us-east-10': { lat: 32.7767, lng: -96.7970 }, // Dallas
    
    // United States - Midwest
    'us-midwest-1': { lat: 41.8781, lng: -87.6298 }, // Chicago
    'us-midwest-2': { lat: 39.0997, lng: -94.5786 }, // Kansas City
    'us-midwest-3': { lat: 44.9778, lng: -93.2650 }, // Minneapolis
    'us-midwest-4': { lat: 39.9612, lng: -82.9988 }, // Columbus
    'us-midwest-5': { lat: 42.3314, lng: -83.0458 }, // Detroit
    'us-midwest-6': { lat: 38.6270, lng: -90.1994 }, // St. Louis
    'us-midwest-7': { lat: 41.2565, lng: -95.9345 }, // Omaha
    'us-midwest-8': { lat: 36.1627, lng: -86.7816 }, // Nashville
    
    // United States - West Coast
    'us-west-1': { lat: 37.7749, lng: -122.4194 }, // San Francisco / N. California
    'us-west-2': { lat: 45.5152, lng: -122.6784 }, // Portland, Oregon
    'us-west-3': { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    'us-west-4': { lat: 47.6062, lng: -122.3321 }, // Seattle
    'us-west-5': { lat: 32.7157, lng: -117.1611 }, // San Diego
    'us-west-6': { lat: 36.1699, lng: -115.1398 }, // Las Vegas
    'us-west-7': { lat: 33.4484, lng: -112.0740 }, // Phoenix
    'us-west-8': { lat: 39.7392, lng: -104.9903 }, // Denver
    'us-west-9': { lat: 40.7608, lng: -111.8910 }, // Salt Lake City
    'us-west-10': { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
    
    // Canada - Major Cities
    'ca-east-1': { lat: 43.6532, lng: -79.3832 }, // Toronto
    'ca-east-2': { lat: 45.5017, lng: -73.5673 }, // Montreal
    'ca-east-3': { lat: 45.4215, lng: -75.6972 }, // Ottawa
    'ca-east-4': { lat: 44.6488, lng: -63.5752 }, // Halifax
    'ca-west-1': { lat: 49.2827, lng: -123.1207 }, // Vancouver
    'ca-west-2': { lat: 51.0447, lng: -114.0719 }, // Calgary
    'ca-west-3': { lat: 53.5461, lng: -113.4938 }, // Edmonton
    'ca-west-4': { lat: 50.4452, lng: -104.6189 }, // Regina
    'ca-west-5': { lat: 49.8951, lng: -97.1384 }, // Winnipeg
    
    // Mexico - Major Cities
    'mx-central-1': { lat: 19.4326, lng: -99.1332 }, // Mexico City
    'mx-central-2': { lat: 20.6597, lng: -103.3496 }, // Guadalajara
    'mx-central-3': { lat: 19.0414, lng: -98.2063 }, // Puebla
    'mx-north-1': { lat: 25.6866, lng: -100.3161 }, // Monterrey
    'mx-north-2': { lat: 31.8686, lng: -116.5967 }, // Tijuana
    'mx-north-3': { lat: 32.5149, lng: -117.0382 }, // Mexicali
    'mx-south-1': { lat: 21.1619, lng: -86.8515 }, // Cancun
    'mx-south-2': { lat: 20.9674, lng: -89.5926 }, // Merida
    'mx-east-1': { lat: 19.1738, lng: -96.1342 }, // Veracruz
    'mx-west-1': { lat: 31.6904, lng: -106.4245 }, // Ciudad Juarez
    
    // Legacy/International regions (keeping for backward compatibility)
    'eu-west-1': { lat: 53.3498, lng: -6.2603 }, // Ireland
    'eu-west-2': { lat: 51.5074, lng: -0.1278 }, // London
    'eu-central-1': { lat: 50.1109, lng: 8.6821 }, // Frankfurt
    'ap-northeast-1': { lat: 35.6762, lng: 139.6503 }, // Tokyo
    'ap-southeast-1': { lat: 1.3521, lng: 103.8198 }, // Singapore
    'ap-southeast-2': { lat: -33.8688, lng: 151.2093 }, // Sydney
    'sa-east-1': { lat: -23.5505, lng: -46.6333 }, // São Paulo
  };

  const coords = regionCoords[region.id] || { lat: 39.8283, lng: -98.5795 }; // Default to US center
  
  return {
    id: region.id,
    name: region.name,
    latitude: coords.lat,
    longitude: coords.lng,
    status: region.status,
    explanation: region.details || 'No details available',
    metrics: undefined, // Metrics not available in NetworkRegion type
  };
};

// Main NetworkMap component
export const NetworkMap: React.FC<NetworkMapProps> = ({ embedded = false, onExpand, regions: propRegions }) => {
  const [regions, setRegions] = useState<MapNetworkRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // If regions are provided as props, use them; otherwise fetch from API
  useEffect(() => {
    console.log('[NetworkMap] propRegions changed:', propRegions?.length, propRegions);
    
    // If propRegions is explicitly provided (even if empty), use it
    if (propRegions !== undefined) {
      if (propRegions.length > 0) {
        // Convert prop regions to map regions
        const mapRegions = propRegions.map(convertToMapRegion);
        console.log('[NetworkMap] Converted to map regions:', mapRegions.length, mapRegions);
        setRegions(mapRegions);
        setLoading(false);
        setError(null);
      } else {
        // Regions provided but empty - show empty state
        console.log('[NetworkMap] propRegions is empty array');
        setRegions([]);
        setLoading(false);
        setError(null);
      }
    } else {
      // No propRegions provided - fetch from API
      const fetchMapData = async () => {
        try {
          setLoading(true);
          console.log('[NetworkMap] Fetching map data from API...');
          const response = await fetch('http://localhost:3001/api/regions/map');
          const result = await response.json();
          console.log('[NetworkMap] API Response:', result);

          if (result.success) {
            console.log('[NetworkMap] Setting regions from API:', result.data.regions?.length);
            setRegions(result.data.regions || []);
          } else {
            throw new Error(result.error || 'Failed to load map data');
          }
        } catch (err) {
          console.error('[NetworkMap] Fetch error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load map');
        } finally {
          setLoading(false);
          console.log('[NetworkMap] Loading complete');
        }
      };

      fetchMapData();
    }
  }, [propRegions]);

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    } else {
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#E20074] mb-4"></div>
        <p className="text-gray-600 dark:text-[#B3B3B3]">Loading network map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center min-h-[300px]">
        <MapPin className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Map Unavailable</h3>
        <p className="text-sm text-gray-600 dark:text-[#B3B3B3]">{error}</p>
      </div>
    );
  }

  const embedContent = (
    <div className="relative bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden">
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={handleExpand}
          className="bg-white dark:bg-[#2A2A2A] p-2 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] transition-colors"
          title="Expand map"
        >
          <Maximize2 className="w-5 h-5 text-gray-700 dark:text-white" />
        </button>
      </div>
      <MapRenderer regions={regions} containerId="network-map-embedded" height="400px" />
      <MapLegend />
    </div>
  );

  const modalContent = showModal && (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#1A1A1A] rounded-xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-[10000]">
          <button
            onClick={() => setShowModal(false)}
            className="bg-white dark:bg-[#2A2A2A] p-2 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] transition-colors"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
        </div>
        <MapRenderer regions={regions} containerId="network-map-fullscreen" height="100%" />
        <MapLegend />
      </div>
    </div>
  );

  return (
    <>
      {embedContent}
      {modalContent}
    </>
  );
};
