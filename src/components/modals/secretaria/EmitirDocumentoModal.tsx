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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Search, User, AlertTriangle, Lock } from "lucide-react";

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

const tiposDocumento = [
  { 
    value: "declaracao_matricula", 
    label: "Declaração de Matrícula", 
    codigo: "DM",
    requerAprovacao: false,
    descricao: "Confirma a matrícula do estudante na instituição"
  },
  { 
    value: "declaracao_frequencia", 
    label: "Declaração de Frequência", 
    codigo: "DF",
    requerAprovacao: false,
    descricao: "Confirma a frequência regular do estudante"
  },
  { 
    value: "declaracao_simples", 
    label: "Declaração Simples", 
    codigo: "DS",
    requerAprovacao: true,
    descricao: "Declaração genérica para diversos fins"
  },
  { 
    value: "atestado", 
    label: "Atestado Administrativo", 
    codigo: "AT",
    requerAprovacao: true,
    descricao: "Atestado para situações administrativas especiais"
  },
];

const EmitirDocumentoModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [estudanteId, setEstudanteId] = useState("");
  const [searchEstudante, setSearchEstudante] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [vias, setVias] = useState("1");

  const tipoSelecionado = tiposDocumento.find((t) => t.value === tipoDocumento);
  const estudanteSelecionado = estudantes.find((e) => e.id === estudanteId);

  const filteredEstudantes = estudantes.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) ||
      est.numero.includes(searchEstudante)
  );

  const handleSubmit = () => {
    if (!tipoDocumento || !estudanteId) {
      toast({
        title: "Campos obrigatórios",
        description: "Seleccione o tipo de documento e o estudante.",
        variant: "destructive",
      });
      return;
    }

    if (tipoSelecionado?.requerAprovacao) {
      toast({
        title: "Documento enviado para aprovação",
        description: `O documento será analisado pela Direcção antes da emissão.`,
      });
    } else {
      toast({
        title: "Documento emitido",
        description: `${tipoSelecionado?.label} emitido com sucesso.`,
      });
    }

    // Reset form
    setStep(1);
    setTipoDocumento("");
    setEstudanteId("");
    setSearchEstudante("");
    setFinalidade("");
    setObservacoes("");
    setVias("1");
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    setTipoDocumento("");
    setEstudanteId("");
    setSearchEstudante("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Emitir Documento
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
        </div>

        {/* Step 1: Tipo de Documento */}
        {step === 1 && (
          <div className="space-y-4">
            <Label>Seleccione o tipo de documento</Label>
            <div className="grid gap-3">
              {tiposDocumento.map((tipo) => (
                <Card
                  key={tipo.value}
                  className={`cursor-pointer transition-colors ${
                    tipoDocumento === tipo.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setTipoDocumento(tipo.value)}
                >
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {tipo.codigo}
                          </Badge>
                          <span className="font-medium">{tipo.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tipo.descricao}
                        </p>
                      </div>
                      {tipo.requerAprovacao && (
                        <Badge variant="outline" className="text-orange-600 shrink-0">
                          <Lock className="h-3 w-3 mr-1" />
                          Aprovação
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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

        {/* Step 3: Detalhes e Confirmação */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Resumo */}
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Documento</p>
                    <p className="font-medium">{tipoSelecionado?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estudante</p>
                    <p className="font-medium">{estudanteSelecionado?.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {estudanteSelecionado?.classe} • Nº {estudanteSelecionado?.numero}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tipoSelecionado?.requerAprovacao && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Este documento requer aprovação</p>
                  <p className="text-xs mt-1">
                    Será enviado para a Direcção antes da emissão final.
                  </p>
                </div>
              </div>
            )}

            {(tipoDocumento === "declaracao_simples" || tipoDocumento === "atestado") && (
              <div>
                <Label htmlFor="finalidade">Finalidade / Motivo</Label>
                <Input
                  id="finalidade"
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  placeholder="Ex: Pedido de visto, abertura de conta bancária..."
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vias">Número de Vias</Label>
                <Select value={vias} onValueChange={setVias}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 via</SelectItem>
                    <SelectItem value="2">2 vias</SelectItem>
                    <SelectItem value="3">3 vias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Notas adicionais..."
                rows={2}
              />
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
                  (step === 1 && !tipoDocumento) ||
                  (step === 2 && !estudanteId)
                }
              >
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {tipoSelecionado?.requerAprovacao ? "Enviar para Aprovação" : "Emitir Documento"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmitirDocumentoModal;
