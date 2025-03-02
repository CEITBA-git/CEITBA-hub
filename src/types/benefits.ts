export interface Sport {
  id: string;
  name: string;
  inscription_url: string;
  max_capacity: number;
  schedule: string;
  place: string;
  place_url: string;
  teachers: string;
  notes: string;
}

export interface Agreement {
  id: string;
  name: string;
  inscription_url: string;
  max_capacity: number;
  schedule: string;
  place: string;
  place_url: string;
  teachers: string;
  notes: string;
  price: number;
}

export interface Language {
  id: string;
  name: string;
  inscription_url: string;
  notes: string;
  levels: string;
  prices: string;
}

export type BenefitType = 'sport' | 'agreement' | 'language'; 