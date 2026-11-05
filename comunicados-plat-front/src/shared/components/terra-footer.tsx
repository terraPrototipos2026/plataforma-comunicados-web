import { Link } from 'react-router';

export function TerraFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-superficie-2 border-t border-borde pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-terra-chico bg-primario text-sobre-primario font-extrabold text-sm flex items-center justify-center">
              T
            </span>
            <span className="text-base font-extrabold text-texto-principal">
              TERRA Colchones &amp; Muebles
            </span>
          </div>
          <p className="text-xs text-texto-suave max-w-md">
            Plataforma centralizada de comunicación interna, circulares corporativas y avisos
            operativos por departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-texto-suave">
          <a href="#portada" className="min-h-[2.75rem] inline-flex items-center hover:text-primario">
            Portada
          </a>
          <a href="#pilares" className="min-h-[2.75rem] inline-flex items-center hover:text-primario">
            Funcionalidades
          </a>
          <a
            href="#departamentos"
            className="min-h-[2.75rem] inline-flex items-center hover:text-primario"
          >
            Departamentos
          </a>
          <Link
            to="/login"
            className="min-h-[2.75rem] inline-flex items-center text-primario font-bold hover:underline"
          >
            Acceso Colaboradores
          </Link>
        </div>
      </div>

      <div className="border-t border-borde-suave py-4 px-4 sm:px-8 text-center text-xs text-texto-suave">
        © {currentYear} TERRA Colchones &amp; Muebles • Sistema de Comunicados v1.0
      </div>
    </footer>
  );
}

