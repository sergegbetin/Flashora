import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'tech',
    name: 'Tech',
    tagline: 'Smartphones, ordinateurs portables & accessoires',
    description:
      'Téléphones, ordinateurs portables, objets connectés et accessoires pour tout garder en marche.',
    image: 'images/product-gadget-pouch.jpg',
    imageAlt: 'Deux smartphones debout sur un fond de studio clair',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    tagline: 'Consoles & équipement de jeu',
    description:
      'Consoles, manettes, claviers mécaniques et casques conçus pour les longues sessions.',
    image: 'images/category-gaming.jpg',
    imageAlt: 'Bureau de jeu éclairé en bleu et magenta',
  },
  {
    id: 'audio',
    name: 'Audio',
    tagline: 'Casques, écouteurs & enceintes',
    description:
      'Des trajets tranquilles aux pièces qui résonnent : casques, écouteurs et enceintes portables.',
    image: 'images/category-audio.jpg',
    imageAlt: 'Personne souriant avec un casque circum-aural',
  },
  {
    id: 'home',
    name: 'Maison',
    tagline: 'Maison connectée & essentiels du quotidien',
    description:
      'Lampes, enceintes connectées et petits appareils qui rendent le quotidien plus simple.',
    image: 'images/category-home.jpg',
    imageAlt: 'Intérieur de chambre lumineux baigné de lumière naturelle',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tagline: 'Produits tendance & cadeaux',
    description:
      'Sacs, équipement de fitness et sélections prêtes à offrir pour tous ceux que vous aimez.',
    image: 'images/category-lifestyle.jpg',
    imageAlt: 'Bracelets à perles empilés portés au poignet',
  },
]

export const categoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id)
