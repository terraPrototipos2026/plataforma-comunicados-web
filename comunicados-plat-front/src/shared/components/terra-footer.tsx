import { Link } from 'react-router';

export function TerraFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer-fondo text-footer-texto border-t border-footer-borde pb-[env(safe-area-inset-bottom)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-terra-chico bg-primario text-sobre-primario font-extrabold text-sm flex items-center justify-center shadow-terra-sm">
              T
            </span>
            <span className="text-base font-extrabold text-footer-texto tracking-tight">
              TERRA Colchones &amp; Muebles
            </span>
          </div>
          <p className="text-xs text-footer-texto-suave max-w-md leading-relaxed">
            Plataforma centralizada de comunicación interna, circulares corporativas y avisos
            operativos por departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-footer-texto-suave">
          <a
            href="#portada"
            className="min-h-[2.75rem] inline-flex items-center hover:text-footer-texto transition-colors"
          >
            Portada
          </a>
          <a
            href="#pilares"
            className="min-h-[2.75rem] inline-flex items-center hover:text-footer-texto transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#departamentos"
            className="min-h-[2.75rem] inline-flex items-center hover:text-footer-texto transition-colors"
          >
            Departamentos
          </a>
          <Link
            to="/login"
            className="min-h-[2.75rem] px-3.5 rounded-full bg-primario/20 border border-primario/40 inline-flex items-center text-footer-texto font-bold hover:bg-primario hover:text-sobre-primario transition-colors"
          >
            Acceso Colaboradores
          </Link>
        </div>
      </div>

      <div className="border-t border-footer-borde py-4 px-4 sm:px-8 text-center text-xs text-footer-texto-suave">
        © {currentYear} TERRA Colchones &amp; Muebles • Sistema de Comunicados v1.0
      </div>
    </footer>
  );
}
