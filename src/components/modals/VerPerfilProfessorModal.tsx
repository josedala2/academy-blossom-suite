import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, BookOpen, Users } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface VerPerfilProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSendEmail: (teacher: Teacher) => void;
}

const VerPerfilProfessorModal = ({
  isOpen,
  onClose,
  teacher,
  onSendEmail,
}: VerPerfilProfessorModalProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Perfil do Professor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {teacher.name
                  .replace("Prof. ", "")
                  .replace("Prof.ª ", "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {teacher.name}
              </h3>
              <Badge
                variant={teacher.status === "active" ? "default" : "secondary"}
                className={
                  teacher.status === "active"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : ""
                }
              >
                {teacher.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>

          {/* Informações de Contacto */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Informações de Contacto
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>

          {/* Disciplinas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Disciplinas Leccionadas
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {/* Turmas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Turmas Atribuídas ({teacher.classes.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.classes.map((cls) => (
                <Badge key={cls} variant="outline">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>

          {/* Acções */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onSendEmail(teacher);
                onClose();
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
            <Button variant="outline" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Horário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerPerfilProfessorModal;
