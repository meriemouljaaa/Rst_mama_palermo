import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationData } from "../../data/navigationData";
import standardLogo from "../../assets/logos/logo_navbar.png";
import whiteLogo from "../../assets/logos/logo_navbar_white.png";

export function Header({ scrollToSection, refs }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
      window.location.href = item.href;
    }
  };

  return (
    <header
      className={`fixed box-border h-[60px] w-full z-[100] left-0 top-0 md:h-[80px] transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-white text-emerald-900 shadow-md" : isMenuOpen ? "bg-emerald-950 text-white shadow-xl" : "text-white bg-transparent"
        }`}
    >
      <nav
        aria-label="Navigation principal"
        className="items-stretch box-border gap-x-2.5 flex h-full max-w-[1960px] gap-y-2.5 w-full mx-auto px-5 md:max-w-[1980px] md:px-[30px]"
      >
        <Link
          title="Retourner sur la page d'accueil"
          to="/"
          className="relative items-center self-center aspect-[517_/_72] box-border flex h-[40px] md:h-[50px] justify-center max-w-[517px] outline-transparent underline decoration-from-font"
        >
          <img
            src={isScrolled ? standardLogo : whiteLogo}
            alt="Mamma Palermo Logo"
            className={`absolute aspect-auto object-contain box-border max-h-[80%] max-w-full translate-x-[-50%] translate-y-[-50%] w-auto z-[2] left-2/4 top-2/4 transition-all duration-300`}
          />
        </Link>

        {/* Hamburger menu pour mobile */}
        <button
          type="button"
          title="Cliquer ici pour afficher tous les liens du menu"
          className="absolute items-center aspect-square bg-transparent gap-x-0 flex h-full justify-center min-h-[60px] min-w-[60px] outline-transparent -outline-offset-2 outline gap-y-0 text-center align-middle z-[3] p-0 right-0 top-0 md:hidden md:min-h-[80px] md:min-w-[80px]"
          onClick={toggleMenu}
        >
          <span className="relative box-border block h-[18px] min-h-[auto] min-w-[auto] w-7 md:inline-block md:min-h-0 md:min-w-0">
            <span
              className={`absolute box-border block h-[3px] mt-[-1.5px] rounded-[3px] top-2/4 transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-emerald-900" : "bg-white"
                } before:bg-current after:bg-current before:absolute after:absolute before:h-[3px] after:h-[3px] before:rounded-[3px] after:rounded-[3px] ${isMenuOpen ? "w-0 before:w-7 after:w-7 before:top-0 after:top-0 before:rotate-45 after:-rotate-45" : "w-7 before:top-[-7px] after:bottom-[-7px] before:w-[calc(100%_-_5px)] after:w-[calc(100%_-_10px)]"}`}
            ></span>
          </span>
        </button>

        {/* Navigation principale */}
        {/* Navigation principale */}
        <div
          className={`fixed box-border flex flex-col h-[calc(100vh-60px)] justify-center items-center w-full px-5 py-10 left-0 top-[60px] transition-all duration-500 bg-emerald-950/95 backdrop-blur-2xl text-white overflow-hidden ${isMenuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"} md:pointer-events-auto md:static md:items-center md:flex-row md:h-full md:justify-end md:min-h-0 md:min-w-0 md:opacity-100 md:visible md:overflow-visible md:p-0 md:top-auto md:bg-transparent`}
        >
          <div className="flex flex-col h-full justify-center pb-20 md:pb-0 md:justify-end md:flex-row md:items-center w-full max-w-sm md:max-w-none mx-auto">

            {/* Minimalist Top Decor inside Menu */}
            <div className={`flex justify-center mb-10 md:hidden transition-all duration-700 ease-out transform ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#C03434] to-transparent"></span>
            </div>

            <ul className={`font-medium box-border flex flex-col list-none gap-y-6 md:gap-y-0 pl-0 md:gap-x-2 lg:gap-x-4 md:flex-row md:visible w-full md:w-auto items-center`}>
              {navigationData.mainNavigation.map((item, index) => (
                <li
                  key={item.id}
                  className={`box-border flex w-full md:w-auto justify-center text-center transition-all duration-[600ms] md:duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:transition-none md:transform-none md:opacity-100 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                  style={{ transitionDelay: isMenuOpen && window.innerWidth < 768 ? `${index * 80 + 100}ms` : '0ms' }}
                >
                  <button
                    onClick={() => handleClick(item)}
                    className={`text-4xl sm:text-5xl md:text-sm lg:text-base items-center box-border flex h-auto justify-center leading-tight md:leading-5 outline-transparent text-center md:uppercase align-middle w-full md:w-auto min-h-[60px] md:min-h-0 md:px-4 md:py-2 md:rounded-[20px] bg-transparent transition-all duration-300 font-souvenir_std md:font-forma_djr_display ${isScrolled && !isMenuOpen
                      ? "text-emerald-900 md:hover:bg-emerald-900 md:hover:text-white"
                      : "text-emerald-50/90 hover:text-white md:text-white md:hover:bg-white md:hover:text-emerald-900 hover:scale-105 md:hover:scale-100"
                      }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div
              className={`box-border flex justify-center w-full md:w-auto mt-12 md:mt-0 md:ml-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:transition-none md:transform-none md:opacity-100 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: isMenuOpen && window.innerWidth < 768 ? `${navigationData.mainNavigation.length * 80 + 200}ms` : '0ms' }}
            >
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                title="Nous Contacter"
                className={`text-lg md:text-sm lg:text-base font-bold items-center flex justify-center uppercase align-middle w-full md:w-auto py-5 md:px-5 md:py-2 rounded-full font-forma_djr_display transition-all duration-300 tracking-wider md:h-[40px] md:rounded-[20px] ${isScrolled && !isMenuOpen
                  ? "bg-emerald-900 text-white border border-emerald-900 hover:bg-emerald-800"
                  : "bg-gradient-to-r from-[#C03434] to-[#a02c2c] text-white hover:from-[#a02c2c] hover:to-[#8a2525] shadow-[0_8px_20px_-5px_rgba(192,52,52,0.4)] hover:-translate-y-1 md:bg-white md:text-emerald-900 md:border md:border-white md:hover:bg-emerald-900 md:hover:text-white md:hover:border-emerald-900 md:shadow-none md:hover:-translate-y-0"
                  }`}
              >
                Nous Contacter
              </Link>
            </div>

            {/* Minimalist Bottom Decor inside Menu */}
            <div className={`mt-12 flex justify-center md:hidden transition-all duration-1000 ease-out transform ${isMenuOpen ? "opacity-50" : "opacity-0"}`} style={{ transitionDelay: '500ms' }}>
              <span className="text-emerald-50/30 text-xs font-forma_djr_display tracking-[0.3em] uppercase">Mamma Palermo</span>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}
