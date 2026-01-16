import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, BookOpen, Percent, FileText, Edit, Trash2 } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  class: string;
  subject: string;
  date: string;
  status: string;
  weight: number;
}

interface VerDetalhesAvaliacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}

const VerDetalhesAvaliacaoModal = ({
  open,
  onOpenChange,
  exam,
}: VerDetalhesAvaliacaoModalProps) => {
  if (!exam) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="border-secondary text-secondary">
            <Clock className="h-3 w-3 mr-1" />
            Agendado
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            <FileText className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case "grading":
        return (
          <Badge variant="outline" className="border-accent text-accent">
            <Edit className="h-3 w-3 mr-1" />
            Em Correção
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{exam.name}</DialogTitle>
          <DialogDescription>
            Detalhes completos da avaliação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status */}
          <div className="flex justify-center">
            {getStatusBadge(exam.status)}
          </div>

          <Separator />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Disciplina</p>
                <p className="font-medium">{exam.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Turma</p>
                <p className="font-medium">{exam.class}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data</p>
                <p className="font-medium text-sm">{formatDate(exam.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="font-medium">{exam.weight}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Informações Adicionais</h4>
            <div className="p-3 rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="ml-2 font-medium">
                    {exam.name.includes("Exame") ? "Exame" : exam.name.includes("Trabalho") ? "Trabalho" : "Teste"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trimestre:</span>
                  <span className="ml-2 font-medium">1º Trimestre</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duração:</span>
                  <span className="ml-2 font-medium">90 min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sala:</span>
                  <span className="ml-2 font-medium">Sala 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Cancelar Avaliação
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerDetalhesAvaliacaoModal;
