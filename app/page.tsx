import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { SocialProof } from "@/components/marketing/SocialProof";
import { Features } from "@/components/marketing/Features";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-alabaster selection:bg-gold-leaf-200 selection:text-charcoal">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
