'use client'

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BenefitCard from '../components/BenefitCard';
import SectionTitle from '../components/SectionTitle';
import benefitsData from '@/data/benefits.json';
import { Sport, Agreement, Language } from '@/types/benefits';
  
const categories = [
    { id: 'all', name: 'Todos', emoji: '✨' },
    { id: 'sports', name: 'Deportes', emoji: '⚽' },
    { id: 'agreements', name: 'Convenios', emoji: '🤝' },
    { id: 'languages', name: 'Idiomas', emoji: '🌎' }
];

export default function BenefitsPage() {
  const [activeTab] = useState('benefits');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sports' | 'agreements' | 'languages'>('all');
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<{
    sports: Sport[],
    agreements: Agreement[],
    languages: Language[]
  }>({ sports: [], agreements: [], languages: [] });
  
  useEffect(() => {
    // Set data after component mounts to avoid hydration mismatch
    setData(benefitsData);
    setIsClient(true);
  }, []);

  return (
    <Layout activeTab={activeTab}>
      <section className="space-y-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Beneficios CEITBA</h1>
            <p className="text-gray text-lg max-w-2xl mx-auto">
              Descubrí todos los beneficios exclusivos para miembros del Centro de Estudiantes
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 sm:px-10 w-full">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | 'sports' | 'agreements' | 'languages')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap min-w-fit ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-surface hover:bg-surface/80'
                }`}
              >
                <span>{category.emoji}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Benefits Sections */}
          {!isClient ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <p>Cargando beneficios...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {(selectedCategory === 'all' || selectedCategory === 'sports') && (
                <section key="sports" className="animate-fadeIn">
                  <SectionTitle>
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">⚽</span>
                      Deportes y Actividades
                    </span>
                  </SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.sports.map((sport: Sport) => (
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
                <section key="agreements" className="animate-fadeIn">
                  <SectionTitle>
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🤝</span>
                      Convenios
                    </span>
                  </SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.agreements.map((agreement: Agreement) => (
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
                <section key="languages" className="animate-fadeIn">
                  <SectionTitle>
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🌎</span>
                      Idiomas
                    </span>
                  </SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.languages.map((language: Language) => (
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
          )}
        </div>
      </section>
    </Layout>
  );
} 