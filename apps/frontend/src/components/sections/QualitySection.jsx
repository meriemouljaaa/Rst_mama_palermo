import React from 'react';
import { qualityFeaturesData } from '../../data/qualityFeaturesData';

export function QualitySection() {
  return (
    <div className="relative bg-emerald-950 py-12 md:py-16 overflow-hidden text-white">
      {/* Decorative details */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center space-x-2 text-emerald-300 font-bold uppercase tracking-[0.2em] text-sm mb-4">
            <span className="w-12 h-[2px] bg-emerald-300 block"></span>
            <span>Un Savoir-Faire Unique</span>
            <span className="w-12 h-[2px] bg-emerald-300 block"></span>
          </div>
          <h2 className="text-[32px] md:text-[45px] font-medium text-white tracking-[-1.5px] leading-[1.1] font-souvenir">
            L'Exigence de la Qualité
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-14">
          {qualityFeaturesData.map((feature, index) => (
            <div
              key={feature.id}
              className="w-full md:w-1/2 flex flex-col items-center text-center group"
            >
              {/* Elegant Arch Image Container */}
              <div className="relative w-full max-w-[240px] aspect-[4/5] mb-5 overflow-hidden rounded-t-[120px] rounded-b-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:-translate-y-3 border border-white/10">
                <div className="absolute inset-0 border-6 border-emerald-900/30 z-20 rounded-t-[120px] rounded-b-xl pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>

                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />

                {/* Floating Decoration */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-souvenir font-medium text-white mb-2 transition-colors duration-300 group-hover:text-emerald-300">
                {feature.title}
              </h3>
              <p className="text-base text-emerald-50/80 font-forma_djr_display leading-relaxed max-w-xs">
                {feature.description}
              </p>

              {/* Small accent line */}
              <div className="w-10 h-[2px] bg-emerald-800 mt-6 group-hover:w-20 group-hover:bg-emerald-400 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}