import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { Comparison } from "@/components/Comparison";
import { Help } from "@/components/Help";
import { Sources } from "@/components/Sources";
import { Footer } from "@/components/Footer";
import { NotifyProvider } from "@/components/NotifyProvider";
import { GetPluginProvider } from "@/components/GetPluginProvider";

export default function Home() {
  return (
    <NotifyProvider>
      <GetPluginProvider>
        <Header />
        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <Benefits />
          <Comparison />
          <Help />
          <Sources />
        </main>
        <Footer />
      </GetPluginProvider>
    </NotifyProvider>
  );
}
