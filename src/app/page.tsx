import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Navbar />
      <Hero />
    </main>
  );
}
