'use client'

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';
import Image from 'next/image';

export default function MinecraftPage() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('approved') === 'true' && session?.user?.email) {
      const submitRegistration = async () => {
        try {
          if (!session.user) return;
          
          const response = await fetch('https://ceitba.org.ar/api/v1/minecraft/whitelist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              minecraftUsername: minecraftUsername,
              email: session.user.email,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.error === 'Ya tienes una cuenta de Minecraft registrada') {
              setError('Ya tienes una cuenta de Minecraft registrada. No puedes registrar múltiples cuentas.');
              return;
            }
            if (data.error === 'Este nombre de usuario de Minecraft ya está registrado') {
              setError('Este nombre de usuario de Minecraft ya está registrado por otro usuario.');
              return;
            }
            throw new Error(data.error || 'Error al agregar a la whitelist');
          }

          setApproved(true);
          setStep(4);
        } catch (err) {
          console.error('Error al procesar la solicitud:', err);
          setError('Error al procesar tu solicitud. Por favor, intenta nuevamente.');
          setStep(3);
        }
      };

        submitRegistration();
    }
  }, [session, minecraftUsername]);

  const validateMinecraftUsername = (username: string) => {
    // Minecraft usernames can only contain letters, numbers, and underscores
    // Must be between 3 and 16 characters
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    return regex.test(username);
  };

  const serverRules = [
    "No griefing ni destrucción de construcciones ajenas",
    "Respetar a todos los jugadores",
    "No usar hacks ni mods que den ventaja injusta",
    "No robar items de otros jugadores",
    "Mantener un ambiente amigable y colaborativo"
  ];

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/minecraft?approved=true',
        redirect: true,
      });
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      console.error('Error en Google Sign In:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      setError('Debes iniciar sesión con tu cuenta @itba.edu.ar');
      return;
    }

    if (!session.user.email.endsWith('@itba.edu.ar')) {
      setStep(5); // Error page for non-ITBA email
      return;
    }

    try {
      const response = await fetch('https://ceitba.org.ar/api/v1/minecraft/whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minecraftUsername: minecraftUsername,
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Ya tienes una cuenta de Minecraft registrada') {
          setError('Ya tienes una cuenta de Minecraft registrada. No puedes registrar múltiples cuentas.');
          return;
        }
        if (data.error === 'Este nombre de usuario de Minecraft ya está registrado') {
          setError('Este nombre de usuario de Minecraft ya está registrado por otro usuario.');
          return;
        }
        throw new Error(data.error || 'Error al agregar a la whitelist');
      }

      setStep(4); // Success page
    } catch (err) {
      console.error('Error al procesar la solicitud:', err);
      setError('Error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText('ceitba.org.ar');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      setError('No se pudo copiar al portapapeles');
    }
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {approved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
            ¡Tu cuenta ha sido aprobada!
          </div>
        )}

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
                    onChange={(e) => {
                      setMinecraftUsername(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-2 bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu username de Minecraft"
                    required
                  />
                  {minecraftUsername && !validateMinecraftUsername(minecraftUsername) && (
                    <p className="mt-2 text-sm text-red-600">
                      El nombre de usuario debe tener entre 3 y 16 caracteres y solo puede contener letras, números y guiones bajos
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (validateMinecraftUsername(minecraftUsername)) {
                      setStep(2);
                    } else {
                      setError('Por favor ingresa un nombre de usuario válido');
                    }
                  }}
                  disabled={!minecraftUsername || !validateMinecraftUsername(minecraftUsername)}
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
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!rulesAccepted}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Verificación ITBA</h3>
                <p className="text-sm text-gray mb-6">
                  Para unirte al servidor, necesitamos verificar que eres estudiante del ITBA.
                  Por favor, inicia sesión con tu cuenta @itba.edu.ar
                </p>
                {status === 'authenticated' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                      ✓ Sesión iniciada como {session.user?.email}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                      >
                        Volver
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200"
                      >
                        Finalizar registro
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
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
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                    >
                      Volver
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold">¡Registro completado!</h3>
                <p className="text-gray">
                  Tu solicitud ha sido registrada exitosamente. Próximamente serás validado para entrar al servidor.
                </p>
                <div className="mt-6 p-4 bg-surface rounded-lg">
                  <p className="text-sm font-medium">IP del servidor:</p>
                  <div className="relative mt-2 flex items-center">
                    <code className="flex-1 p-2 bg-background rounded-l text-primary">
                      ceitba.org.ar
                    </code>
                    <button
                      onClick={handleCopyIP}
                      className="px-4 py-2 bg-background rounded-r border-l border-black/[.08] dark:border-white/[.145] hover:bg-background/80 transition-all duration-200"
                      title="Copiar IP"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold">Email no válido</h3>
                <p className="text-gray">
                  Lo sentimos, pero solo se permiten correos electrónicos del dominio @itba.edu.ar para registrarse en el servidor.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full px-6 py-3 bg-surface text-gray-600 rounded-xl hover:bg-surface/80 transition-all duration-200"
                >
                  Volver a intentar
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}