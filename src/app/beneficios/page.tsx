'use client'

import { useState } from 'react';
import Layout from '../components/Layout';
import BenefitCard from '../components/BenefitCard';
import SectionTitle from '../components/SectionTitle';
import benefitsData from '@/data/benefits.json';
import { Sport, Agreement, Language } from '@/types/benefits';

export default function BenefitsPage() {
  const [activeTab, setActiveTab] = useState('benefits');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sports' | 'agreements' | 'languages'>('all');

  const categories = [
    { id: 'all', name: 'Todos', emoji: '✨' },
    { id: 'sports', name: 'Deportes', emoji: '⚽' },
    { id: 'agreements', name: 'Convenios', emoji: '🤝' },
    { id: 'languages', name: 'Idiomas', emoji: '🌎' }
  ];

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Beneficios CEITBA</h1>
          <p className="text-gray text-lg max-w-2xl mx-auto">
            Descubrí todos los beneficios exclusivos para miembros del Centro de Estudiantes
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                  : 'bg-surface hover:bg-surface/80'
              }`}
            >
              <span className="text-xl">{category.emoji}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Benefits Sections */}
        {(selectedCategory === 'all' || selectedCategory === 'sports') && (
          <section className="mb-16 animate-fadeIn">
            <SectionTitle>
              <span className="flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                Deportes y Actividades
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefitsData.sports.map((sport: Sport) => (
                <BenefitCard
                  key={sport.id}
                  data={sport}
                  type="sport"
                />
              ))}
            </div>
          </section>
        )}

        {(selectedCategory === 'all' || selectedCategory === 'agreements') && (
          <section className="mb-16 animate-fadeIn">
            <SectionTitle>
              <span className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Convenios
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefitsData.agreements.map((agreement: Agreement) => (
                <BenefitCard
                  key={agreement.id}
                  data={agreement}
                  type="agreement"
                />
              ))}
            </div>
          </section>
        )}

        {(selectedCategory === 'all' || selectedCategory === 'languages') && (
          <section className="mb-16 animate-fadeIn">
            <SectionTitle>
              <span className="flex items-center gap-2">
                <span className="text-2xl">🌎</span>
                Idiomas
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefitsData.languages.map((language: Language) => (
                <BenefitCard
                  key={language.id}
                  data={language}
                  type="language"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
} 