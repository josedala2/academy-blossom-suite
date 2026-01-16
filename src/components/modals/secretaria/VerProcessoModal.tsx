import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  FolderOpen,
  Clock,
  User,
  FileText,
  MessageSquare,
  Send,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Download,
  ArrowRight,
} from "lucide-react";

interface Observacao {
  data: string;
  autor: string;
  texto: string;
}

interface Processo {
  id: string;
  numero: string;
  tipo: string;
  tipoNome: string;
  estudante: string;
  classe: string;
  dataCriacao: string;
  estado: string;
  criadoPor: string;
  descricao: string;
  anexos: number;
  observacoes: Observacao[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processo: Processo | null;
}

const VerProcessoModal = ({ open, onOpenChange, processo }: Props) => {
  const { toast } = useToast();
  const [novaObservacao, setNovaObservacao] = useState("");

  if (!processo) return null;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "criado":
        return (
          <Badge variant="outline" className="border-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Criado
          </Badge>
        );
      case "em_analise":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Em Análise
          </Badge>
        );
      case "aprovado":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "concluido":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "transferencia":
        return <ArrowRightLeft className="h-5 w-5" />;
      case "anulacao":
        return <XCircle className="h-5 w-5" />;
      case "reingresso":
        return <RotateCcw className="h-5 w-5" />;
      default:
        return <FolderOpen className="h-5 w-5" />;
    }
  };

  const handleAddObservacao = () => {
    if (!novaObservacao.trim()) return;
    toast({
      title: "Observação adicionada",
      description: "A sua observação foi registada no processo.",
    });
    setNovaObservacao("");
  };

  const handleAvancarEstado = () => {
    const proximoEstado =
      processo.estado === "criado"
        ? "em_analise"
        : processo.estado === "em_analise"
        ? "aprovado"
        : processo.estado === "aprovado"
        ? "concluido"
        : null;

    if (proximoEstado) {
      toast({
        title: "Estado actualizado",
        description: `Processo avançou para: ${proximoEstado.replace("_", " ")}`,
      });
    }
  };

  const canAdvance =
    processo.estado !== "concluido" && processo.estado !== "rejeitado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Detalhes do Processo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getTipoIcon(processo.tipo)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-muted-foreground">
                    {processo.numero}
                  </span>
                  {getEstadoBadge(processo.estado)}
                </div>
                <h3 className="text-lg font-semibold">{processo.tipoNome}</h3>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="py-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Estudante
                </h4>
                <div>
                  <p className="font-medium">{processo.estudante}</p>
                  <p className="text-sm text-muted-foreground">{processo.classe}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Informações
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span>{processo.dataCriacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Por:</span>
                    <span>{processo.criadoPor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Descrição */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Descrição / Motivo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm">{processo.descricao}</p>
            </CardContent>
          </Card>

          {/* Anexos */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Anexos ({processo.anexos})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {Array.from({ length: processo.anexos }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">documento_{i + 1}.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workflow */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Fluxo do Processo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                {["criado", "em_analise", "aprovado", "concluido"].map(
                  (estado, index) => (
                    <div key={estado} className="flex items-center">
                      <div
                        className={`flex flex-col items-center ${
                          getEstadoOrder(processo.estado) >= index
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            getEstadoOrder(processo.estado) >= index
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs mt-1 capitalize">
                          {estado.replace("_", " ")}
                        </span>
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-16 h-0.5 mx-2 ${
                            getEstadoOrder(processo.estado) > index
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Histórico / Observações */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Histórico e Observações
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-48 pr-4">
                <div className="space-y-4">
                  {processo.observacoes.map((obs, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-muted">
                      <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" />
                      <div className="text-xs text-muted-foreground mb-1">
                        {obs.data} • {obs.autor}
                      </div>
                      <p className="text-sm">{obs.texto}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />

              {/* Nova Observação */}
              <div className="space-y-2">
                <Label htmlFor="observacao">Adicionar Observação</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="observacao"
                    value={novaObservacao}
                    onChange={(e) => setNovaObservacao(e.target.value)}
                    placeholder="Escreva uma observação..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddObservacao}
                    disabled={!novaObservacao.trim()}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {canAdvance && (
            <Button onClick={handleAvancarEstado}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Avançar Estado
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function getEstadoOrder(estado: string): number {
  const ordem: Record<string, number> = {
    criado: 0,
    em_analise: 1,
    aprovado: 2,
    concluido: 3,
    rejeitado: -1,
  };
  return ordem[estado] ?? -1;
}

export default VerProcessoModal;
