import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ConceptSection } from "./components/sections/ConceptSection";
import { ProductsSection } from "./components/sections/ProductsSection";
import { QualitySection } from "./components/sections/QualitySection";
import { RestaurantsSection } from "./components/sections/RestaurantsSection";
import { Footer } from "./components/layout/Footer";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import Menu from "./menu/Menu";
import Contact from "./contact/Contact";
import PageWrapper from "./components/layout/PageWrapper";

function MainPage({ isLoading }) {
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
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-white font-forma_djr_display transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'} md:bg-[linear-gradient(to_right,rgb(255,255,255),rgb(255,255,255)_7.69231%,rgb(0,81,62)_7.69231%,rgb(0,81,62)_15.3846%,rgb(255,255,255)_15.3846%,rgb(255,255,255)_23.0769%,rgb(0,81,62)_23.0769%,rgb(0,81,62)_30.7692%,rgb(255,255,255)_30.7692%,rgb(255,255,255)_38.4615%,rgb(0,81,62)_38.4615%,rgb(0,81,62)_46.1538%,rgb(255,255,255)_46.1538%,rgb(255,255,255)_53.8462%,rgb(0,81,62)_53.8462%,rgb(0,81,62)_61.5385%,rgb(255,255,255)_61.5385%,rgb(255,255,255)_69.2308%,rgb(0,81,62)_69.2308%,rgb(0,81,62)_76.9231%,rgb(255,255,255)_76.9231%,rgb(255,255,255)_84.6154%,rgb(0,81,62)_84.6154%,rgb(0,81,62)_92.3077%,rgb(255,255,255)_92.3077%,rgb(255,255,255)_100%,rgb(0,81,62)_100%,rgb(0,81,62)_107.692%)]`}>
      <div className="relative box-border">
        <div className="absolute box-border h-px top-0"></div>
      </div>

      <main>
        <HeroSection scrollToAbout={() => scrollToSection(aboutRef)} />
        <AboutSection ref={aboutRef} scrollToConcept={scrollToConcept} />
        <ConceptSection ref={conceptRef} />
        <ProductsSection />
        <QualitySection />
        <RestaurantsSection />
      </main>
    </div>
  );
}

function AnimatedRoutes({ isLoading, aboutRef, conceptRef, scrollToSection }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><MainPage isLoading={isLoading} aboutRef={aboutRef} conceptRef={conceptRef} scrollToSection={scrollToSection} /></PageWrapper>} />
        <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const aboutRef = useRef(null);
  const conceptRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Simulation of initial site loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Global socket notification
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`);
    socket.on("orderStatusChanged", (data) => {
      setNotification(`Order #${data.orderId} is now: ${data.status}`);
      setTimeout(() => setNotification(null), 5000);
    });
    return () => socket.disconnect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Router>
      <div className="relative">
        <AnimatePresence>
          {isLoading && (
            <LoadingScreen key="loading-screen" />
          )}
        </AnimatePresence>

        {!isLoading && (
          <div key="app-content" className="relative">
            <Header scrollToSection={scrollToSection} refs={{ aboutRef, conceptRef }} />
            {notification && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[999] bg-green-600 text-white px-6 py-3 rounded-full shadow-xl font-bold transition-all duration-300 animate-bounce">
                🍕 {notification}
              </div>
            )}
            <AnimatedRoutes isLoading={isLoading} aboutRef={aboutRef} conceptRef={conceptRef} scrollToSection={scrollToSection} />
            <FooterWrapper isMobile={isMobile} aboutRef={aboutRef} conceptRef={conceptRef} />
          </div>
        )}
      </div>
    </Router>
  );
}

function FooterWrapper({ isMobile, aboutRef, conceptRef }) {
  const location = useLocation();
  const isMenuMobile = isMobile && location.pathname === "/menu";
  
  if (isMenuMobile) return null;
  return <Footer refs={{ aboutRef, conceptRef }} />;
}
