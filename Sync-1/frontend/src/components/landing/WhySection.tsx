import { Zap, Network } from 'lucide-react';

export default function WhySection() {
  return (
    <section className="relative py-32 px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,77,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(226,0,116,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Built for Industry Leaders
          </h2>
          <p className="text-xl text-gray-400">
            Combining cutting-edge AI with enterprise-grade reliability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CompanyCard
            icon={Zap}
            company="NVIDIA"
            color="#76B900"
            features={[
              {
                title: 'Multi-Agent AI Reasoning',
                description: 'Distributed decision-making across network topology'
              },
              {
                title: 'GPU-Powered Simulations',
                description: '1000x faster repair scenario modeling'
              }
            ]}
          />

          <CompanyCard
            icon={Network}
            company="T-Mobile"
            color="#E20074"
            features={[
              {
                title: 'Predictive Repair',
                description: 'Fix issues before customers experience them'
              },
              {
                title: 'Zero Downtime',
                description: 'Autonomous healing without service interruption'
              }
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function CompanyCard({ icon: Icon, company, color, features }: {
  icon: React.ElementType;
  company: string;
  color: string;
  features: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="group relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-700 transition-all hover:scale-[1.02]">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
        style={{ background: `radial-gradient(circle at center, ${color}20, transparent 70%)` }}
      />

      <div className="relative">
        <div className="flex items-center space-x-4 mb-8">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-8 h-8" style={{ color }} strokeWidth={1.5} />
            <div
              className="absolute inset-0 rounded-xl animate-pulse"
              style={{
                boxShadow: `0 0 20px ${color}40`,
                border: `2px solid ${color}30`
              }}
            />
          </div>
          <h3 className="text-3xl font-bold text-white">{company}</h3>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative pl-6 border-l-2 transition-all"
              style={{
                borderColor: `${color}40`,
              }}
            >
              <div
                className="absolute left-0 top-3 w-2 h-2 rounded-full -translate-x-[5px]"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}
              />
              <h4 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
