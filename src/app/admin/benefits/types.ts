export interface Benefit {
  id: string;
  name: string;
  inscription_url: string;
  max_capacity: number;
  notes: string;
  price: number;
}

export interface BenefitTime {
  id: string;
  benefit_id: string;
  day: string;
  hour_from: string;
  hour_to: string;
  place: string;
  place_url: string;
}

export interface NewBenefit {
  name: string;
  inscription_url: string;
  max_capacity: number;
  notes: string;
  price: number;
}

export interface NewBenefitTime {
  day: string;
  hour_from: string;
  hour_to: string;
  place: string;
  place_url: string;
} 