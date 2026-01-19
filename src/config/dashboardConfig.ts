import { UserRole } from "@/contexts/AuthContext";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Calendar,
  ClipboardCheck,
  FileText,
  Clock,
  Send,
  TrendingUp,
  AlertCircle,
  Bell,
  Award,
  BookMarked,
  LucideIcon,
} from "lucide-react";

export interface StatConfig {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent";
}

export interface QuickActionConfig {
  label: string;
  icon: LucideIcon;
  href: string;
  modalType?: string;
}

export interface DashboardConfig {
  welcomeMessage: string;
  subtitle: string;
  stats: StatConfig[];
  quickActions: QuickActionConfig[];
  showRecentStudents: boolean;
  showUpcomingEvents: boolean;
  showPendingPayments: boolean;
  showMyClasses?: boolean;
  showMyGrades?: boolean;
  showMySchedule?: boolean;
  showAttendance?: boolean;
  showStudentPortalLink?: boolean;
}

// Admin Dashboard Configuration
const adminConfig: DashboardConfig = {
  welcomeMessage: "Painel de Administração",
  subtitle: "Visão geral completa da sua instituição de ensino",
  stats: [
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
  ],
  quickActions: [
    { label: "Nova Matrícula", icon: Users, href: "/dashboard/estudantes", modalType: "matricula" },
    { label: "Lançar Notas", icon: GraduationCap, href: "/dashboard/avaliacoes" },
    { label: "Registar Pagamento", icon: CreditCard, href: "/dashboard/propinas", modalType: "pagamento" },
    { label: "Enviar Comunicado", icon: Send, href: "/dashboard/comunicados", modalType: "comunicado" },
  ],
  showRecentStudents: true,
  showUpcomingEvents: true,
  showPendingPayments: true,
};

// Director Pedagógico Dashboard Configuration
const directorPedagogicoConfig: DashboardConfig = {
  welcomeMessage: "Painel do Director Pedagógico",
  subtitle: "Supervisão e gestão de toda a actividade pedagógica",
  stats: [
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
      title: "Avaliações Pendentes",
      value: "18",
      change: "-5",
      trend: "down",
      icon: ClipboardCheck,
      color: "primary",
    },
  ],
  quickActions: [
    { label: "Ver Estudantes", icon: Users, href: "/dashboard/estudantes" },
    { label: "Gerir Professores", icon: GraduationCap, href: "/dashboard/professores" },
    { label: "Ver Avaliações", icon: ClipboardCheck, href: "/dashboard/avaliacoes" },
    { label: "Relatórios", icon: TrendingUp, href: "/dashboard/relatorios" },
  ],
  showRecentStudents: true,
  showUpcomingEvents: true,
  showPendingPayments: false,
  showAttendance: true,
};

// Secretary Dashboard Configuration
const secretarioConfig: DashboardConfig = {
  welcomeMessage: "Painel da Secretaria",
  subtitle: "Gestão de matrículas, documentos e atendimento",
  stats: [
    {
      title: "Matrículas Hoje",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "primary",
    },
    {
      title: "Documentos Pendentes",
      value: "15",
      change: "-5",
      trend: "down",
      icon: FileText,
      color: "secondary",
    },
    {
      title: "Pré-Registos",
      value: "23",
      change: "+7",
      trend: "up",
      icon: ClipboardCheck,
      color: "accent",
    },
    {
      title: "Atendimentos Hoje",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Bell,
      color: "primary",
    },
  ],
  quickActions: [
    { label: "Novo Pré-Registo", icon: ClipboardCheck, href: "/dashboard/secretaria/pre-registos" },
    { label: "Emitir Documento", icon: FileText, href: "/dashboard/secretaria/documentos" },
    { label: "Nova Matrícula", icon: Users, href: "/dashboard/estudantes", modalType: "matricula" },
    { label: "Ver Processos", icon: BookOpen, href: "/dashboard/secretaria/processos" },
  ],
  showRecentStudents: true,
  showUpcomingEvents: true,
  showPendingPayments: false,
};

