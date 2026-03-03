import React, { useState } from "react";
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
      { id: "margherita", name: "Margherita di Bufala", description: "Sauce tomate San Marzano, mozzarella di bufala, basilic frais, huile d'olive extra vierge", price: "60 DH", isPopular: true, image: pizzaImg },
      { id: "tartufo", name: "La Tartufo", description: "Crème de truffe, champignons sauvages, mozzarella fiordilatte, copeaux de parmesan", price: "85 DH", image: pezziPizzaImg },
      { id: "burrata", name: "Queen Burrata", description: "Sauce tomate, tomates cerises confites, burrata entière, pesto genovese maison", price: "90 DH", isPopular: true, image: pizzaImg },
      { id: "diavola", name: "Diavola Piquante", description: "Sauce tomate, mozzarella, spianata piccante, piments frais, oignons rouges", price: "75 DH", image: pezziPizzaImg },
      { id: "quattro", name: "Quattro Formaggi", description: "Mozzarella fiordilatte, gorgonzola AOP, taleggio, parmigiano reggiano", price: "80 DH", image: pizzaImg }
    ]
  },
  {
    id: "pasta",
    title: "Pasta Fresca",
    subtitle: "Pâtes fraîches faites maison tous les matins",
    bannerImage: pastaImg,
    items: [
      { id: "carbonara", name: "L'Authentique Carbonara", description: "Spaghetti, guanciale croustillante, jaune d'œuf, pecorino romano, poivre noir", price: "75 DH", isPopular: true, image: pastaImg },
      { id: "truffle", name: "Rigatoni à la Truffe", description: "Crème de truffe noire, champignons de Paris, parmesan affiné 24 mois", price: "95 DH", image: pastaImg },
      { id: "bolognese", name: "Pappardelle Ragù", description: "Pâtes larges, sauce bolognaise mijotée 6 heures, herbes fraîches", price: "70 DH", image: pastaImg },
      { id: "pesto", name: "Linguine al Pesto", description: "Pesto de basilic frais, pignons de pin torréfiés, parmigiano, tomates séchées", price: "65 DH", image: pastaImg }
    ]
  },
  {
    id: "panuozzo",
    title: "Panuozzo Napoli",
    subtitle: "Sandwichs chauds italiens préparés avec la pâte à pizza",
    bannerImage: panuazzoImg,
    items: [
      { id: "pan_classico", name: "Il Classico", description: "Prosciutto crudo, mozzarella di bufala, roquette, tomates cerises", price: "55 DH", image: panuazzoImg },
      { id: "pan_pollo", name: "Pollo & Pesto", description: "Poulet grillé, crème de pesto, provolone fondu, tomates séchées", price: "60 DH", isPopular: true, image: panuazzoImg },
      { id: "pan_vege", name: "Verdure Grigliate", description: "Légumes du soleil grillés, mozzarella, crème balsamique", price: "50 DH", image: panuazzoImg },
    ]
  },
  {
    id: "plats",
    title: "Plats Signature",
    subtitle: "L'excellence de Mamma Palermo en plat principal",
    bannerImage: platPouletImg,
    items: [
      { id: "milanese", name: "Escalope Milanaise", description: "Veau pané croustillant, tomates cerises, roquette, parmesan, linguine sauce napolitaine", price: "95 DH", isPopular: true, image: platPouletImg },
      { id: "saumon", name: "Pavé de Saumon", description: "Saumon rôti, risotto au citron et asperges vertes, sauce vierge", price: "120 DH", image: platPoissonImg },
      { id: "pollo_funghi", name: "Poulet aux Champignons", description: "Suprême de volaille, sauce crémeuse aux champignons, pommes grenailles", price: "85 DH", image: platPouletImg }
    ]
  },
  {
    id: "burgers",
    title: "Gourmet Burgers",
    subtitle: "Pain brioché artisanal boucher",
    bannerImage: burgerImg,
    items: [
      { id: "mamma_burger", name: "Signature Mamma", description: "Viande hachée 180g, foie gras poêlé, confit d'oignon, roquette, sauce secrète", price: "110 DH", isPopular: true, image: burgerImg },
      { id: "italian_burger", name: "Italiano Vero", description: "Steak boucher, gorgonzola fondu, pancetta croustillante, tomates séchées", price: "85 DH", image: burgerImg },
      { id: "chicken_burger", name: "Crispy Pollo", description: "Poulet croustillant, cheddar affiné, coleslaw maison, sauce BBQ italienne", price: "75 DH", image: burgerImg }
    ]
  },
  {
    id: "salades",
    title: "Insalate & Antipasti",
    subtitle: "Pour commencer en fraîcheur",
    bannerImage: saladesImg,
    items: [
      { id: "cesar", name: "César Italienne", description: "Sucrine croquante, poulet rôti, croûtons à l'ail, parmesan, sauce césar maison", price: "60 DH", image: saladesImg },
      { id: "burrata_salad", name: "Burrata & Pomodoro", description: "Burrata 125g, déclinaison de tomates, huile d'olive basilic, pignons", price: "75 DH", isPopular: true, image: saladesImg },
      { id: "frites_truffes", name: "Frites Truffes & Parmesan", description: "Frites allumettes fraîches, huile de truffe, parmesan râpé", price: "40 DH", image: fritesImg }
    ]
  },
  {
    id: "dolce",
    title: "Dolce",
    subtitle: "Les douceurs pour finir en beauté",
    bannerImage: dolceImg,
    items: [
      { id: "tiramisu", name: "Tiramisu della Nonna", description: "Recette traditionnelle au café espresso et mascarpone, cacao amer", price: "45 DH", isPopular: true, image: dolceImg },
      { id: "panna_cotta", name: "Panna Cotta", description: "Infusée à la vanille de Madagascar, coulis de fruits rouges", price: "40 DH", image: dolceImg },
      { id: "cheesecake", name: "Cheesecake Pistache", description: "Crème de pistache de Bronte, base biscuit croquant", price: "55 DH", image: dolceImg }
    ]
  },
  {
    id: "boissons",
    title: "Drinks & Café",
    subtitle: "Rafraîchissements et boissons chaudes",
    bannerImage: jusImg,
    items: [
      { id: "mojito", name: "Virgin Mojito", description: "Citron vert, menthe fraîche, cassonade, eau gazeuse", price: "35 DH", image: jusImg },
      { id: "cafe_italiano", name: "Espresso Italiano", description: "Café torréfié 100% Arabica", price: "15 DH", image: cafeImg },
      { id: "soda_italien", name: "Limonade Artisanale", description: "Limonade bio pétillante (Citron, Orange sanguine)", price: "25 DH", image: sodaImg }
    ]
  }
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState(menuCategories[0].id);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-emerald-950 font-forma_djr_display selection:bg-[#C03434] selection:text-white pb-20">
      {/* 1. Hero / Header Section (Immersive) */}
      <div className="relative h-[65vh] min-h-[500px] w-full flex flex-col justify-center items-center overflow-hidden">
        {/* Dynamic Background */}
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

        <div className="relative z-10 text-center px-5 flex flex-col items-center mt-10">
          <span className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6 border border-emerald-300/30 px-5 py-2 rounded-full backdrop-blur-md shadow-lg">Découvrez L'Authenticité</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 font-souvenir_std tracking-[-3px] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)] leading-none">
            La <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe4b5] via-[#fff8dc] to-white drop-shadow-sm">Carte</span>
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50/90 max-w-3xl leading-relaxed font-light drop-shadow-lg mt-4">
            Un voyage culinaire majestueux au cœur de l'Italie.
            Des produits nobles, une passion ardente.
          </p>
        </div>
      </div>

      {/* 2. Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 bg-[#FDFCFB]/80 backdrop-blur-xl border-b border-emerald-900/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x pt-6">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`flex-none snap-start whitespace-nowrap px-6 py-3 rounded-full text-base sm:text-lg font-bold transition-all duration-500 ring-1 ring-inset ${activeTab === cat.id
                    ? "bg-emerald-950 text-white ring-emerald-950 shadow-[0_8px_20px_rgba(2,44,34,0.3)] scale-105"
                    : "bg-white text-emerald-900/60 ring-emerald-900/10 hover:text-emerald-900 hover:ring-emerald-400 hover:bg-emerald-50"
                  }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-32">
        {menuCategories.map((category, index) => (
          <section id={category.id} key={category.id} className="scroll-mt-48">

            {/* Category Header Layout */}
            <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 mb-20`}>
              <div className="flex-1 space-y-6 w-full">
                <div className="inline-flex items-center gap-4">
                  <span className="h-[2px] w-16 bg-[#C03434]"></span>
                  <span className="text-[#C03434] font-bold tracking-[0.3em] uppercase text-sm">Sélection</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold font-souvenir_std text-emerald-950 tracking-[-2px] leading-tight drop-shadow-sm">
                  {category.title}
                </h2>
                <p className="text-xl md:text-2xl text-emerald-900/60 font-light max-w-xl leading-relaxed">
                  {category.subtitle}
                </p>
              </div>
              <div className="flex-1 w-full h-[300px] md:h-[450px] relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] group isolate">
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 rounded-[3rem]"></div>
                <img
                  src={category.bannerImage}
                  alt={category.title}
                  className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out"
                />
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-emerald-900/5 rounded-[2.5rem] p-8 hover:shadow-[0_30px_60px_-20px_rgba(2,44,34,0.15)] transition-all duration-500 flex flex-col h-full hover:-translate-y-3 overflow-hidden"
                >
                  {/* Decor subtle background element */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

                  {item.isPopular && (
                    <div className="absolute top-8 right-8 z-20 bg-gradient-to-r from-[#C03434] to-[#e63946] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_8px_20px_rgba(192,52,52,0.4)] tracking-[0.1em] uppercase">
                      Le Favori
                    </div>
                  )}

                  {/* Thumbnail Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                    <div className="w-28 h-28 rounded-full overflow-hidden shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15)] shrink-0 border-4 border-white ring-1 ring-emerald-900/10 group-hover:ring-emerald-400 group-hover:border-emerald-50 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none"></div>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:rotate-6 group-hover:scale-125 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="text-3xl sm:text-4xl font-bold text-[#C03434] font-forma_djr_display block drop-shadow-sm">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-emerald-950 font-souvenir_std mb-4 group-hover:text-[#C03434] transition-colors duration-500 leading-tight">
                    {item.name}
                  </h3>

                  <div className="flex-grow">
                    <p className="text-emerald-900/60 leading-relaxed text-[16px] font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-emerald-900/10 flex items-center justify-between group-hover:border-emerald-900/30 transition-colors duration-500">
                    <span className="text-sm font-bold text-emerald-900 uppercase tracking-widest relative">
                      Ajouter
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C03434] group-hover:w-full transition-all duration-500"></span>
                    </span>
                    <button className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center transform group-hover:bg-[#C03434] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_10px_20px_-5px_rgba(192,52,52,0.4)] transition-all duration-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </section>
        ))}
      </div>

      {/* 4. Large Immersive Footer CTA */}
      <div className="relative overflow-hidden bg-emerald-950 text-white min-h-[60vh] flex items-center justify-center rounded-t-[4rem] mx-4 sm:mx-8 shadow-2xl mt-10">
        <div className="absolute inset-0 z-0">
          <img src={dolceImg} className="w-full h-full object-cover opacity-20 transform hover:scale-105 transition-transform duration-[20s] ease-linear" alt="Mamma Palermo Ambiance" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/90 to-emerald-950/60"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center flex flex-col items-center py-24 object-contain">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#C03434] to-[#f05c5c] rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(192,52,52,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h3 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 font-souvenir_std leading-tight drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
            L'Appétit Vient<br />En Commandant.
          </h3>
          <p className="text-xl sm:text-3xl text-emerald-100/80 max-w-3xl font-light mb-16 leading-relaxed">
            Profitez de l'excellence de <span className="text-white font-medium">Mamma Palermo</span> depuis le confort de votre maison.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <button className="bg-gradient-to-r from-[#C03434] to-[#a32222] text-white px-10 py-5 sm:py-6 rounded-full text-xl sm:text-2xl font-bold hover:from-[#a32222] hover:to-[#8a1919] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(192,52,52,0.4)] hover:shadow-none hover:-translate-y-1 ring-4 ring-transparent hover:ring-[#C03434]/30">
              Commander en Livraison
            </button>
            <button className="bg-transparent border-2 border-emerald-100/30 backdrop-blur-md text-emerald-50 px-10 py-5 sm:py-6 rounded-full text-xl sm:text-2xl font-bold hover:bg-emerald-50 hover:text-emerald-950 transition-all duration-500 hover:-translate-y-1">
              Click & Collect
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
