import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Image imports (Sync with Menu.jsx)
import pizzaImg from "../../assets/products/pizza.jpg";
import pastaImg from "../../assets/products/pasta.jpg";
import burgerImg from "../../assets/products/burger.jpg";
import platPouletImg from "../../assets/products/plat_poulet.jpg";
import saladesImg from "../../assets/products/salades.jpg";
import dolceImg from "../../assets/products/dolce.jpg";
import sodaImg from "../../assets/products/soda.jpg";

export function ProductsSection() {
  const [categories, setCategories] = useState([]);
  const scrollContainerRef = useRef(null);

  const CATEGORY_IMAGE_MAPPING = useMemo(() => ({
    "pizzas": pizzaImg,
    "pastas": pastaImg,
    "desserts": dolceImg,
    "boissons": sodaImg,
    "plats": platPouletImg,
    "viande & poulet": platPouletImg,
    "burgers & sandwiches": burgerImg,
    "salades": saladesImg
  }), []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('localhost:3001')) {
      return url.replace('localhost:3001', 'localhost:5000');
    }
    return url;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        
        // Filter for parent categories that are marked as featured
        const featured = data.filter(c => (c.parent_id === null || c.parent_id === undefined) && c.is_featured);
        
        const structuredCategories = featured.map(cat => ({
          id: cat.id,
          title: cat.name,
          image: CATEGORY_IMAGE_MAPPING[cat.name.toLowerCase()] || getImageUrl(cat.image_url) || burgerImg
        }));

        setCategories(structuredCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, [CATEGORY_IMAGE_MAPPING]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 420 : 310;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 420 : 310;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-stone-50 overflow-hidden py-[60px] md:py-[100px]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      {/* Titre */}
      <div className="relative z-10 px-5 md:px-[30px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C03434] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Notre Carte</span>
          <h2 className="text-[40px] md:text-[55px] font-medium text-emerald-950 tracking-[-1.5px] leading-[1.1] mb-6 font-souvenir">
            Découvrez nos créations
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-forma_djr_display leading-relaxed">
            Parce que les meilleures recettes nécessitent les meilleurs produits. Redécouvrez l'Italie à travers nos plats exclusifs.
          </p>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative z-10 box-border max-w-full w-full">
        <div className="box-border max-w-[1660px] w-full mx-auto px-5 md:max-w-[1680px] md:px-[30px] relative">

          {/* Produits */}
          <div
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto pb-12 pt-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/menu"
                className="group relative flex-shrink-0 w-[290px] md:w-[380px] mr-6 bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 snap-center hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-stone-100 block"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    alt={cat.title}
                    src={cat.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <figcaption className="p-8 relative">
                  <div className="flex justify-between items-center bg-white">
                    <span
                      className="text-2xl font-bold text-gray-900 group-hover:text-emerald-900 transition-colors duration-300 font-souvenir"
                    >
                      {cat.title}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all duration-300 shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </figcaption>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="flex gap-6 w-full h-40">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex-shrink-0 w-[290px] md:w-[380px] bg-stone-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            )}
          </div>

          {/* Boutons de scroll floatants */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20">
            <button
              onClick={scrollLeft}
              className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-emerald-900 hover:bg-emerald-900 hover:text-white hover:scale-110 transition-all duration-300 border border-stone-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20">
            <button
              onClick={scrollRight}
              className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-emerald-900 hover:bg-emerald-900 hover:text-white hover:scale-110 transition-all duration-300 border border-stone-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* CTA Découvrir */}
      <div className="relative z-10 px-5 mt-8 md:px-[30px]">
        <div className="flex justify-center">
          <Link
            to="/menu"
            className="group relative overflow-hidden text-emerald-900 bg-white border border-emerald-900 max-w-[300px] w-full px-12 py-5 rounded-full font-bold text-lg uppercase tracking-wider text-center inline-flex items-center justify-center gap-3 transition-colors duration-300 hover:text-white"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Voir la carte</span>
            <div className="absolute inset-0 bg-emerald-900 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
          </Link>
        </div>
      </div>

    </div>
  );
}
