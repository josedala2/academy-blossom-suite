import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Generate PDF document
  const generatePDF = (): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header - School name and logo placeholder
    doc.setFillColor(25, 65, 120);
    doc.rect(0, 0, pageWidth, 35, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SGE - SISTEMA DE GESTÃO ESCOLAR", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("República de Angola - Ministério da Educação", pageWidth / 2, 23, { align: "center" });
    doc.text("Instituição de Ensino Oficial", pageWidth / 2, 30, { align: "center" });
    
    // Document title
    doc.setTextColor(25, 65, 120);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(documento.tipoNome.toUpperCase(), pageWidth / 2, 50, { align: "center" });
    
    // Document number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Documento Nº: ${documento.numero}`, pageWidth / 2, 58, { align: "center" });
    
    // Separator line
    doc.setDrawColor(200, 160, 50);
    doc.setLineWidth(1);
    doc.line(20, 65, pageWidth - 20, 65);
    
    // Document body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let yPos = 80;
    const lineHeight = 8;
    
    // Introduction text based on document type
    const introText = getDocumentIntroText(documento.tipo);
    const splitIntro = doc.splitTextToSize(introText, pageWidth - 40);
    doc.text(splitIntro, 20, yPos);
    yPos += splitIntro.length * lineHeight + 10;
    
    // Student information
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO ESTUDANTE:", 20, yPos);
    yPos += lineHeight;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nome Completo: ${documento.estudante}`, 25, yPos);
    yPos += lineHeight;
    doc.text(`Classe/Turma: ${documento.classe}`, 25, yPos);
    yPos += lineHeight;
    doc.text(`Ano Lectivo: 2024/2025`, 25, yPos);
    yPos += lineHeight * 2;
    
    // Document specific content
    const bodyText = getDocumentBodyText(documento.tipo, documento.estudante);
    const splitBody = doc.splitTextToSize(bodyText, pageWidth - 40);
    doc.text(splitBody, 20, yPos);
    yPos += splitBody.length * lineHeight + 20;
    
    // Emission info
    doc.setFontSize(10);
    doc.text(`Data de Emissão: ${documento.dataEmissao}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Emitido por: ${documento.emitidoPor}`, 20, yPos);
    yPos += lineHeight;
    
    if (documento.estado === "aprovado" && documento.aprovadoPor) {
      doc.text(`Aprovado por: ${documento.aprovadoPor}`, 20, yPos);
      yPos += lineHeight;
    }
    
    // Signature area
    yPos = 230;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // Left signature
    doc.line(30, yPos, 80, yPos);
    doc.setFontSize(9);
    doc.text("O Secretário", 55, yPos + 5, { align: "center" });
    
    // Right signature
    doc.line(pageWidth - 80, yPos, pageWidth - 30, yPos);
    doc.text("O Director", pageWidth - 55, yPos + 5, { align: "center" });
    
    // Stamp area
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("(Carimbo da Instituição)", pageWidth / 2, yPos + 15, { align: "center" });
    
    // Footer
    doc.setFillColor(25, 65, 120);
    doc.rect(0, 280, pageWidth, 17, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Este documento é válido apenas com carimbo e assinatura da instituição", pageWidth / 2, 287, { align: "center" });
    doc.text(`Código de Verificação: ${documento.numero.replace(/[^A-Z0-9]/g, "")}${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, 293, { align: "center" });
    
    return doc;
  };

  const getDocumentIntroText = (tipo: string): string => {
    switch (tipo) {
      case "declaracao_matricula":
        return "Para os devidos efeitos, declaramos que o(a) estudante abaixo identificado(a) encontra-se regularmente matriculado(a) nesta instituição de ensino, conforme os registos académicos em vigor.";
      case "declaracao_frequencia":
        return "Para os devidos efeitos, declaramos que o(a) estudante abaixo identificado(a) frequenta regularmente as aulas nesta instituição de ensino, mantendo assiduidade satisfatória.";
      case "certificado_habilitacoes":
        return "Certificamos que o(a) estudante abaixo identificado(a) concluiu com aproveitamento o ciclo de estudos nesta instituição, tendo obtido as habilitações académicas correspondentes.";
      case "transferencia":
        return "Para os devidos efeitos, declaramos que o(a) estudante abaixo identificado(a) solicita transferência desta instituição de ensino, tendo cumprido todas as obrigações académicas e financeiras pendentes.";
      default:
        return "Para os devidos efeitos, emitimos o presente documento relativo ao(à) estudante abaixo identificado(a), conforme solicitação.";
    }
  };

  const getDocumentBodyText = (tipo: string, estudante: string): string => {
    switch (tipo) {
      case "declaracao_matricula":
        return `Pelo presente, confirmamos que ${estudante} está devidamente matriculado(a) nesta instituição para o ano lectivo em curso, podendo apresentar este documento junto de qualquer entidade que o solicite.\n\nA presente declaração é emitida a pedido do(a) interessado(a) e destina-se exclusivamente aos fins por ele(a) indicados.`;
      case "declaracao_frequencia":
        return `Certificamos que ${estudante} mantém frequência regular às actividades lectivas, cumprindo com as obrigações académicas estabelecidas pelo regulamento interno.\n\nA presente declaração é válida por 30 (trinta) dias a contar da data de emissão.`;
      case "certificado_habilitacoes":
        return `Em cumprimento do disposto no Decreto Presidencial n.º 227/25, certificamos que ${estudante} concluiu os estudos correspondentes ao nível de ensino frequentado, tendo sido aprovado(a) em todas as disciplinas do currículo.\n\nO presente certificado é emitido em conformidade com a legislação angolana em vigor.`;
      case "transferencia":
        return `Informamos que ${estudante} encontra-se em situação regular para efeitos de transferência, não havendo quaisquer impedimentos de ordem académica ou financeira.\n\nO histórico escolar completo será enviado directamente à instituição de destino, mediante solicitação formal.`;
      default:
        return `A presente documentação é emitida a pedido do(a) interessado(a), ${estudante}, para os devidos efeitos legais.\n\nPor ser verdade, firmamos o presente documento.`;
    }
  };

  const handlePreview = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfDataUrl(url);
    setPreviewOpen(true);
    setPreviewZoom(100);
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`${documento.numero}_${documento.tipoNome.replace(/\s+/g, "_")}.pdf`);
    
    toast({
      title: "Download concluído",
      description: `Documento ${documento.numero}.pdf foi descarregado.`,
    });
  };

  const handlePrint = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    
    // Open in new window for printing
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
    
    toast({
      title: "Preparando impressão",
      description: "O documento será aberto para impressão.",
    });
  };

  const closePreview = () => {
    setPreviewOpen(false);
    if (pdfDataUrl) {
      URL.revokeObjectURL(pdfDataUrl);
      setPdfDataUrl(null);
    }
  };

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(prev - 25, 50));
  };

  const canDownloadOrPrint =
    documento.estado === "emitido" || documento.estado === "aprovado";

  return (
    <>
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

            {/* Document Preview Card */}
            <Card 
              className={canDownloadOrPrint ? "cursor-pointer hover:border-primary transition-colors" : ""}
              onClick={canDownloadOrPrint ? handlePreview : undefined}
            >
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Pré-visualização do Documento</p>
                  <p className="text-sm">
                    {canDownloadOrPrint
                      ? "Clique para pré-visualizar o documento."
                      : "O documento estará disponível após aprovação."}
                  </p>
                  {canDownloadOrPrint && (
                    <Button variant="link" className="mt-2" onClick={(e) => { e.stopPropagation(); handlePreview(); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Pré-visualização
                    </Button>
                  )}
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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!canDownloadOrPrint}
            >
              <Eye className="h-4 w-4 mr-2" />
              Pré-visualizar
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

      {/* PDF Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pré-visualização: {documento.tipoNome}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={previewZoom <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-16 text-center">{previewZoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={previewZoom >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-muted/50 rounded-lg p-4">
            {pdfDataUrl && (
              <iframe
                ref={iframeRef}
                src={pdfDataUrl}
                className="w-full h-full border-0 bg-white rounded"
                style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: "top center" }}
                title="PDF Preview"
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closePreview}>
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descarregar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerDocumentoModal;
