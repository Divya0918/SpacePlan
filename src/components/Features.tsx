import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Move3d, 
  Palette, 
  LayoutGrid, 
  SunMedium, 
  FileSpreadsheet, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Box,
      title: 'Live Room Customizer',
      badge: 'Interactive WebGL',
      description: 'Select wall colors, switch interior styles, preview different room appearances, and experiment with real-time furniture placement in 60 FPS.',
      accent: 'border-[#D9633B]/30 hover:border-[#D9633B]',
      iconBg: 'bg-[#D9633B]/10 text-[#D9633B]',
      detail: 'Colors, styles & placement tools',
    },
    {
      icon: Move3d,
      title: 'Smart Furniture Placement',
      badge: 'Magnetic Snapping',
      description: 'Explore furniture and arrange sofas, tables, beds, chairs, and other objects with intelligent collision prevention, dimension clearance, and snap-to-wall.',
      accent: 'border-[#2A4136]/30 hover:border-[#2A4136]',
      iconBg: 'bg-[#2A4136]/10 text-[#2A4136]',
      detail: '5,000+ real designer catalog items',
    },
    {
      icon: Palette,
      title: 'Color & Material Customization',
      badge: 'Photorealistic PBR',
      description: 'Experiment with wall colors, floor materials, fabric upholstery, and different interior combinations to create a harmonized aesthetic tone.',
      accent: 'border-amber-500/30 hover:border-amber-500',
      iconBg: 'bg-amber-500/10 text-amber-600',
      detail: 'Wood parquet, boucle, linen & stone',
    },
    {
      icon: LayoutGrid,
      title: 'Room Layout Planner',
      badge: '2D & 3D Sync',
      description: 'Create room layouts, organize furniture, enter wall dimensions, and save multiple design ideas for effortless side-by-side comparison.',
      accent: 'border-emerald-600/30 hover:border-emerald-600',
      iconBg: 'bg-emerald-600/10 text-emerald-700',
      detail: 'Architectural scale accuracy to 1mm',
    },
    {
      icon: SunMedium,
      title: 'Daylight & Mood Simulation',
      badge: 'Dynamic Raycasting',
      description: 'Simulate natural sunlight according to geographic orientation, observe golden hour sunbeams, and test warm ambient evening lighting fixtures.',
      accent: 'border-orange-400/30 hover:border-orange-400',
      iconBg: 'bg-orange-400/10 text-orange-600',
      detail: 'Morning, noon, sunset & night modes',
    },
    {
      icon: FileSpreadsheet,
      title: 'Instant Specs & Shopping Export',
      badge: '1-Click Deliverable',
      description: 'Generate high-resolution 4K render snapshots, full dimensional blueprints, and complete itemized bills of materials to hand over to contractors.',
      accent: 'border-[#1C2621]/30 hover:border-[#1C2621]',
      iconBg: 'bg-[#1C2621]/10 text-[#1C2621]',
      detail: 'Export to PDF, PNG & CAD format',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#F5EFE6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A4136]/10 border border-[#2A4136]/20 text-[#2A4136] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D9633B]" />
            Comprehensive Capabilities
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight mb-4">
            Everything You Need to Create Your Dream Space
          </h2>
          <p className="text-[#5F6D65] text-base sm:text-lg leading-relaxed">
            Eliminate guesswork from remodeling. SpacePlan delivers intuitive architectural-grade tools 
            engineered for homeowners, interior designers, and decor enthusiasts.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group relative bg-white rounded-3xl p-7 sm:p-8 border transition-all duration-300 shadow-soft-sm hover:shadow-soft-xl flex flex-col justify-between ${feature.accent}`}
              >
                <div>
                  {/* Top row with icon and badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${feature.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF7F2] text-[#55635B] border border-[#EBE3D7]">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A231F] mb-3 group-hover:text-[#D9633B] transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-[#64726A] text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom detail pill */}
                <div className="pt-4 border-t border-[#F2ECE2] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7E8D84]">
                    {feature.detail}
                  </span>
                  <a
                    href="#preview"
                    className="w-7 h-7 rounded-full bg-[#FAF7F2] text-[#2A4136] group-hover:bg-[#D9633B] group-hover:text-white flex items-center justify-center transition-all duration-200"
                    aria-label={`Test ${feature.title} in 3D`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Bottom Callout Bar */}
        <div className="mt-16 bg-[#1C2621] rounded-3xl p-8 sm:p-10 text-white shadow-soft-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D9633B]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="font-serif text-2xl sm:text-3xl font-semibold">
                Want to test your real living room layout right now?
              </h4>
              <p className="text-white/70 text-sm max-w-xl">
                Try our live 3D visualizer above or schedule an interactive product demo with our spatial design team.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#preview"
                className="px-6 py-3 rounded-full bg-[#D9633B] hover:bg-[#C24F29] text-white text-xs font-bold tracking-wide shadow-md transition-all duration-200"
              >
                Launch Live 3D Room
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wide border border-white/20 transition-all duration-200"
              >
                Request Studio Demo
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
