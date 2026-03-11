import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from 'socket.io-client';

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

// --- Utilities ---

const formatPrice = (price) => {
  if (price === undefined || price === null) return "";
  let val = price;
  if (typeof val === 'string') {
    val = val.replace(" DH", "").trim().replace(",", ".");
  }
  const num = parseFloat(val);
  if (isNaN(num)) return typeof price === 'string' ? price.replace(" DH", "") : price;
  return num % 1 === 0 ? Math.round(num).toString() : num.toFixed(2);
};

// --- Optimized Light Components ---

const ProductCard = memo(({ item, onAddToCart, onSelect }) => (
  <div
    onClick={() => onSelect(item)}
    className="group relative bg-white border border-emerald-900/5 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
  >
    <div className="flex flex-col sm:flex-row items-start lg:items-center gap-3 mb-4">
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm shrink-0 border border-emerald-900/10 bg-emerald-50">
        <img src={item.image || burgerImg} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="mt-1 sm:mt-0">
        <span className="text-xl sm:text-2xl font-bold text-[#C03434] block">
          {formatPrice(item.price)} DH
        </span>
      </div>
    </div>
    <h3 className="text-xl font-bold text-emerald-950 font-souvenir_std mb-2 truncate group-hover:text-[#C03434] transition-colors">
      {item.name}
    </h3>
    <div className="flex-grow">
      <p className="text-emerald-900/60 leading-snug text-[13px] font-light line-clamp-2">
        {item.description}
      </p>
    </div>
    <div className="mt-5 pt-3 border-t border-emerald-900/10 flex items-center justify-between">
      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Détails</span>
      <button
        onClick={(e) => { e.stopPropagation(); onAddToCart(item, 1, e); }}
        className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center hover:bg-[#C03434] hover:text-white transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  </div>
));

const MobileProductCard = memo(({ item, onAddToCart, onSelect }) => (
  <div
    onClick={() => onSelect(item)}
    className="bg-white rounded-[16px] shadow-sm p-2.5 flex flex-col relative overflow-hidden h-full active:scale-95 transition-transform"
  >
    <div className="w-full aspect-square mb-2 relative overflow-hidden rounded-[8px] bg-gray-50 shrink-0">
      <img src={item.image || burgerImg} alt={item.name} loading="lazy" className="w-full h-full object-contain p-1" />
    </div>
    <div className="flex flex-col flex-grow">
      <h4 className="text-[13px] font-bold text-gray-800 leading-[1.2] mb-1.5 line-clamp-2">{item.name}</h4>
      <span className="text-[#333] font-bold text-[14px] mt-auto">
        {formatPrice(item.price)} DH
      </span>
      <div className="flex gap-1.5 w-full mt-2">
        <button className="flex-1 py-1.5 border border-[#C03434] text-[#C03434] rounded-[8px] text-[12px] font-bold uppercase">Détails</button>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(item, 1, e); }}
          className="w-[32px] shrink-0 bg-[#C03434] text-white rounded-[8px] flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  </div>
));

