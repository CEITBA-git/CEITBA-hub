import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Configuración para usar Node.js Runtime y asegurar respuestas dinámicas
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0; 