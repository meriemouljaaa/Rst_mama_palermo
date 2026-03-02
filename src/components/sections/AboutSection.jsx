import React, { forwardRef } from "react";
import { ArrowRight, UtensilsCrossed, Heart, Leaf } from "lucide-react";
import restaurantImg from "../../assets/restaurant_about.jpg";

export const AboutSection = forwardRef(({ scrollToConcept }, ref) => {
  return (
    <section id="apropos" className="bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div ref={ref} className="relative z-10 box-border max-w-full w-full mx-auto px-5 py-[80px] md:px-[60px] md:py-[160px]">
        <div className="box-border gap-x-12 flex flex-col-reverse lg:flex-row max-w-[1400px] gap-y-12 mx-auto items-center">

          <div className="flex-1 w-full space-y-8">
            <div className="inline-flex items-center space-x-2 text-red-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <span className="w-12 h-[2px] bg-red-600 block"></span>
              <span>Notre Histoire</span>
            </div>

            <h2 className="text-[40px] md:text-[50px] lg:text-[60px] font-medium text-emerald-950 tracking-[-2px] leading-[1.1] font-souvenir relative">
              Bienvenue chez <br />
              <span className="text-[#C03434] relative inline-block">
                MAMMA PALERMO
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-100" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15, 100 5 L 100 10 L 0 10 Z" fill="currentColor"></path>
                </svg>
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 font-forma_djr_display leading-relaxed max-w-2xl">
              Passion intemporelle, tradition italienne authentique et ingrédients d'une qualité exceptionnelle vous attendent à chaque bouchée.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {[
                { icon: <UtensilsCrossed className="w-6 h-6 text-[#C03434]" />, title: "Tradition", desc: "Recettes familiales" },
                { icon: <Leaf className="w-6 h-6 text-[#C03434]" />, title: "Fraîcheur", desc: "Produits locaux" },
                { icon: <Heart className="w-6 h-6 text-[#C03434]" />, title: "Passion", desc: "Fait avec amour" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-50 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <span className="text-sm text-gray-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={scrollToConcept}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-[#C03434] text-white font-medium text-lg uppercase tracking-wider px-10 py-5 rounded-full hover:shadow-xl hover:shadow-red-200 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="relative z-10">Découvrir le concept</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 h-full w-full bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end relative">
            <div className="relative group">
              <div className="absolute -inset-4 bg-red-100/50 rounded-[60px] blur-2xl group-hover:bg-red-200/50 transition-all duration-500 group-hover:scale-105"></div>
              <figure className="relative z-10 overflow-hidden rounded-[40px] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-700 ease-out max-w-lg">
                <img
                  src={restaurantImg}
                  alt="Restaurant Mamma Palermo"
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </figure>
              {/* Decorative badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 border border-red-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500 hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">🇮🇹</div>
                  <span className="font-bold text-sm text-emerald-950 uppercase tracking-tighter">Authentique</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
