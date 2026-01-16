import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowRight, UserPlus, User, Phone, Mail } from "lucide-react";

interface Visitante {
  id: number;
  nome: string;
  contacto: string;
  email: string;
  motivo: string;
  observacoes: string;
  dataVisita: string;
  horaVisita: string;
  atendidoPor: string;
  estado: "atendido" | "aguardando" | "convertido";
  seguimento: boolean;
}

interface ConverterVisitanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitante: Visitante | null;
}

const classesDisponiveis = [
  { value: "7", label: "7ª Classe" },
  { value: "8", label: "8ª Classe" },
  { value: "9", label: "9ª Classe" },
  { value: "10", label: "10ª Classe" },
  { value: "11", label: "11ª Classe" },
  { value: "12", label: "12ª Classe" },
];

const ConverterVisitanteModal = ({
  open,
  onOpenChange,
  visitante,
}: ConverterVisitanteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nomeEstudante, setNomeEstudante] = useState("");
  const [classePretendida, setClassePretendida] = useState("");

  if (!visitante) return null;

  const handleConverter = async () => {
    if (!nomeEstudante || !classePretendida) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const numeroRegisto = `PR-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    toast.success("Visitante convertido em candidato!", {
      description: `Pré-registo ${numeroRegisto} criado para ${nomeEstudante}`,
    });

    setNomeEstudante("");
    setClassePretendida("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ArrowRight className="h-5 w-5 text-green-600" />
            Converter em Candidato
          </DialogTitle>
          <DialogDescription>
            Crie um pré-registo a partir dos dados do visitante
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visitante Info */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <h4 className="text-sm font-medium">Dados do Visitante</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{visitante.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{visitante.contacto}</span>
              </div>
              {visitante.email && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{visitante.email}</span>
                </div>
              )}
            </div>
            <Badge variant="secondary">{visitante.motivo}</Badge>
          </div>

          {/* Dados do Estudante */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium border-b pb-2">Dados do Estudante</h4>

            <div className="space-y-2">
              <Label htmlFor="nomeEstudante">Nome do Estudante *</Label>
              <Input
                id="nomeEstudante"
                placeholder="Ex: João Manuel Silva"
                value={nomeEstudante}
                onChange={(e) => setNomeEstudante(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classePretendida">Classe Pretendida *</Label>
              <Select value={classePretendida} onValueChange={setClassePretendida}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione a classe" />
                </SelectTrigger>
                <SelectContent>
                  {classesDisponiveis.map((classe) => (
                    <SelectItem key={classe.value} value={classe.value}>
                      {classe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs text-muted-foreground">
              Os dados de contacto do visitante serão usados como encarregado de educação.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleConverter}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A converter...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Pré-Registo
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConverterVisitanteModal;
