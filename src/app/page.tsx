import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import StructuredData from "@/components/StructuredData";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <StructuredData />
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
    </main>
  );
}
