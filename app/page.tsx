import Hero from "@/components/hero";
import Features from "@/components/features";
import Community from "@/components/community";
import CallToAction from "@/components/call-to-action";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Features />
        <Community />
        <CallToAction />
      </main>
    </>
  );
}
