import React from 'react';
import pizza from "../../assets/pizza_background.jpg"
import spaghetti from "../../assets/spaghetti.jpg"
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";

export function RestaurantsSection() {
  return (
    <div className="relative bg-white text-emerald-950 overflow-hidden py-16 md:py-24">
      {/* Decorative patterns - simplified for light background */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-20">

        {/* Text Content */}
        <div className="w-full md:w-5/12 space-y-6">
          <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-[0.2em] text-sm mb-1">
            <span className="w-12 h-[2px] bg-emerald-600 block"></span>
            <span>Un lieu d'exception</span>
          </div>

          <h2 className="text-[38px] md:text-[50px] lg:text-[60px] font-medium tracking-tight leading-[1.1] font-souvenir text-emerald-950">
            Découvrez notre <br />
            <span className="text-emerald-600 italic font-light">lieu sincère</span>
          </h2>

          <p className="text-lg md:text-xl text-emerald-900/70 font-forma_djr_display leading-relaxed">
            Un cadre chaleureux et convivial pour partager un moment inoubliable. Sur place ou à emporter.
          </p>

          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                <MapPin className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <strong className="block text-base font-souvenir text-emerald-900">Mamma Palermo</strong>
                <span className="text-emerald-800/60 text-xs font-forma_djr_display">Residence Abdelhadi RDC, Centre, Bouskoura 27182</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/carte"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">Notre Restaurant</span>
              <div className="absolute inset-0 h-full w-full bg-emerald-700 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
            </Link>
          </div>
        </div>

        {/* Layered Images */}
        <div className="w-full md:w-7/12 relative min-h-[400px] lg:min-h-[500px] flex items-center justify-center">

          <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-[100px] -z-10"></div>

          <div className="relative w-full max-w-[400px] aspect-[4/5] md:ml-auto group">
            <img
              alt="Mamma Palermo Ambiance"
              src={pizza}
              className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_rgba(6,78,59,0.15)] z-10 group-hover:-translate-y-4 group-hover:rotate-1 transition-all duration-700"
            />

            <img
              alt="Mamma Palermo Plats"
              src={spaghetti}
              className="absolute -left-10 bottom-10 w-2/3 aspect-square object-cover rounded-3xl shadow-2xl z-20 border-6 border-white group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:-rotate-3 transition-all duration-700"
            />

            {/* Floating Badge */}
            <div className="absolute -right-4 top-12 z-30 bg-emerald-600 text-white p-3 rounded-full shadow-2xl flex flex-col items-center justify-center w-20 h-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <span className="font-forma_djr_display font-bold text-lg leading-none block">100%</span>
              <span className="font-souvenir text-xs uppercase tracking-wider block">Frais</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
