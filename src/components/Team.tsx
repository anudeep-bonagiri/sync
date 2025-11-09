import { Github, Linkedin } from 'lucide-react';

const team = [
  {
    name: 'Team Member',
    role: 'AI/ML Engineer',
    github: '#',
    linkedin: '#'
  }
];

const partners = [
  { name: 'HackUTD 2025', logo: 'H' },
  { name: 'NVIDIA', logo: 'N' },
  { name: 'T-Mobile', logo: 'T' }
];

export default function Team() {
  return (
    <section className="relative py-32 px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,0,116,0.1),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Built at HackUTD 2025
          </h2>
          <p className="text-xl text-gray-400">
            Pushing the boundaries of autonomous network intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-700 transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/0 to-[#7C4DFF]/0 group-hover:from-[#E20074]/10 group-hover:to-[#7C4DFF]/5 rounded-2xl transition-all" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E20074] to-[#7C4DFF] mx-auto mb-6 flex items-center justify-center text-3xl font-bold">
                  {member.name[0]}
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {member.name}
                </h3>

                <p className="text-gray-400 text-center mb-6">
                  {member.role}
                </p>

                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    className="w-10 h-10 rounded-lg border border-gray-800 flex items-center justify-center hover:border-[#E20074] hover:bg-[#E20074]/10 transition-all"
                  >
                    <Github className="w-5 h-5 text-gray-400 group-hover:text-[#E20074]" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-10 h-10 rounded-lg border border-gray-800 flex items-center justify-center hover:border-[#E20074] hover:bg-[#E20074]/10 transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-[#E20074]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Supported By
          </h3>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.2}s both`
              }}
            >
              <div className="relative w-32 h-32 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 flex items-center justify-center hover:border-gray-700 transition-all hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/0 to-[#7C4DFF]/0 group-hover:from-[#E20074]/20 group-hover:to-[#7C4DFF]/10 rounded-2xl transition-all" />
                <div className="relative text-4xl font-bold bg-gradient-to-br from-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent">
                  {partner.logo}
                </div>
              </div>
              <p className="text-center mt-4 text-sm text-gray-400">
                {partner.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="group relative px-12 py-5 border-2 border-[#E20074] rounded-lg font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#E20074]/30">
            <div className="absolute inset-0 bg-[#E20074] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">See Full Case Study</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
