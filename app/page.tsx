// ============================================================
// PAGE PRINCIPALE — Assemblage de toutes les sections
// Chaque section est lazy-loadée pour la performance
// ============================================================

// Force dynamic rendering to avoid static generation issues with 3D components
export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/FooterServer";
import HeroSection from "@/components/sections/HeroSectionServer";
import AboutSection from "@/components/sections/AboutSectionServer";
import SkillsSection from "@/components/sections/SkillsSectionConsolidatedServer";
import ProjectsSection from "@/components/sections/ProjectsSectionServer";
import FormationSection from "@/components/sections/FormationSectionServer";
import ExperienceSection from "@/components/sections/ExperienceSectionServer";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      {/* Navbar sticky avec useScrollSpy */}
      <Navbar />

      <main id="main-content">
        {/* Ancres id pour le scroll spy de la navbar */}
        <section id="hero">
          <HeroSection />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="skills">
          <SkillsSection />
        </section>

        <section id="projects">
          <ProjectsSection />
        </section>

        <section id="formation">
          <FormationSection />
        </section>

        <section id="experience">
          <ExperienceSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <Footer />
    </>
  );
}