// Teacher Dashboard Configuration
const professorConfig: DashboardConfig = {
  welcomeMessage: "Painel do Professor",
  subtitle: "Gestão das suas turmas, avaliações e horários",
  stats: [
    {
      title: "Minhas Turmas",
      value: "5",
      change: "",
      trend: "neutral",
      icon: BookOpen,
      color: "primary",
    },
    {
      title: "Total Alunos",
      value: "156",
      change: "+4",
      trend: "up",
      icon: Users,
      color: "secondary",
    },
    {
      title: "Aulas Hoje",
      value: "4",
      change: "",
      trend: "neutral",
      icon: Clock,
      color: "accent",
    },
    {
      title: "Avaliações Pendentes",
      value: "12",
      change: "-3",
      trend: "down",
      icon: ClipboardCheck,
      color: "primary",
    },
  ],
  quickActions: [
    { label: "Lançar Notas", icon: ClipboardCheck, href: "/dashboard/avaliacoes" },
    { label: "Ver Horário", icon: Calendar, href: "/dashboard/horarios" },
    { label: "Registar Presença", icon: Users, href: "/dashboard/turmas" },
    { label: "Enviar Comunicado", icon: Send, href: "/dashboard/comunicados", modalType: "comunicado" },
  ],
  showRecentStudents: false,
  showUpcomingEvents: true,
  showPendingPayments: false,
  showMyClasses: true,
  showAttendance: true,
};

// Student Dashboard Configuration - Redirects to Portal
const estudanteConfig: DashboardConfig = {
  welcomeMessage: "Portal do Estudante",
  subtitle: "Aceda ao seu portal para ver horário, pagamentos, exames e notas",
  stats: [
    {
      title: "Média Geral",
      value: "14.5",
      change: "+0.5",
      trend: "up",
      icon: Award,
      color: "primary",
    },
    {
      title: "Propinas em Dia",
      value: "4/5",
      change: "",
      trend: "neutral",
      icon: CreditCard,
      color: "secondary",
    },
    {
      title: "Exames Próximos",
      value: "4",
      change: "",
      trend: "neutral",
      icon: ClipboardCheck,
      color: "accent",
    },
    {
      title: "Presenças",
      value: "95%",
      change: "+2%",
      trend: "up",
      icon: Calendar,
      color: "primary",
    },
  ],
  quickActions: [
    { label: "Meu Portal", icon: GraduationCap, href: "/dashboard/portal-estudante" },
    { label: "Ver Horário", icon: Calendar, href: "/dashboard/portal-estudante" },
    { label: "Pagamentos", icon: CreditCard, href: "/dashboard/portal-estudante" },
    { label: "Minhas Notas", icon: Award, href: "/dashboard/portal-estudante" },
  ],
  showRecentStudents: false,
  showUpcomingEvents: true,
  showPendingPayments: false,
  showMyGrades: false,
  showMySchedule: false,
  showStudentPortalLink: true,
};

export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  admin: adminConfig,
  director_pedagogico: directorPedagogicoConfig,
  secretario: secretarioConfig,
  professor: professorConfig,
  estudante: estudanteConfig,
};

// Role-specific data
export const myClasses = [
  { name: "Matemática - 10ª A", students: 32, nextClass: "Hoje, 08:00", room: "Sala 101" },
  { name: "Matemática - 10ª B", students: 28, nextClass: "Hoje, 10:00", room: "Sala 102" },
  { name: "Matemática - 11ª A", students: 30, nextClass: "Amanhã, 08:00", room: "Sala 103" },
  { name: "Matemática - 11ª B", students: 29, nextClass: "Amanhã, 10:00", room: "Sala 104" },
];

export const myGrades = [
  { subject: "Matemática", grade: 16, teacher: "Prof. João Santos", lastTest: "15 Jan" },
  { subject: "Português", grade: 14, teacher: "Prof. Maria Silva", lastTest: "12 Jan" },
  { subject: "Física", grade: 15, teacher: "Prof. Carlos Neto", lastTest: "10 Jan" },
  { subject: "Química", grade: 13, teacher: "Prof. Ana Costa", lastTest: "08 Jan" },
];

export const myScheduleToday = [
  { time: "08:00 - 09:30", subject: "Matemática", room: "Sala 101", teacher: "Prof. João Santos" },
  { time: "09:45 - 11:15", subject: "Português", room: "Sala 205", teacher: "Prof. Maria Silva" },
  { time: "11:30 - 13:00", subject: "Física", room: "Lab. Física", teacher: "Prof. Carlos Neto" },
  { time: "14:00 - 15:30", subject: "Educação Física", room: "Ginásio", teacher: "Prof. Pedro Lima" },
];

export const attendanceStats = [
  { turma: "10ª A", presente: 28, ausente: 4, total: 32 },
  { turma: "10ª B", presente: 25, ausente: 3, total: 28 },
  { turma: "11ª A", presente: 29, ausente: 1, total: 30 },
];
