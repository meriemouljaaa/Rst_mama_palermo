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
    return url.replace(/localhost|192\.168\.\d+\.\d+/, window.location.hostname).replace(':3001', ':5000');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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

          {/* Produits Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 pt-4 max-w-[1200px] mx-auto"
          >
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to="/menu"
                className="group relative w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-500 transform hover:-translate-y-1.5 cursor-pointer border border-stone-100 block"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    alt={cat.title}
                    src={cat.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <figcaption className="p-5 relative">
                  <div className="flex justify-between items-center bg-white">
                    <span
                      className="text-lg font-bold text-gray-900 group-hover:text-emerald-900 transition-colors duration-300 font-souvenir"
                    >
                      {cat.title}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all duration-300 shrink-0">
                      <ArrowRight className="w-4 h-4" />
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
