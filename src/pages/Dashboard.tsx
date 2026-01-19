import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
  BookOpen,
  Users,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NovaMatriculaModal from "@/components/modals/NovaMatriculaModal";
import RegistarPagamentoModal from "@/components/modals/RegistarPagamentoModal";
import EnviarComunicadoModal from "@/components/modals/EnviarComunicadoModal";
import { useAuth, roleNames } from "@/contexts/AuthContext";
import {
  dashboardConfigs,
  myClasses,
  myGrades,
  myScheduleToday,
  attendanceStats,
} from "@/config/dashboardConfig";

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
  const { user } = useAuth();
  const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false);
  const [isComunicadoModalOpen, setIsComunicadoModalOpen] = useState(false);

  const config = user ? dashboardConfigs[user.role] : dashboardConfigs.admin;

  const handleQuickAction = (href: string, modalType?: string) => {
    if (modalType === "matricula") {
      setIsMatriculaModalOpen(true);
    } else if (modalType === "pagamento") {
      setIsPagamentoModalOpen(true);
    } else if (modalType === "comunicado") {
      setIsComunicadoModalOpen(true);
    } else {
      navigate(href);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              {config.welcomeMessage}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Olá, {user?.name}! {config.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="text-xs">
              {user ? roleNames[user.role] : "Convidado"}
            </Badge>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Janeiro 2026</span>
              <span className="xs:hidden">Jan 2026</span>
            </Button>
          </div>
        </div>

        {/* Student Portal Banner */}
        {user?.role === "estudante" && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Portal do Estudante</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Aceda ao seu horário, pagamentos, exames e notas num só lugar
                    </p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/dashboard/portal-estudante")}
                  className="w-full sm:w-auto"
                >
                  Aceder ao Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {config.stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center ${
                    stat.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : stat.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    ) : stat.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                    ) : null}
                    <span
                      className={`text-[10px] sm:text-sm ${
                        stat.trend === "up"
                          ? "text-primary"
                          : stat.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Students - Admin/Secretary only */}
          {config.showRecentStudents && (
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Matrículas Recentes</CardTitle>
                  <CardDescription>
                    Últimas matrículas registadas no sistema
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/estudantes")}>
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
          )}

          {/* My Classes - Teacher only */}
          {config.showMyClasses && (
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Minhas Turmas</CardTitle>
                  <CardDescription>
                    Turmas atribuídas a si este ano lectivo
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/turmas")}>
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myClasses.map((turma, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{turma.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {turma.students} alunos
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3" />
                            {turma.room}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {turma.nextClass}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Grades - Student only */}
          {config.showMyGrades && (
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Minhas Notas</CardTitle>
                  <CardDescription>
                    Desempenho nas disciplinas do trimestre actual
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/avaliacoes")}>
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myGrades.map((grade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold ${
                            grade.grade >= 14
                              ? "bg-primary"
                              : grade.grade >= 10
                              ? "bg-accent"
                              : "bg-destructive"
                          }`}
                        >
                          {grade.grade}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{grade.subject}</p>
                          <p className="text-sm text-muted-foreground">{grade.teacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Último teste</p>
                        <p className="text-sm font-medium">{grade.lastTest}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          {config.showUpcomingEvents && (
            <Card className={!config.showRecentStudents && !config.showMyClasses && !config.showMyGrades ? "lg:col-span-2" : ""}>
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
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/horarios")}>
                  Ver Calendário Completo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* My Schedule Today - Student only */}
          {config.showMySchedule && (
            <Card>
              <CardHeader>
                <CardTitle>Horário de Hoje</CardTitle>
                <CardDescription>As suas aulas para hoje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myScheduleToday.map((aula, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">{aula.time.split(" - ")[0]}</p>
                      <p className="text-xs text-muted-foreground">{aula.time.split(" - ")[1]}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{aula.subject}</p>
                      <p className="text-xs text-muted-foreground">{aula.room} • {aula.teacher}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/horarios")}>
                  Ver Horário Completo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Payments - Admin only */}
          {config.showPendingPayments && (
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/propinas")}>
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
          )}

          {/* Attendance Stats - Teacher only */}
          {config.showAttendance && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Assiduidade Hoje</CardTitle>
                  <CardDescription>
                    Presenças nas suas turmas
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/turmas")}>
                  Registar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stat.turma}</span>
                        <span className="text-muted-foreground">
                          {stat.presente}/{stat.total} presentes
                        </span>
                      </div>
                      <Progress value={(stat.presente / stat.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className={!config.showPendingPayments && !config.showAttendance ? "lg:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>Acções Rápidas</CardTitle>
              <CardDescription>
                Atalhos para as tarefas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {config.quickActions.map((action, index) => (
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

      <EnviarComunicadoModal
        open={isComunicadoModalOpen}
        onOpenChange={setIsComunicadoModalOpen}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
