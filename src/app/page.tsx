import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { LogosBar } from "@/components/sections/LogosBar";
import { Features } from "@/components/sections/Features";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <Hero />
      <LogosBar />
      <Features />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <Footer />
    </main>
  );
}
