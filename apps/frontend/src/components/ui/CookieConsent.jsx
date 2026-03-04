import React from 'react';

export function CookieConsent() {
  return (
    <div className="fixed z-[20930940] bottom-0 inset-x-0">
      <div role="dialog" className="absolute w-auto z-[1100] left-0 bottom-0 md:w-[420px] md:left-5 md:bottom-20">
        <input 
          type="hidden" 
          name="axeptio_cookies_pizza cosy-fr_value" 
          value="" 
          className="text-black text-[13.3333px] bg-transparent hidden leading-[normal] p-0 font-arial" 
        />
      </div>
      <button 
        title="Gérez vos préférences en matière de cookies et données personnelles" 
        className="absolute text-black text-sm font-bold bg-transparent block justify-center leading-[17.5px] text-center text-nowrap -translate-x-1.5 z-[1000] p-0 left-[18px] bottom-2.5"
      >
        <span className="text-nowrap">
          <span className="flex text-nowrap">
            <span className="relative flex h-12 text-nowrap w-12">
              <img 
                src="https://c.animaapp.com/menjgxnroMJDqo/assets/icon-1.svg" 
                alt="Icon" 
                className="static h-auto text-wrap align-middle w-auto z-auto md:relative md:aspect-auto md:h-12 md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:align-baseline md:w-12 md:z-[100] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]" 
              />
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
