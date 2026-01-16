import { TrendingUp, Clock, Award, Globe } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "98%",
    label: "Taxa de Satisfação",
    description: "Dos utilizadores recomendam",
  },
  {
    icon: Clock,
    value: "50%",
    label: "Menos Tempo",
    description: "Em processos administrativos",
  },
  {
    icon: Award,
    value: "100%",
    label: "Conformidade",
    description: "Com regulamentos do MED",
  },
  {
    icon: Globe,
    value: "24/7",
    label: "Disponibilidade",
    description: "Acesso em qualquer lugar",
  },
];

const Stats = () => {
  return (
    <section className="py-16 gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-4 group-hover:bg-primary-foreground/20 transition-colors">
                <stat.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
