
import React from 'react';
import { X, Crown, Phone, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'customer' | 'provider';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, userRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-amber-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 bg-white/50 rounded-full p-1"
        >
          <X size={20} />
        </button>
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden">
            {/* Decorative BG elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
                <div className="mx-auto bg-gradient-to-br from-amber-300 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/50 mb-4 border-2 border-white/20">
                    <Crown size={32} className="text-white fill-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
                <p className="text-slate-300 text-sm">
                    Unlock premium connectivity.
                </p>
            </div>
        </div>

        <div className="p-6 space-y-5">
            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="bg-amber-100 p-2 rounded-full">
                    <Phone size={20} className="text-amber-600" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Direct Calling</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Get priority access to {userRole === 'provider' ? 'customers' : 'verified providers'} via secure, direct phone calls.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                    <Zap size={18} className="fill-white" />
                    Upgrade Now • Rs. 500/mo
                </button>
                <button onClick={onClose} className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors">
                    Maybe Later
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
