import { 
  Crown, 
  Building2, 
  BookMarked, 
  Settings, 
  UserCheck, 
  Calculator,
  Headphones,
  Users,
  GraduationCap
} from "lucide-react";

const profiles = [
  {
    icon: Crown,
    title: "Super Admin",
    description: "Controlo total do sistema a nível técnico e funcional",
    features: ["Gestão de todos os módulos", "Configuração de escolas", "Auditoria completa"],
  },
  {
    icon: Building2,
    title: "Diretor Geral",
    description: "Gestão estratégica e administrativa da escola",
    features: ["Visão global", "Aprovação de despesas", "Relatórios consolidados"],
  },
  {
    icon: BookMarked,
    title: "Diretor Pedagógico",
    description: "Gestão e supervisão académica",
    features: ["Plano pedagógico", "Aprovação de pautas", "Supervisão de professores"],
  },
  {
    icon: Settings,
    title: "Administrador",
    description: "Gestão operacional do dia-a-dia",
    features: ["Matrículas", "Turmas e horários", "Documentação"],
  },
  {
    icon: UserCheck,
    title: "Professor",
    description: "Gestão académica dos alunos",
    features: ["Lançar notas", "Registar presenças", "Comunicar com encarregados"],
  },
  {
    icon: Calculator,
    title: "Contabilista",
    description: "Controlo financeiro completo",
    features: ["Propinas e pagamentos", "Despesas e salários", "Relatórios financeiros"],
  },
  {
    icon: Headphones,
    title: "Recepcionista",
    description: "Gestão de front office",
    features: ["Pré-registo", "Atendimento", "Documentação básica"],
  },
  {
    icon: Users,
    title: "Encarregado",
    description: "Acompanhamento dos educandos",
    features: ["Ver notas e frequência", "Comunicação directa", "Pagamento online"],
  },
  {
    icon: GraduationCap,
    title: "Estudante",
    description: "Acesso ao perfil académico",
    features: ["Notas e horário", "Calendário escolar", "Histórico pessoal"],
  },
];

const UserProfiles = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Perfis de Utilizadores
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Acesso personalizado para cada utilizador
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada perfil tem permissões específicas, garantindo segurança e eficiência
            no acesso às funcionalidades do sistema.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl bg-card border border-border/50 card-hover overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-hero opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-hero flex items-center justify-center shadow-md">
                  <profile.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {profile.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {profile.description}
                  </p>
                  <ul className="space-y-1">
                    {profile.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserProfiles;
