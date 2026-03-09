import React, { useState } from "react";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com',
    icon: '📘',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com',
    icon: '📷',
    color: 'bg-[#C03434]',
    hoverColor: 'hover:bg-[#C03434]'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://fr.linkedin.com',
    icon: '💼',
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    icon: '🎵',
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: '🐦',
    color: 'bg-blue-400',
    hoverColor: 'hover:bg-blue-500'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: '📺',
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700'
  }
];

const contactInfo = {
  address: 'Residence Abdelhadi RDC, Centre, Bouskoura 27182',
  phone1: '05 22 06 65 79',
  phone2: '06 56 18 87 92',
  email: 'contact@mammapalermo.ma',
  hours: {
    'Lundi - Vendredi': '9h00 - 18h00',
    'Samedi': '10h00 - 16h00',
    'Dimanche': 'Fermé'
  }
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 text-white pt-[100px] py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 font-souvenir_std tracking-[-2px] md:text-6xl">
            Contactez-nous
          </h1>
          <p className="text-xl font-medium font-forma_djr_display md:text-2xl">
            Une question ? Une suggestion ? Nous sommes là pour vous écouter
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Formulaire de contact */}
          <div className="order-2 lg:order-1">
            <div className="bg-white border-2 border-gray-100 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-emerald-900 mb-8 font-souvenir_std text-center">
                📝 Envoyez-nous un message
              </h2>

              {submitMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 font-forma_djr_display">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 font-forma_djr_display"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 font-forma_djr_display"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 font-forma_djr_display"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 font-forma_djr_display"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 font-forma_djr_display"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="franchise">Devenir franchisé</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="compliment">Compliment</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-emerald-900 mb-2 font-forma_djr_display">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-900 focus:outline-none transition-colors duration-200 resize-vertical font-forma_djr_display"
                    placeholder="Écrivez votre message ici..."
                  />
                </div>

                {/* Bouton d'envoi */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-white text-base font-medium items-center bg-emerald-900 box-border gap-x-2 inline-flex justify-center leading-4 min-h-[60px] min-w-[200px] outline-transparant outline gap-y-2 text-center uppercase align-middle border-emerald-900 px-8 py-4 rounded-[30px] border-2 border-solid font-forma_djr_display transition-colors duration-200 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed md:text-xl md:leading-5 md:min-h-[75px] md:py-6 md:rounded-[37.5px]"
                  >
                    {isSubmitting ? (
                      <> <span className="animate-spin mr-2">⏳</span> Envoi en cours... </>
                    ) : (
                      <> 📧 Envoyer le message </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center font-forma_djr_display"> * Champs obligatoires </p>
              </form>
            </div>
          </div>

          {/* Informations de contact et réseaux sociaux */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Informations de contact */}
            <div className="bg-emerald-900 text-white rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-8 font-souvenir_std text-center"> 📍 Nos Coordonnées </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🏢</div>
                  <div>
                    <h3 className="font-bold text-lg font-forma_djr_display mb-1">Adresse</h3>
                    <p className="font-forma_djr_display opacity-90">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📞</div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg font-forma_djr_display mb-1">Téléphone</h3>
                    <a href={`tel:${contactInfo.phone1.replace(/\s/g, '')}`} className="font-forma_djr_display opacity-90 hover:opacity-100 transition-opacity duration-200 underline">
                      {contactInfo.phone1}
                    </a>
                    <a href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`} className="font-forma_djr_display opacity-90 hover:opacity-100 transition-opacity duration-200 underline">
                      {contactInfo.phone2}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-bold text-lg font-forma_djr_display mb-1">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="font-forma_djr_display opacity-90 hover:opacity-100 transition-opacity duration-200 underline">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🕒</div>
                  <div>
                    <h3 className="font-bold text-lg font-forma_djr_display mb-2">Horaires d'ouverture</h3>
                    <div className="space-y-1">
                      {Object.entries(contactInfo.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between font-forma_djr_display opacity-90">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white border-2 border-gray-100 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-emerald-900 mb-8 font-souvenir_std text-center"> 🌐 Suivez-nous </h2>
              <p className="text-center text-gray-600 mb-8 font-forma_djr_display">Restez connectés avec Pizza Cosy sur nos réseaux sociaux pour ne rien manquer de nos actualités, promotions et nouveautés !</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {socialLinks.map((social) => (
                  <button
                    key={social.id}
                    onClick={() => openSocialLink(social.url)}
                    className={`${social.color} ${social.hoverColor} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                        {social.icon}
                      </div>
                      <span className="text-sm font-bold font-forma_djr_display">
                        {social.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-lg font-medium text-emerald-900 font-forma_djr_display"> @pizzacosyfrance </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
