import React, { useState } from "react";

export function LocationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="box-border">
      {/* Bouton pour ouvrir le modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Ouvrir Location Modal
      </button>

      {/* Modal principal */}
      <div
        className={`fixed text-black bg-white/90 box-border h-[1000px] w-full z-50 left-0 top-0 font-open_sans transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="relative text-white box-border h-full w-full mx-0 md:w-[760px] md:mx-auto">
          <div className="fixed bg-white shadow-[rgba(0,0,0,0.5)_0px_-1px_4px_0px] box-border flex flex-col max-h-full min-h-40 overflow-x-auto overflow-y-hidden w-full pt-5 pb-[61px] px-2.5 left-0 right-auto top-auto -bottom-full md:absolute md:min-h-[100px] md:pb-[57px] md:px-5 md:right-0 md:-top-full md:bottom-auto">
            <div className="box-border">
              <button
                type="button"
                className="text-[15px] items-center bg-red-300 gap-x-0 block justify-center leading-[22.5px] outline-blue-500 outline gap-y-0 text-center align-middle w-4/5 mx-auto px-0 py-[9px] rounded-[23px]"
              >
                <span className="box-border">
                  Voir les Pizza Cosy près de vous
                </span>
                <i className="font-black box-border inline-block leading-[15px]"></i>
              </button>
              <div className="absolute bg-red-400 shadow-[rgba(0,0,0,0.5)_2px_2px_2px_0px] box-border hidden uppercase z-40 px-5 py-2.5 rounded-bl rounded-br rounded-tl rounded-tr left-2/4 top-20"></div>
              <div className="text-[14.4px] box-border leading-[21.6px] text-center lowercase w-full my-1">
                ou
              </div>
              <div className="relative box-border">
                <input
                  type="text"
                  placeholder="Recherchez votre restaurant"
                  className="text-zinc-600 text-sm font-medium bg-gray-200 box-border leading-[21px] min-h-[60px] min-w-[200px] text-left text-ellipsis w-full mb-2 pl-2 pr-10 pt-[9px] pb-[7px] md:min-h-[75px]"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="text-black box-border pt-[5px] pb-[110px]"></div>
          </div>
        </div>
      </div>

      {/* Modal secondaire pour itinéraire */}
      <div
        className={`fixed text-xs bg-black/80 box-border h-full leading-[18px] w-full z-50 top-0 font-open_sans transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="text-black box-border table-cell align-middle">
          <div className="bg-white box-border mt-[-200%] w-[99%] mx-auto p-2.5 md:w-2/5">
            <h3 className="text-[26px] font-medium box-border tracking-[-1.3px] leading-[26px] mb-2.5 font-souvenir_std md:text-3xl md:tracking-[-1.5px] md:leading-[30px]">
              Demande d'Itinéraire
            </h3>
            <p className="text-lg font-medium box-border leading-[27px] mb-[9px] font-forma_djr_display">
              Afin de vous proposer un itinéraire, nous avons besoin de votre
              adresse de départ :
            </p>
            <input
              type="text"
              placeholder="Merci de la renseigner ici"
              className="text-zinc-600 text-sm font-medium bg-gray-200 box-border leading-[21px] min-h-[60px] min-w-[200px] text-left text-ellipsis w-full my-2 p-[7px] font-forma_djr_display md:min-h-[75px]"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <div className="text-red-700 box-border hidden">
              Cette adresse n'est pas assez précise. Vous pouvez par exemple
              saisir le numéro de la rue, le nom de votre hotel ou de votre
              entreprise où vous souhaitez vous faire livrer.
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-[10px] items-center bg-black box-border inline-block justify-center leading-[15px] px-[15px] py-1.5 rounded"
              >
                Valider
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-[10px] items-center bg-zinc-500 box-border inline-block justify-center leading-[15px] px-[15px] py-1.5 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
