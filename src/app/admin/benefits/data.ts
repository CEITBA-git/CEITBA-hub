import { Benefit, BenefitTime } from './types';

// Mock data for benefits
export const initialBenefits: Benefit[] = [
  { 
    id: '1', 
    name: 'Gimnasio',
    inscription_url: 'https://example.com/gym',
    max_capacity: 50,
    notes: 'Acceso ilimitado al gimnasio del campus',
    price: 1500
  },
  { 
    id: '2', 
    name: 'Yoga',
    inscription_url: 'https://example.com/yoga',
    max_capacity: 20,
    notes: 'Clases de yoga para todos los niveles',
    price: 1200
  },
  { 
    id: '3', 
    name: 'Natación',
    inscription_url: 'https://example.com/swimming',
    max_capacity: 30,
    notes: 'Acceso a la piscina olímpica',
    price: 2000
  }
];

// Mock data for benefit times
export const initialBenefitTimes: BenefitTime[] = [
  {
    id: '101',
    benefit_id: '1',
    day: 'Lunes',
    hour_from: '08:00',
    hour_to: '20:00',
    place: 'Edificio Central',
    place_url: 'https://maps.example.com/gym'
  },
  {
    id: '102',
    benefit_id: '1',
    day: 'Miércoles',
    hour_from: '08:00',
    hour_to: '20:00',
    place: 'Edificio Central',
    place_url: 'https://maps.example.com/gym'
  },
  {
    id: '103',
    benefit_id: '2',
    day: 'Martes',
    hour_from: '18:00',
    hour_to: '19:30',
    place: 'Sala de Yoga',
    place_url: 'https://maps.example.com/yoga'
  },
  {
    id: '104',
    benefit_id: '2',
    day: 'Jueves',
    hour_from: '18:00',
    hour_to: '19:30',
    place: 'Sala de Yoga',
    place_url: 'https://maps.example.com/yoga'
  },
  {
    id: '105',
    benefit_id: '3',
    day: 'Lunes',
    hour_from: '14:00',
    hour_to: '18:00',
    place: 'Piscina Olímpica',
    place_url: 'https://maps.example.com/pool'
  }
];

// Day options for the form
export const dayOptions: string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
]; 