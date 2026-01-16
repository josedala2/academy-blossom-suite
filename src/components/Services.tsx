import { 
  GraduationCap, 
  Users, 
  ClipboardList, 
  Calendar, 
  CreditCard, 
  BarChart3,
  MessageSquare,
  Shield
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: GraduationCap,
    title: "Gestão Académica",
    description: "Matrículas, turmas, disciplinas e histórico escolar centralizado num só lugar.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Portal do Encarregado",
    description: "Acesso unificado para acompanhar notas, frequência e comunicar com a escola.",
    color: "secondary",
  },
  {
    icon: ClipboardList,
    title: "Avaliações e Notas",
    description: "Gestão completa de exames, testes, pautas e cálculo automático de médias.",
    color: "accent",
  },
  {
    icon: Calendar,
    title: "Planeamento Escolar",
    description: "Horários, calendário de exames e quadro de avisos integrados.",
    color: "primary",
  },
  {
    icon: CreditCard,
    title: "Gestão Financeira",
    description: "Propinas, pagamentos online, despesas e relatórios financeiros detalhados.",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Estatísticas",
    description: "Insights estratégicos com relatórios académicos e financeiros exportáveis.",
    color: "accent",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Interna",
    description: "Avisos, mensagens privadas e notificações entre todos os intervenientes.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Segurança e Permissões",
    description: "Controlo de acesso por perfil com auditoria e rastreabilidade completa.",
    color: "secondary",
  },
];

const Services = () => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground";
      case "secondary":
        return "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground";
      case "accent":
        return "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground";
      default:
        return "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground";
    }
  };

  return (
    <section id="services" className="py-20 bg-muted/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Tudo o que precisa para gerir a sua escola
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma plataforma completa que integra todos os processos da sua instituição
            de ensino, desde a admissão até à formatura.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group card-hover border-border/50 bg-card cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${getColorClasses(service.color)}`}>
                  <service.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