export default function Menu() {
  const [activeTabDesktop, setActiveTabDesktop] = useState(null);
  const [activeTabMobile, setActiveTabMobile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mamma_palermo_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartAnimations, setCartAnimations] = useState([]);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [dynamicMenu, setDynamicMenu] = useState([]);
  const [productMapping, setProductMapping] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hydratedCategories, setHydratedCategories] = useState(new Set());

  const CATEGORY_STYLE_META = useMemo(() => ({
    "pizzas": { banner: pizzaImg, subtitle: "Artisanales & Cuites au feu de bois" },
    "pastas": { banner: pastaImg, subtitle: "Pâtes fraîches faites maison" },
    "desserts": { banner: dolceImg, subtitle: "Les douceurs pour finir en beauté" },
    "boissons": { banner: sodaImg, subtitle: "Boissons fraîches & jus naturels" },
    "plats": { banner: platPouletImg, subtitle: "L'excellence en plat principal" },
    "viande & poulet": { banner: platPouletImg, subtitle: "L'excellence en plat principal" },
    "burgers & sandwiches": { banner: burgerImg, subtitle: "Pain brioché & sandwichs italiens" },
    "salades": { banner: saladesImg, subtitle: "Fraîcheur & saveurs méditerranéennes" }
  }), []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('localhost:3001')) {
      return url.replace('localhost:3001', 'localhost:5000');
    }
    return url;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/categories`)
        ]);
        const products = await prodRes.json();
        const categories = await catRes.json();

        const mapping = {};
        products.forEach(p => mapping[p.name.replace(/^\d+\.\s*/, '').toLowerCase().trim()] = p.id);
        setProductMapping(mapping);

        const rootCategories = categories.filter(c => c.parent_id === null || c.parent_id === undefined);
        const dynamicStructure = rootCategories.map(root => {
          const subIds = categories.filter(c => c.id === root.id || c.parent_id === root.id).map(c => c.id);
          const items = products.filter(p => p.is_available && subIds.includes(p.category_id)).map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: `${p.price} DH`,
            image: getImageUrl(p.image_url),
            variants: p.variants || []
          }));
          if (items.length === 0) return null;
          const meta = CATEGORY_STYLE_META[root.name.toLowerCase()] || {};
          return { 
            id: `cat-${root.id}`, 
            title: root.name, 
            subtitle: meta.subtitle || root.description, 
            bannerImage: meta.banner || getImageUrl(root.image_url) || burgerImg, 
            items 
          };
        }).filter(Boolean);

        if (dynamicStructure.length > 0) {
          setDynamicMenu(dynamicStructure);
          setActiveTabDesktop(dynamicStructure[0].id);
          setActiveTabMobile(dynamicStructure[0].id);
          setHydratedCategories(new Set([dynamicStructure[0].id]));
        }
      } catch (err) { console.error(err); }
    };
    fetchData();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('productUpdated', fetchData);
    socket.on('newOrder', fetchData); // In case we want to refresh for other reasons

    return () => socket.disconnect();
  }, [CATEGORY_STYLE_META]);

  // Progressive Hydration Logic
  useEffect(() => {
    if (dynamicMenu.length === 0) return;

    // Smoothly hydrate other categories after the initial frame
    const timer = setTimeout(() => {
      setHydratedCategories(prev => {
        const next = new Set(prev);
        dynamicMenu.forEach(c => next.add(c.id));
        return next;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [dynamicMenu]);

  // States & Cart logic unchanged
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ full_name: '', phone: '', address: '', notes: '', payment_method: 'Cash on Delivery' });
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => { localStorage.setItem('mamma_palermo_cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product, qty, e) => {
    const effectivePrice = selectedVariant ? `${selectedVariant.price} DH` : product.price;
    const effectiveName = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;
    const effectiveId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setCartAnimations(prev => [...prev, { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, image: product.image || burgerImg }]);
      setTimeout(() => {
        setCartAnimations(prev => prev.filter(a => a.id !== id));
        setIsCartBumping(true);
        setTimeout(() => setIsCartBumping(false), 300);
      }, 700);
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === effectiveId);
      if (existing) return prev.map(item => item.id === effectiveId ? { ...item, quantity: item.quantity + qty } : item);
      return [...prev, { ...product, id: effectiveId, name: effectiveName, price: effectivePrice, dbId: productMapping[product.name.toLowerCase().trim()], variant_name: selectedVariant?.name || null, quantity: qty }];
    });
    setSelectedProduct(null);
  };

  const handleQuickAdd = (product, qty, e) => {
    if (product.variants?.length > 0) {
      setSelectedProduct(product);
    } else {
      addToCart(product, qty, e);
    }
  };

  const updateCartQuantity = (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(" DH", "")) * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rightScrollRef = useRef(null);

  const scrollToSectionDesktop = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
    setActiveTabDesktop(id);
  };

  const scrollToSectionMobile = (id) => {
    const el = document.getElementById(`mobile-${id}`);
    if (el && rightScrollRef.current) rightScrollRef.current.scrollTo({ top: el.offsetTop - rightScrollRef.current.offsetTop, behavior: 'smooth' });
    setActiveTabMobile(id);
  };

  const handleMobileScroll = () => {
    if (!rightScrollRef.current) return;
    const divs = dynamicMenu.map(c => document.getElementById(`mobile-${c.id}`)).filter(Boolean);
    let current = dynamicMenu[0]?.id;
    for (const d of divs) {
      if (d.offsetTop - rightScrollRef.current.offsetTop <= rightScrollRef.current.scrollTop + 50) current = d.id.replace('mobile-', '');
    }
    if (current !== activeTabMobile) setActiveTabMobile(current);
  };

  useEffect(() => {
    if (isMobile) return;

    const handleDesktopScroll = () => {
      const scrollPos = window.scrollY + 200; // Offset for sticky headers
      let current = activeTabDesktop;

      for (const cat of dynamicMenu) {
        const el = document.getElementById(cat.id);
        if (el && el.offsetTop <= scrollPos) {
          current = cat.id;
        }
      }

      if (current !== activeTabDesktop) {
        setActiveTabDesktop(current);
      }
    };

    window.addEventListener('scroll', handleDesktopScroll);
    return () => window.removeEventListener('scroll', handleDesktopScroll);
  }, [isMobile, dynamicMenu, activeTabDesktop]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      setCheckoutSuccess(true);
      setCart([]);
      setIsCartOpen(true);
      setIsCheckoutMode(true);
      setTimeout(() => window.history.replaceState({}, document.title, window.location.pathname), 2000);
    } else if (paymentStatus === 'error') {
      alert("Le paiement a échoué. Veuillez réessayer.");
      setIsCartOpen(true);
      setIsCheckoutMode(true);
      setTimeout(() => window.history.replaceState({}, document.title, window.location.pathname), 2000);
    }
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      if (selectedProduct.variants?.length > 0) {
        setSelectedVariant(selectedProduct.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedProduct]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (checkoutForm.phone.length !== 10) {
      alert("Le numéro de téléphone doit comporter exactement 10 chiffres.");
      return;
    }
    setIsSubmitting(true);
    try {
      const names = checkoutForm.full_name.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '.';

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const cRes = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: checkoutForm.phone,
          address: checkoutForm.address
        })
      });
      const customer = await cRes.json();
      const orderRes = await fetch(`${API_BASE}/api/orders`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customer.id, total_amount: cartTotal, notes: checkoutForm.notes, items: cart.map(i => ({ product_id: i.dbId || null, product_name: i.name, quantity: i.quantity, unit_price: parseFloat(i.price.replace(" DH", "")), variant_name: i.variant_name })), payment_method: checkoutForm.payment_method })
      });
      
      const orderData = await orderRes.json();

      if (checkoutForm.payment_method === 'Online') {
        const payRes = await fetch(`${API_BASE}/api/payments/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderData.id,
            amount: cartTotal,
            customer: {
              full_name: checkoutForm.full_name,
              phone: checkoutForm.phone,
              address: checkoutForm.address
            }
          })
        });
        const payData = await payRes.json();
        if (payData.redirect_url) {
          window.location.href = payData.redirect_url;
          return;
        } else {
          throw new Error("Erreur de paiement");
        }
      }

      setCart([]); setCheckoutSuccess(true);
      setTimeout(() => {
        setIsCartOpen(false);
        setIsCheckoutMode(false);
        setCheckoutSuccess(false);
        setCheckoutForm({ full_name: '', phone: '', address: '', notes: '', payment_method: 'Cash on Delivery' });
        setShowNotes(false);
      }, 3000);
    } catch (err) { alert("Une erreur est survenue."); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-[#FDFCFB] text-emerald-950 font-forma_djr_display min-h-screen">

      {/* MOBILE */}
      <div className={`${isMobile ? 'flex' : 'hidden'} md:hidden flex-col h-[100dvh] bg-gray-50 overflow-hidden fixed inset-0 z-50 pt-[65px]`}>
        <div className="flex-1 overflow-hidden flex">
          <div className="w-[85px] bg-white border-r overflow-y-auto no-scrollbar pb-24 shrink-0 shadow-sm">
            {dynamicMenu.map(cat => (
              <button key={cat.id} onClick={() => scrollToSectionMobile(cat.id)} className={`w-full flex flex-col items-center py-5 px-1 gap-2 ${activeTabMobile === cat.id ? 'bg-gray-50' : 'opacity-60'}`}>
                <div className={`w-12 h-12 rounded-full overflow-hidden transition-transform ${activeTabMobile === cat.id ? 'scale-110 shadow-lg ring-2 ring-[#C03434]' : 'grayscale-[30%]'}`}>
                  <img src={cat.bannerImage} alt="" className="w-full h-full object-cover" />
                </div>
                <span className={`text-[10px] uppercase tracking-wider text-center ${activeTabMobile === cat.id ? 'font-bold text-[#C03434]' : 'font-semibold text-gray-400'}`}>{cat.title}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50 p-3 pb-32 no-scrollbar scroll-smooth" ref={rightScrollRef} onScroll={handleMobileScroll}>
            <div className="space-y-6">
              {dynamicMenu.map(cat => (
                <div key={`mobile-${cat.id}`} id={`mobile-${cat.id}`} className="scroll-mt-4 min-h-[100px]">
                  <h3 className="font-bold text-[17px] mb-3 text-gray-800 ml-1">{cat.title}</h3>
                  {hydratedCategories.has(cat.id) ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {cat.items.map(item => <MobileProductCard key={item.id} item={item} onAddToCart={handleQuickAdd} onSelect={setSelectedProduct} />)}
                    </div>
                  ) : <div className="h-40 bg-white/50 rounded-2xl animate-pulse" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? 'hidden' : 'block'} hidden md:block pb-20`}>
        <div className="relative h-[45vh] pt-[100px] w-full flex flex-col justify-center items-center overflow-hidden bg-emerald-950">
          <img src={pizzaImg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-emerald-950/80 to-transparent" />
          <div className="relative z-10 text-center flex flex-col items-center">
            <span className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-xs mb-4 border border-emerald-300/30 px-4 py-1.5 rounded-full backdrop-blur-md">Artisanal & Traditionnel</span>
            <h1 className="text-8xl font-bold font-souvenir_std tracking-tight text-white leading-none">Le <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe4b5] to-white">Menu</span></h1>
          </div>
        </div>
        <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-2xl border-b shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-center space-x-10">
            {dynamicMenu.map(cat => (
              <button key={cat.id} onClick={() => scrollToSectionDesktop(cat.id)} className={`relative py-5 text-[13px] uppercase tracking-widest font-bold transition-colors ${activeTabDesktop === cat.id ? "text-[#C03434]" : "text-emerald-950/40 hover:text-emerald-950"}`}>
                {cat.title}
                {activeTabDesktop === cat.id && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#C03434] rounded-t-lg" />}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
          {dynamicMenu.map((cat, idx) => (
            <section id={cat.id} key={cat.id} className="scroll-mt-32 min-h-[200px]">
              <div className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 mb-12`}>
                <div className="flex-1"><h2 className="text-5xl font-bold font-souvenir_std text-emerald-950 mb-4">{cat.title}</h2><p className="text-xl text-emerald-900/60 font-light">{cat.subtitle}</p></div>
                <div className="flex-1 h-[220px] rounded-[2rem] overflow-hidden shadow-2xl bg-emerald-100"><img src={cat.bannerImage} className="w-full h-full object-cover" /></div>
              </div>
              {hydratedCategories.has(cat.id) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map(item => <ProductCard key={item.id} item={item} onAddToCart={handleQuickAdd} onSelect={setSelectedProduct} />)}
                </div>
              ) : <div className="h-60 bg-emerald-50 rounded-[2rem] animate-pulse" />}
            </section>
          ))}
        </div>
      </div>

      {/* Persistent Components */}
      {selectedProduct && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-[850px] shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/50 text-emerald-950 rounded-full flex items-center justify-center backdrop-blur-lg">✕</button>
            <div className="h-64 md:h-auto md:w-1/2 overflow-hidden"><img src={selectedProduct.image || burgerImg} className="w-full h-full object-cover" /></div>
            <div className="p-8 flex flex-col md:w-1/2">
              <h3 className="text-3xl font-bold font-souvenir_std mb-2">{selectedProduct.name}</h3>
              <span className="text-2xl font-bold text-[#C03434] mb-4 block">
                {formatPrice(selectedVariant ? selectedVariant.price : selectedProduct.price)} DH
              </span>
              <p className="text-emerald-900/60 font-light mb-8">{selectedProduct.description || "Une expérience authentique italienne."}</p>
              {selectedProduct.variants?.length > 0 && (
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.variants.map(v => (
                      <button key={v.id} onClick={() => setSelectedVariant(v)} className={`p-3 rounded-xl font-bold border-2 transition-all ${selectedVariant?.id === v.id ? 'border-[#C03434] bg-red-50 text-[#C03434]' : 'border-gray-100'}`}>{v.name}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-auto flex items-center gap-4">
                <button onClick={(e) => addToCart(selectedProduct, quantity, e)} className="flex-1 bg-[#C03434] text-white h-16 rounded-xl font-bold uppercase shadow-lg">Ajouter au panier</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setIsCartOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
                className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-5 border-b"><h2 className="text-2xl font-bold font-souvenir_std">{isCheckoutMode ? (checkoutSuccess ? "Bravo!" : "Livraison") : "Panier"}</h2><button onClick={() => { setIsCartOpen(false); setIsCheckoutMode(false); setCheckoutSuccess(false); }}>✕</button></div>

                {isCheckoutMode ? (
                  <form id="checkoutForm" onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-5 no-scrollbar bg-gray-50/20 flex flex-col gap-4">
                    {!checkoutSuccess && (
                      <button type="button" onClick={() => setIsCheckoutMode(false)} className="self-start text-sm font-bold text-gray-500 hover:text-[#C03434] transition-colors mb-2">
                        ← Retour au panier
                      </button>
                    )}

                    {checkoutSuccess ? (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-950 font-souvenir_std">Commande Réussie!</h3>
                        <p className="text-sm text-gray-500 max-w-[250px]">Votre commande a été enregistrée avec succès. Elle sera préparée dans les plus brefs délais.</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <input required type="text" placeholder="Nom Complet" value={checkoutForm.full_name} onChange={e => setCheckoutForm({ ...checkoutForm, full_name: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#C03434] transition-colors" />

                        <div className="relative">
                          <input required type="tel" placeholder="Téléphone (ex: 0612345678)" maxLength="10" value={checkoutForm.phone} onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setCheckoutForm({ ...checkoutForm, phone: val });
                          }} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#C03434] transition-colors" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                            {checkoutForm.phone.length}/10
                          </span>
                        </div>

                        <textarea required placeholder="Adresse de livraison" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} rows="3" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#C03434] transition-colors resize-none"></textarea>

                        {!showNotes ? (
                          <button type="button" onClick={() => setShowNotes(true)} className="text-[13px] font-bold text-[#C03434] hover:underline flex items-center gap-1.5 ml-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Ajouter une note
                          </button>
                        ) : (
                          <textarea placeholder="Notes pour la commande..." value={checkoutForm.notes} onChange={e => setCheckoutForm({ ...checkoutForm, notes: e.target.value })} rows="2" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#C03434] transition-colors resize-none"></textarea>
                        )}

                        <div className="space-y-2 mt-2">
                          <span className="text-[13px] font-bold text-emerald-950 uppercase tracking-widest pl-1">Méthode de paiement</span>
                          <div className="grid grid-cols-2 gap-3">
                            <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${checkoutForm.payment_method === 'Cash on Delivery' ? 'border-[#C03434] bg-red-50 text-[#C03434]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                              <input type="radio" name="payment_method" value="Cash on Delivery" checked={checkoutForm.payment_method === 'Cash on Delivery'} onChange={e => setCheckoutForm({ ...checkoutForm, payment_method: e.target.value })} className="hidden" />
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                              <span className="text-[12px] font-bold text-center leading-tight">Paiement à la<br />livraison</span>
                            </label>
                            <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${checkoutForm.payment_method === 'Online' ? 'border-[#C03434] bg-red-50 text-[#C03434]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                              <input type="radio" name="payment_method" value="Online" checked={checkoutForm.payment_method === 'Online'} onChange={e => setCheckoutForm({ ...checkoutForm, payment_method: e.target.value })} className="hidden" />
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                              <span className="text-[12px] font-bold text-center leading-tight">Paiement en<br />ligne</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="flex-1 overflow-y-auto p-5 no-scrollbar bg-gray-50/20">
                    {cart.length === 0 ? <p className="text-center text-gray-400 mt-20">Vide</p> : cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl shadow-sm border mb-4">
                        <img src={item.image || burgerImg} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm leading-tight flex-1">{item.name}</h4>
                            <button onClick={() => updateCartQuantity(item.id, -item.quantity)} className="p-1.5 text-gray-400 hover:text-[#C03434] transition-colors rounded-lg hover:bg-red-50 -mt-1 -mr-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-[#C03434]">{formatPrice(item.price)} DH</span>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button onClick={() => updateCartQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-emerald-900 transition-colors">-</button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-emerald-900 transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && !checkoutSuccess && (
                  <div className="p-6 border-t bg-white relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                    {isCheckoutMode ? (
                      <button type="submit" form="checkoutForm" disabled={isSubmitting} className="w-full bg-[#C03434] text-white py-4 rounded-xl font-bold uppercase shadow-lg disabled:opacity-70 transition-all flex justify-center items-center">
                        {isSubmitting ? <span className="animate-pulse">En cours...</span> : `Confirmer (${formatPrice(cartTotal)} DH)`}
                      </button>
                    ) : (
                      <button onClick={() => setIsCheckoutMode(true)} className="w-full bg-[#C03434] text-white py-4 rounded-xl font-bold uppercase shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">Commander ({formatPrice(cartTotal)} DH)</button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {cartAnimations.map(anim => createPortal(
        <div key={anim.id} className="fixed z-[10000] w-12 h-12 rounded-full overflow-hidden border-2 border-white animate-fly-to-cart pointer-events-none" style={{ '--start-x': `${anim.x}px`, '--start-y': `${anim.y}px` }}>
          <img src={anim.image} className="w-full h-full object-cover" />
        </div>,
        document.body
      ))}

      {cartItemCount > 0 && (
        <button onClick={() => setIsCartOpen(true)} className={`fixed bottom-8 right-8 z-[60] bg-[#C03434] text-white p-4 rounded-full shadow-2xl transition-transform ${isCartBumping ? 'scale-125' : 'hover:scale-110'}`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="absolute -top-1 -right-1 bg-white text-[#C03434] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-red-50">{cartItemCount}</span>
        </button>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flyToCart {
          0% { top: var(--start-y); left: var(--start-x); transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { top: calc(100vh - 50px); left: calc(100vw - 50px); transform: translate(-50%, -50%) scale(0.1); opacity: 0; }
        }
        .animate-fly-to-cart { animation: flyToCart 0.7s cubic-bezier(0.5, 0, 0.2, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
