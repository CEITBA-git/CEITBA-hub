'use client'
import { Agreement, Language, BenefitType, Benefit } from "@/types/benefits";
import { useRouter } from "next/navigation";

interface BenefitCardProps {
  data: Benefit | Agreement | Language;
  type: BenefitType;
}

export default function BenefitCard({ data, type }: BenefitCardProps) {
  const router = useRouter();

  const handleRegisterClick = () => {
    sessionStorage.setItem("selectedBenefit", JSON.stringify({type, data}));
    router.push(`/benefits/${data.id}/inscription`);
  };

  const renderDetails = () => {
    switch (type) {
      case "sport":
      case "activity":
        const sport = data as Benefit;
        return (
          <>
            {sport.times && sport.times.length > 0 && (
              <p className="text-gray">
                🕒 Horario:{" "}
                {sport.times.map((time, index, arr) => (
                  <span key={index}>
                    {time.day} {time.hour_from}-{time.hour_to}
                    {index < arr.length - 1 ? ", " : ""}{" "}
                  </span>
                ))}
              </p>
            )}
            {sport.times &&
              sport.times.length > 0 &&
              (() => {
                const uniquePlaces = Array.from(
                  new Set(
                    sport.times
                      .map((time) =>
                        JSON.stringify({
                          place: time.place,
                          place_url: time.place_url,
                        })
                      )
                      .filter(Boolean)
                  )
                ).map((item) => JSON.parse(item));

                return uniquePlaces.length > 0 ? (
                  <p className="text-gray">
                    📍 Lugar:{" "}
                    {uniquePlaces
                      .slice(0, 4)
                      .map(({ place, place_url }, index, arr) => (
                        <span key={index}>
                          {place_url ? (
                            <a
                              href={place_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              {place}
                            </a>
                          ) : (
                            place
                          )}
                          {index < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </p>
                ) : null;
              })()}

            {sport.teachers && sport.teachers.length > 0 && (
              <p className="text-gray">
                👥 Profesores:{" "}
                {sport.teachers.map((teacher, index, arr) => (
                  <span key={index}>
                    {teacher}
                    {index < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            {sport.max_capacity && (
              <p className="text-gray">
                👥 Capacidad máxima: {sport.max_capacity}
              </p>
            )}
          </>
        );

      case "agreement":
        const agreement = data as Agreement;
        return (
          <>
            {agreement.price && (
              <p className="text-gray">💰 Precio: ${agreement.price}</p>
            )}
            {agreement.schedule && (
              <p className="text-gray">🕒 Horario: {agreement.schedule}</p>
            )}
            {agreement.place && (
              <p className="text-gray">
                📍 Lugar:{" "}
                {agreement.place_url ? (
                  <a
                    href={agreement.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    {agreement.place}
                  </a>
                ) : (
                  agreement.place
                )}
              </p>
            )}
          </>
        );

      case "language":
        const language = data as Language;
        return (
          <>
            {language.levels && (
              <p className="text-gray">
                📊 Niveles:{" "}
                {language.levels.map((level, index, arr) => (
                  <span key={index}>
                    {level}
                    {index < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            {language.prices && (
              <p className="text-gray">
                💰 Precios:{" "}
                {language.prices.map((price, index, arr) => (
                  <span key={index}>
                    {price}
                    {index < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{data.name}</h3>
        {
          // <a
          //   href={data.inscription_url}
          //   target="_blank"
          //   rel="noopener noreferrer"
          //   className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer"
          // >
          //   Inscribirse →
          // </a>

          
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-80"
            onClick={handleRegisterClick}>
              Inscribirse
            </button>
        }
      </div>
      <div className="space-y-2">
        {renderDetails()}
        {data.notes && (
          <p className="text-gray mt-4 text-sm italic">📝 {data.notes}</p>
        )}
      </div>
      <div className="flex justify-between items-end mb-4">
</div>
    </div>
  );
}
