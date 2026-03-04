import legumes from '../assets/legumes.jpg';
import pate_pizza from '../assets/pate_pizza.jpg';

export const qualityFeaturesData = [
    {
      id: 'pate-maison',
      title: 'Pâte maison',
      description: 'Notre pâte à pizza est pétrie chaque jour sur place.',
      image: pate_pizza,
      imageClass: 'italic aspect-[auto_1024_/_1024] bg-no-repeat bg-cover box-border max-w-full break-words align-bottom w-[206px]'
    },
    {
      id: 'de-saison',
      title: 'De saison',
      description: 'Légumes sélectionnés avec soin, cuisinés avec amour.',
      image: legumes,
      imageClass: 'italic aspect-[auto_1024_/_1024] bg-no-repeat bg-cover box-border max-w-full break-words align-bottom w-[210px]'
    }
  ];
  