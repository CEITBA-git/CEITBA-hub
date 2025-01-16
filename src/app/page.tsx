'use client'

import QuickAccessCard from './components/QuickAccessCard';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PreviewCard from './components/PreviewCard';
import SectionTitle from './components/SectionTitle';

const staffMembers = [
  { 
    name: 'Juan Pérez', 
    role: 'Presidente',
    image: '/staff/juan.jpg'
  },
  { 
    name: 'María García', 
    role: 'Vicepresidente',
    image: '/staff/maria.jpg'
  },
  // Add more staff members
];

const faqItems = [
  {
    question: '¿Qué es CEITBA?',
    answer: 'CEITBA es el Centro de Estudiantes del Instituto Tecnológico de Buenos Aires, una organización que representa y apoya a todos los estudiantes del ITBA.'
  },
  {
    question: '¿Cómo me uno a CEITBA?',
    answer: 'Todos los estudiantes del ITBA son automáticamente miembros de CEITBA. Para participar activamente, puedes unirte a nuestras comisiones o asistir a nuestros eventos.'
  },
];

const departments = [
  {
    title: 'Departamento Académico',
    description: 'Trabajamos para mejorar la calidad educativa y representar a los estudiantes en cuestiones académicas.',
    icon: '📚'
  },
  {
    title: 'Departamento de Bienestar',
    description: 'Nos ocupamos de la salud mental y física de los estudiantes, organizando actividades y brindando apoyo.',
    icon: '🌟'
  },
  {
    title: 'Departamento de Cultura',
    description: 'Promovemos actividades culturales y artísticas para enriquecer la vida universitaria.',
    icon: '🎭'
  },
  {
    title: 'Departamento de Deportes',
    description: 'Organizamos eventos deportivos y fomentamos la actividad física en la comunidad.',
    icon: '⚽'
  }
];

const values = [
  {
    title: 'Excelencia',
    description: 'Buscamos la máxima calidad en todo lo que hacemos.',
    icon: '🎯'
  },
  {
    title: 'Innovación',
    description: 'Promovemos nuevas ideas y soluciones creativas.',
    icon: '💡'
  },
  {
    title: 'Comunidad',
    description: 'Fomentamos un ambiente inclusivo y colaborativo.',
    icon: '🤝'
  }
];

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllFaq, setShowAllFaq] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => [...prev, entry.target.id]);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (sectionId: string) => visibleSections.includes(sectionId);

  const displayedStaff = showAllStaff ? staffMembers : staffMembers.slice(0, ITEMS_PER_PAGE);
  const displayedFaq = showAllFaq ? faqItems : faqItems.slice(0, ITEMS_PER_PAGE);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'inicio' && (
        <>
          {/* Hero Section */}
          <section id="hero" className={`text-center mb-24 transition-all duration-1000 transform ${isVisible('hero') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bienvenido al Portal CEITBA</h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Tu plataforma central para acceder a todos los recursos e información del CEITBA
            </p>
          </section>

          {/* Quick Access Section */}
          <section id="quick-access" className={`mb-24 transition-all duration-1000 transform ${isVisible('quick-access') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <SectionTitle>Acceso Rápido</SectionTitle>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <QuickAccessCard
                title="Wiki"
                description="Accede a nuestra base de conocimientos y documentación"
                href="/wiki"
                emoji="📚"
              />
              <QuickAccessCard
                title="Planificador"
                description="Organiza tu horario académico con nuestra herramienta intuitiva"
                href="/scheduler"
                emoji="📅"
              />
              <QuickAccessCard
                title="Servidor Minecraft"
                description="Únete a nuestra comunidad de gaming"
                href="/minecraft"
                emoji="🎮"
              />
            </div>
          </section>

          {/* Values Section */}
          <section id="values" className={`mb-24 max-w-5xl mx-auto`}>
            <SectionTitle>Nuestros Valores</SectionTitle>
            <div className="space-y-16">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-start gap-8 group transition-all duration-1000 transform ${isVisible('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-surface rounded-2xl md:mt-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-lg text-gray leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Departments Section */}
          <section id="departments" className="mb-24 max-w-5xl mx-auto">
            <SectionTitle>Departamentos</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {departments.map((dept, index) => (
                <div 
                  key={index}
                  className={`group bg-surface hover:bg-surface/80 p-8 rounded-2xl transition-all duration-300 transform ${isVisible('departments') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-background rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">
                        {dept.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {dept.title}
                      </h3>
                      <p className="text-gray leading-relaxed">{dept.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Preview Sections */}
          <section id="previews" className="mb-24 max-w-5xl mx-auto">
            <div className="grid gap-16 grid-cols-1 lg:grid-cols-2">
              <PreviewCard
                title="Comisión Directiva"
                onViewAll={() => setActiveTab('staff')}
                items={staffMembers.slice(0, 3)}
                type="staff"
              />
              <PreviewCard
                title="Preguntas Frecuentes"
                onViewAll={() => setActiveTab('faq')}
                items={faqItems.slice(0, 3)}
                type="faq"
              />
            </div>
          </section>
        </>
      )}

      {activeTab === 'staff' && (
        <section className="bg-surface p-8 rounded-lg max-w-5xl mx-auto">
          <SectionTitle>Comisión Directiva</SectionTitle>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedStaff.map((member, index) => (
              <PreviewCard
                key={index}
                title=""
                onViewAll={() => {}}
                items={[member]}
                type="staff"
              />
            ))}
          </div>
          {staffMembers.length > ITEMS_PER_PAGE && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllStaff(!showAllStaff)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                {showAllStaff ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === 'faq' && (
        <section className="bg-surface p-8 rounded-lg max-w-4xl mx-auto">
          <SectionTitle>Preguntas Frecuentes</SectionTitle>
          <div className="space-y-6">
            {displayedFaq.map((item, index) => (
              <PreviewCard
                key={index}
                title=""
                onViewAll={() => {}}
                items={[item]}
                type="faq"
              />
            ))}
          </div>
          {faqItems.length > ITEMS_PER_PAGE && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllFaq(!showAllFaq)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                {showAllFaq ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
