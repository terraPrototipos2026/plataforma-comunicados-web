import { TerraTopbar, TopInstitutionalBanner } from '../../../../shared/components/terra-topbar';
import { TerraFooter } from '../../../../shared/components/terra-footer';
import { AccessibilityFab } from '../../../../shared/components/accessibility-fab';
import { HeroPortadaSection } from '../components/hero-portada.section';
import { FeaturesBentoSection } from '../components/features-bento.section';
import { DepartmentsSection } from '../components/departments.section';

export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col bg-fondo text-texto-principal selection:bg-primario selection:text-sobre-primario">
      <TopInstitutionalBanner />
      <TerraTopbar />

      <main className="flex-1">
        <HeroPortadaSection />
        <FeaturesBentoSection />
        <DepartmentsSection />
      </main>

      <TerraFooter />
      <AccessibilityFab />
    </div>
  );
}

