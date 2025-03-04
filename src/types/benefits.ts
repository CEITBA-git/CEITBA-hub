
export interface BenefitTime {
  day: string;
  hour_from: string;
  hour_to: string;
  place: string;
  place_url?: string;
}

export interface Benefit {
  id: string;
  name: string;
  inscription_url?: string;
  max_capacity?: number;
  teachers?: string[];
  notes?: string;
  times?: BenefitTime[];
}
export interface Agreement {
  id: string;
  name: string;
  inscription_url?: string;
  schedule?: string[];
  place?: string; 
  place_url?: string; 
  max_capacity?: number;
  teachers?: string[];
  notes?: string;
  price?: number;
}

export interface Language {
  id: string;
  name: string;
  inscription_url?: string;
  notes?: string;
  levels?: string[];
  prices?: string[];
}

export interface BenefitsData {
  sports: Benefit[];
  agreements: Agreement[];
  languages: Language[];
  activities: Benefit[];
}

export type BenefitType = 'sport'  | 'activity' | 'agreement' | 'language'; 