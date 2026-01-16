import { useState } from "react";
import {
  Users,
  UserPlus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Building,
  ClipboardList,
  MessageSquare,
  FileCheck,
  ArrowRight,
  BarChart3,
  FolderOpen,
  GraduationCap,
  FileBarChart,
  UserCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

// Stats data
const stats = [
  { label: "Pré-Registos Pendentes", value: 12, icon: UserPlus, color: "text-accent", bgColor: "bg-accent/10" },
  { label: "Processos em Andamento", value: 8, icon: ClipboardList, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Documentos Emitidos Hoje", value: 24, icon: FileCheck, color: "text-secondary", bgColor: "bg-secondary/10" },
  { label: "Atendimentos Realizados", value: 47, icon: Users, color: "text-green-600", bgColor: "bg-green-500/10" },
];

// Quick navigation modules
const modulosSecretaria = [
  {
    titulo: "Pré-Registos",
    descricao: "Gestão de inscrições e matrículas pendentes",
    icon: UserPlus,
    cor: "text-primary",
    bgCor: "bg-primary/10",
    borderCor: "border-primary/20",
    rota: "/dashboard/secretaria/pre-registos",
    badge: 12,
  },
  {
    titulo: "Visitantes",
    descricao: "Registo e acompanhamento de atendimentos",
    icon: Users,
    cor: "text-secondary",
    bgCor: "bg-secondary/10",
    borderCor: "border-secondary/20",
    rota: "/dashboard/secretaria/visitantes",
    badge: 3,
  },
  {
    titulo: "Estudantes",
    descricao: "Consulta e gestão de fichas de estudantes",
    icon: GraduationCap,
    cor: "text-blue-600",
    bgCor: "bg-blue-500/10",
    borderCor: "border-blue-500/20",
    rota: "/dashboard/secretaria/estudantes",
  },
  {
    titulo: "Encarregados",
    descricao: "Gestão de encarregados de educação",
    icon: UserCheck,
    cor: "text-green-600",
    bgCor: "bg-green-500/10",
    borderCor: "border-green-500/20",
    rota: "/dashboard/secretaria/encarregados",
  },
  {
    titulo: "Documentos",
    descricao: "Emissão de declarações e certificados",
    icon: FileText,
    cor: "text-accent",
    bgCor: "bg-accent/10",
    borderCor: "border-accent/20",
    rota: "/dashboard/secretaria/documentos",
    badge: 5,
  },
  {
    titulo: "Processos",
    descricao: "Transferências, anulações e reingressos",
    icon: ClipboardList,
    cor: "text-orange-600",
    bgCor: "bg-orange-500/10",
    borderCor: "border-orange-500/20",
    rota: "/dashboard/secretaria/processos",
    badge: 8,
  },
  {
    titulo: "Templates",
    descricao: "Modelos de documentos personalizáveis",
    icon: FolderOpen,
    cor: "text-purple-600",
    bgCor: "bg-purple-500/10",
    borderCor: "border-purple-500/20",
    rota: "/dashboard/secretaria/templates",
  },
  {
    titulo: "Relatórios",
    descricao: "Estatísticas e exportação de dados",
    icon: BarChart3,
    cor: "text-indigo-600",
    bgCor: "bg-indigo-500/10",
    borderCor: "border-indigo-500/20",
    rota: "/dashboard/secretaria/relatorios",
  },
];

// Recent pre-registrations
const recentPreRegistos = [
  { id: 1, nome: "Ana Beatriz Fernandes", idade: 14, classe: "9ª Classe", estado: "pending", data: "2026-01-16" },
  { id: 2, nome: "Carlos Manuel Silva", idade: 12, classe: "7ª Classe", estado: "analysis", data: "2026-01-15" },
  { id: 3, nome: "Diana Costa", idade: 16, classe: "11ª Classe", estado: "approved", data: "2026-01-14" },
  { id: 4, nome: "Eduardo Santos", idade: 15, classe: "10ª Classe", estado: "rejected", data: "2026-01-13" },
];

// Recent visitors
const recentVisitantes = [
  { id: 1, nome: "Maria José", contacto: "923 456 789", motivo: "Informações de Matrícula", data: "2026-01-16", convertido: false },
  { id: 2, nome: "António Mendes", contacto: "912 345 678", motivo: "Consulta de Notas", data: "2026-01-16", convertido: false },
  { id: 3, nome: "Rosa Ferreira", contacto: "934 567 890", motivo: "Matrícula do Filho", data: "2026-01-15", convertido: true },
];

// Pending processes
const processosPendentes = [
  { id: 1, tipo: "Transferência", estudante: "João Silva", estado: "Em análise", dias: 3 },
  { id: 2, tipo: "Anulação", estudante: "Maria Santos", estado: "Aguarda aprovação", dias: 5 },
  { id: 3, tipo: "Reingresso", estudante: "Pedro Neto", estado: "Documentos pendentes", dias: 2 },
];

// Pending approvals
const aprovacoesPendentes = [
  { id: 1, tipo: "Declaração de Matrícula", solicitante: "Encarregado de João Silva", data: "2026-01-16" },
  { id: 2, tipo: "Transferência de Escola", solicitante: "Maria Ferreira", data: "2026-01-15" },
  { id: 3, tipo: "Atestado Administrativo", solicitante: "Empresa XYZ", data: "2026-01-14" },
];

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "pending":
      return <Badge variant="outline" className="border-accent text-accent"><Clock className="h-3 w-3 mr-1" />Pré-registo</Badge>;
    case "analysis":
      return <Badge variant="outline" className="border-primary text-primary"><AlertCircle className="h-3 w-3 mr-1" />Em análise</Badge>;
    case "approved":
      return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Aprovado</Badge>;
    case "rejected":
      return <Badge variant="outline" className="border-destructive text-destructive"><AlertCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
    default:
      return null;
  }
};

