import emporter from "../assets/icons/emporter1.png";
import livraison from "../assets/icons/livraison1.png";

export const orderOptionsData = [
  {
    id: "takeaway",
    type: "À emporter",
    description: "Vous cherchez un restaurant ?",
    image: emporter,
    bg: "bg-[#C03434]", // ton rouge
    buttonTextColor: "text-[#C03434]",
  },
  {
    id: "delivery",
    type: "En livraison",
    description: "On vous livre à quelle adresse ?",
    image: livraison,
    bg: "bg-emerald-900",
    buttonTextColor: "text-emerald-900",
  },
];
