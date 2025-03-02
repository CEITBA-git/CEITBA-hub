'use client'

import { useState } from 'react';
import Layout from '../components/Layout';
import BenefitCard from '../components/BenefitCard';
import { Sport, Agreement, Language } from '@/types/benefits';
import SectionTitle from '../components/SectionTitle';

export default function BenefitsPage() {
  const [activeTab, setActiveTab] = useState('benefits');
  
  // This would typically come from your API or a JSON file
  const sports: Sport[] = [];
  const agreements: Agreement[] = [];
  const languages: Language[] = [];

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Benefits</h1>

        <section className="mb-16">
          <SectionTitle>Sports & Activities</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sports.map((sport) => (
              <BenefitCard
                key={sport.id}
                data={sport}
                type="sport"
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <SectionTitle>Agreements</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agreements.map((agreement) => (
              <BenefitCard
                key={agreement.id}
                data={agreement}
                type="agreement"
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <SectionTitle>Languages</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languages.map((language) => (
              <BenefitCard
                key={language.id}
                data={language}
                type="language"
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
} 