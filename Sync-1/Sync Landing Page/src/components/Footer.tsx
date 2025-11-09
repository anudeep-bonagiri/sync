import { ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import catIcon from '../assets/cat-icon.png';

export default function Footer() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <footer ref={ref} className="relative py-8 md:py-10 px-6 bg-[#0A0A0A] overflow-hidden border-t border-gray-800/50">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E20074] to-transparent" />
      
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#E20074] rounded-full blur-[100px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#7C4DFF] rounded-full blur-[100px] opacity-10" />
      </div>

      {/* Bottom decorative gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left side - Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={catIcon} 
                alt="Sync Cat" 
                className="w-12 h-12 md:w-14 md:h-14 relative z-10 drop-shadow-[0_0_15px_rgba(226,0,116,0.6)]" 
              />
              <div className="absolute inset-0 blur-xl bg-[#E20074] opacity-30 animate-pulse" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
              Sync
            </h3>
          </div>

          {/* Center - Description */}
          <p className="text-sm text-gray-500 text-center max-w-md hidden md:block">
            Self-healing AI that fixes networks before anyone notices
          </p>

          {/* Right side - Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://devpost.com/software/sync-ai-gltbhz?ref_content=user-portfolio&ref_feature=in_progress"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-800 hover:border-[#E20074] transition-all duration-300 ease-out hover:bg-[#E20074]/10 transform-gpu"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#E20074] transition-colors duration-300" />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">Devpost</span>
            </a>

            <a
              href="https://www.youtube.com/watch?v=hfMk-kjRv4c"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E20074] to-[#7C4DFF] hover:shadow-lg hover:shadow-[#E20074]/50 transition-all duration-300 ease-out hover:scale-105 transform-gpu"
            >
              <ExternalLink className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Live Demo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative bottom elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E20074]/50 to-transparent" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#7C4DFF]/30 to-transparent" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-[#E20074]/20 to-transparent" />
    </footer>
  );
}
