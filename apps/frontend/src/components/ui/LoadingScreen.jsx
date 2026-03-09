import React from 'react';
import { motion } from 'framer-motion';
import logoImg from "../../assets/logo-loading.png";

export const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white"
        >
            {/* Curtain Layers */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[#00513e] animate-curtain-down"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#00513e] animate-curtain-up"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Floating Logo Ring */}
                <div className="relative mb-8 h-32 w-32 flex items-center justify-center animate-float">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5 scale-125"></div>
                    <div className="absolute inset-0 rounded-full border-[2px] border-t-[#d62828] border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>

                    <div className="bg-white p-2 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.2)] animate-pulse-subtle flex items-center justify-center overflow-hidden">
                        <img
                            src={logoImg}
                            alt="Mamma Palermo Logo"
                            className="w-28 h-28 object-contain"
                        />
                    </div>
                </div>

                {/* Grand Entrance Text */}
                <div className="overflow-hidden h-14 md:h-24 flex items-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase animate-text-reveal">
                        Mamma Palermo
                    </h2>
                </div>

                {/* Visual Accent */}
                <div className="mt-6 flex items-center gap-4 opacity-0 animate_fade_in_up">
                    <div className="h-px w-10 bg-[#d62828]"></div>
                    <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-black text-white/70">
                        L'Authentique Goût de l'Italie
                    </p>
                    <div className="h-px w-10 bg-[#d62828]"></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes text-reveal {
                    0% { transform: translateY(110%); }
                    100% { transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes curtain-down {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(0); }
                }
                @keyframes curtain-up {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(0); }
                }
                .animate-text-reveal {
                    animation: text-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .animate_fade_in_up {
                    animation: fade-in-up 1s ease-out 0.8s forwards;
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 2s ease-in-out infinite;
                }
                .animate-curtain-down {
                    animation: curtain-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-curtain-up {
                    animation: curtain-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </motion.div>
    );
};
