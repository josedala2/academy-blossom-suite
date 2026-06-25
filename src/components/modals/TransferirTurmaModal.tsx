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
import { ArrowRightLeft, AlertTriangle, CheckCircle2, Users } from "lucide-react";
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
  /** Lista completa de estudantes — usada para detectar conflitos e ocupação */
  todosEstudantes?: Student[];
  /** Período lectivo actual (apenas informativo no cabeçalho) */
  periodoLetivo?: string;
  /** Capacidade máxima por turma (default 35) */
  capacidadeMaxima?: number;
  onConfirm: (studentId: number, novaTurma: string, motivo: string) => void;
}

// Extrai "10ª" de "10ª A"
const extrairAno = (turma: string) => turma.split(" ")[0] ?? "";
// Extrai "A" de "10ª A"
const extrairLetra = (turma: string) => turma.split(" ")[1] ?? "";

type Conflito = {
  tipo: "lotacao" | "duplicado" | "inactivo" | "pagamentos";
  mensagem: string;
  severidade: "erro" | "aviso";
};

const TransferirTurmaModal = ({
  isOpen,
  onClose,
  student,
  turmasDisponiveis,
  todosEstudantes = [],
  periodoLetivo = "2025/2026",
  capacidadeMaxima = 35,
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

  // Ocupação por turma (excluindo o próprio estudante na origem)
  const ocupacaoPorTurma = useMemo(() => {
    const map = new Map<string, number>();
    todosEstudantes.forEach((s) => {
      map.set(s.class, (map.get(s.class) ?? 0) + 1);
    });
    return map;
  }, [todosEstudantes]);

  // Apenas turmas do mesmo ano e diferentes da actual
  const opcoes = useMemo(() => {
    return turmasDisponiveis
      .filter((t) => extrairAno(t) === anoActual && t !== turmaActual)
      .sort((a, b) => extrairLetra(a).localeCompare(extrairLetra(b)));
  }, [turmasDisponiveis, anoActual, turmaActual]);

  // Detecta conflitos para a turma seleccionada
  const conflitos = useMemo<Conflito[]>(() => {
    if (!student || !novaTurma) return [];
    const lista: Conflito[] = [];

    // 1. Lotação máxima
    const ocupacao = ocupacaoPorTurma.get(novaTurma) ?? 0;
    if (ocupacao >= capacidadeMaxima) {
      lista.push({
        tipo: "lotacao",
        severidade: "erro",
        mensagem: `Turma lotada (${ocupacao}/${capacidadeMaxima}). Não é possível adicionar mais estudantes no período ${periodoLetivo}.`,
      });
    } else if (ocupacao >= capacidadeMaxima - 2) {
      lista.push({
        tipo: "lotacao",
        severidade: "aviso",
        mensagem: `Turma quase lotada (${ocupacao}/${capacidadeMaxima}). Confirme antes de prosseguir.`,
      });
    }

    // 2. Duplicado (estudante já matriculado na turma destino — mesmo nome ou nº)
    const duplicado = todosEstudantes.find(
      (s) =>
        s.class === novaTurma &&
        s.id !== student.id &&
        (s.number === student.number ||
          s.name.trim().toLowerCase() === student.name.trim().toLowerCase())
    );
    if (duplicado) {
      lista.push({
        tipo: "duplicado",
        severidade: "erro",
        mensagem: `Já existe um registo do estudante na turma ${novaTurma} (Nº ${duplicado.number}). Conflito de matrícula no mesmo período.`,
      });
    }

    // 3. Estudante inactivo / transferido — não pode mudar de turma
    if (student.status && student.status !== "active") {
      lista.push({
        tipo: "inactivo",
        severidade: "erro",
        mensagem: `Estudante com estado "${student.status}". Reactive a matrícula antes de transferir.`,
      });
    }

    // 4. Pendências financeiras — aviso (não bloqueia)
    if (student.payments && student.payments !== "ok") {
      lista.push({
        tipo: "pagamentos",
        severidade: "aviso",
        mensagem:
          "O estudante apresenta pendências financeiras. A transferência será registada, mas regularize na Tesouraria.",
      });
    }

    return lista;
  }, [
    student,
    novaTurma,
    ocupacaoPorTurma,
    capacidadeMaxima,
    todosEstudantes,
    periodoLetivo,
  ]);

  const temErro = conflitos.some((c) => c.severidade === "erro");
  const podeConfirmar = !!novaTurma && motivo.trim().length >= 10 && !temErro;

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
    if (temErro) {
      toast({
        title: "Conflitos detectados",
        description:
          "Resolva os conflitos assinalados antes de confirmar a transferência.",
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
            Mude o estudante para outra turma do <strong>mesmo ano lectivo</strong>{" "}
            ({periodoLetivo}).
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
              <div className="flex items-center gap-2 pt-1 flex-wrap">
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
                    {opcoes.map((t) => {
                      const ocupacao = ocupacaoPorTurma.get(t) ?? 0;
                      const lotada = ocupacao >= capacidadeMaxima;
                      return (
                        <SelectItem key={t} value={t} disabled={lotada}>
                          <span className="flex items-center justify-between gap-3 w-full">
                            <span>{t}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {ocupacao}/{capacidadeMaxima}
                              {lotada && (
                                <span className="text-destructive ml-1">
                                  • Lotada
                                </span>
                              )}
                            </span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Painel de validação de conflitos */}
            {novaTurma && (
              <div className="space-y-2">
                {conflitos.length === 0 ? (
                  <div className="flex items-start gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      Sem conflitos detectados. A turma destino tem vaga e o
                      estudante não está duplicado neste período.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {conflitos.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 rounded-md border p-2.5 text-xs ${
                          c.severidade === "erro"
                            ? "border-destructive/40 bg-destructive/10"
                            : "border-amber-500/40 bg-amber-500/10"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            c.severidade === "erro"
                              ? "text-destructive"
                              : "text-amber-600"
                          }`}
                        />
                        <p>{c.mensagem}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
