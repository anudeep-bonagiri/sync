import { Github, Linkedin, ExternalLink, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-20 px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E20074] to-transparent" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E20074] rounded-full blur-[150px] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center">
          <div className="mb-8 relative">
            <Zap className="w-16 h-16 text-[#E20074]" strokeWidth={1.5} />
            <div className="absolute inset-0 blur-2xl bg-[#E20074] opacity-50 animate-pulse" />
          </div>

          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Adaptive Network Repair Agent
          </h3>

          <p className="text-gray-400 mb-8 max-w-md text-center">
            Self-healing AI that fixes networks before anyone notices
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a
              href="#"
              className="group flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-800 hover:border-[#E20074] transition-all hover:bg-[#E20074]/10"
            >
              <Github className="w-5 h-5 text-gray-400 group-hover:text-[#E20074] transition-colors" />
              <span className="text-gray-400 group-hover:text-white transition-colors">GitHub</span>
            </a>

            <a
              href="#"
              className="group flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-800 hover:border-[#E20074] transition-all hover:bg-[#E20074]/10"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-[#E20074] transition-colors" />
              <span className="text-gray-400 group-hover:text-white transition-colors">LinkedIn</span>
            </a>

            <a
              href="#"
              className="group flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#E20074] to-[#7C4DFF] hover:shadow-2xl hover:shadow-[#E20074]/50 transition-all hover:scale-105"
            >
              <ExternalLink className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Live Demo</span>
            </a>
          </div>

          <div className="w-full border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-500">
                Built for HackUTD 2025
              </p>

              <p className="text-sm text-gray-500">
                Powered by NVIDIA and T-Mobile technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
