import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MINECRAFT_REGISTRATION_COOKIE = 'minecraft_registration';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { minecraftUsername } = await request.json();

    if (!minecraftUsername) {
      return NextResponse.json(
        { error: 'Nombre de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya se registró
    const registrationCookie = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith(`${MINECRAFT_REGISTRATION_COOKIE}=`))
      ?.split('=')[1];

    if (registrationCookie) {
      const registrations = JSON.parse(decodeURIComponent(registrationCookie));
      if (registrations.includes(session.user.email)) {
        return NextResponse.json(
          { error: 'Ya tienes una cuenta de Minecraft registrada' },
          { status: 400 }
        );
      }
    }

    // Registrar el nuevo usuario
    const response = NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 200 }
    );

    // Actualizar la cookie con el nuevo registro
    const currentRegistrations = registrationCookie 
      ? JSON.parse(decodeURIComponent(registrationCookie))
      : [];
    
    currentRegistrations.push(session.user.email);
    
    // Configurar la cookie
    const cookieValue = encodeURIComponent(JSON.stringify(currentRegistrations));
    const cookieOptions = [
      `${MINECRAFT_REGISTRATION_COOKIE}=${cookieValue}`,
      'Path=/',
      'HttpOnly',
      process.env.NODE_ENV === 'production' ? 'Secure' : '',
      'SameSite=Lax',
      'Max-Age=31536000' // 1 año
    ].filter(Boolean).join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('Error al procesar la solicitud de whitelist:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 