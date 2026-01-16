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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  Calendar,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RelatorioMensalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportData = {
  month: "Janeiro 2026",
  totalReceived: 12540000,
  totalPending: 2345000,
  totalOverdue: 875000,
  totalExpected: 15760000,
  collectionRate: 87,
  previousMonthRate: 82,
  totalStudents: 847,
  paidStudents: 713,
  pendingStudents: 134,
  overdueStudents: 47,
  byClass: [
    { class: "7ª Classe", received: 1850000, pending: 280000, rate: 87 },
    { class: "8ª Classe", received: 1920000, pending: 320000, rate: 86 },
    { class: "9ª Classe", received: 2100000, pending: 350000, rate: 86 },
    { class: "10ª Classe", received: 2280000, pending: 420000, rate: 84 },
    { class: "11ª Classe", received: 2190000, pending: 480000, rate: 82 },
    { class: "12ª Classe", received: 2200000, pending: 495000, rate: 82 },
  ],
  byMethod: [
    { method: "Multicaixa Express", amount: 5890000, percentage: 47 },
    { method: "Transferência", amount: 3760000, percentage: 30 },
    { method: "Dinheiro", amount: 1880000, percentage: 15 },
    { method: "Depósito", amount: 1010000, percentage: 8 },
  ],
};

const months = [
  { value: "01-2026", label: "Janeiro 2026" },
  { value: "12-2025", label: "Dezembro 2025" },
  { value: "11-2025", label: "Novembro 2025" },
  { value: "10-2025", label: "Outubro 2025" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-AO", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value) + " Kz";
};

const RelatorioMensalModal = ({ open, onOpenChange }: RelatorioMensalModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState("01-2026");
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Financeiro Mensal", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.month, 105, 30, { align: "center" });

    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Financeiro", 20, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryData = [
      ["Total Recebido", formatCurrency(reportData.totalReceived)],
      ["Total Pendente", formatCurrency(reportData.totalPending)],
      ["Total em Atraso", formatCurrency(reportData.totalOverdue)],
      ["Taxa de Cobrança", `${reportData.collectionRate}%`],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Indicador", "Valor"]],
      body: summaryData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // By Class
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Receitas por Classe", 20, (doc as any).lastAutoTable.finalY + 15);

    const classData = reportData.byClass.map((c) => [
      c.class,
      formatCurrency(c.received),
      formatCurrency(c.pending),
      `${c.rate}%`,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Classe", "Recebido", "Pendente", "Taxa"]],
      body: classData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // By Method
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Receitas por Método de Pagamento", 20, (doc as any).lastAutoTable.finalY + 15);

    const methodData = reportData.byMethod.map((m) => [
      m.method,
      formatCurrency(m.amount),
      `${m.percentage}%`,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Método", "Valor", "Percentagem"]],
      body: methodData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO")}`, 20, finalY);

    doc.save(`relatorio_financeiro_${selectedMonth}.pdf`);

    toast.success("Relatório exportado com sucesso!");
    setIsExporting(false);
  };

  const rateDiff = reportData.collectionRate - reportData.previousMonthRate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Relatório Financeiro Mensal
          </DialogTitle>
          <DialogDescription>
            Resumo das receitas e cobranças do mês
          </DialogDescription>
        </DialogHeader>

        {/* Month Selector */}
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Recebido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-primary">{formatCurrency(reportData.totalReceived)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-accent" />
                Pendente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-accent">{formatCurrency(reportData.totalPending)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Em Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-destructive">{formatCurrency(reportData.totalOverdue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Taxa Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{reportData.collectionRate}%</span>
                <Badge variant={rateDiff >= 0 ? "default" : "destructive"} className="text-xs">
                  {rateDiff >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {rateDiff >= 0 ? "+" : ""}{rateDiff}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso de Cobrança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(reportData.totalReceived)} recebido</span>
              <span>{formatCurrency(reportData.totalExpected)} esperado</span>
            </div>
            <Progress value={reportData.collectionRate} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{reportData.paidStudents} estudantes pagos</span>
              <span>{reportData.pendingStudents + reportData.overdueStudents} por regularizar</span>
            </div>
          </CardContent>
        </Card>

        {/* By Class */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Receitas por Classe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.byClass.map((item) => (
                <div key={item.class} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.class}</span>
                    <span className="font-medium">{item.rate}%</span>
                  </div>
                  <Progress value={item.rate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Por Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.byMethod.map((item) => (
                <div key={item.method} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.method}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={exportToPDF} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A exportar...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatorioMensalModal;
