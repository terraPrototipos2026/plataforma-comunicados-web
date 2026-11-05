import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import portada2k2Img from '../../../../assets/portada2k2.jpg';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { SettingsModalTrigger } from '../../../../shared/components/settings-modal';
import { TopInstitutionalBanner } from '../../../../shared/components/terra-topbar';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { LoginForm } from '../components/login-form';

export default function LoginPage() {
  const { theme, highContrast } = useThemeStore();

  return (
    <div className="min-h-svh flex flex-col bg-fondo text-texto-principal selection:bg-primario selection:text-sobre-primario">
      <TopInstitutionalBanner />

      {/* Cabecera de Navegación para Vista Pública de Login */}
      <header className="sticky top-0 z-50 min-h-[4.25rem] bg-superficie-1/95 backdrop-blur-md border-b border-borde-suave pt-[env(safe-area-inset-top)] px-4 sm:px-8 flex items-center justify-between transition-colors">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 min-h-[2.75rem] focus:outline-none rounded-terra-chico"
          >
            <div className="w-10 h-10 rounded-terra-boton bg-primario text-sobre-primario flex items-center justify-center font-extrabold text-lg shadow-terra-sm shrink-0">
              T
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-texto-principal leading-none">
                  TERRA
                </span>
                <span className="text-[0.65rem] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primario-claro text-primario">
                  Acceso
                </span>
              </div>
              <span className="text-xs text-texto-suave font-medium leading-tight">
                Colchones &amp; Muebles
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <SettingsModalTrigger />

            <Link
              to="/"
              className="min-h-[2.75rem] h-11 px-4 rounded-full bg-superficie-2 hover:bg-superficie-crema border-[1.5px] border-borde hover:border-primario text-texto-principal font-bold transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal Centrado con Fondo portada2k2.jpg y difuminado sutil */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center py-6 sm:py-10 px-4 sm:px-8">
        {!highContrast && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[3px]"
            style={{
              backgroundImage: `url(${portada2k2Img})`,
            }}
          />
        )}

        {!highContrast && theme === 'dark' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-fondo/75 transition-colors"
          />
        )}

        <SlideFadeTransition
          direction="horizontal"
          exitMode="through"
          offset={40}
          preset="spring"
          transitionKey="login-card"
          className="relative z-10 w-full max-w-[22.5rem] mx-auto"
        >
          <section
            aria-labelledby="login-card-title"
            className="rounded-terra-modal bg-superficie-1/92 backdrop-blur-md border-[1.5px] border-borde p-5 sm:p-6 shadow-terra flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1 text-center border-b border-borde-suave pb-3.5">
              <span className="text-[0.68rem] uppercase font-extrabold tracking-[0.18em] text-primario">
                Autenticación Institucional
              </span>
              <h1
                id="login-card-title"
                className="text-lg sm:text-xl font-extrabold text-texto-principal tracking-tight"
              >
                Iniciar Sesión
              </h1>
              <p className="text-xs text-texto-suave">
                Introduce tu correo corporativo y contraseña.
              </p>
            </div>

            <LoginForm />
          </section>
        </SlideFadeTransition>
      </main>
    </div>
  );
}
