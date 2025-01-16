'use client'

import { useState } from 'react';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';
import Image from 'next/image';

export default function MinecraftPage() {
  const [step, setStep] = useState(1);
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const serverRules = [
    "No griefing ni destrucción de construcciones ajenas",
    "Respetar a todos los jugadores",
    "No usar hacks ni mods que den ventaja injusta",
    "No robar items de otros jugadores",
    "Mantener un ambiente amigable y colaborativo"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de verificación y whitelist
    console.log('Form submitted');
  };

  return (
    <Layout activeTab="minecraft">
      <div className="max-w-2xl mx-auto">
        <section className="text-center mb-12">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Image
              src="/minecraft-logo.png"
              alt="Minecraft Logo"
              fill
              className="object-contain"
            />
          </div>
          <SectionTitle>Servidor Minecraft CEITBA</SectionTitle>
          <p className="text-gray mt-4">
            Únete a nuestra comunidad de Minecraft y construye junto a otros estudiantes del ITBA
          </p>
        </section>

        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-black/[.08] dark:border-white/[.145] p-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= stepNumber ? 'bg-primary text-white' : 'bg-surface text-gray'}`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2
                      ${step > stepNumber ? 'bg-primary' : 'bg-surface'}`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Usuario de Minecraft</h3>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu username de Minecraft"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!minecraftUsername}
                  className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Reglas del Servidor</h3>
                <div className="bg-background rounded-lg p-4 space-y-2">
                  {serverRules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <p className="text-sm text-gray">{rule}</p>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rulesAccepted}
                    onChange={(e) => setRulesAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray">
                    He leído y acepto las reglas del servidor
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!rulesAccepted}
                  className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Verificación ITBA</h3>
                <p className="text-sm text-gray mb-6">
                  Para unirte al servidor, necesitamos verificar que eres estudiante del ITBA.
                  Por favor, inicia sesión con tu cuenta @itba.edu.ar
                </p>
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-white text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Iniciar sesión con Google
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
} 