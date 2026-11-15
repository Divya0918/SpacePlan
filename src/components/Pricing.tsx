import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, HelpCircle, Zap } from 'lucide-react';

interface PricingProps {
  onSelectPlan?: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const handlePlanClick = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
    const element = document.getElementById('contact');
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
    <section id="pricing" className="py-24 bg-[#FAF7F2] relative border-t border-[#EDE6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9633B]/10 border border-[#D9633B]/20 text-[#C24F29] text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Flexible Pricing
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight mb-4">
            Simple Plans for Every Space
          </h2>
          <p className="text-[#606E66] text-base sm:text-lg leading-relaxed">
            Transparent pricing designed for individual homeowners and growing design studios. 
            No surprise fees, no hardware requirements.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-[#EFE8DD] p-1.5 rounded-full border border-[#E0D5C6]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                !isAnnual
                  ? 'bg-white text-[#1A231F] shadow-soft-sm'
                  : 'text-[#64726A] hover:text-[#1A231F]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-[#1C2621] text-white shadow-soft-sm'
                  : 'text-[#64726A] hover:text-[#1A231F]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-[#D9633B] text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (2 required plans) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 items-stretch">
          
          {/* Card 1: Starter Plan – Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] shadow-soft-md hover:shadow-soft-xl transition-all duration-300 flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#1A231F]">Starter Plan</h3>
                  <p className="text-xs text-[#718077] mt-1">Ideal for exploring single-room ideas</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#F5EFE6] text-[#2A4136]">
                  Free Tier
                </span>
              </div>

              {/* Price Display */}
              <div className="my-6 pb-6 border-b border-[#F2ECE2]">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-bold text-[#1A231F]">$0</span>
                  <span className="text-sm font-semibold text-[#7E8D84]">/ forever</span>
                </div>
                <p className="text-xs text-[#89978E] mt-2">No credit card or commitment required</p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  'One active room project at a time',
                  'Basic furniture collection (100+ standard models)',
                  'Basic color palettes & wall textures',
                  '2D room planning & floor dimensioning',
                  'Limited design saving (up to 3 revisions)',
                  'Community forum support',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#48564E]">
                    <div className="w-4 h-4 rounded-full bg-[#FAF5EE] text-[#D9633B] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanClick('Starter Plan (Free)')}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#F5EFE6] hover:bg-[#EDE5D8] text-[#2A4136] font-bold text-xs sm:text-sm transition-all duration-200 border border-[#E0D5C6] flex items-center justify-center gap-2 group"
            >
              <span>Start for Free</span>
              <ArrowRight className="w-4 h-4 text-[#2A4136] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Studio Plan – $12/month (Popular Highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#1C2621] rounded-3xl p-8 sm:p-10 border-2 border-[#D9633B] shadow-soft-xl transition-all duration-300 flex flex-col justify-between relative text-white"
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 right-8 bg-[#D9633B] text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Most Popular Option
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-white">Studio Plan</h3>
                  <p className="text-xs text-white/70 mt-1">For passionate decorators & interior stylists</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  Full Access
                </span>
              </div>

              {/* Price Display */}
              <div className="my-6 pb-6 border-b border-white/15">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-bold text-white">
                    {isAnnual ? '$10' : '$12'}
                  </span>
                  <span className="text-sm font-semibold text-white/70">/ month</span>
                </div>
                <p className="text-xs text-white/60 mt-2">
                  {isAnnual ? 'Billed annually ($120/yr). Save $24.' : 'Billed monthly. Cancel anytime.'}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  'Unlimited room projects & floor plan saves',
                  'Complete furniture library (5,000+ designer items)',
                  'Interactive 3D previews & 4K photorealistic renders',
                  'Advanced customization (lighting moods, custom colors)',
                  'Save and compare unlimited design variations',
                  'Priority architectural customer support & CAD export',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                    <div className="w-4 h-4 rounded-full bg-[#D9633B] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanClick('Studio Plan ($12/mo)')}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#D9633B] hover:bg-[#C24F29] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Choose Studio</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

        </div>

        {/* Pricing Disclaimer Note */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-[#839189] flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#D9633B]" />
            <span>
              All plans include 14-day risk-free access. Transparent SaaS pricing with zero hidden fees.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};
