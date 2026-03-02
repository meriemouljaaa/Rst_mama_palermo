import React from "react";
import { Link } from "react-router-dom";

const restaurantData = {
  id: 'main-restaurant',
  name: 'MAMMA PALERMO - Restaurant Principal',
  address: 'Residence Abdelhadi RDC, Centre, Bouskoura 27182',
  phone1: '05 22 06 65 79',
  phone2: '06 56 18 87 92',
  email: 'contact@mammapalermo.ma',
  hours: {
    'Lundi': '11h30 - 14h30 • 18h30 - 22h30',
    'Mardi': '11h30 - 14h30 • 18h30 - 22h30',
    'Mercredi': '11h30 - 14h30 • 18h30 - 22h30',
    'Jeudi': '11h30 - 14h30 • 18h30 - 22h30',
    'Vendredi': '11h30 - 14h30 • 18h30 - 23h00',
    'Samedi': '11h30 - 15h00 • 18h30 - 23h00',
    'Dimanche': '18h30 - 22h30'
  },
  mapUrl: 'https://www.google.com/maps/place/123+Rue+de+la+Pizza,+75001+Paris,+France',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3414!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1692930000000!5m2!1sfr!2sfr',
  coordinates: {
    lat: 48.8566,
    lng: 2.3522
  }
};

export default function Carte() {
  const openInGoogleMaps = () => {
    window.open(restaurantData.mapUrl, "_blank");
  };

  const callRestaurant = (number) => {
    window.open(`tel:${number.replace(/\s/g, '')}`, "_self");
  };

  const emailRestaurant = () => {
    window.open(`mailto:${restaurantData.email}`, "_self");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-emerald-900 text-white py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 font-souvenir_std tracking-[-2px] md:text-6xl">
            Nous Trouver
          </h1>
          <p className="text-xl font-medium font-forma_djr_display md:text-2xl">
            Venez découvrir nos lieux sincères
          </p>
        </div>

        {/* Bouton de retour */}
        <Link
          to="/"
          className="absolute top-8 left-8 text-white text-base font-medium items-center bg-transparent flex justify-center min-h-[50px] min-w-[50px] border-white px-4 py-3 rounded-[25px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-white hover:text-emerald-900 md:text-lg md:min-h-[60px] md:px-6 md:py-4 md:rounded-[30px]"
        >
          ← Retour
        </Link>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-5 py-16">
        {/* Informations */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-6 font-souvenir_std tracking-[-2px] md:text-5xl">
            {restaurantData.name}
          </h2>
          <p className="text-xl text-gray-600 font-forma_djr_display md:text-2xl">
            {restaurantData.address}
          </p>
        </div>

        {/* Carte + Infos */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Google Maps */}
          <div className="relative">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Localisation Pizza Cosy"
                src={restaurantData.embedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[400px] md:h-[500px]"
              />
            </div>

            {/* Bouton Maps */}
            <div className="mt-6 text-center">
              <button
                onClick={openInGoogleMaps}
                className="text-white text-base font-medium items-center bg-[#C03434] inline-flex justify-center min-h-[60px] min-w-[200px] border-[#C03434] px-8 py-4 rounded-[30px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-[#a52a2a] md:text-xl md:min-h-[75px] md:py-6 md:rounded-[37.5px]"
              >
                📍 Ouvrir dans Google Maps
              </button>
            </div>
          </div>

          {/* Infos détaillées */}
          <div className="space-y-8">
            {/* Horaires */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 font-souvenir_std text-center">
                🕒 Horaires d'ouverture
              </h3>
              <div className="space-y-3">
                {Object.entries(restaurantData.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-bold text-emerald-900 font-forma_djr_display">
                      {day}
                    </span>
                    <span className="text-gray-600 font-forma_djr_display">
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border-2 border-gray-100 rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 font-souvenir_std text-center">
                📞 Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-bold text-emerald-900 font-forma_djr_display">
                      Téléphone
                    </h4>
                    <p className="text-gray-600 font-forma_djr_display">
                      {restaurantData.phone1} <br />
                      {restaurantData.phone2}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => callRestaurant(restaurantData.phone1)}
                      className="text-white text-xs font-medium items-center bg-emerald-900 inline-flex justify-center min-h-[35px] min-w-[80px] border-emerald-900 px-4 py-1 rounded-[20px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-emerald-800"
                    >
                      Appeler 1
                    </button>
                    <button
                      onClick={() => callRestaurant(restaurantData.phone2)}
                      className="text-white text-xs font-medium items-center bg-emerald-900 inline-flex justify-center min-h-[35px] min-w-[80px] border-emerald-900 px-4 py-1 rounded-[20px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-emerald-800"
                    >
                      Appeler 2
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-bold text-emerald-900 font-forma_djr_display">
                      Email
                    </h4>
                    <p className="text-gray-600 font-forma_djr_display">
                      {restaurantData.email}
                    </p>
                  </div>
                  <button
                    onClick={emailRestaurant}
                    className="text-white text-sm font-medium items-center bg-[#C03434] inline-flex justify-center min-h-[40px] min-w-[80px] border-[#C03434] px-4 py-2 rounded-[20px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-[#a52a2a]"
                  >
                    Écrire
                  </button>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-emerald-900 text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 font-souvenir_std text-center">
                🍕 Nos Services
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">🏪</div>
                  <h4 className="font-bold font-forma_djr_display mb-1">Sur place</h4>
                  <p className="text-sm font-forma_djr_display opacity-90">Restauration</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">📦</div>
                  <h4 className="font-bold font-forma_djr_display mb-1">À emporter</h4>
                  <p className="text-sm font-forma_djr_display opacity-90">Take away</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">🚗</div>
                  <h4 className="font-bold font-forma_djr_display mb-1">Livraison</h4>
                  <p className="text-sm font-forma_djr_display opacity-90">À domicile</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">🅿️</div>
                  <h4 className="font-bold font-forma_djr_display mb-1">Parking</h4>
                  <p className="text-sm font-forma_djr_display opacity-90">Gratuit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-16 border-t border-gray-200">
          <h3 className="text-3xl font-bold text-emerald-900 mb-4 font-souvenir_std">
            Prêt à nous rendre visite ?
          </h3>
          <p className="text-xl text-gray-600 mb-8 font-forma_djr_display">
            Découvrez l'authenticité de nos saveurs italiennes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="text-white text-base font-medium items-center bg-[#C03434] inline-flex justify-center min-h-[60px] min-w-[200px] border-[#C03434] px-8 py-4 rounded-[30px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-[#a52a2a] md:text-xl md:min-h-[75px] md:py-6 md:rounded-[37.5px]"
            >
              Voir la carte
            </Link>
            <button
              onClick={() => callRestaurant(restaurantData.phone1)}
              className="text-white text-base font-medium items-center bg-emerald-900 inline-flex justify-center min-h-[60px] min-w-[200px] border-emerald-900 px-8 py-4 rounded-[30px] border-2 font-forma_djr_display transition-colors duration-200 hover:bg-emerald-800 md:text-xl md:min-h-[75px] md:py-6 md:rounded-[37.5px]"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
