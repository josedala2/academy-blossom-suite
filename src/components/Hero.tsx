import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Educação em Angola"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/40" />
        <div className="absolute inset-0 gradient-hero opacity-60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-slow" />
            <span className="text-sm font-medium text-primary-foreground">
              Plataforma Digital de Gestão Educacional
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Sistema Integrado de{" "}
            <span className="text-accent">Gestão Escolar</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Modernize a gestão da sua instituição de ensino com uma plataforma completa
            que integra administração académica, financeira e pedagógica numa única solução.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="accent" size="xl">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Saber Mais
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: GraduationCap, value: "50+", label: "Escolas" },
              { icon: Users, value: "25.000+", label: "Estudantes" },
              { icon: BookOpen, value: "1.200+", label: "Professores" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-foreground/10 mb-2">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
