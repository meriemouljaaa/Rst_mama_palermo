import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Send, 
    Facebook, 
    Instagram, 
    Linkedin, 
    Twitter, 
    Youtube,
    ChevronRight,
    MessageSquare,
    Info
} from "lucide-react";

import pizzaBg from "../assets/products/pizza.jpg";

const socialLinks = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com',
    icon: <Facebook size={20} />,
    color: 'hover:text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com',
    icon: <Instagram size={20} />,
    color: 'hover:text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.02.16-.03.32-.03.48 0 1.29.84 2.44 2.07 2.82.72.23 1.51.19 2.22-.09.91-.32 1.61-1.12 1.83-2.05.07-.3.1-.61.1-.91V.02h-.01Z"/>
      </svg>
    ),
    color: 'hover:text-white',
    bgColor: 'bg-[#000000]'
  }
];

const contactInfo = {
  address: 'Residence Abdelhadi RDC, Centre, Bouskoura 27182',
  phone1: '05 22 06 65 79',
  phone2: '06 56 18 87 92',
  email: 'contact@mammapalermo.com',
  hours: [
    { day: 'Lundi - Vendredi', time: '12h00 - 23h00' },
    { day: 'Samedi & Dimanche', time: '12h00 - 00h00' }
  ]
};

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi du formulaire
    setTimeout(() => {
      setSubmitMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 2000);
  };

  const openSocialLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section - Elite Design */}
      <div className="relative h-[45vh] md:h-[50vh] pt-[100px] w-full flex flex-col justify-center items-center overflow-hidden bg-emerald-950">
           <img src={pizzaBg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-emerald-950/80 to-transparent" />
           
           <div className="relative z-10 text-center flex flex-col items-center px-5 mb-16 md:mb-20">
             <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 border border-emerald-300/30 px-4 py-1 rounded-full backdrop-blur-md"
             >
              Service Client
             </motion.span>
             <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold font-souvenir_std tracking-tight text-white leading-none mb-6"
             >
                Restons en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe4b5] via-white to-[#ffe4b5] italic">Contact</span>
             </motion.h1>
             <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-50/70 max-w-xl text-base md:text-xl font-light leading-relaxed font-forma_djr_display"
             >
               Partagez votre expérience ou rejoignez la famille Mamma Palermo.
             </motion.p>
           </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-8 md:-mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Contact Information Cards */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick Access Card */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-bold text-emerald-950 font-souvenir_std">Coordonnées</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-900 group-hover:bg-[#C03434] group-hover:text-white transition-all duration-300 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-1">Localisation</h4>
                    <p className="text-emerald-950 font-bold leading-snug text-sm">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-900 group-hover:bg-[#C03434] group-hover:text-white transition-all duration-300 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-1">Téléphones</h4>
                    <div className="flex flex-col gap-0.5">
                      <a href={`tel:${contactInfo.phone1}`} className="text-emerald-950 font-bold hover:text-[#C03434] transition-colors">{contactInfo.phone1}</a>
                      <a href={`tel:${contactInfo.phone2}`} className="text-emerald-950 font-bold hover:text-[#C03434] transition-colors">{contactInfo.phone2}</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-900 group-hover:bg-[#C03434] group-hover:text-white transition-all duration-300 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-1">Email</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-emerald-950 font-bold hover:text-[#C03434] transition-colors break-all text-sm">{contactInfo.email}</a>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="pt-0.5 w-full">
                      <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-2">Horaires</h4>
                      <div className="space-y-1.5">
                         {contactInfo.hours.map((h, i) => (
                           <div key={i} className="flex justify-between items-center w-full">
                              <span className="text-[13px] font-medium text-gray-500">{h.day}</span>
                              <span className="text-[13px] font-bold text-emerald-950">{h.time}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials Card - Optimized */}
            <div className="bg-[#0b2b1a] rounded-[2rem] p-8 relative overflow-hidden group shadow-xl border border-white/5">
               <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-all duration-700" />
               <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-500/5 rounded-full blur-[40px]" />
               
               <h3 className="text-white font-bold font-souvenir_std text-xl mb-6 relative z-10 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                 Rejoignez-nous
               </h3>
               
               <div className="grid grid-cols-3 gap-3 relative z-10">
                  {socialLinks.map(social => (
                    <button 
                      key={social.id} 
                      onClick={() => openSocialLink(social.url)}
                      className="aspect-square bg-white/5 hover:bg-white text-white hover:text-[#0b2b1a] rounded-2xl flex items-center justify-center transition-all duration-500 scale-100 hover:scale-105 border border-white/10 group/btn shadow-lg"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {social.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 absolute -bottom-4">{social.name}</span>
                      </div>
                    </button>
                  ))}
               </div>
               
               <div className="mt-8 flex items-center justify-between relative z-10 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <p className="text-emerald-50/60 text-[10px] uppercase tracking-[0.2em] font-black">Mamma Palermo</p>
                 </div>
                 <p className="text-white/20 text-[9px] font-bold">@OFFICIEL</p>
               </div>
            </div>
          </div>

          {/* Right Side: Modern Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/20 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="mb-10 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 font-souvenir_std mb-2">Envoyez un message</h2>
                  <p className="text-gray-400 text-base md:text-lg font-light">Réponse moyenne sous 24 heures.</p>
                </div>

                {submitMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 mb-8 flex items-center gap-3 font-bold text-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                       <Send size={14} />
                    </div>
                    {submitMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Prénom</label>
                         <input 
                          type="text" 
                          name="firstName" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 text-sm" 
                          placeholder="Marco"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Nom</label>
                         <input 
                          type="text" 
                          name="lastName" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 text-sm" 
                          placeholder="Rossi"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Email</label>
                         <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 text-sm" 
                          placeholder="marco.r@example.com"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Téléphone</label>
                         <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 text-sm" 
                          placeholder="06 12 34 56 78"
                         />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Sujet</label>
                       <select 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 appearance-none pointer-events-auto text-sm"
                       >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="commande">Support Commande</option>
                          <option value="franchise">Devenir Franchisé</option>
                          <option value="evenement">Événements & Groupes</option>
                          <option value="partenariat">Recrutement</option>
                          <option value="autre">Autre demande</option>
                       </select>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] uppercase tracking-widest font-black text-gray-400 ml-1">Message</label>
                       <textarea 
                        name="message" 
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-emerald-950 resize-none text-sm" 
                        placeholder="Comment pouvons-nous vous aider ?"
                       />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-900 text-white rounded-full py-4 font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-900/10 hover:bg-black hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer ma demande
                      </>
                    )}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section - Elite Full Width */}
      <div className="w-full h-[400px] bg-gray-200 relative overflow-hidden group">
         <iframe 
          title="Mamma Palermo Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.620806432468!2d-7.654073788992114!3d33.45918444870198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62f0032a1fd35%3A0x186f8b7a58768da7!2sMAMMA%20PALERMO!5e0!3m2!1sen!2sma!4v1773333712144!5m2!1sen!2sma" 
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100" 
          allowFullScreen="" 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
         />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-16 h-16 bg-[#C03434] text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <MapPin size={32} />
            </div>
         </div>
         <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
      </div>
    </div>
  );
}
