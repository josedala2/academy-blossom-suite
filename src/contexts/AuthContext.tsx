import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "admin" | "director_pedagogico" | "secretario" | "professor" | "estudante";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users database
const demoUsersDB: Record<string, { password: string; user: User }> = {
  "admin@escola.ao": {
    password: "admin123",
    user: {
      id: "1",
      name: "Carlos Mendes",
      email: "admin@escola.ao",
      role: "admin",
    },
  },
  "director@escola.ao": {
    password: "director123",
    user: {
      id: "5",
      name: "António Ferreira",
      email: "director@escola.ao",
      role: "director_pedagogico",
    },
  },
  "secretario@escola.ao": {
    password: "secretario123",
    user: {
      id: "2",
      name: "Ana Silva",
      email: "secretario@escola.ao",
      role: "secretario",
    },
  },
  "professor@escola.ao": {
    password: "professor123",
    user: {
      id: "3",
      name: "João Santos",
      email: "professor@escola.ao",
      role: "professor",
    },
  },
  "estudante@escola.ao": {
    password: "estudante123",
    user: {
      id: "4",
      name: "Maria Costa",
      email: "estudante@escola.ao",
      role: "estudante",
    },
  },
};

// Role hierarchy for permission checks
const roleHierarchy: Record<UserRole, number> = {
  admin: 5,
  director_pedagogico: 4,
  secretario: 3,
  professor: 2,
  estudante: 1,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("sge_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const userRecord = demoUsersDB[email.toLowerCase()];
    
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      localStorage.setItem("sge_user", JSON.stringify(userRecord.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("sge_user");
  }, []);

  const hasPermission = useCallback((allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Role display names
export const roleNames: Record<UserRole, string> = {
  admin: "Administrador",
  director_pedagogico: "Director Pedagógico",
  secretario: "Secretário",
  professor: "Professor",
  estudante: "Estudante",
};

// Role colors for UI
export const roleColors: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-800",
  director_pedagogico: "bg-indigo-100 text-indigo-800",
  secretario: "bg-blue-100 text-blue-800",
  professor: "bg-green-100 text-green-800",
  estudante: "bg-purple-100 text-purple-800",
};
