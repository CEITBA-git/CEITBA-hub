import { Sport, Agreement, Language, BenefitType } from '@/types/benefits';

interface BenefitCardProps {
  data: Sport | Agreement | Language;
  type: BenefitType;
}

export default function BenefitCard({ data, type }: BenefitCardProps) {
  const renderDetails = () => {
    switch (type) {
      case 'sport':
        const sport = data as Sport;
        return (
          <>
            {sport.schedule && <p className="text-gray">🕒 Horario: {sport.schedule}</p>}
            {sport.place && (
              <p className="text-gray">
                📍 Lugar: {sport.place_url ? (
                  <a href={sport.place_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    {sport.place}
                  </a>
                ) : sport.place}
              </p>
            )}
            {sport.teachers && <p className="text-gray">👥 Profesores: {sport.teachers}</p>}
            {sport.max_capacity && <p className="text-gray">👥 Capacidad máxima: {sport.max_capacity}</p>}
          </>
        );

      case 'agreement':
        const agreement = data as Agreement;
        return (
          <>
            {agreement.price && <p className="text-gray">💰 Precio: ${agreement.price}</p>}
            {agreement.schedule && <p className="text-gray">🕒 Horario: {agreement.schedule}</p>}
            {agreement.place && (
              <p className="text-gray">
                📍 Lugar: {agreement.place_url ? (
                  <a href={agreement.place_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    {agreement.place}
                  </a>
                ) : agreement.place}
              </p>
            )}
          </>
        );

      case 'language':
        const language = data as Language;
        return (
          <>
            {language.levels && <p className="text-gray">📊 Niveles: {language.levels}</p>}
            {language.prices && <p className="text-gray">💰 Precios: {language.prices}</p>}
          </>
        );
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{data.name}</h3>
        {data.inscription_url && (
          <a
            href={data.inscription_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Inscribirse →
          </a>
        )}
      </div>
      <div className="space-y-2">
        {renderDetails()}
        {data.notes && <p className="text-gray mt-4 text-sm italic">📝 {data.notes}</p>}
      </div>
    </div>
  );
} 