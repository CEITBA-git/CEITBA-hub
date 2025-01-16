import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre CEITBA</h3>
            <p className="text-gray text-sm leading-relaxed">
              El Centro de Estudiantes del Instituto Tecnológico de Buenos Aires trabaja para mejorar la experiencia universitaria de todos los estudiantes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/wiki" className="text-gray hover:text-primary text-sm transition-colors">
                  Wiki
                </Link>
              </li>
              <li>
                <Link href="/scheduler" className="text-gray hover:text-primary text-sm transition-colors">
                  Planificador
                </Link>
              </li>
              <li>
                <Link href="/minecraft" className="text-gray hover:text-primary text-sm transition-colors">
                  Servidor Minecraft
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-gray text-sm">
                📍 Av. Eduardo Madero 399
              </li>
              <li className="text-gray text-sm">
                📧 info@ceitba.org.ar
              </li>
              <li className="text-gray text-sm">
                🌐 www.ceitba.org.ar
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray">
              © {new Date().getFullYear()} CEITBA. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-gray hover:text-primary transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 