import React, { useState } from "react";
import { orderOptionsData } from "../../data/orderOptionsData";

export function OrderNavigation() {
  const [active, setActive] = useState(null);

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-50">
      <ul className="flex gap-3 p-3 justify-start">
        {orderOptionsData.map((opt) => {
          const expanded = active === opt.id;

          return (
            <li
              key={opt.id}
              onMouseEnter={() => setActive(opt.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(opt.id)}
              onBlur={() => setActive(null)}
              className={[
                "transition-[flex-basis] duration-300 ease-out",
                expanded ? "flex-[1_1_100%]" : "flex-[0_0_240px]",
              ].join(" ")}
            >
              <a
                href="#"
                aria-expanded={expanded}
                className={[
                  "group relative block overflow-hidden rounded-2xl text-white shadow-lg",
                  "transition-all duration-300 ease-out",
                  opt.bg,
                  expanded ? "p-6" : "px-4 py-3",
                ].join(" ")}
              >
                {/* Vue compacte */}
                <div className={expanded ? "hidden" : "flex items-center gap-3"}>
                  <img
                    src={opt.image}
                    alt={opt.type}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="text-lg font-semibold">{opt.type}</span>
                </div>

                {/* Vue étendue */}
                <div
                  className={[
                    expanded
                      ? "grid grid-cols-[auto_1fr_auto] items-center gap-6"
                      : "hidden",
                    "min-h-[160px]",
                  ].join(" ")}
                >
                  {/* Col gauche */}
                  <div className="flex items-center gap-5">
                    <img
                      src={opt.image}
                      alt={opt.type}
                      className="h-16 w-16 md:h-20 md:w-20 object-contain"
                    />
                    <span className="text-4xl md:text-6xl font-extrabold leading-none">
                      {opt.type}
                    </span>
                  </div>

                  {/* Col centre */}
                  <p className="text-center text-lg md:text-2xl font-medium">
                    {opt.description}
                  </p>

                  {/* Col droite */}
                  <button
                    type="button"
                    className={[
                      "justify-self-end uppercase font-semibold",
                      "bg-white border-2 border-white",
                      "rounded-[30px] px-7 py-3 md:px-10 md:py-4",
                      "min-h-[52px] md:min-h-[64px]",
                      "shadow-sm transition-transform duration-200",
                      "hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                      opt.buttonTextColor,
                    ].join(" ")}
                  >
                    Je commande
                  </button>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
