import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E8DFD3] shadow-soft-xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EFE8DD] flex items-center justify-between bg-[#FAF7F2]">
          <h3 id="modal-title" className="font-serif text-xl font-semibold text-[#1A231F]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EAE1D3] text-[#55635B] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#4E5B53] leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EFE8DD] bg-[#FAF7F2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1C2621] text-white text-xs font-bold hover:bg-[#2A3730] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
