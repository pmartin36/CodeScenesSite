import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { Comparison } from "@/components/Comparison";
import { OriginStory } from "@/components/OriginStory";
import { Help } from "@/components/Help";
import { Sources } from "@/components/Sources";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Comparison />
        <OriginStory />
        <Help />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
