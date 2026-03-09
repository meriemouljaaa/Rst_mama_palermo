import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigationData } from "../../data/navigationData";
import standardLogo from "../../assets/logos/logo_navbar.png";
import whiteLogo from "../../assets/logos/logo_navbar_white.png";

export function Header({ scrollToSection, refs }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100); // Changer après 100px de scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour gérer scroll ou navigation vers la page principale
  const handleClick = (item) => {
    setIsMenuOpen(false); // Close menu on click
    if (location.pathname === "/" && (item.id === "about" || item.id === "concept")) {
      const ref = refs[item.id + "Ref"];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.href);
    }
  };

  return (
    <header
      className={`fixed box-border w-full z-[100] left-0 top-0 transition-all duration-500 ease-in-out ${isScrolled
        ? "h-[65px] md:h-[70px] bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-white/20"
        : "h-[80px] md:h-[100px] bg-transparent"
        } ${isMenuOpen ? "h-screen bg-emerald-950 shadow-none !backdrop-blur-none" : ""}`}
    >
      <nav
        aria-label="Navigation principale"
        className="items-stretch box-border flex h-full max-w-[1960px] w-full mx-auto px-6 md:px-12 transition-all duration-500"
      >
        <Link
          to="/"
          className={`relative flex items-center self-center transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"
            }`}
        >
          <img
            src={isScrolled ? standardLogo : whiteLogo}
            alt="Mamma Palermo"
            className="h-[45px] md:h-[55px] w-auto object-contain transition-all duration-500"
          />
        </Link>

        {/* Hamburger menu pour mobile */}
        <button
          type="button"
          className="ml-auto relative flex items-center justify-center w-12 h-12 md:hidden focus:outline-none z-50"
          onClick={toggleMenu}
        >
          <div className="flex flex-col gap-1.5 w-8">
            <span className={`h-[2px] w-8 rounded-full transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-emerald-900" : "bg-white"
              } ${isMenuOpen ? "rotate-45 translate-y-[8px]" : ""}`}></span>
            <span className={`h-[2px] w-5 rounded-full transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-emerald-900" : "bg-white"
              } ${isMenuOpen ? "opacity-0 translate-x-2" : "ml-auto"}`}></span>
            <span className={`h-[2px] w-8 rounded-full transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-emerald-900" : "bg-white"
              } ${isMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></span>
          </div>
        </button>

        {/* Navigation Bureau */}
        <div className="hidden md:flex items-center ml-auto gap-8 lg:gap-12">
          <ul className="flex items-center list-none p-0 gap-6 lg:gap-10">
            {navigationData.mainNavigation.map((item) => (
              <li key={item.id} className="relative group">
                <button
                  onClick={() => handleClick(item)}
                  className={`relative py-2 text-sm lg:text-base font-bold uppercase tracking-widest transition-all duration-300 font-forma_djr_display ${isScrolled ? "text-emerald-900" : "text-white"
                    }`}
                >
                  {item.label}
                  {/* Underline animated effect */}
                  <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-emerald-900" : "bg-red-500"
                    }`}></span>
                </button>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className={`px-8 py-2.5 rounded-full font-bold uppercase tracking-tighter text-sm transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isScrolled
              ? "bg-emerald-900 text-white hover:bg-emerald-800"
              : "bg-white text-emerald-900 hover:bg-gray-100"
              }`}
          >
            Contact
          </Link>
        </div>

        {/* Navigation Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-emerald-950 transition-all duration-700 ease-in-out md:hidden flex flex-col items-center justify-center px-8 text-center ${isMenuOpen ? "clip-path-open opacity-100" : "clip-path-closed opacity-0 pointer-events-none"
            }`}
        >
          {/* Decorative background logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none transform scale-[2]">
            <img src={whiteLogo} alt="" className="w-full h-auto" />
          </div>

          <ul className="list-none p-0 flex flex-col gap-10 relative z-10 w-full">
            {navigationData.mainNavigation.map((item, index) => (
              <li
                key={item.id}
                className={`transition-all duration-700 transform ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => handleClick(item)}
                  className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter hover:text-red-500 transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className={`mt-10 transition-all duration-700 delay-500 transform ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="inline-block px-12 py-4 bg-red-600 text-white rounded-full text-xl font-bold uppercase tracking-widest shadow-2xl"
              >
                Nous Contacter
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .clip-path-closed {
          clip-path: circle(0% at 90% 5%);
        }
        .clip-path-open {
          clip-path: circle(150% at 90% 5%);
        }
      `}</style>
    </header>
  );
}
