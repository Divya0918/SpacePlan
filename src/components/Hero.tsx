import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Layers, 
  CheckCircle2, 
  Star, 
  Box, 
  Compass,
  Palette
} from 'lucide-react';

interface HeroProps {
  onStartDesigning?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDesigning }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F6EFEA] to-[#FAF7F2]">
      {/* Subtle architectural grid lines and warm mocha atmospheric glow */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#5F4336 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Featured user palette warm mocha ambient auras */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#5F4336]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#866350]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#9D8374]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Tag featuring the Warm Mocha tone */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFE7E1] border border-[#D6C4B8] shadow-soft-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#5F4336] animate-pulse" />
              <span className="text-xs font-bold text-[#5F4336] tracking-wide uppercase">
                Next-Gen 3D Interior Planning
              </span>
              <span className="text-xs text-[#866350] hidden sm:inline">• Signature Mocha Palette</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6.5xl font-bold tracking-tight text-[#1A231F] leading-[1.12]"
            >
              Your Room. <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#5F4336]">Your Rules.</span> <br />
              Your Vision.
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-[#526058] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Design, customize, and visualize your dream interior in 3D. 
              SpacePlan makes it easy to transform your ideas into beautiful living spaces 
              with realistic materials, designer furniture layouts, and natural lighting simulation.
            </motion.p>

            {/* Action Buttons with signature mocha color */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => {
                  scrollToSection('preview');
                  if (onStartDesigning) onStartDesigning();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5F4336] hover:bg-[#4E362B] text-white font-bold text-sm tracking-wide shadow-soft-lg hover:shadow-soft-xl border border-[#866350]/40 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Launch 3D Design Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-[#F5EFE6] text-[#5F4336] border border-[#D6C4B8] font-semibold text-sm shadow-soft-sm transition-all duration-200"
              >
                <Layers className="w-4 h-4 text-[#5F4336]" />
                <span>Explore Features</span>
              </button>
            </motion.div>

            {/* Trust Statement & Social Proof Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1A231F]">4.9 / 5.0</span>
                <span className="text-xs text-[#7B8A81]">(1,400+ reviews)</span>
              </div>

              <div className="h-4 w-px bg-[#D6CBC0] hidden sm:block" />

              {/* Trust statement */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#4D5A53]">
                <CheckCircle2 className="w-4 h-4 text-[#5F4336]" />
                <span>Trusted by 10,000+ homeowners & interior architects</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual Showcase with Floating Cards */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Main Visual Container with #5F4336 accent frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#5F4336]/40 shadow-soft-xl bg-white p-2 ring-4 ring-[#5F4336]/10">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#EFECE6]">
                  {/* High Quality Interior Photography & 3D Architectural Scene */}
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="SpacePlan Modern 3D Living Room Interior with warm natural light"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Subtle gradient vignette with warm mocha tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                  {/* Corner Badge in #5F4336 */}
                  <div className="absolute top-4 left-4 bg-[#5F4336] text-white px-3.5 py-1.5 rounded-full shadow-soft-md border border-white/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wide">Signature #5F4336 Palette</span>
                  </div>

                  {/* Quick Action to jump to 3D room */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="bg-[#1C2621]/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-medium border border-[#5F4336]/40">
                      Project: <span className="font-semibold text-white">4-Room Suite in #5F4336 Mocha</span>
                    </div>
                    <button
                      onClick={() => scrollToSection('preview')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5F4336] hover:bg-[#4E362B] text-white text-xs font-bold shadow-md transition-all border border-[#866350]/50 transform hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Live Customizer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: 3D Preview Stats */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border-2 border-[#5F4336]/30 shadow-soft-lg z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5F4336] text-white flex items-center justify-center font-bold shadow-soft-sm">
                  <Box className="w-5 h-5 text-[#EFE7E1]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#866350] uppercase tracking-wider">4-Room 3D Studio</div>
                  <div className="text-xs font-bold text-[#1A231F]">Hall • Bed • Kitchen • Garden</div>
                </div>
              </motion.div>

              {/* Floating Card 2: Furniture Customization Palette with User's Color */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-8 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-[#5F4336]/30 shadow-soft-lg z-20 max-w-[280px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#1A231F] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#5F4336]" />
                    Material Finishes
                  </span>
                  <span className="text-[10px] font-bold text-white bg-[#5F4336] px-2 py-0.5 rounded-full">
                    #5F4336
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* User's signature Mocha swatch */}
                  <div className="w-7 h-7 rounded-full bg-[#5F4336] border-2 border-white shadow-md ring-2 ring-[#5F4336] transform scale-110 flex items-center justify-center text-white text-[9px] font-bold" title="Signature Roasted Mocha (#5F4336)">
                    ✓
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#866350] border border-white shadow-soft-sm" title="Walnut Cocoa (#866350)" />
                  <div className="w-6 h-6 rounded-full bg-[#9D8374] border border-white shadow-soft-sm" title="Cedar Taupe (#9D8374)" />
                  <div className="w-6 h-6 rounded-full bg-[#E6E0D5] border border-white shadow-soft-sm" title="Boucle Cream" />
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] border border-white shadow-soft-sm" title="Brushed Brass" />
                </div>
                <div className="text-[10px] text-[#6E7B74] mt-2 font-medium">
                  Active Tone: <strong className="text-[#5F4336]">Roasted Mocha (#5F4336)</strong>
                </div>
              </motion.div>

              {/* Floating Card 3: Room Dimensions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-6 -right-4 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border-2 border-[#5F4336]/30 shadow-soft-lg z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5F4336] text-white flex items-center justify-center font-bold shadow-soft-sm">
                  <Compass className="w-5 h-5 text-[#EFE7E1]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#866350] uppercase tracking-wider">Spatial Area</div>
                  <div className="text-xs font-bold text-[#1A231F]">5.4m × 6.8m (36.7 m²)</div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
