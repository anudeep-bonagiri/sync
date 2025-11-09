import { useEffect, useState } from 'react';
import { Activity, TrendingDown, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const [loyal, setLoyal] = useState(78);
  const [switching, setSwitching] = useState(12);
  const [considering, setConsidering] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      const total = 100;
      const newLoyal = Math.max(70, Math.min(85, loyal + (Math.random() - 0.5) * 4));
      const newSwitching = Math.max(8, Math.min(18, switching + (Math.random() - 0.5) * 3));
      const newConsidering = total - newLoyal - newSwitching;

      setLoyal(newLoyal);
      setSwitching(newSwitching);
      setConsidering(Math.max(5, newConsidering));
    }, 2000);

    return () => clearInterval(interval);
  }, [loyal, switching]);

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0F0515] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(226,0,116,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Live Control Center
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Real-time network health and customer retention
          </p>
        </div>

        <div className="relative perspective-1000">
          <div className="relative transform-gpu transition-transform duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/20 to-[#7C4DFF]/20 blur-3xl" />

            <div className="relative border border-gray-800 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl">
              <div className="p-8 border-b border-gray-800 bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Network Command Dashboard</h3>
                    <p className="text-sm text-gray-400 font-mono">Last updated: {new Date().toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#26C6DA] animate-pulse" />
                    <span className="text-sm text-gray-400">AI Active</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <MetricCard
                  icon={Users}
                  title="Loyal Customers"
                  value={`${loyal.toFixed(0)}%`}
                  trend="up"
                  color="#4CAF50"
                />
                <MetricCard
                  icon={Activity}
                  title="Considering Switch"
                  value={`${considering.toFixed(0)}%`}
                  trend="up"
                  color="#FFC107"
                />
                <MetricCard
                  icon={TrendingDown}
                  title="Switching Away"
                  value={`${switching.toFixed(0)}%`}
                  trend="down"
                  color="#E20074"
                />
              </div>

              <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <LoyaltyChart loyal={loyal} switching={switching} considering={considering} />
                <DallasHeatmap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, title, value, trend, color }: {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: 'up' | 'down';
  color: string;
}) {
  return (
    <div className="group relative p-6 rounded-xl border border-gray-800 bg-black/40 hover:border-gray-700 transition-all hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-6 h-6" style={{ color }} strokeWidth={1.5} />
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-500" />
          )}
        </div>

        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
    </div>
  );
}

function LoyaltyChart({ loyal, switching, considering }: { loyal: number; switching: number; considering: number }) {
  const [history, setHistory] = useState<Array<{ loyal: number; switching: number; considering: number }>>([
    { loyal: 78, switching: 12, considering: 10 }
  ]);

  useEffect(() => {
    setHistory(prev => [...prev.slice(-19), { loyal, switching, considering }]);
  }, [loyal, switching, considering]);

  return (
    <div className="p-4 sm:p-6 rounded-xl border border-gray-800 bg-black/40">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Customer Loyalty Trends</h4>
      <div className="relative h-40 sm:h-48">
        <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="loyalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#4CAF50', stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="switchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#E20074', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#E20074', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {history.map((data, i) => {
            const x = (i / (history.length - 1)) * 400;
            return (
              <circle key={`loyal-${i}`} cx={x} cy={160 - (data.loyal / 100) * 160} r="3" fill="#4CAF50" />
            );
          })}

          <path
            d={`M 0 ${160 - (history[0]?.loyal / 100) * 160} ${history.map((d, i) =>
              `L ${(i / (history.length - 1)) * 400} ${160 - (d.loyal / 100) * 160}`
            ).join(' ')}`}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(76,175,80,0.5)]"
          />

          {history.map((data, i) => {
            const x = (i / (history.length - 1)) * 400;
            return (
              <circle key={`switch-${i}`} cx={x} cy={160 - (data.switching / 100) * 160} r="2.5" fill="#E20074" />
            );
          })}

          <path
            d={`M 0 ${160 - (history[0]?.switching / 100) * 160} ${history.map((d, i) =>
              `L ${(i / (history.length - 1)) * 400} ${160 - (d.switching / 100) * 160}`
            ).join(' ')}`}
            fill="none"
            stroke="#E20074"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(226,0,116,0.5)]"
          />
        </svg>
      </div>
      <div className="flex gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
          <span className="text-xs sm:text-sm text-gray-400">Loyal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E20074]" />
          <span className="text-xs sm:text-sm text-gray-400">Switching</span>
        </div>
      </div>
    </div>
  );
}

function DallasHeatmap() {
  const dallasZones = [
    { id: 1, name: 'Downtown', x: 40, y: 35, intensity: 0.8 },
    { id: 2, name: 'North Dallas', x: 50, y: 15, intensity: 0.6 },
    { id: 3, name: 'Irving', x: 20, y: 40, intensity: 0.7 },
    { id: 4, name: 'Arlington', x: 10, y: 50, intensity: 0.5 },
    { id: 5, name: 'Plano', x: 55, y: 10, intensity: 0.65 },
    { id: 6, name: 'South Dallas', x: 45, y: 65, intensity: 0.4 },
    { id: 7, name: 'Fort Worth', x: 5, y: 65, intensity: 0.55 },
    { id: 8, name: 'Frisco', x: 60, y: 5, intensity: 0.72 },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-xl border border-gray-800 bg-black/40">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Dallas Metro Network Health</h4>
      <div className="relative w-full aspect-square max-w-xs sm:max-w-none mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="100" fill="#0A0A0A" opacity="0.3" rx="8" />

          {dallasZones.map((zone) => {
            const color = zone.intensity > 0.7 ? '#4CAF50' : zone.intensity > 0.5 ? '#FFC107' : '#E20074';
            return (
              <g key={zone.id}>
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={8 + zone.intensity * 4}
                  fill={color}
                  opacity={0.2 + zone.intensity * 0.3}
                  className="transition-all"
                  filter="url(#glow)"
                />
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={3}
                  fill={color}
                  className="animate-pulse"
                  style={{ animationDelay: `${zone.id * 0.1}s` }}
                />
              </g>
            );
          })}

          <text x="5" y="95" fontSize="8" fill="#666" fontFamily="monospace">
            Dallas Metro
          </text>
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {dallasZones.map((zone) => (
          <div key={zone.id} className="text-gray-400">
            <div className="font-semibold text-white">{zone.name}</div>
            <div>{(zone.intensity * 100).toFixed(0)}% Health</div>
          </div>
        ))}
      </div>
    </div>
  );
}
