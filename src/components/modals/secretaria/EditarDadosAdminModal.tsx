import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Phone, AlertCircle, Lock } from "lucide-react";

interface Estudante {
  id: string;
  numero: string;
  nome: string;
  classe: string;
  turma: string;
  turno: string;
  encarregado: string;
  telefoneEncarregado: string;
  estadoFinanceiro: string;
  estadoMatricula: string;
  endereco: string;
  dataNascimento: string;
  naturalidade: string;
  nacionalidade: string;
  genero: string;
  documentoId: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudante: Estudante | null;
}

const EditarDadosAdminModal = ({ open, onOpenChange, estudante }: Props) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    endereco: "",
    encarregado: "",
    telefoneEncarregado: "",
    telefoneAlternativo: "",
    emailEncarregado: "",
    observacoes: "",
  });

  useEffect(() => {
    if (estudante) {
      setFormData({
        endereco: estudante.endereco,
        encarregado: estudante.encarregado,
        telefoneEncarregado: estudante.telefoneEncarregado,
        telefoneAlternativo: "",
        emailEncarregado: "",
        observacoes: "",
      });
    }
  }, [estudante]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados actualizados",
      description: "Os dados administrativos foram actualizados com sucesso.",
    });
    onOpenChange(false);
  };

  if (!estudante) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Dados Administrativos
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Apenas dados administrativos podem ser alterados</p>
              <p className="text-xs mt-1">
                Dados académicos, notas e frequência são geridos pela Direção Pedagógica.
              </p>
            </div>
          </div>

          {/* Student Info (Read-only) */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{estudante.nome}</h3>
                <p className="text-sm text-muted-foreground">Nº {estudante.numero}</p>
              </div>
              <Badge variant="secondary">
                {estudante.classe} {estudante.turma}
              </Badge>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Dados bloqueados
              </span>
            </div>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </h4>
            <div>
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                placeholder="Rua, número, bairro, município..."
                rows={2}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contactos do Encarregado
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="encarregado">Nome do Encarregado</Label>
                <Input
                  id="encarregado"
                  value={formData.encarregado}
                  onChange={(e) =>
                    setFormData({ ...formData, encarregado: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="telefoneEncarregado">Telefone Principal</Label>
                <Input
                  id="telefoneEncarregado"
                  value={formData.telefoneEncarregado}
                  onChange={(e) =>
                    setFormData({ ...formData, telefoneEncarregado: e.target.value })
                  }
                  placeholder="+244 9XX XXX XXX"
                />
              </div>
              <div>
                <Label htmlFor="telefoneAlternativo">Telefone Alternativo</Label>
                <Input
                  id="telefoneAlternativo"
                  value={formData.telefoneAlternativo}
                  onChange={(e) =>
                    setFormData({ ...formData, telefoneAlternativo: e.target.value })
                  }
                  placeholder="+244 9XX XXX XXX"
                />
              </div>
              <div>
                <Label htmlFor="emailEncarregado">Email</Label>
                <Input
                  id="emailEncarregado"
                  type="email"
                  value={formData.emailEncarregado}
                  onChange={(e) =>
                    setFormData({ ...formData, emailEncarregado: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              placeholder="Notas ou observações administrativas..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarDadosAdminModal;
