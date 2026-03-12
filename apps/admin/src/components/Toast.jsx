import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [paused, onClose]);

    return (
        <div 
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] min-w-[260px] max-w-[90vw] overflow-hidden rounded-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border-2 backdrop-blur-2xl animate-notification flex flex-col cursor-default group transition-all duration-300 ${
                type === 'success' 
                    ? 'bg-emerald-50/95 border-emerald-500/20' 
                    : 'bg-red-50/95 border-red-500/20'
            } ${paused ? 'pause-animation' : ''}`} 
            style={{ transformOrigin: 'top center' }}
        >
            {/* Subtle Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br opacity-5 pointer-events-none ${
                type === 'success' ? 'from-emerald-500 to-transparent' : 'from-red-500 to-transparent'
            }`} />
            
            <div className="relative p-2.5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 ${paused ? 'scale-105' : ''} ${
                    type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <Info size={18} strokeWidth={2.5} />
                </div>
                
                <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[13px] font-bold text-gray-800 leading-tight break-words">
                            {message}
                        </p>
                        {paused && (
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-2 bg-gray-100 px-1 rounded">Paused</span>
                        )}
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shrink-0"
                >
                    <X size={12} strokeWidth={3} />
                </button>
            </div>

            {/* Ultra Compact Progress Bar */}
            <div className="w-full h-0.5 bg-gray-100 relative mt-auto">
                <div className={`absolute top-0 left-0 h-full animate-progress ${
                    type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
            </div>
        </div>
    );
}
