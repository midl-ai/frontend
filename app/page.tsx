'use client';

import {
  Header,
  HeroSection,
  FeaturesSection,
  StatsSection,
  ArchitectureSection,
  CTASection,
  Footer,
} from '@/components/landing';

/** MIDL AI Terminal Landing Page */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-accent-foreground">
      <Header />

      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ArchitectureSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
