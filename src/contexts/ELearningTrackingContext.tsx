import React, { createContext, useContext, useState, useCallback } from "react";

export interface AccessLog {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  classTitle: string;
  type: "class_access" | "material_download";
  materialName?: string;
  timestamp: Date;
}

interface ELearningTrackingContextType {
  accessLogs: AccessLog[];
  logClassAccess: (studentId: string, studentName: string, classId: string, classTitle: string) => void;
  logMaterialDownload: (studentId: string, studentName: string, classId: string, classTitle: string, materialName: string) => void;
  getClassStats: (classId: string) => { accessCount: number; downloadCount: number; uniqueStudents: string[] };
  getStudentAccessHistory: (classId: string) => AccessLog[];
}

const ELearningTrackingContext = createContext<ELearningTrackingContextType | undefined>(undefined);

// Mock initial data for demonstration
const getMockLogs = (): AccessLog[] => [
  {
    id: "log1",
    studentId: "s1",
    studentName: "Maria Costa",
    classId: "1",
    classTitle: "Introdução às Equações de 2º Grau",
    type: "class_access",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "log2",
    studentId: "s1",
    studentName: "Maria Costa",
    classId: "1",
    classTitle: "Introdução às Equações de 2º Grau",
    type: "material_download",
    materialName: "Exercícios_Equações.pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "log3",
    studentId: "s2",
    studentName: "João Silva",
    classId: "1",
    classTitle: "Introdução às Equações de 2º Grau",
    type: "class_access",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: "log4",
    studentId: "s3",
    studentName: "Ana Fernandes",
    classId: "2",
    classTitle: "Leis de Newton - Revisão",
    type: "class_access",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "log5",
    studentId: "s3",
    studentName: "Ana Fernandes",
    classId: "2",
    classTitle: "Leis de Newton - Revisão",
    type: "material_download",
    materialName: "Resumo_Leis_Newton.pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "log6",
    studentId: "s4",
    studentName: "Pedro Santos",
    classId: "1",
    classTitle: "Introdução às Equações de 2º Grau",
    type: "material_download",
    materialName: "Fórmulas_Resolvente.pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
];

export const ELearningTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(getMockLogs);

  const logClassAccess = useCallback(
    (studentId: string, studentName: string, classId: string, classTitle: string) => {
      const newLog: AccessLog = {
        id: Date.now().toString(),
        studentId,
        studentName,
        classId,
        classTitle,
        type: "class_access",
        timestamp: new Date(),
      };
      setAccessLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  const logMaterialDownload = useCallback(
    (studentId: string, studentName: string, classId: string, classTitle: string, materialName: string) => {
      const newLog: AccessLog = {
        id: Date.now().toString(),
        studentId,
        studentName,
        classId,
        classTitle,
        type: "material_download",
        materialName,
        timestamp: new Date(),
      };
      setAccessLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  const getClassStats = useCallback(
    (classId: string) => {
      const classLogs = accessLogs.filter((log) => log.classId === classId);
      const accessCount = classLogs.filter((log) => log.type === "class_access").length;
      const downloadCount = classLogs.filter((log) => log.type === "material_download").length;
      const uniqueStudents = [...new Set(classLogs.map((log) => log.studentName))];
      return { accessCount, downloadCount, uniqueStudents };
    },
    [accessLogs]
  );

  const getStudentAccessHistory = useCallback(
    (classId: string) => {
      return accessLogs.filter((log) => log.classId === classId);
    },
    [accessLogs]
  );

  return (
    <ELearningTrackingContext.Provider
      value={{
        accessLogs,
        logClassAccess,
        logMaterialDownload,
        getClassStats,
        getStudentAccessHistory,
      }}
    >
      {children}
    </ELearningTrackingContext.Provider>
  );
};

export const useELearningTracking = () => {
  const context = useContext(ELearningTrackingContext);
  if (!context) {
    throw new Error("useELearningTracking must be used within an ELearningTrackingProvider");
  }
  return context;
};
