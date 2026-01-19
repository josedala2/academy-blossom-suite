import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

export type NotificationType = "exam" | "grade" | "payment" | "general" | "elearning" | "grade_delay" | "supervision";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  priority?: "low" | "medium" | "high";
  metadata?: {
    professorId?: string;
    professorName?: string;
    disciplina?: string;
    turma?: string;
    prazo?: Date;
    diasAtraso?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getHighPriorityCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications for students
const getStudentNotifications = (): Notification[] => [
  {
    id: "1",
    type: "exam",
    title: "Novo Exame Marcado",
    message: "Exame de Matemática agendado para 25/01/2026 às 09:00",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    link: "/dashboard/portal-estudante",
  },
  {
    id: "2",
    type: "grade",
    title: "Nota Lançada",
    message: "A sua nota de Português foi publicada: 16 valores",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    link: "/dashboard/portal-estudante",
  },
  {
    id: "3",
    type: "payment",
    title: "Propina Vencida",
    message: "A propina de Janeiro está em atraso. Por favor regularize o pagamento.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    link: "/dashboard/portal-estudante",
  },
  {
    id: "4",
    type: "exam",
    title: "Lembrete de Exame",
    message: "Exame de Física em 2 dias - 27/01/2026 às 14:00",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    link: "/dashboard/portal-estudante",
  },
  {
    id: "5",
    type: "grade",
    title: "Pauta Final Publicada",
    message: "As notas finais do 1º trimestre já estão disponíveis",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    link: "/dashboard/portal-estudante",
  },
];

// Mock notifications for admin
const getAdminNotifications = (): Notification[] => [
  {
    id: "1",
    type: "general",
    title: "Nova Matrícula Pendente",
    message: "João Silva aguarda aprovação de matrícula",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    link: "/dashboard/estudantes",
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento Recebido",
    message: "Maria Santos pagou a propina de Janeiro - 15.000 MZN",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    link: "/dashboard/propinas",
  },
];

// Notifications for Director Pedagógico - includes grade delay alerts
const getDirectorNotifications = (): Notification[] => [
  {
    id: "dp1",
    type: "grade_delay",
    title: "⚠️ Atraso no Lançamento de Notas",
    message: "Prof. Carlos Mendes não lançou as notas de Matemática da 10ª Classe A. Prazo expirado há 3 dias.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "high",
    metadata: {
      professorId: "prof1",
      professorName: "Carlos Mendes",
      disciplina: "Matemática",
      turma: "10ª Classe A",
      diasAtraso: 3,
    },
  },
  {
    id: "dp2",
    type: "grade_delay",
    title: "⚠️ Atraso no Lançamento de Notas",
    message: "Profa. Ana Ferreira não lançou as notas de Física da 11ª Classe B. Prazo expirado há 2 dias.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "high",
    metadata: {
      professorId: "prof2",
      professorName: "Ana Ferreira",
      disciplina: "Física",
      turma: "11ª Classe B",
      diasAtraso: 2,
    },
  },
  {
    id: "dp3",
    type: "grade_delay",
    title: "⏰ Prazo Próximo do Vencimento",
    message: "Prof. Miguel Santos tem 1 dia para lançar notas de Química da 12ª Classe A.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "medium",
    metadata: {
      professorId: "prof3",
      professorName: "Miguel Santos",
      disciplina: "Química",
      turma: "12ª Classe A",
      diasAtraso: -1, // negative means days remaining
    },
  },
  {
    id: "dp4",
    type: "supervision",
    title: "📊 Notas Lançadas",
    message: "Profa. Maria Silva lançou todas as notas de Português da 10ª Classe B.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "low",
    metadata: {
      professorId: "prof4",
      professorName: "Maria Silva",
      disciplina: "Português",
      turma: "10ª Classe B",
    },
  },
  {
    id: "dp5",
    type: "supervision",
    title: "📈 Relatório Semanal Disponível",
    message: "O relatório de desempenho semanal dos professores está pronto para revisão.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "low",
  },
  {
    id: "dp6",
    type: "grade_delay",
    title: "⚠️ Múltiplos Atrasos Detectados",
    message: "Prof. João Baptista tem 3 avaliações com notas por lançar. Atrasos de 1 a 5 dias.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    link: "/dashboard/relatorios-pedagogicos",
    priority: "high",
    metadata: {
      professorId: "prof5",
      professorName: "João Baptista",
      diasAtraso: 5,
    },
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const getInitialNotifications = useCallback(() => {
    if (!user) return [];
    if (user.role === "estudante") return getStudentNotifications();
    if (user.role === "director_pedagogico") return getDirectorNotifications();
    return getAdminNotifications();
  }, [user]);

  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications);

  React.useEffect(() => {
    setNotifications(getInitialNotifications());
  }, [getInitialNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getHighPriorityCount = useCallback(() => {
    return notifications.filter((n) => !n.read && n.priority === "high").length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        clearAll,
        getHighPriorityCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
