import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Download,
  Printer,
  Clock,
  User,
  FileCheck,
  FileClock,
  FileX,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Documento {
  id: string;
  numero: string;
  tipo: string;
  tipoNome: string;
  estudante: string;
  classe: string;
  dataEmissao: string;
  emitidoPor: string;
  estado: string;
  aprovadoPor: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento: Documento | null;
}

const VerDocumentoModal = ({ open, onOpenChange, documento }: Props) => {
  const { toast } = useToast();

  if (!documento) return null;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "emitido":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Emitido
          </Badge>
        );
      case "pendente_aprovacao":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <FileClock className="h-3 w-3 mr-1" />
            Pendente de Aprovação
          </Badge>
        );
      case "aprovado":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <FileX className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: `A descarregar ${documento.numero}.pdf`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Preparando impressão",
      description: "O documento será enviado para a impressora.",
    });
  };

  const canDownloadOrPrint =
    documento.estado === "emitido" || documento.estado === "aprovado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-base">
                  {documento.numero}
                </Badge>
                {getEstadoBadge(documento.estado)}
              </div>
              <h3 className="text-lg font-semibold">{documento.tipoNome}</h3>
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
                  <p className="font-medium">{documento.estudante}</p>
                  <p className="text-sm text-muted-foreground">{documento.classe}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Emissão
                </h4>
                <div>
                  <p className="font-medium">{documento.dataEmissao}</p>
                  <p className="text-sm text-muted-foreground">
                    Por: {documento.emitidoPor}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approval Info */}
          {(documento.estado === "aprovado" || documento.estado === "rejeitado") && (
            <Card
              className={
                documento.estado === "aprovado"
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  {documento.estado === "aprovado" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {documento.estado === "aprovado"
                        ? "Aprovado"
                        : "Rejeitado"}{" "}
                      por {documento.aprovadoPor || "Direcção"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Data da {documento.estado === "aprovado" ? "aprovação" : "rejeição"}:{" "}
                      2024-01-14 15:30
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {documento.estado === "pendente_aprovacao" && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <FileClock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Aguardando aprovação da Direcção</p>
                    <p className="text-sm text-muted-foreground">
                      O documento será analisado e você será notificado quando
                      for aprovado ou rejeitado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Preview Placeholder */}
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Pré-visualização do Documento</p>
                <p className="text-sm">
                  {canDownloadOrPrint
                    ? "Clique em 'Descarregar' para ver o documento completo."
                    : "O documento estará disponível após aprovação."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Log */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Histórico
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{documento.dataEmissao}</span>
                <span>-</span>
                <span>Documento criado por {documento.emitidoPor}</span>
              </div>
              {documento.estado === "aprovado" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>2024-01-14 15:30</span>
                  <span>-</span>
                  <span>Aprovado por {documento.aprovadoPor}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={!canDownloadOrPrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleDownload} disabled={!canDownloadOrPrint}>
            <Download className="h-4 w-4 mr-2" />
            Descarregar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerDocumentoModal;
