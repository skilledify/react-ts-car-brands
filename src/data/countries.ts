import type { Country } from '../types'

export const countries: Country[] = [
  { id: 'germany', name: 'Германия', flag: '🇩🇪', accent: '#FFD75E' },
  { id: 'italy', name: 'Италия', flag: '🇮🇹', accent: '#61E28B' },
  { id: 'usa', name: 'США', flag: '🇺🇸', accent: '#6FA8FF' },
  { id: 'japan', name: 'Япония', flag: '🇯🇵', accent: '#FF7C8F' },
  { id: 'france', name: 'Франция', flag: '🇫🇷', accent: '#7DA7FF' },
  { id: 'uk', name: 'Великобритания', flag: '🇬🇧', accent: '#B49CFF' },
  { id: 'sweden', name: 'Швеция', flag: '🇸🇪', accent: '#6FE7FF' },
  { id: 'southkorea', name: 'Южная Корея', flag: '🇰🇷', accent: '#FF8CCB' },
  { id: 'czechia', name: 'Чехия', flag: '🇨🇿', accent: '#7EE7C0' },
  { id: 'spain', name: 'Испания', flag: '🇪🇸', accent: '#FFB36B' },
]

export const countryById = Object.fromEntries(
  countries.map((country) => [country.id, country]),
) as Record<Country['id'], Country>
