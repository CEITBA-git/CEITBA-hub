'use client'

import QuickAccessCard from './components/QuickAccessCard';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PreviewCard from './components/PreviewCard';
import SectionTitle from './components/SectionTitle';
import staffData from '@/data/staff.json';
import faqData from '@/data/faq.json';

// Combinar directivos y departamentos para la lista completa
const staffMembers = [...staffData.directivos, ...staffData.departamentos];

// Obtener las preguntas frecuentes
const faqItems = faqData.items;

const departments = [
  {
    title: 'Deportes',
    description: 'Organizamos y gestionamos todas las actividades deportivas: fútbol, básquet, tenis, ping pong, ajedrez, esports, natación y más. ¡Fomentamos el deporte en la comunidad ITBA!',
    icon: '⚽'
  },
  {
    title: 'Náutica',
    description: 'Gestionamos el barco del ITBA y todas las actividades relacionadas con la náutica, brindando una experiencia única para los estudiantes.',
    icon: '⛵'
  },
  {
    title: 'Media',
    description: 'Nos encargamos de la imagen del Centro y la comunicación efectiva con los alumnos, manteniendo a la comunidad informada y conectada.',
    icon: '📱'
  },
  {
    title: 'IT',
    description: 'Desarrollamos y mantenemos las soluciones tecnológicas del Centro, trabajando en proyectos informáticos para mejorar la experiencia estudiantil.',
    icon: '💻'
  },
  {
    title: 'Infraestructura y Proyectos',
    description: 'Gestionamos proyectos de mejora y mantenemos la infraestructura existente, trabajando constantemente para optimizar los espacios y recursos.',
    icon: '🔧'
  },
  {
    title: 'Eventos y Cultura',
    description: 'Organizamos eventos propuestos por alumnos y fomentamos actividades culturales, incluyendo intercambios de idiomas y otras iniciativas estudiantiles.',
    icon: '🎭'
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
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Miembros</h2>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-4">
                  {staffMembers.slice(0, 3).map((member, index) => (
                    <div 
                      key={index}
                      className="bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-gray text-sm">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">FAQ</h2>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="space-y-4">
                  {faqItems.slice(0, 3).map((item, index) => (
                    <div 
                      key={index}
                      className="bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.01] transition-all duration-300"
                    >
                      <h3 className="font-semibold mb-2">{item.question}</h3>
                      <p className="text-gray text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'staff' && (
        <section className="space-y-12">
          {/* Directivos */}
          <div className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-8">
            <SectionTitle>Directivos</SectionTitle>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8">
              {staffMembers
                .filter(member => member.department === 'Directivo')
                .map((member, index) => (
                  <div 
                    key={index}
                    className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-primary font-medium mb-1">{member.role}</p>
                        <a href={`mailto:${member.email}`} className="text-gray text-sm hover:text-primary transition-colors">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Departamentos */}
          {['IT', 'Media', 'Infraestructura y Proyectos', 'Deportes', 'Náutica'].map(dept => {
            const departmentMembers = staffMembers.filter(member => member.department === dept);
            if (departmentMembers.length === 0) return null;

            return (
              <div key={dept} className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-8">
                <SectionTitle>{dept}</SectionTitle>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                  {departmentMembers.map((member, index) => (
                    <div 
                      key={index}
                      className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-primary text-sm font-medium mb-1">{member.role}</p>
                          <a href={`mailto:${member.email}`} className="text-gray text-sm hover:text-primary transition-colors">
                            {member.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {activeTab === 'faq' && (
        <section className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-8">
          <SectionTitle>Preguntas Frecuentes</SectionTitle>
          <div className="space-y-6 mt-8">
            {displayedFaq.map((item, index) => (
              <div 
                key={index}
                className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.01] transition-all duration-300"
              >
                <h3 className="font-semibold text-lg mb-3">{item.question}</h3>
                <p className="text-gray leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
          {faqItems.length > ITEMS_PER_PAGE && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllFaq(!showAllFaq)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm font-medium"
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