const Secretaria = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              Secretaria
            </h1>
            <p className="text-muted-foreground">
              Gestão administrativa, atendimento e expediente escolar
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard/secretaria/relatorios")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
            <Button onClick={() => navigate("/dashboard/secretaria/pre-registos")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Pré-Registo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Cards - Modules */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Módulos da Secretaria</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {modulosSecretaria.map((modulo, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 ${modulo.borderCor}`}
                onClick={() => navigate(modulo.rota)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-12 w-12 rounded-lg ${modulo.bgCor} flex items-center justify-center`}>
                      <modulo.icon className={`h-6 w-6 ${modulo.cor}`} />
                    </div>
                    {modulo.badge && (
                      <Badge className="bg-primary text-primary-foreground">
                        {modulo.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{modulo.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Pre-Registrations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Pré-Registos Recentes
                    </CardTitle>
                    <CardDescription>Últimos pedidos de matrícula</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/secretaria/pre-registos")}>
                    Ver Todos
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPreRegistos.map((registro) => (
                    <div
                      key={registro.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{registro.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {registro.idade} anos • {registro.classe}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getEstadoBadge(registro.estado)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(registro.data).toLocaleDateString("pt-AO")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Visitors */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      Visitantes Recentes
                    </CardTitle>
                    <CardDescription>Atendimentos do dia</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/secretaria/visitantes")}>
                    Ver Todos
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentVisitantes.map((visitante) => (
                    <div
                      key={visitante.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{visitante.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {visitante.motivo} • {visitante.contacto}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {visitante.convertido ? (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            Convertido
                          </Badge>
                        ) : (
                          <Badge variant="outline">Visitante</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Processes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                  Processos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {processosPendentes.map((processo) => (
                  <div key={processo.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{processo.tipo}</span>
                      <Badge variant="outline" className="text-xs">
                        {processo.dias} dias
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{processo.estudante}</p>
                    <Badge variant="secondary" className="text-xs">
                      {processo.estado}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/dashboard/secretaria/processos")}>
                  Ver Todos os Processos
                </Button>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  Aguardando Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aprovacoesPendentes.map((aprovacao) => (
                  <div key={aprovacao.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <p className="font-medium text-sm">{aprovacao.tipo}</p>
                    <p className="text-xs text-muted-foreground">{aprovacao.solicitante}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(aprovacao.data).toLocaleDateString("pt-AO")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Resumo de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Atendimentos</span>
                    <span className="font-medium">47/60</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentos Emitidos</span>
                    <span className="font-medium">24/30</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processos Resolvidos</span>
                    <span className="font-medium">5/8</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Secretaria;
