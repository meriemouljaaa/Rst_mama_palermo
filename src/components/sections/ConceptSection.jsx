import React, { useState, forwardRef } from "react";
import palermoImg from "/src/assets/palermo-sicily.jpg";
import chefImg from "../../assets/chef.jpg";
import ambianceImg from "../../assets/restaurant.jpg";
import { storyStepsData } from "../../data/storyStepsData";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";

export const ConceptSection = forwardRef((props, ref) => {
  const [activeStep, setActiveStep] = useState(0);

  // Decorative images mapped to steps for dynamic background change
  const stepImages = [
    palermoImg,
    chefImg,
    ambianceImg,
  ];

  return (
    <section id="concept" ref={ref} className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-emerald-950 flex items-center py-12 md:py-16">
      {/* Dynamic Background Image */}
      {stepImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeStep ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={img}
            alt="Ambience"
            className="w-full h-full object-cover"
          />
          {/* Elegant dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Content Column */}
          <div className="lg:col-span-5 space-y-8">

            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">
                <span className="w-8 h-[2px] bg-emerald-400 block"></span>
                <span>{storyStepsData[activeStep].subtitle}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-souvenir text-white leading-tight">
                {storyStepsData[activeStep].title}
              </h2>
            </div>

            {/* Step Navigation Dots */}
            <div className="flex space-x-3">
              {storyStepsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`relative h-1.5 rounded-full transition-all duration-500 overflow-hidden ${index === activeStep ? "w-12 bg-white/20" : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                >
                  {index === activeStep && (
                    <span className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="relative">
              <Quote className="absolute -top-5 -left-5 w-10 h-10 text-emerald-500/20 rotate-180" />
              <p className="text-lg lg:text-xl text-emerald-50 font-forma_djr_display leading-relaxed relative z-10 pb-4 border-b border-white/10">
                {storyStepsData[activeStep].content}
              </p>

              <div className="mt-4 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-xl border border-emerald-400/20">
                  {storyStepsData[activeStep].icon}
                </div>
                <p className="font-semibold text-emerald-300 font-forma_djr_display tracking-wide uppercase text-xs">
                  {storyStepsData[activeStep].highlight}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : storyStepsData.length - 1))}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-emerald-950 transition-all duration-300 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < storyStepsData.length - 1 ? prev + 1 : 0))}
                className="w-12 h-12 rounded-full border border-emerald-400 bg-emerald-400 flex items-center justify-center text-emerald-950 hover:bg-emerald-300 transition-all duration-300 group"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Floating Cards Grid */}
          <div className="lg:col-span-7 relative hidden lg:block h-[500px]">
            {storyStepsData.map((step, index) => {
              const isActive = index === activeStep;
              const isPrev = index === (activeStep - 1 + storyStepsData.length) % storyStepsData.length;
              const isNext = index === (activeStep + 1) % storyStepsData.length;

              let transformClass = "translate-x-full opacity-0 scale-90";
              let zIndexClass = "z-0";

              if (isActive) {
                transformClass = "translate-x-10 translate-y-0 opacity-100 scale-100 rotate-2";
                zIndexClass = "z-30";
              } else if (isPrev) {
                transformClass = "-translate-x-20 -translate-y-10 opacity-40 scale-95 -rotate-6";
                zIndexClass = "z-20";
              } else if (isNext) {
                transformClass = "translate-x-40 translate-y-10 opacity-40 scale-95 rotate-6";
                zIndexClass = "z-10";
              }

              return (
                <div
                  key={index}
                  className={`absolute top-1/2 -mt-32 right-10 w-72 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[30px] shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${transformClass} ${zIndexClass}`}
                >
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-2 font-souvenir">{step.subtitle}</h4>
                  <p className="text-emerald-100/70 text-xs font-forma_djr_display">{step.title}</p>
                </div>
              );
            })}

            {/* Visual element representing "Notre Engagement" glowing behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
          </div>

        </div>
      </div>
    </section>
  );
});
