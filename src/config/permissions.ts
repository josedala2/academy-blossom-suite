import { UserRole } from "@/contexts/AuthContext";
import {
  Users,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  DollarSign,
  Clock,
  MessageSquare,
  BarChart3,
  Settings,
  Building2,
  LucideIcon,
  Video,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// Define navigation items with role-based access
export const navigationConfig: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: BarChart3,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor", "estudante"],
      },
      {
        label: "Meu Portal",
        href: "/dashboard/portal-estudante",
        icon: GraduationCap,
        allowedRoles: ["estudante"],
      },
    ],
  },
  {
    title: "Gestão Académica",
    items: [
      {
        label: "Estudantes",
        href: "/dashboard/estudantes",
        icon: GraduationCap,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor"],
      },
      {
        label: "Professores",
        href: "/dashboard/professores",
        icon: Users,
        allowedRoles: ["admin", "director_pedagogico", "secretario"],
      },
      {
        label: "Turmas",
        href: "/dashboard/turmas",
        icon: Calendar,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor"],
      },
      {
        label: "Avaliações",
        href: "/dashboard/avaliacoes",
        icon: ClipboardCheck,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor"],
      },
      {
        label: "Horários",
        href: "/dashboard/horarios",
        icon: Clock,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor"],
      },
      {
        label: "E-Learning",
        href: "/dashboard/elearning",
        icon: Video,
        allowedRoles: ["professor", "director_pedagogico"],
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        label: "Propinas",
        href: "/dashboard/propinas",
        icon: DollarSign,
        allowedRoles: ["admin", "secretario"],
      },
    ],
  },
  {
    title: "Comunicação",
    items: [
      {
        label: "Comunicados",
        href: "/dashboard/comunicados",
        icon: MessageSquare,
        allowedRoles: ["admin", "director_pedagogico", "secretario", "professor"],
      },
      {
        label: "Relatórios",
        href: "/dashboard/relatorios",
        icon: BarChart3,
        allowedRoles: ["admin", "director_pedagogico", "secretario"],
      },
      {
        label: "Rel. Pedagógicos",
        href: "/dashboard/relatorios-pedagogicos",
        icon: ClipboardCheck,
        allowedRoles: ["admin", "director_pedagogico"],
      },
    ],
  },
  {
    title: "Administração",
    items: [
      {
        label: "Secretaria",
        href: "/dashboard/secretaria",
        icon: Building2,
        allowedRoles: ["admin", "secretario"],
      },
      {
        label: "Configurações",
        href: "/dashboard/configuracoes",
        icon: Settings,
        allowedRoles: ["admin"],
      },
    ],
  },
];

// Route permissions mapping
export const routePermissions: Record<string, UserRole[]> = {
  "/dashboard": ["admin", "director_pedagogico", "secretario", "professor", "estudante"],
  "/dashboard/perfil": ["admin", "director_pedagogico", "secretario", "professor", "estudante"],
  "/dashboard/portal-estudante": ["estudante"],
  "/dashboard/estudantes": ["admin", "director_pedagogico", "secretario", "professor"],
  "/dashboard/professores": ["admin", "director_pedagogico", "secretario"],
  "/dashboard/turmas": ["admin", "director_pedagogico", "secretario", "professor"],
  "/dashboard/avaliacoes": ["admin", "director_pedagogico", "secretario", "professor", "estudante"],
  "/dashboard/propinas": ["admin", "secretario"],
  "/dashboard/propinas/historico": ["admin", "secretario"],
  "/dashboard/horarios": ["admin", "director_pedagogico", "secretario", "professor", "estudante"],
  "/dashboard/comunicados": ["admin", "director_pedagogico", "secretario", "professor"],
  "/dashboard/relatorios": ["admin", "director_pedagogico", "secretario"],
  "/dashboard/relatorios-pedagogicos": ["admin", "director_pedagogico"],
  "/dashboard/elearning": ["professor", "director_pedagogico"],
  "/dashboard/configuracoes": ["admin"],
  "/dashboard/secretaria": ["admin", "secretario"],
  "/dashboard/secretaria/pre-registos": ["admin", "secretario"],
  "/dashboard/secretaria/visitantes": ["admin", "secretario"],
  "/dashboard/secretaria/estudantes": ["admin", "secretario"],
  "/dashboard/secretaria/encarregados": ["admin", "secretario"],
  "/dashboard/secretaria/documentos": ["admin", "secretario"],
  "/dashboard/secretaria/templates": ["admin", "secretario"],
  "/dashboard/secretaria/processos": ["admin", "secretario"],
  "/dashboard/secretaria/relatorios": ["admin", "secretario"],
};

// Get filtered navigation based on user role
export function getFilteredNavigation(userRole: UserRole): NavSection[] {
  return navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.allowedRoles.includes(userRole)),
    }))
    .filter((section) => section.items.length > 0);
}

// Check if user has access to a specific route
export function hasRouteAccess(path: string, userRole: UserRole): boolean {
  const allowedRoles = routePermissions[path];
  if (!allowedRoles) return true; // Allow access to routes not in the map
  return allowedRoles.includes(userRole);
}
