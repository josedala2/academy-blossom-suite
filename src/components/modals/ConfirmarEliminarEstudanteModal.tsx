import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ConfirmarEliminarEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onConfirm: (studentId: number) => void;
}

const ConfirmarEliminarEstudanteModal = ({
  isOpen,
  onClose,
  student,
  onConfirm,
}: ConfirmarEliminarEstudanteModalProps) => {
  const [confirmText, setConfirmText] = useState("");

  if (!student) return null;

  const isConfirmValid = confirmText === student.number;

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm(student.id);
      setConfirmText("");
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Eliminar Estudante</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Esta acção não pode ser revertida.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Student Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{student.name}</span>
              <Badge variant="secondary">{student.class}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Nº de Matrícula: <span className="font-mono font-medium">{student.number}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Encarregado: {student.guardian}
            </p>
          </div>

          {/* Warning */}
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Atenção:</strong> Ao eliminar este estudante, todos os dados associados 
              (notas, pagamentos, histórico) serão permanentemente removidos.
            </p>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmNumber">
              Para confirmar, digite o número de matrícula: <strong>{student.number}</strong>
            </Label>
            <Input
              id="confirmNumber"
              placeholder="Digite o número de matrícula"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={confirmText && !isConfirmValid ? "border-destructive" : ""}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-destructive">
                O número de matrícula não corresponde.
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Estudante
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmarEliminarEstudanteModal;
