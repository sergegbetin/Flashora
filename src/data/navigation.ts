export const trendingSearches = [
  'casque',
  'montre connectée',
  'clavier de jeu',
  'ordinateur portable',
  'écouteurs',
  'sac à dos',
  'lampe connectée',
  'idées cadeaux',
]

export const filterRanges = [
  { id: 'all', label: 'Tous les prix', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'u50', label: 'Moins de 50 €', min: 0, max: 49 },
  { id: '50-150', label: '50 € – 150 €', min: 50, max: 150 },
  { id: '150-500', label: '150 € – 500 €', min: 150, max: 500 },
  { id: 'o500', label: 'Plus de 500 €', min: 501, max: Number.POSITIVE_INFINITY },
]
