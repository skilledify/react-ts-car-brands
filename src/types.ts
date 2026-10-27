import type { BrandLogoId } from './data/brandLogos'

export type CountryId =
  | 'germany'
  | 'italy'
  | 'usa'
  | 'japan'
  | 'france'
  | 'uk'
  | 'sweden'
  | 'southkorea'
  | 'czechia'
  | 'spain'

export interface Country {
  id: CountryId
  name: string
  flag: string
  accent: string
}

export interface Brand {
  id: string
  name: string
  nameRu: string
  country: CountryId
  since: number
  tagline: string
  fact: string
  accent: string
  logo: BrandLogoId | 'mercedes'
}


export interface Progress {
  learned: string[]
  stars: number
  quizBest: number
  quizPlayed: number
  raceBest: number | null
  raceWins: number
  soundOn: boolean
}
