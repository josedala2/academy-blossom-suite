import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import UserProfiles from "@/components/UserProfiles";
import Stats from "@/components/Stats";
import News from "@/components/News";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <UserProfiles />
        <Stats />
        <News />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
