import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Implementação em menos de 30 dias",
  "Formação gratuita para toda a equipa",
  "Suporte técnico dedicado 24/7",
  "Migração de dados incluída",
];

const CTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="relative rounded-2xl gradient-hero overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary-foreground blur-3xl" />
          </div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
                Pronto para transformar a gestão da sua escola?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                Junte-se a mais de 50 escolas em Angola que já utilizam o SGE 
                para modernizar os seus processos educacionais.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {benefit}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" size="xl">
                  Solicitar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="heroOutline" size="xl">
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
