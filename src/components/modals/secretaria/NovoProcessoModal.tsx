import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FolderPlus,
  Search,
  User,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  Upload,
  FileText,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data
const estudantes = [
  { id: "1", nome: "João Manuel Silva", numero: "2024001", classe: "10ª A" },
  { id: "2", nome: "Ana Beatriz Santos", numero: "2024002", classe: "11ª B" },
  { id: "3", nome: "Carlos Eduardo Mendes", numero: "2024003", classe: "12ª A" },
  { id: "4", nome: "Diana Rosa Ferreira", numero: "2024004", classe: "10ª C" },
  { id: "5", nome: "Emanuel José Costa", numero: "2024005", classe: "11ª A" },
];

const tiposProcesso = [
  {
    value: "transferencia",
    label: "Transferência",
    icon: ArrowRightLeft,
    descricao: "Processo de transferência do estudante para outra instituição",
    camposExtra: ["escola_destino", "motivo_transferencia"],
  },
  {
    value: "anulacao",
    label: "Anulação de Matrícula",
    icon: XCircle,
    descricao: "Cancelamento da matrícula do estudante",
    camposExtra: ["motivo_anulacao"],
  },
  {
    value: "reingresso",
    label: "Reingresso",
    icon: RotateCcw,
    descricao: "Retorno do estudante após período de ausência",
    camposExtra: ["motivo_ausencia", "periodo_ausencia"],
  },
];

const NovoProcessoModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [tipoProcesso, setTipoProcesso] = useState("");
  const [estudanteId, setEstudanteId] = useState("");
  const [searchEstudante, setSearchEstudante] = useState("");
  const [descricao, setDescricao] = useState("");
  const [camposExtra, setCamposExtra] = useState<Record<string, string>>({});
  const [anexos, setAnexos] = useState<string[]>([]);

  const tipoSelecionado = tiposProcesso.find((t) => t.value === tipoProcesso);
  const estudanteSelecionado = estudantes.find((e) => e.id === estudanteId);

  const filteredEstudantes = estudantes.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) ||
      est.numero.includes(searchEstudante)
  );

  const handleAddAnexo = () => {
    // Simula adição de anexo
    const novoAnexo = `documento_${anexos.length + 1}.pdf`;
    setAnexos([...anexos, novoAnexo]);
    toast({
      title: "Anexo adicionado",
      description: `${novoAnexo} foi adicionado ao processo.`,
    });
  };

  const handleRemoveAnexo = (index: number) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!tipoProcesso || !estudanteId || !descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processo criado",
      description: `Processo de ${tipoSelecionado?.label} criado com sucesso.`,
    });

    // Reset form
    setStep(1);
    setTipoProcesso("");
    setEstudanteId("");
    setSearchEstudante("");
    setDescricao("");
    setCamposExtra({});
    setAnexos([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    setTipoProcesso("");
    setEstudanteId("");
    setSearchEstudante("");
    setDescricao("");
    setCamposExtra({});
    setAnexos([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Novo Processo Administrativo
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Tipo de Processo */}
        {step === 1 && (
          <div className="space-y-4">
            <Label>Seleccione o tipo de processo</Label>
            <div className="grid gap-3">
              {tiposProcesso.map((tipo) => {
                const Icon = tipo.icon;
                return (
                  <Card
                    key={tipo.value}
                    className={`cursor-pointer transition-colors ${
                      tipoProcesso === tipo.value
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setTipoProcesso(tipo.value)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            tipoProcesso === tipo.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{tipo.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {tipo.descricao}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Seleccionar Estudante */}
        {step === 2 && (
          <div className="space-y-4">
            <Label>Seleccione o estudante</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou número..."
                value={searchEstudante}
                onChange={(e) => setSearchEstudante(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
              {filteredEstudantes.map((est) => (
                <div
                  key={est.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    estudanteId === est.id
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setEstudanteId(est.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{est.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        Nº {est.numero}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{est.classe}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Detalhes e Anexos */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Resumo */}
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Processo</p>
                    <p className="font-medium">{tipoSelecionado?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estudante</p>
                    <p className="font-medium">{estudanteSelecionado?.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {estudanteSelecionado?.classe}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campos Extra por Tipo */}
            {tipoProcesso === "transferencia" && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="escola_destino">Escola de Destino</Label>
                  <Input
                    id="escola_destino"
                    value={camposExtra.escola_destino || ""}
                    onChange={(e) =>
                      setCamposExtra({ ...camposExtra, escola_destino: e.target.value })
                    }
                    placeholder="Nome da escola de destino"
                  />
                </div>
              </div>
            )}

            {tipoProcesso === "reingresso" && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="periodo_ausencia">Período de Ausência</Label>
                  <Input
                    id="periodo_ausencia"
                    value={camposExtra.periodo_ausencia || ""}
                    onChange={(e) =>
                      setCamposExtra({ ...camposExtra, periodo_ausencia: e.target.value })
                    }
                    placeholder="Ex: Janeiro a Março de 2024"
                  />
                </div>
              </div>
            )}

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição / Motivo *</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o motivo e detalhes do processo..."
                rows={3}
              />
            </div>

            <Separator />

            {/* Anexos */}
            <div>
              <Label className="mb-2 block">Anexos</Label>
              <div className="space-y-2">
                {anexos.map((anexo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{anexo}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAnexo(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddAnexo}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Anexo
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !tipoProcesso) || (step === 2 && !estudanteId)
                }
              >
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Criar Processo</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoProcessoModal;
