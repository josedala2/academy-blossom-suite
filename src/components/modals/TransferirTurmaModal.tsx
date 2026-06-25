import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface TransferirTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  /** Lista de todas as turmas existentes (ex.: "10ª A", "10ª B", "8ª C") */
  turmasDisponiveis: string[];
  onConfirm: (studentId: number, novaTurma: string, motivo: string) => void;
}

// Extrai "10ª" de "10ª A"
const extrairAno = (turma: string) => turma.split(" ")[0] ?? "";
// Extrai "A" de "10ª A"
const extrairLetra = (turma: string) => turma.split(" ")[1] ?? "";

const TransferirTurmaModal = ({
  isOpen,
  onClose,
  student,
  turmasDisponiveis,
  onConfirm,
}: TransferirTurmaModalProps) => {
  const { toast } = useToast();
  const [novaTurma, setNovaTurma] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNovaTurma("");
      setMotivo("");
    }
  }, [isOpen, student?.id]);

  const turmaActual = student?.class ?? "";
  const anoActual = extrairAno(turmaActual);

  // Apenas turmas do mesmo ano (classe) e diferentes da actual
  const opcoes = useMemo(() => {
    return turmasDisponiveis
      .filter((t) => extrairAno(t) === anoActual && t !== turmaActual)
      .sort((a, b) => extrairLetra(a).localeCompare(extrairLetra(b)));
  }, [turmasDisponiveis, anoActual, turmaActual]);

  const podeConfirmar = !!novaTurma && motivo.trim().length >= 10;

  const handleConfirmar = () => {
    if (!student) return;
    if (!novaTurma) {
      toast({
        title: "Seleccione uma turma",
        description: "Indique a turma de destino para o estudante.",
        variant: "destructive",
      });
      return;
    }
    if (motivo.trim().length < 10) {
      toast({
        title: "Motivo insuficiente",
        description: "Descreva o motivo da transferência (mín. 10 caracteres).",
        variant: "destructive",
      });
      return;
    }
    onConfirm(student.id, novaTurma, motivo.trim());
    toast({
      title: "Transferência efectuada",
      description: `${student.name} foi transferido(a) de ${turmaActual} para ${novaTurma}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Transferir de Turma
          </DialogTitle>
          <DialogDescription>
            Mude o estudante para outra turma do <strong>mesmo ano lectivo</strong>.
          </DialogDescription>
        </DialogHeader>

        {student && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
              <p>
                <strong>Estudante:</strong> {student.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Nº {student.number}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline">Actual: {turmaActual}</Badge>
                {novaTurma && (
                  <>
                    <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                    <Badge>Destino: {novaTurma}</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Turma de destino ({anoActual})</Label>
              {opcoes.length === 0 ? (
                <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Não existem outras turmas disponíveis para o ano{" "}
                    <strong>{anoActual}</strong>. Crie uma nova turma antes de
                    transferir.
                  </p>
                </div>
              ) : (
                <Select value={novaTurma} onValueChange={setNovaTurma}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {opcoes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Motivo da transferência{" "}
                <span className="text-xs text-muted-foreground">
                  ({motivo.trim().length}/300)
                </span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Ex.: Pedido do encarregado, reequilíbrio pedagógico, conflito de turno..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value.slice(0, 300))}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!podeConfirmar || opcoes.length === 0}
            className="gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Confirmar Transferência
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferirTurmaModal;
