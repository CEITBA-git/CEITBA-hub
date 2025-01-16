'use client'

import { useState } from 'react';
import faqData from '@/data/faq.json';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';

const faqItems = faqData.items;

export default function FaqPage() {
  const [activeTab] = useState('faq');

  return (
    <Layout activeTab={activeTab}>
      <section className="mb-24 max-w-4xl mx-auto">
        <SectionTitle>Preguntas Frecuentes</SectionTitle>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="bg-surface/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.01] transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-3">{item.question}</h3>
              <p className="text-gray leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
} 