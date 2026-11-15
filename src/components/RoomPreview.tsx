import React from 'react';
import { Sparkles } from 'lucide-react';
import { DesignWorkspace } from './DesignWorkspace';

interface RoomPreviewProps {
  onSelectPlanInterest?: (styleName: string) => void;
}

export const RoomPreview: React.FC<RoomPreviewProps> = ({ onSelectPlanInterest }) => {
  return (
    <section id="preview" className="py-20 bg-[#FAF7F2] relative overflow-hidden">
      {/* Decorative background aura with signature mocha & walnut */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#5F4336]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#866350]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5F4336]/10 border border-[#5F4336]/20 text-[#5F4336] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive 3D Interior Designing Studio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight mb-4">
            Interactive 3D Room Designing Workspace
          </h2>
          <p className="text-[#606E66] text-base sm:text-lg leading-relaxed">
            Design your full residence floor plan in real-time. Drag and arrange furniture across all rooms, 
            customize dimensions, colors, and materials, and save your custom home space plan.
          </p>
        </div>

        {/* Master Interactive 3D CAD Designing Workspace */}
        <DesignWorkspace onSelectPlanInterest={onSelectPlanInterest} />
      </div>
    </section>
  );
};
