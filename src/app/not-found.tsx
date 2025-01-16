'use client'

import { useRouter } from 'next/navigation';
import Layout from './components/Layout';

export default function NotFound() {
  const router = useRouter();

  return (
    <Layout activeTab="">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-8xl mb-8 animate-bounce">
          🚧
        </div>
        <h1 className="text-4xl font-bold mb-4">
          ¡Ups! Página no encontrada
        </h1>
        <p className="text-xl text-gray mb-8 max-w-md">
          Parece que la página que estás buscando no existe o fue movida a otro lugar.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          Volver al inicio
        </button>
      </div>
    </Layout>
  )
} 