import type { ReviewItem } from '../types'

/** Top announcement strip copy. */
export const announcement = {
  text: 'CYBER MONDAY EST LANCÉ — OFFRES À DURÉE LIMITÉE',
  cta: 'Voir les soldes',
}

/** Primary navigation. */
export const navLinks = [
  { label: 'Boutique', to: '/shop' },
  { label: 'Soldes', to: '/shop?sort=discount' },
  { label: 'Tendances', to: '/shop?sort=popular' },
  { label: 'Nouveautés', to: '/shop?sort=newest' },
  { label: 'Idées cadeaux', to: '/#gift-guide' },
]

/** Trust bar under the hero. */
export const trustItems = [
  { title: 'Paiements sécurisés', detail: 'Vos coordonnées bancaires restent chez le prestataire', icon: 'shield' },
  { title: 'Expédition rapide', detail: 'Livraison offerte dès 79 € · 3 à 5 jours', icon: 'truck' },
  { title: 'Retours faciles', detail: 'Sous 30 jours, étiquette prépayée incluse', icon: 'return' },
  { title: 'Service client', detail: 'FAQ et contact, 7 jours sur 7', icon: 'chat' },
]

/** Editorial gift guide collections. */
export const giftCollections = [
  {
    id: 'for-him',
    title: 'POUR LUI',
    subtitle: 'Montres, portefeuilles et essentiels du week-end',
    image: 'images/gift-him.jpg',
    alt: 'Gros plan d’une montre chronographe doré rosé',
    to: '/shop?category=lifestyle',
  },
  {
    id: 'for-her',
    title: 'POUR ELLE',
    subtitle: 'Petits bijoux, grandes émotions',
    image: 'images/gift-her.jpg',
    alt: 'Bagues présentées sur un présentoir bijou blanc',
    to: '/shop?category=lifestyle',
  },
  {
    id: 'for-gamers',
    title: 'POUR LES GAMERS',
    subtitle: 'Manettes, casques et sessions console',
    image: 'images/gift-gamers.jpg',
    alt: 'Mains tenant une manette de jeu dans une pièce sombre',
    to: '/shop?category=gaming',
  },
  {
    id: 'for-tech-lovers',
    title: 'POUR LES AMIS DE LA TECH',
    subtitle: 'Des gadgets vraiment utilisés au quotidien',
    image: 'images/gift-tech.jpg',
    alt: 'Console et ordinateur portable disposés sur un bureau',
    to: '/shop?category=tech',
  },
]

/** Sample shopper quotes — clearly labelled as demo data in the UI. */
export const testimonials: ReviewItem[] = [
  {
    id: 't-1',
    name: 'Camille',
    initials: 'CM',
    rating: 5,
    product: 'Sonic Pro Headphones',
    text: 'Commandé le lundi, porté dès le jeudi. La réduction de bruit dans le train est le vrai test — elle passe.',
  },
  {
    id: 't-2',
    name: 'Julien',
    initials: 'JL',
    rating: 5,
    product: 'Velocity Mechanical Keyboard',
    text: 'La sensation de frappe est bien meilleure que le prix ne le laisse penser. Le hot-swap m’a convaincu de le garder longtemps.',
  },
  {
    id: 't-3',
    name: 'Sara',
    initials: 'SR',
    rating: 4,
    product: 'Urban Commuter Backpack',
    text: 'Mon portable 16" et un week-end de vêtements y tiennent sans effort. Les bretelles restent confortables même à pleine charge.',
  },
  {
    id: 't-4',
    name: 'Marc',
    initials: 'MC',
    rating: 5,
    product: 'Pulse Fit Smartwatch',
    text: 'L’autonomie tient exactement une semaine, comme promis, et le suivi du sommeil a enfin du sens pour moi.',
  },
]

/** Frequently asked questions (store level). */
export const storeFaqs = [
  {
    q: 'Ces prix sont-ils réels ?',
    a: 'FLASHORA est un prototype : le catalogue, les prix, les remises et les états de stock sont des données de démonstration. Le paiement n’est jamais réellement traité.',
  },
  {
    q: 'Quand les offres Cyber Monday prennent-elles fin ?',
    a: 'Les comptes à rebours de ce prototype illustrent un format d’offre à durée limitée. Les échéances réelles de la campagne seraient publiées ici et sur chaque page d’offre.',
  },
  {
    q: 'Comment savoir si un article est en stock ?',
    a: 'Chaque fiche produit et chaque page article affiche un état clair : en stock ou rupture de stock. Nous n’affichons jamais de quantités restantes inventées.',
  },
  {
    q: 'Puis-je acheter sans créer de compte ?',
    a: 'Oui. La commande en tant qu’invité est prise en charge : le tunnel de commande ne collecte que les coordonnées de livraison, et le paiement est confié à un prestataire en production.',
  },
  {
    q: 'Quels moyens de paiement seront pris en charge ?',
    a: 'Le tunnel de commande est conçu pour un prestataire tel que Stripe ou PayPal : les données de carte sont saisies sur l’interface du prestataire et ne sont jamais stockées par la boutique.',
  },
]

/** Product-level FAQ shown on product pages. */
export const productFaqs = [
  {
    q: 'Cet article est-il inclus dans la campagne Cyber Monday ?',
    a: 'Le badge sur la fiche vous le dit : les articles en promotion affichent leur remise, les nouveautés affichent « Nouveau ». Les articles sans remise gardent leur prix habituel.',
  },
  {
    q: 'Quel est le délai de livraison ?',
    a: 'La livraison standard est estimée à 2 à 5 jours ouvrés, de nouveau affichée au moment de la commande avant votre confirmation.',
  },
  {
    q: 'Et si l’article ne convient pas à ma configuration ?',
    a: 'Les retours sont acceptés sous 30 jours conformément à la politique de retour, à condition que l’article soit complet et dans son emballage d’origine.',
  },
  {
    q: 'Le produit est-il garanti ?',
    a: 'Chaque produit indique sa période de garantie dans les caractéristiques techniques. La garantie couvre les défauts de fabrication, pas les dommages accidentels.',
  },
]

/** Customer service content blocks. */
export const shippingFacts = [
  {
    label: 'Livraison standard',
    value: '3 à 5 jours ouvrés',
    detail: 'Suivi, signature à la réception',
  },
  {
    label: 'Livraison express',
    value: '1 à 2 jours ouvrés',
    detail: 'Commandez avant 14 h',
  },
  {
    label: 'Livraison offerte',
    value: 'Commandes de plus de 79 €',
    detail: 'Appliquée automatiquement lors de la commande',
  },
  {
    label: 'Suivi',
    value: 'Inclus',
    detail: 'Envoyé par e-mail à l’expédition du colis',
  },
]

export const returnFacts = [
  { label: 'Délai de retour', value: '30 jours', detail: 'À partir de la date de livraison' },
  {
    label: 'État',
    value: 'Ensemble complet',
    detail: 'Emballage et accessoires d’origine',
  },
  {
    label: 'Délai de remboursement',
    value: '5 à 10 jours ouvrés',
    detail: 'Après réception et contrôle du retour',
  },
  {
    label: 'Frais de retour',
    value: 'Étiquette prépayée',
    detail: 'Générée depuis votre page de commande',
  },
]

/** Newsletter copy. */
export const newsletter = {
  title: 'ACCÈS EN PRIORITÉ AUX MEILLEURES OFFRES',
  text: 'Accédez en avant-première aux prochains lancements, aux offres exclusives et aux nouveautés.',
  cta: 'REJOINDRE FLASHORA',
  placeholder: 'Votre adresse e-mail',
}
