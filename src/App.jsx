import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ConceptSection } from "./components/sections/ConceptSection";
import { ProductsSection } from "./components/sections/ProductsSection";
import { QualitySection } from "./components/sections/QualitySection";
import { RestaurantsSection } from "./components/sections/RestaurantsSection";
import { Footer } from "./components/layout/Footer";
import Menu from "./menu/Menu";
import Carte from "./carte/Carte";
import Contact from "./contact/Contact"

function MainPage() {
  const aboutRef = useRef(null);
  const conceptRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToConcept = () => {
    if (conceptRef.current) {
      conceptRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-forma_djr_display md:bg-[linear-gradient(to_right,rgb(255,255,255),rgb(255,255,255)_7.69231%,rgb(0,81,62)_7.69231%,rgb(0,81,62)_15.3846%,rgb(255,255,255)_15.3846%,rgb(255,255,255)_23.0769%,rgb(0,81,62)_23.0769%,rgb(0,81,62)_30.7692%,rgb(255,255,255)_30.7692%,rgb(255,255,255)_38.4615%,rgb(0,81,62)_38.4615%,rgb(0,81,62)_46.1538%,rgb(255,255,255)_46.1538%,rgb(255,255,255)_53.8462%,rgb(0,81,62)_53.8462%,rgb(0,81,62)_61.5385%,rgb(255,255,255)_61.5385%,rgb(255,255,255)_69.2308%,rgb(0,81,62)_69.2308%,rgb(0,81,62)_76.9231%,rgb(255,255,255)_76.9231%,rgb(255,255,255)_84.6154%,rgb(0,81,62)_84.6154%,rgb(0,81,62)_92.3077%,rgb(255,255,255)_92.3077%,rgb(255,255,255)_100%,rgb(0,81,62)_100%,rgb(0,81,62)_107.692%)]">

      <div className="relative box-border">
        <div className="absolute box-border h-px top-0"></div>
      </div>

      {/* On passe la fonction scroll et les refs au Header */}
      <Header scrollToSection={scrollToSection} refs={{ aboutRef, conceptRef }} />

      <main>
        <HeroSection scrollToAbout={() => scrollToSection(aboutRef)} />
        <AboutSection ref={aboutRef} scrollToConcept={scrollToConcept} />
        <ConceptSection ref={conceptRef} />
        <ProductsSection />
        <QualitySection />
        <RestaurantsSection />
      </main>

      <Footer refs={{ aboutRef, conceptRef }} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/carte" element={<Carte />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
