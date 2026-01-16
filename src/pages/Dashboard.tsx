import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NovaMatriculaModal from "@/components/modals/NovaMatriculaModal";
import RegistarPagamentoModal from "@/components/modals/RegistarPagamentoModal";

const stats = [
  {
    title: "Total Estudantes",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    title: "Professores",
    value: "48",
    change: "+3",
    trend: "up",
    icon: GraduationCap,
    color: "secondary",
  },
  {
    title: "Turmas Activas",
    value: "32",
    change: "0",
    trend: "neutral",
    icon: BookOpen,
    color: "accent",
  },
  {
    title: "Propinas Recebidas",
    value: "12.5M Kz",
    change: "+8%",
    trend: "up",
    icon: CreditCard,
    color: "primary",
  },
];

const recentStudents = [
  { name: "João Manuel Silva", class: "10ª A", status: "pending", date: "Hoje" },
  { name: "Maria Ana Santos", class: "8ª B", status: "approved", date: "Ontem" },
  { name: "Pedro José Neto", class: "11ª C", status: "approved", date: "15 Jan" },
  { name: "Ana Luísa Ferreira", class: "9ª A", status: "pending", date: "14 Jan" },
];

const upcomingEvents = [
  { title: "Reunião de Pais - 10ª Classe", date: "20 Jan", time: "14:00" },
  { title: "Exame Nacional - Matemática", date: "25 Jan", time: "08:00" },
  { title: "Conselho Pedagógico", date: "28 Jan", time: "10:00" },
];

const pendingPayments = [
  { student: "Carlos Mendes", amount: "35.000 Kz", months: 2 },
  { student: "Luísa Oliveira", amount: "17.500 Kz", months: 1 },
  { student: "Manuel Costa", amount: "52.500 Kz", months: 3 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false);

  const handleQuickAction = (href: string, modalType?: string) => {
    if (modalType === "matricula") {
      setIsMatriculaModalOpen(true);
    } else if (modalType === "pagamento") {
      setIsPagamentoModalOpen(true);
    } else {
      navigate(href);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Painel de Controlo
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Aqui está o resumo da sua escola.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Janeiro 2026
            </Button>
            <Button onClick={() => setIsMatriculaModalOpen(true)}>
              Nova Matrícula
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    stat.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : stat.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  ) : null}
                  <span
                    className={`text-sm ${
                      stat.trend === "up"
                        ? "text-primary"
                        : stat.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change} este mês
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Students */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Matrículas Recentes</CardTitle>
                <CardDescription>
                  Últimas matrículas registadas no sistema
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {student.date}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === "approved"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {student.status === "approved" ? "Aprovado" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Calendário da semana</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg gradient-hero flex flex-col items-center justify-center text-primary-foreground">
                    <span className="text-xs">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Ver Calendário Completo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Propinas em Atraso
                </CardTitle>
                <CardDescription>
                  Estudantes com pagamentos pendentes
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div>
                      <p className="font-medium">{payment.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.months} {payment.months === 1 ? "mês" : "meses"} em atraso
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">{payment.amount}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Enviar lembrete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acções Rápidas</CardTitle>
              <CardDescription>
                Atalhos para as tarefas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nova Matrícula", icon: Users, href: "/dashboard/estudantes", modalType: "matricula" },
                  { label: "Lançar Notas", icon: GraduationCap, href: "/dashboard/avaliacoes", modalType: undefined },
                  { label: "Registar Pagamento", icon: CreditCard, href: "/dashboard/propinas", modalType: "pagamento" },
                  { label: "Enviar Comunicado", icon: Calendar, href: "/dashboard/comunicados", modalType: undefined },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:border-primary hover:text-primary transition-colors"
                    onClick={() => handleQuickAction(action.href, action.modalType)}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NovaMatriculaModal
        open={isMatriculaModalOpen}
        onOpenChange={setIsMatriculaModalOpen}
      />

      <RegistarPagamentoModal
        open={isPagamentoModalOpen}
        onOpenChange={setIsPagamentoModalOpen}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
