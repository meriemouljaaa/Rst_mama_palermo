import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Image imports
import pizzaImg from "../assets/products/pizza.jpg";
import pezziPizzaImg from "../assets/products/pezzi_pizza.jpg";
import pastaImg from "../assets/products/pasta.jpg";
import panuazzoImg from "../assets/products/panuazzo.jpg";
import platPouletImg from "../assets/products/plat_poulet.jpg";
import platPoissonImg from "../assets/products/plat_poisson.jpg";
import saladesImg from "../assets/products/salades.jpg";
import burgerImg from "../assets/products/burger.jpg";
import fritesImg from "../assets/products/frites.jpg";
import dolceImg from "../assets/products/dolce.jpg";
import sodaImg from "../assets/products/soda.jpg";
import jusImg from "../assets/products/jus.jpg";
import cafeImg from "../assets/products/cafe.jpg";

const menuCategories = [
  {
    id: "pizza",
    title: "Nos Pizzas",
    subtitle: "Artisanales & Cuites au feu de bois",
    bannerImage: pizzaImg,
    items: [
      { id: "margherita", name: "Margherita di Bufala", description: "Sauce tomate San Marzano, mozzarella, basilic", price: "60 DH", isPopular: true, image: pizzaImg },
      { id: "tartufo", name: "La Tartufo", description: "Crème truffe, champignons, fondue", price: "85 DH", image: pezziPizzaImg },
      { id: "burrata", name: "Queen Burrata", description: "Sauce tomate, burrata, pesto", price: "90 DH", isPopular: true, image: pizzaImg },
      { id: "diavola", name: "Diavola Piquante", description: "Sauce tomate, mozzarella, spianata", price: "75 DH", image: pezziPizzaImg },
      { id: "quattro", name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, taleggio", price: "80 DH", image: pizzaImg }
    ]
  },
  {
    id: "pasta",
    title: "Pasta Fresca",
    subtitle: "Pâtes fraîches faites maison",
    bannerImage: pastaImg,
    items: [
      { id: "carbonara", name: "La Carbonara", description: "Spaghetti, guanciale, pecorino", price: "75 DH", isPopular: true, image: pastaImg },
      { id: "truffle", name: "Rigatoni Truffe", description: "Crème truffe noire, champignons", price: "95 DH", image: pastaImg },
      { id: "bolognese", name: "Pappardelle Ragù", description: "Sauce bolognaise mijotée 6h", price: "70 DH", image: pastaImg },
      { id: "pesto", name: "Linguine Pesto", description: "Pesto basilic frais, pignons", price: "65 DH", image: pastaImg }
    ]
  },
  {
    id: "panuozzo",
    title: "Panuozzo",
    subtitle: "Sandwichs chauds italiens",
    bannerImage: panuazzoImg,
    items: [
      { id: "pan_classico", name: "Il Classico", description: "Prosciutto, bufala, roquette", price: "55 DH", image: panuazzoImg },
      { id: "pan_pollo", name: "Pollo & Pesto", description: "Poulet grillé, provolone", price: "60 DH", isPopular: true, image: panuazzoImg },
      { id: "pan_vege", name: "Verdure Grigliate", description: "Légumes grillés, crème basilic", price: "50 DH", image: panuazzoImg },
    ]
  },
  {
    id: "plats",
    title: "Plats",
    subtitle: "L'excellence en plat principal",
    bannerImage: platPouletImg,
    items: [
      { id: "milanese", name: "Escalope Milanese", description: "Veau pané, linguine napolitaine", price: "95 DH", isPopular: true, image: platPouletImg },
      { id: "saumon", name: "Pavé Saumon", description: "Saumon rôti, risotto citron", price: "120 DH", image: platPoissonImg },
      { id: "pollo_funghi", name: "Poulet Champis", description: "Suprême sauce forestière", price: "85 DH", image: platPouletImg }
    ]
  },
  {
    id: "burgers",
    title: "Burgers",
    subtitle: "Pain brioché boucher",
    bannerImage: burgerImg,
    items: [
      { id: "mamma_burger", name: "Signature Mamma", description: "Viande 180g, foie gras, roquette", price: "110 DH", isPopular: true, image: burgerImg },
      { id: "italian_burger", name: "Italiano Vero", description: "Steak, gorgonzola, pancetta", price: "85 DH", image: burgerImg },
      { id: "chicken_burger", name: "Crispy Pollo", description: "Poulet crispy, coleslaw maison", price: "75 DH", image: burgerImg }
    ]
  },
  {
    id: "salades",
    title: "Salades",
    subtitle: "Pour commencer en fraîcheur",
    bannerImage: saladesImg,
    items: [
      { id: "cesar", name: "César Italienne", description: "Sucrine, poulet rôti, parmesan", price: "60 DH", image: saladesImg },
      { id: "burrata_salad", name: "Burrata Fresca", description: "Burrata 125g, déclinaison tomates", price: "75 DH", isPopular: true, image: saladesImg },
      { id: "frites_truffes", name: "Frites Truffes", description: "Frites allumettes, huile truffe", price: "40 DH", image: fritesImg }
    ]
  },
  {
    id: "dolce",
    title: "Desserts",
    subtitle: "Les douceurs pour finir en beauté",
    bannerImage: dolceImg,
    items: [
      { id: "tiramisu", name: "Tiramisu Nonna", description: "Café espresso et mascarpone", price: "45 DH", isPopular: true, image: dolceImg },
      { id: "panna_cotta", name: "Panna Cotta", description: "Infusée à la vanille, coulis", price: "40 DH", image: dolceImg },
      { id: "cheesecake", name: "Cheesecake", description: "Crème de pistache et spéculoos", price: "55 DH", image: dolceImg }
    ]
  },
  {
    id: "boissons",
    title: "Boissons",
    subtitle: "Rafraîchissements et boissons chaudes",
    bannerImage: jusImg,
    items: [
      { id: "mojito", name: "Virgin Mojito", description: "Citron vert, menthe fraîche", price: "35 DH", image: jusImg },
      { id: "cafe_italiano", name: "Espresso", description: "Café 100% Arabica", price: "15 DH", image: cafeImg },
      { id: "soda_italien", name: "Limonade", description: "Limonade bio pétillante", price: "25 DH", image: sodaImg }
    ]
  }
];

export default function Menu() {
  const [activeTabDesktop, setActiveTabDesktop] = useState(menuCategories[0].id);
  const [activeTabMobile, setActiveTabMobile] = useState(menuCategories[0].id);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const rightScrollRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
    }
  }, [selectedProduct]);

  // Scroll logic Desktop
  const scrollToSectionDesktop = (id) => {
    setActiveTabDesktop(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Scroll logic Mobile
  const scrollToSectionMobile = (id) => {
    setActiveTabMobile(id);
    const element = document.getElementById(`mobile-${id}`);
    if (element && rightScrollRef.current) {
      rightScrollRef.current.scrollTo({
        top: element.offsetTop - rightScrollRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Scroll Tracking on Mobile
  const handleMobileScroll = () => {
    if (!rightScrollRef.current) return;

    const sections = menuCategories.map(c => document.getElementById(`mobile-${c.id}`));
    let currentCat = menuCategories[0].id;

    for (const section of sections) {
      if (!section) continue;
      // When the top of the section comes close to the top of the container
      if (section.offsetTop - rightScrollRef.current.offsetTop <= rightScrollRef.current.scrollTop + 30) {
        currentCat = section.id.replace('mobile-', '');
      }
    }

    if (activeTabMobile !== currentCat) {
      setActiveTabMobile(currentCat);
    }
  };

  return (
    <div className="bg-[#FDFCFB] text-emerald-950 font-forma_djr_display selection:bg-[#C03434] selection:text-white">

      {/* =========================================
             1. MOBILE LAYOUT (App style - max-md)
      ========================================= */}
      <div className="md:hidden flex flex-col h-[100dvh] bg-gray-50 overflow-hidden fixed top-0 left-0 right-0 bottom-0 z-50">

        {/* Top App Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 shrink-0 border-b border-gray-200">
          <Link to="/" className="text-gray-900 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <span className="text-[19px] font-bold text-gray-900 tracking-tight">Nouveautés</span>
          <button className="text-gray-500 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        {/* Mobile Body Content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar (Categories) */}
          <div className="w-[85px] bg-white border-r border-gray-100 overflow-y-auto no-scrollbar pb-24 shrink-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col">
              {menuCategories.map((cat) => {
                const isActive = activeTabMobile === cat.id;
                // Simpler shorter names for tight vertical sidebar
                let shortName = cat.title;
                if (cat.id === "pasta") shortName = "Pasta";
                if (cat.id === "panuozzo") shortName = "Panuozzo";
                if (cat.id === "plats") shortName = "Plats";
                if (cat.id === "burgers") shortName = "Burgers";
                if (cat.id === "salades") shortName = "Salades";
                if (cat.id === "dolce") shortName = "Desserts";
                if (cat.id === "boissons") shortName = "Boissons";
                if (cat.id === "pizza") shortName = "Pizzas";

                return (
                  <button
                    key={`side-${cat.id}`}
                    onClick={() => scrollToSectionMobile(cat.id)}
                    className={`relative w-full flex flex-col items-center py-5 px-1 gap-2 transition-all duration-300 ${isActive
                      ? 'opacity-100 bg-gray-50'
                      : 'opacity-60 hover:opacity-100 bg-white'
                      }`}
                  >
                    {isActive && <div className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-[#C03434] rounded-r-md"></div>}
                    <div className={`w-12 h-12 relative rounded-full overflow-hidden shrink-0 transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_5px_15px_-3px_rgba(192,52,52,0.3)] ring-2 ring-[#C03434] ring-offset-2 ring-offset-gray-50' : 'shadow-sm grayscale-[30%]'}`}>
                      <img src={cat.bannerImage} alt={shortName} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider leading-tight text-center ${isActive ? 'font-bold text-[#C03434]' : 'font-semibold text-gray-500'}`}>
                      {shortName}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Content (Products Grid) */}
          <div
            className="flex-1 overflow-y-auto bg-gray-50 p-3 pb-32 no-scrollbar scroll-smooth"
            ref={rightScrollRef}
            onScroll={handleMobileScroll}
          >
            <div className="space-y-6">
              {menuCategories.map((cat) => (
                <div key={`mobile-${cat.id}`} id={`mobile-${cat.id}`} className="scroll-mt-4">

                  {/* Category Title Subtle Divider */}
                  <h3 className="font-bold text-[17px] mb-3 text-gray-800 ml-1">{cat.title}</h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-2.5 flex flex-col relative overflow-hidden h-full cursor-pointer active:scale-95 transition-transform"
                      >

                        {/* Share Icon */}
                        <button className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 hover:bg-gray-100 backdrop-blur rounded-full flex items-center justify-center z-10 shadow-sm transition-colors border border-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </button>

                        {/* Image cropped realistically */}
                        <div className="w-full aspect-square mb-2 relative overflow-hidden rounded-[8px] bg-gray-50 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col flex-grow">
                          <h4 className="text-[13px] font-bold text-gray-800 leading-[1.2] mb-1.5">{item.name}</h4>
                          <span className="text-[#333] font-bold text-[14px] mb-3 mt-auto tracking-tight">
                            {item.price.replace(" DH", "")}.00 DH
                          </span>

                          {/* Main Action Button */}
                          <button className="w-full py-1.5 border border-[#C03434] text-[#C03434] rounded-[8px] text-[13px] font-bold uppercase tracking-wider hover:bg-[#C03434]/5 active:bg-[#C03434] active:text-white transition-all">
                            ADD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
             2. DESKTOP LAYOUT (Classic web - md:block)
      ========================================= */}
      <div className="hidden md:block min-h-screen pb-20">

        {/* Hero / Header Section (Immersive) */}
        <div className="relative h-[45vh] min-h-[350px] w-full flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-emerald-950">
            <img src={pizzaImg} alt="Menu Mamma Palermo" className="w-full h-full object-cover opacity-30 mix-blend-overlay hover:scale-110 transition-transform duration-[20s] ease-linear" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-emerald-950/80 to-transparent" />
          </div>

          <Link
            to="/"
            className="absolute z-30 top-10 left-10 text-white/90 text-sm font-medium flex items-center gap-2 bg-emerald-900/30 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 hover:bg-white hover:text-emerald-900 transition-all duration-300 shadow-xl group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Retour à l'accueil
          </Link>

          <div className="relative z-10 text-center px-5 flex flex-col items-center mt-6">
            <span className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-xs sm:text-xs mb-4 border border-emerald-300/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">Découvrez L'Authenticité</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 font-souvenir_std tracking-[-2px] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)] leading-none">
              La <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe4b5] via-[#fff8dc] to-white drop-shadow-sm">Carte</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-50/90 max-w-2xl leading-relaxed font-light drop-shadow-lg mt-2">
              Un voyage culinaire majestueux au cœur de l'Italie.
              Des produits nobles, une passion ardente.
            </p>
          </div>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start lg:justify-center space-x-6 sm:space-x-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSectionDesktop(cat.id)}
                  className={`relative flex-none snap-start whitespace-nowrap py-5 text-[12px] sm:text-[13px] uppercase tracking-[0.12em] font-bold transition-colors duration-300 ${activeTabDesktop === cat.id
                    ? "text-[#C03434]"
                    : "text-emerald-950/40 hover:text-emerald-950"
                    }`}
                >
                  {cat.title}
                  {activeTabDesktop === cat.id && (
                    <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#C03434] rounded-t-lg shadow-[0_-2px_6px_rgba(192,52,52,0.4)]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
          {menuCategories.map((category, index) => (
            <section id={category.id} key={category.id} className="scroll-mt-32">

              {/* Category Header Layout */}
              <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 lg:gap-8 mb-10`}>
                <div className="flex-1 space-y-3 w-full">
                  <div className="inline-flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-[#C03434]"></span>
                    <span className="text-[#C03434] font-bold tracking-[0.2em] uppercase text-[10px]">Sélection</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-souvenir_std text-emerald-950 tracking-[-1px] leading-tight drop-shadow-sm">
                    {category.title}
                  </h2>
                  <p className="text-base md:text-lg text-emerald-900/60 font-light max-w-lg leading-relaxed">
                    {category.subtitle}
                  </p>
                </div>
                <div className="flex-1 w-full h-[160px] md:h-[220px] relative rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] group isolate">
                  <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                  <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 rounded-[2.5rem]"></div>
                  <img
                    src={category.bannerImage}
                    alt={category.title}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out"
                  />
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="group relative bg-white border border-emerald-900/5 rounded-2xl p-5 hover:shadow-[0_15px_30px_-10px_rgba(2,44,34,0.1)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 overflow-hidden cursor-pointer hover:border-[#C03434]/20"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>

                    {item.isPopular && (
                      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-[#C03434] to-[#e63946] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(192,52,52,0.3)] tracking-[0.1em] uppercase">
                        Le Favori
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start lg:items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_5px_10px_-2px_rgba(0,0,0,0.1)] shrink-0 border-2 border-white ring-1 ring-emerald-900/10 group-hover:ring-emerald-400 group-hover:border-emerald-50 transition-all duration-500 relative">
                        <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none"></div>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-700 ease-out" />
                      </div>
                      <div className="mt-1 sm:mt-0">
                        <span className="text-xl sm:text-2xl font-bold text-[#C03434] font-forma_djr_display block drop-shadow-sm">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-emerald-950 font-souvenir_std mb-2 group-hover:text-[#C03434] transition-colors duration-500 leading-tight">
                      {item.name}
                    </h3>

                    <div className="flex-grow">
                      <p className="text-emerald-900/60 leading-snug text-[13px] font-light md:max-w-xs">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-emerald-900/10 flex items-center justify-between group-hover:border-emerald-900/30 transition-colors duration-500">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest relative">
                        Ajouter
                        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C03434] group-hover:w-full transition-all duration-500"></span>
                      </span>
                      <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center transform group-hover:bg-[#C03434] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_5px_12px_-3px_rgba(192,52,52,0.3)] transition-all duration-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          ))}
        </div>

        {/* Large Immersive Footer CTA */}
        <div className="relative overflow-hidden bg-emerald-950 text-white min-h-[40vh] flex items-center justify-center rounded-t-[3rem] mx-4 sm:mx-8 shadow-2xl mt-8">
          <div className="absolute inset-0 z-0">
            <img src={dolceImg} className="w-full h-full object-cover opacity-20 transform hover:scale-105 transition-transform duration-[20s] ease-linear" alt="Mamma Palermo Ambiance" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/90 to-emerald-950/60"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-5 text-center flex flex-col items-center py-16 object-contain">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#C03434] to-[#f05c5c] rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(192,52,52,0.5)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-souvenir_std leading-tight drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
              L'Appétit Vient<br />En Commandant.
            </h3>
            <p className="text-lg sm:text-2xl text-emerald-100/80 max-w-2xl font-light mb-10 leading-relaxed">
              Profitez de l'excellence de <span className="text-white font-medium">Mamma Palermo</span> depuis le confort de votre maison.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <button className="bg-gradient-to-r from-[#C03434] to-[#a32222] text-white px-8 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:from-[#a32222] hover:to-[#8a1919] transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(192,52,52,0.4)] hover:shadow-none hover:-translate-y-1 ring-4 ring-transparent hover:ring-[#C03434]/30">
                Commander en Livraison
              </button>
              <button className="bg-transparent border-2 border-emerald-100/30 backdrop-blur-md text-emerald-50 px-8 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:bg-emerald-50 hover:text-emerald-950 transition-all duration-500 hover:-translate-y-1">
                Click & Collect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-backdrop-entry"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-[2rem] overflow-hidden w-full max-w-[850px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 animate-modal-entry border border-white/20 flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Floating) */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/50 hover:bg-white text-emerald-950 rounded-full flex items-center justify-center backdrop-blur-lg shadow-lg transition-all duration-300 border border-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Left Side: Image */}
            <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden bg-emerald-900/5 isolate border-r border-gray-100/50">
              {/* Product Image Full Bleed */}
              <div className="absolute inset-0 w-full h-full z-10 transition-transform duration-[1.5s] ease-out hover:scale-105 animate-image-reveal">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {selectedProduct.isPopular && (
                <div className="absolute top-5 left-5 z-30 bg-gradient-to-r from-[#C03434] to-[#e63946] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(192,52,52,0.4)] tracking-[0.15em] uppercase border border-red-500/30">
                  Le Favori
                </div>
              )}
            </div>

            {/* Right Side: Content */}
            <div className="p-6 sm:p-8 md:p-10 flex flex-col md:w-1/2 relative bg-white">
              {/* Title & Price */}
              <div className="flex flex-col gap-2 mb-6 md:w-full">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="h-[2px] w-6 bg-[#C03434]"></span>
                  <span className="text-[#C03434] font-bold tracking-[0.2em] uppercase text-[10px]">Détails</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 font-souvenir_std leading-[1.1] drop-shadow-sm">
                  {selectedProduct.name}
                </h3>
                <span className="text-2xl font-bold text-[#C03434] font-forma_djr_display mt-2 bg-red-50/50 self-start px-3 py-1 rounded-xl">
                  {selectedProduct.price}
                </span>
              </div>

              {/* Description */}
              <div className="h-px w-full bg-gray-100 my-2"></div>

              <p className="text-emerald-900/60 text-[15.5px] leading-[1.7] my-6 font-light overflow-y-auto no-scrollbar flex-grow min-h-[80px]">
                {selectedProduct.description}
                {!selectedProduct.description?.includes('Préparé avec soin') && " Préparé avec passion et savoir-faire pour une expérience authentique aux saveurs éclatantes d'Italie."}
              </p>

              {/* Quantity & Action */}
              <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="flex items-center w-full sm:w-auto bg-gray-50/80 rounded-[1.25rem] border border-gray-100 p-1.5 shadow-inner h-14 sm:h-16 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-emerald-900/40 hover:text-emerald-950 hover:bg-white rounded-xl transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
                  </button>
                  <span className="w-10 sm:w-12 text-center font-bold text-[18px] text-emerald-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-emerald-900/40 hover:text-emerald-950 hover:bg-white rounded-xl transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setQuantity(1);
                  }}
                  className="flex-1 w-full bg-gradient-to-r from-[#C03434] to-[#a32222] text-white h-14 sm:h-16 rounded-[1.25rem] font-bold uppercase hover:from-[#a32222] hover:to-[#8a1919] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(192,52,52,0.4)] hover:shadow-[0_5px_15px_-5px_rgba(192,52,52,0.4)] hover:-translate-y-0.5 active:translate-y-px relative overflow-hidden group px-4 sm:px-6"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span className="tracking-[0.1em] text-[13px] mt-px">Ajouter</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes modalScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            @keyframes backdropFade {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes imageReveal {
              0% { opacity: 0; transform: scale(0.8) translateY(15px); filter: blur(10px); }
              100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
            }
            .animate-modal-entry {
              animation: modalScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-backdrop-entry {
              animation: backdropFade 0.3s ease-out forwards;
            }
            .animate-image-reveal {
              opacity: 0;
              animation: imageReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
            }
          `}} />
        </div>
      )}

    </div>
  );
}
