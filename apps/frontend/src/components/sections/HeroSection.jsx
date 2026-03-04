import React from 'react';
import pizzaBackground from "../../assets/Herosection.jpg"
import { ChevronDown, Sparkles } from 'lucide-react';

export function HeroSection({ scrollToAbout }) {
  return (
    <div className="box-border">
      <section className="relative text-white bg-emerald-900 box-border flex max-h-none min-h-[80vh] md:min-h-[800px] items-center justify-center overflow-hidden">

        {/* Decoratve Vignette Overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-[2] mix-blend-multiply pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative box-border flex flex-col items-center justify-center max-w-5xl w-full z-[3] mx-auto px-5 text-center pt-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium tracking-widest text-emerald-50 uppercase font-forma_djr_display">L'Authentique Goût de l'Italie</span>
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.2em] mb-4 font-syncopate drop-shadow-2xl">
            <span className="bg-gradient-to-r from-emerald-400 via-white/95 to-red-500 bg-clip-text text-transparent">
              MΛMMΛ PΛLERMO
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl font-light mb-6 font-forma_djr_display text-gray-200 max-w-3xl drop-shadow-lg leading-relaxed">
            Pizzas artisanales, amour véritable, et ingrédients frais choisis avec le cœur.
          </p>

          <button
            onClick={scrollToAbout}
            className="group flex flex-col items-center gap-2 mt-4 animate-bounce transition duration-500 hover:text-emerald-400"
          >
            <span className="text-sm uppercase tracking-widest font-semibold font-forma_djr_display text-white/80 group-hover:text-emerald-400 transition-colors">Découvrir</span>
            <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full flex justify-center items-center border border-white/30 group-hover:border-emerald-400 group-hover:bg-white/20 transition-all duration-300">
              <ChevronDown className="w-6 h-6" />
            </div>
          </button>
        </div>

        {/* Footer info in Absolute positions */}
        <div className="absolute bottom-24 right-10 z-[3] hidden md:flex flex-col text-right items-end opacity-80 hover:opacity-100 transition-opacity">
          <p className="text-xl font-medium box-border leading-5 font-forma_djr_display mb-2 border-b border-transparent hover:border-white transition-all cursor-pointer">mammapalermo.com</p>
          <p className="text-xl font-medium box-border leading-5 font-forma_djr_display border-b border-transparent hover:border-white transition-all cursor-pointer">@mammapalermo</p>
        </div>

        <img
          src={pizzaBackground}
          className="absolute italic aspect-[auto_2288_/_1526] bg-no-repeat bg-cover box-border h-full max-w-full object-cover w-full z-[1] left-0 top-0 transition-transform duration-[20s] ease-linear hover:scale-110 object-[center_30%]"
        />
      </section>
    </div>
  );
}
