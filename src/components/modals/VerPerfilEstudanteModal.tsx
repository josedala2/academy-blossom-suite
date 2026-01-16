import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, GraduationCap, CreditCard, Calendar, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Student {
  id: number;
  name: string;
  number: string;
  class: string;
  guardian: string;
  phone: string;
  status: string;
  payments: string;
}

interface VerPerfilEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSendEmail: () => void;
}

const VerPerfilEstudanteModal = ({
  isOpen,
  onClose,
  student,
  onSendEmail,
}: VerPerfilEstudanteModalProps) => {
  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Estudante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com foto e info básica */}
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {getInitials(student.name)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">Nº {student.number}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{student.class}</Badge>
                <Badge
                  variant={student.status === "active" ? "default" : "secondary"}
                  className={
                    student.status === "active"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : ""
                  }
                >
                  {student.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do Estudante */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Informações Académicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Turma</p>
                    <p className="font-medium">{student.class}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ano Lectivo</p>
                    <p className="font-medium">2024/2025</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    student.payments === "ok" 
                      ? "bg-green-100 dark:bg-green-900/30" 
                      : student.payments === "pending"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}>
                    <CreditCard className={`h-5 w-5 ${
                      student.payments === "ok" 
                        ? "text-green-600 dark:text-green-400" 
                        : student.payments === "pending"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Propinas</p>
                    <p className={`font-medium ${
                      student.payments === "ok" 
                        ? "text-green-600 dark:text-green-400" 
                        : student.payments === "pending"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {student.payments === "ok"
                        ? "Em dia"
                        : student.payments === "pending"
                        ? "Pendente"
                        : "Em atraso"}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Matrícula</p>
                    <p className="font-medium">#{student.number}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Encarregado de Educação */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Encarregado de Educação</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{student.guardian}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">email@exemplo.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Luanda, Angola</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Acções */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={onSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerPerfilEstudanteModal;
