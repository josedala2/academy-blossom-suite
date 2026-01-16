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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Receipt, Download, Loader2, Printer, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface GerarRecibosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pagamentosPagos = [
  { id: 1, student: "João Silva", class: "10ª A", month: "Janeiro 2026", amount: "17.500 Kz", date: "2026-01-08", method: "Multicaixa", hasReceipt: false },
  { id: 2, student: "Maria Neto", class: "9ª C", month: "Janeiro 2026", amount: "15.000 Kz", date: "2026-01-05", method: "Transferência", hasReceipt: true },
  { id: 3, student: "Pedro Costa", class: "12ª A", month: "Janeiro 2026", amount: "20.000 Kz", date: "2026-01-10", method: "Dinheiro", hasReceipt: false },
  { id: 4, student: "Luísa Ferreira", class: "8ª B", month: "Janeiro 2026", amount: "17.500 Kz", date: "2026-01-12", method: "Multicaixa", hasReceipt: false },
  { id: 5, student: "Carlos Mendes", class: "11ª A", month: "Janeiro 2026", amount: "17.500 Kz", date: "2026-01-09", method: "Depósito", hasReceipt: true },
];

const GerarRecibosModal = ({ open, onOpenChange }: GerarRecibosModalProps) => {
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>("all");

  const filteredPayments = pagamentosPagos.filter(
    (p) => filterMonth === "all" || p.month.includes(filterMonth)
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(filteredPayments.filter(p => !p.hasReceipt).map((p) => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, id]);
    } else {
      setSelectedPayments(selectedPayments.filter((pId) => pId !== id));
    }
  };

  const generateReceipts = async () => {
    if (selectedPayments.length === 0) {
      toast.error("Seleccione pelo menos um pagamento");
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const doc = new jsPDF();
    let yPosition = 20;

    selectedPayments.forEach((paymentId, index) => {
      const payment = pagamentosPagos.find((p) => p.id === paymentId);
      if (!payment) return;

      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      }

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("RECIBO DE PAGAMENTO", 105, yPosition, { align: "center" });

      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Escola de Gestão Educacional", 105, yPosition, { align: "center" });

      yPosition += 20;
      doc.setFontSize(10);
      doc.text(`Recibo Nº: REC-${new Date().getFullYear()}-${String(payment.id).padStart(4, "0")}`, 20, yPosition);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-AO")}`, 150, yPosition);

      yPosition += 15;
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);

      yPosition += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Estudante:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(payment.student, 60, yPosition);

      yPosition += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Turma:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(payment.class, 60, yPosition);

      yPosition += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Mês Ref.:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(payment.month, 60, yPosition);

      yPosition += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Método:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(payment.method, 60, yPosition);

      yPosition += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Data Pgto:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(payment.date).toLocaleDateString("pt-AO"), 60, yPosition);

      yPosition += 20;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition - 5, 170, 15, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`VALOR PAGO: ${payment.amount}`, 105, yPosition + 5, { align: "center" });

      yPosition += 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("_______________________________", 105, yPosition, { align: "center" });
      yPosition += 5;
      doc.text("Assinatura e Carimbo", 105, yPosition, { align: "center" });
    });

    doc.save(`recibos_${new Date().toISOString().split("T")[0]}.pdf`);

    toast.success(`${selectedPayments.length} recibo(s) gerado(s) com sucesso!`);
    setIsGenerating(false);
    setSelectedPayments([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-primary" />
            Gerar Recibos
          </DialogTitle>
          <DialogDescription>
            Seleccione os pagamentos para gerar os recibos em PDF
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-center gap-4 py-2">
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              <SelectItem value="Janeiro">Janeiro</SelectItem>
              <SelectItem value="Fevereiro">Fevereiro</SelectItem>
              <SelectItem value="Março">Março</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {selectedPayments.length} seleccionado(s)
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPayments.length === filteredPayments.filter(p => !p.hasReceipt).length && filteredPayments.filter(p => !p.hasReceipt).length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Pgto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPayment(payment.id, checked as boolean)
                      }
                      disabled={payment.hasReceipt}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{payment.student}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{payment.class}</Badge>
                  </TableCell>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell className="font-mono">{payment.amount}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString("pt-AO")}</TableCell>
                  <TableCell>
                    {payment.hasReceipt ? (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Printer className="h-3 w-3 mr-1" />
                        Emitido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={generateReceipts} disabled={isGenerating || selectedPayments.length === 0}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A gerar...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Gerar {selectedPayments.length > 0 ? `(${selectedPayments.length})` : ""} Recibo(s)
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerarRecibosModal;
