"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout";
import { Agreement, Benefit, BenefitTime, BenefitType, Language } from "@/types/benefits";
import CareerDropdown from "@/app/components/CareerDropdown";

export default function BenefitRegistration() {
  const router = useRouter();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("inscription");
  const [benefit, setBenefit] = useState<Benefit | Agreement | Language | null>(
    null
  );
  const [type, setType] = useState<BenefitType | null>(null);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    legajo: "",
    carrera: "",
    email: "",
    telefono: "",
    notas: "",
    nivel_idioma: "",
    horarios: [] as string[],
    termsAccepted: false,
  });

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.nombre.trim() !== "" &&
          formData.apellido.trim() !== "" &&
          formData.legajo.trim() !== "" &&
          formData.carrera !== ""
        );
      case 2:
        return (
          formData.email.trim() !== "" &&
          formData.email.endsWith("@itba.edu.ar") &&
          formData.telefono.trim() !== ""
        );
      case 3:
        const hasValidLanguageLevel =
          type !== "language" || formData.nivel_idioma !== "";
        const hasSelectedSchedules =
          (type !== "sport" && type !== "activity") ||
          !("times" in benefit! && benefit.times?.length) ||
          formData.horarios.length > 0;
        return (
          formData.termsAccepted &&
          hasValidLanguageLevel &&
          hasSelectedSchedules
        );
      default:
        return true;
    }
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("selectedBenefit");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setType(parsedData.type);

      switch (parsedData.type) {
        case "agreement":
          setBenefit(parsedData.data as Agreement);
          break;
        case "language":
          setBenefit(parsedData.data as Language);
          break;
        default:
          setBenefit(parsedData.data as Benefit);
      }

      setIsLoading(false);
    } else {
      router.push("/benefits");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (error) setError("");
  };

  const handleCareerSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, carrera: value }));
  };

  const handleTimeToggle = (timeString: string) => {
    setFormData((prev) => {
      const horarios = prev.horarios.includes(timeString)
        ? prev.horarios.filter((time) => time !== timeString)
        : [...prev.horarios, timeString];

      return { ...prev, horarios };
    });
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: // Personal data validation
        if (!formData.nombre.trim()) return "El nombre es requerido";
        if (!formData.apellido.trim()) return "El apellido es requerido";
        if (!formData.legajo.trim()) return "El legajo es requerido";
        if (!formData.carrera) return "La carrera es requerida";
        return "";

      case 2: // Contact validation
        if (!formData.email.trim()) return "El email es requerido";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email inválido";
        if (!formData.email.trim().endsWith("@itba.edu.ar"))
          return "Debes usar un email con dominio @itba.edu.ar";
        if (!formData.telefono.trim()) return "El teléfono es requerido";
        return "";

      case 3: // Schedule/preferences validation
        if (type === "language" && !formData.nivel_idioma) {
          return "Por favor selecciona un nivel de idioma";
        }
        if (
          (type === "sport" || type === "activity") && 
          ("times" in benefit!) && (benefit!.times?.length) &&
          formData.horarios.length === 0
        ) {
          return "Por favor selecciona al menos un horario";
        }
        
        if (!formData.termsAccepted) {
          return "Debes aceptar los términos y condiciones";
        }
        return "";

      default:
        return "";
    }
  };

  const nextStep = () => {
    const error = validateStep(step);
    if (error) {
      setError(error);
      return;
    }

    setStep((prev) => prev + 1);
    setError("");
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    const error = validateStep(3);
    if (error) {
      setError(error);
      return;
    }

    if (!formData.email.endsWith("@itba.edu.ar")) {
      setError("Debes usar un email con dominio @itba.edu.ar");
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        student_id: formData.legajo,
        email: formData.email,
        name: formData.nombre,
        last_name: formData.apellido,
        type: type,
        benefit_id: id,
        phone_number: formData.telefono,
        preferred_times: formData.horarios.join(", ") || null,
        level: formData.nivel_idioma || null,
        notes: formData.notas || null,
        career: formData.carrera,
      };

      const response = await fetch("/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      // Send confirmation email
      //   await supabase.functions.invoke('send-email', {
      //     body: {
      //       to: formData.email,
      //       subject: `Confirmación de inscripción - ${benefit?.name}`,
      //       text: `Hola ${formData.nombre},\n\nHas sido inscrito en ${benefit?.name}.\n\nDetalles:\n- Horario: ${formData.horarios.join(', ')}\n- Notas: ${formData.notas || 'No especificadas'}\n\n¡Nos vemos pronto!`,
      //     },
      //   });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || "Error submitting registration");
      }

      const result = await response.json();
      console.log("Raw response:", response.status, result);

      // setSuccess(true);
      setStep(4);
    } catch (error: unknown) {
      console.error("Error submitting registration:", error);
      setError(
        "Error al procesar la inscripción. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !benefit) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex justify-center items-center min-h-[70vh]">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} pagePadding="py-6">
      <div className="max-w-2xl mx-auto">
        <section className="text-center mb-8">
          {/* Icon or image for the benefit type */}
          <div className="flex items-center justify-center mx-auto w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4">
            <span className="text-2xl">
              {type === "sport"
                ? "⚽"
                : type === "activity"
                ? "🎨"
                : type === "language"
                ? "🌎"
                : "🤝"}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Inscripción a {benefit.name}
          </h1>
          <p className="text-gray mt-2">
            Completá el formulario para inscribirte a este beneficio del CEITBA
          </p>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Step progress indicator */}
        {step < 4 && (
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 3 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      step >= stepNumber
                        ? "bg-primary text-white"
                        : "bg-surface text-gray"
                    }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2
                      ${step > stepNumber ? "bg-primary" : "bg-surface"}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-black/[.08] dark:border-white/[.145] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Datos personales</h3>

                {/* Name & Last Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium mb-2"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="apellido"
                      className="block text-sm font-medium mb-2"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                {/* Legajo */}
                <div>
                  <label
                    htmlFor="legajo"
                    className="block text-sm font-medium mb-2"
                  >
                    Legajo
                  </label>
                  <input
                    type="text"
                    id="legajo"
                    name="legajo"
                    value={formData.legajo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu número de legajo"
                    required
                  />
                </div>

                {/* Career */}
                <div>
                  <label
                    htmlFor="carrera"
                    className="block text-sm font-medium mb-2"
                  >
                    Carrera
                  </label>
                  <CareerDropdown onSelect={handleCareerSelect} />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(1)}
                  className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">
                  Información de contacto
                </h3>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="usuario@itba.edu.ar"
                    required
                  />
                  <p className="mt-1 ml-2 text-xs text-gray">
                    Debe ser un email con dominio @itba.edu.ar
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu número de teléfono"
                    required
                  />
                </div>

                {/* Notes -- i do feel like it has to be at the last step but it looks good here */}
                <div>
                  <label
                    htmlFor="notas"
                    className="block text-sm font-medium mb-2"
                  >
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="¿Algo más que quieras agregar?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(2)}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Schedules and Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Horarios y preferencias
                </h3>

                {/* Benefit Details */}
<div className="p-4 bg-primary/5 rounded-lg">
  <h4 className="font-medium mb-3">Detalles del beneficio</h4>
  <div className="space-y-2 text-sm">
    {type === "sport" || type === "activity" ? (() => {
      const sportBenefit = benefit as Benefit;
      return (
        <>
          {sportBenefit?.teachers && sportBenefit.teachers.length > 0 && (
            <p className="flex items-start">
              <span className="text-primary mr-2">👥</span>
              <span>
                Profesores:{" "}
                {sportBenefit.teachers.join(", ")}
              </span>
            </p>
          )}
          {sportBenefit?.max_capacity && (
            <p className="flex items-start">
              <span className="text-primary mr-2">👥</span>
              <span>
                Capacidad máxima:{" "}
                {sportBenefit.max_capacity}
              </span>
            </p>
          )}
        </>
      );
    })() : type === "agreement" ? (() => {
      const agreementBenefit = benefit as Agreement;
      return (
        <>
          {agreementBenefit?.price && (
            <p className="flex items-start">
              <span className="text-primary mr-2">💰</span>
              <span>Precio: ${agreementBenefit.price}</span>
            </p>
          )}
        </>
      );
    })() : type === "language" && (() => {
      const languageBenefit = benefit as Language;
      return (
        <>
          {languageBenefit?.levels && languageBenefit.levels.length > 0 && (
            <p className="flex items-start">
              <span className="text-primary mr-2">📊</span>
              <span>
                Niveles:{" "}
                {languageBenefit.levels.join(", ")}
              </span>
            </p>
          )}
          {languageBenefit?.prices && languageBenefit.prices.length > 0 && (
            <p className="flex items-start">
              <span className="text-primary mr-2">💰</span>
              <span>
                Precios:{" "}
                {languageBenefit.prices.join(", ")}
              </span>
            </p>
          )}
        </>
      );
    })()}

    {benefit?.notes && (
      <p className="flex items-start mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
        <span className="text-yellow-600 dark:text-yellow-400 mr-2">
          📝
        </span>
        <span className="text-gray-800 dark:text-gray-200">
          {benefit.notes}
        </span>
      </p>
    )}
  </div>
</div>

                {/* Language Level Selection */}
{type === "language" && (() => {
  const languageBenefit = benefit as Language;
  return (
    <div>
      <label
        htmlFor="nivel_idioma"
        className="block text-sm font-medium mb-2"
      >
        Nivel de idioma
      </label>
      <select
        id="nivel_idioma"
        name="nivel_idioma"
        value={formData.nivel_idioma}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Selecciona tu nivel</option>
        <option value="n/a">No sé</option>
        {languageBenefit.levels?.map((level: string) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
})()}

{/* Schedule Selection */}
{(type === "sport" || type === "activity") && (() => {
  const sportBenefit = benefit as Benefit;
  return (
    sportBenefit.times && sportBenefit.times.length > 0 && (
      <div>
        <label className="block text-sm font-medium mb-3">
          Selecciona los horarios a los que puedes asistir:
        </label>
        <div className="space-y-2">
          {sportBenefit.times.map((time: BenefitTime, index: number) => (
            <label
              key={index}
              className={`flex items-start gap-3 p-3 border rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
                formData.horarios.includes(
                  `${time.day} ${time.hour_from} - ${time.hour_to} ${time.place}`
                )
                  ? "border-primary bg-primary/5"
                  : "border-black/[.08] dark:border-white/[.145]"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.horarios.includes(
                  `${time.day} ${time.hour_from} - ${time.hour_to} ${time.place}`
                )}
                onChange={() =>
                  handleTimeToggle(
                    `${time.day} ${time.hour_from} - ${time.hour_to} ${time.place}`
                  )
                }
                className="mt-1"
              />
              <div>
                <p className="font-medium">
                  {time.day} {time.hour_from} - {time.hour_to}
                </p>
                <p className="text-sm text-gray-600">
                  📍{" "}
                  {time.place_url ? (
                    <a
                      href={time.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {time.place}
                    </a>
                  ) : (
                    time.place
                  )}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    )
  );
})()}

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray">
                      Acepto los{" "}
                      <a href="_blank" className="text-primary underline">
                        términos y condiciones
                      </a>{" "}
                      para la inscripción en este beneficio
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepValid(3)}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Procesando..." : "Completar inscripción"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold">¡Inscripción exitosa!</h3>
                <p className="text-gray">
                  Tu inscripción a {benefit.name} ha sido registrada
                  exitosamente. Te hemos enviado un correo electrónico a{" "}
                  {formData.email} con los detalles.
                </p>

                {/* Benefit Summary */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                  <h4 className="font-medium text-green-800 mb-2">
                    Resumen de tu inscripción:
                  </h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>
                      <strong>Beneficio:</strong> {benefit.name}
                    </li>
                    {formData.horarios.length > 0 && (
                      <li>
                        <strong>Horarios seleccionados:</strong>{" "}
                        {formData.horarios.join(", ")}
                      </li>
                    )}
                    {type === "language" && formData.nivel_idioma && (
                      <li>
                        <strong>Nivel:</strong> {formData.nivel_idioma}
                      </li>
                    )}
                    {formData.notas && (
                      <li>
                        <strong>Notas:</strong> {formData.notas}
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/benefits")}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 mt-4"
                >
                  Volver a beneficios
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
