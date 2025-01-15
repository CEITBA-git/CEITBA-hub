import QuickAccessCard from './components/QuickAccessCard';
import ScrollSection from './components/ScrollSection';
import ThemeSwitcher from './components/ThemeSwitcher';
import { UserCircleIcon } from '@heroicons/react/24/solid';

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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Switcher */}
      <header className="fixed top-0 right-0 p-8 z-50">
        <ThemeSwitcher />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="title mb-4">Bienvenido al Portal CEITBA</h1>
          <p className="defaultText">
            Tu plataforma central para acceder a todos los recursos e información del CEITBA
          </p>
        </section>

        {/* Quick Access Section */}
        <section className="mb-16">
          <h2 className="uppercaseTitle mb-8 text-center">Acceso Rápido</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Information Grid */}
        <div className="grid gap-16 grid-cols-1 lg:grid-cols-2">
          {/* Staff Section */}
          <section className="bg-surface p-6 rounded-lg">
            <h2 className="uppercaseTitle mb-6">Comisión Directiva</h2>
            <div className="space-y-4">
              {staffMembers.map((member, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background"
                >
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-12 h-12 text-gray" />
                  )}
                  <div>
                    <h3 className="defaultText font-medium">{member.name}</h3>
                    <p className="text-sm text-gray">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-surface p-6 rounded-lg">
            <h2 className="uppercaseTitle mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-background"
                >
                  <h3 className="defaultText font-medium mb-2">{item.question}</h3>
                  <p className="text-sm text-gray">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
