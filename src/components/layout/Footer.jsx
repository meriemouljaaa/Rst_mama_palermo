import React from "react";
import { socialLinksData } from "../../data/socialLinksData";
import { footerNavigationData } from "../../data/footerNavigationData";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import whiteLogo from "../../assets/logos/mamma_palermo_white.png";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 relative overflow-hidden text-center md:text-left border-t border-emerald-900/50">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand / Logo */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link to="/" className="inline-block w-[180px] max-w-[200px]">
              <img src={whiteLogo} alt="Mamma Palermo" className="w-full h-auto drop-shadow-lg" />
            </Link>
            <p className="text-emerald-100/70 font-forma_djr_display text-sm leading-relaxed max-w-[280px] text-center md:text-left">
              L'authentique goût de l'Italie au cœur de votre ville. Des plats préparés avec passion et des ingrédients frais de saison.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col items-center md:items-start md:pl-8">
            <h3 className="font-souvenir text-xl text-white mb-6 uppercase tracking-wider">Menu</h3>
            <ul className="space-y-4 font-forma_djr_display w-full flex flex-col items-center md:items-start">
              {footerNavigationData.map((item) => (
                <li key={item.id}>
                  {item.href.startsWith("/") ? (
                    <Link to={item.href} className="text-emerald-100/70 hover:text-emerald-400 transition-colors uppercase text-sm tracking-widest relative group inline-flex justify-center md:justify-start">
                      {item.label}
                      <span className="absolute -bottom-1 left-1/2 md:left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </Link>
                  ) : (
                    <ScrollLink
                      to={`${item.id}-section`}
                      smooth={true}
                      duration={500}
                      offset={-70}
                      className="cursor-pointer text-emerald-100/70 hover:text-emerald-400 transition-colors uppercase text-sm tracking-widest relative group inline-flex justify-center md:justify-start"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-1/2 md:left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </ScrollLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-souvenir text-xl text-white mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4 font-forma_djr_display text-emerald-100/70 text-sm flex flex-col items-center md:items-start">
              <li className="flex items-center space-x-3">
                <span className="text-emerald-400">📍</span>
                <span>Residence Abdelhadi RDC, Centre, Bouskoura 27182</span>
              </li>
              <li className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400">📞</span>
                  <a href="tel:0522066579" className="hover:text-emerald-400 transition-colors">05 22 06 65 79</a>
                </div>
                <div className="flex items-center space-x-3 ml-7">
                  <a href="tel:0656188792" className="hover:text-emerald-400 transition-colors">06 56 18 87 92</a>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-emerald-400">✉️</span>
                <a href="mailto:contact@mammapalermo.com" className="hover:text-emerald-400 transition-colors">contact@mammapalermo.com</a>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-block border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-950 px-6 py-2 rounded-full uppercase text-[11px] tracking-[0.2em] transition-all font-forma_djr_display text-center"
              >
                Nous Trouver
              </Link>
            </div>
          </div>

          {/* Column 4: Socials */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-souvenir text-xl text-white mb-6 uppercase tracking-wider">Suivre</h3>
            <p className="font-forma_djr_display text-sm text-emerald-100/70 mb-4 text-center md:text-left">
              Rejoignez @mammapalermo sur nos réseaux pour suivre nos nouveautés.
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              {socialLinksData.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    title={social.title}
                    href={social.href}
                    className="flex justify-center items-center w-10 h-10 rounded-full border border-emerald-800 text-emerald-300 hover:bg-emerald-400 hover:text-emerald-950 hover:border-emerald-400 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center text-xs font-forma_djr_display text-emerald-500/80">
          <p>© {new Date().getFullYear()} Mamma Palermo. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-300 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
