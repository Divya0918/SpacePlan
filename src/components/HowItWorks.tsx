import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Ruler, 
  Palette, 
  Eye, 
  ArrowRight, 
  Check, 
  Compass, 
  SlidersHorizontal,
  Share2
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Start with Your Room',
      subtitle: 'Input dimensions or pick a floor plan blueprint',
      icon: Ruler,
      description: 'Choose your room geometry (Living Room, Bedroom, Studio Apartment, Open Loft) or type in exact architectural wall dimensions. Doors, windows, and structural columns snap directly into place.',
      highlights: [
        'Precise metric or imperial millimeter accuracy',
        'Standard architectural room templates',
        'Quick mobile camera LiDAR room scanning support',
      ],
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      tag: 'Step 1 • Foundation',
    },
    {
      step: '02',
      title: 'Customize Your Design',
      subtitle: 'Curate furniture, textures, and personalized aesthetics',
      icon: Palette,
      description: 'Browse our expansive library of 5,000+ real-world furniture items. Drag-and-drop seating, rugs, tables, lighting fixtures, and experiment freely with wall paint swatches and timber grains.',
      highlights: [
        '5,000+ designer catalog pieces with verified dimensions',
        'Real-time PBR material swatches (wood, fabric, stone, brass)',
        'Magnetic auto-alignment and clearance distance safety',
      ],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      tag: 'Step 2 • Styling',
    },
    {
      step: '03',
      title: 'Preview Your Dream Space',
      subtitle: 'Walk through in 3D, simulate lighting, and export',
      icon: Eye,
      description: 'Experience your fully realized space in fluid 60 FPS 3D. Switch daylight conditions from sunrise to golden hour, take high-resolution render snapshots, and share interactive links with contractors.',
      highlights: [
        'Real-time orbital 3D perspective and blueprint view',
        'Geographic solar simulation & ambient fixture glow',
        '1-click export of bills of materials, spec sheets & PDF renders',
      ],
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      tag: 'Step 3 • Realization',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9633B]/10 border border-[#D9633B]/20 text-[#C24F29] text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            Simple 3-Step Process
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight mb-4">
            From Empty Space to Beautiful Place
          </h2>
          <p className="text-[#606E66] text-base sm:text-lg leading-relaxed">
            Transforming a room should be joyful, not overwhelming. Here is how SpacePlan turns 
            your conceptual sketches into an interactive reality in minutes.
          </p>
        </div>

        {/* 3 Step Process Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeTab === index;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={() => setActiveTab(index)}
                className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#D9633B] shadow-soft-xl ring-2 ring-[#D9633B]/10'
                    : 'bg-[#FDFBF7] border-[#E8DFD3] hover:border-[#D5CABB] shadow-soft-sm'
                }`}
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-4xl font-bold text-[#E2D5C3]">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#D9633B] text-white' : 'bg-[#EFE8DD] text-[#2A4136]'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Step Title & Subtitle */}
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9633B] mb-2 block">
                    {item.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#1A231F] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#637169] text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-[#F2ECE2] space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#4C5B52]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Step Deep Dive Spotlight */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-soft-lg p-6 sm:p-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4ED] text-[#D9633B] text-xs font-bold uppercase">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Featured Workflow Focus
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A231F]">
                {steps[activeTab].title} – {steps[activeTab].subtitle}
              </h3>
              <p className="text-[#5B6A62] text-sm sm:text-base leading-relaxed">
                {steps[activeTab].description} With SpacePlan, everything runs natively in your browser. 
                No high-end graphics workstation or heavy software downloads required.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#preview"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2A4136] hover:bg-[#1C2621] text-white text-xs font-bold transition-all"
                >
                  <span>Test in 3D Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE7DB] text-[#2A4136] border border-[#E5DCD0] text-xs font-semibold transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D9633B]" />
                  <span>Request Full Walkthrough</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#EFECE6] border border-[#E5DDD2] shadow-soft-md">
                <img
                  src={steps[activeTab].image}
                  alt={steps[activeTab].title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1A231F] shadow-soft-sm">
                  {steps[activeTab].tag}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
