import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Printer, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface GerarBoletinsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const turmas = [
  { id: "1", nome: "10ª Classe A", nivel: "II Ciclo" },
  { id: "2", nome: "10ª Classe B", nivel: "II Ciclo" },
  { id: "3", nome: "11ª Classe A", nivel: "II Ciclo" },
  { id: "4", nome: "11ª Classe B", nivel: "II Ciclo" },
  { id: "5", nome: "12ª Classe A", nivel: "II Ciclo" },
  { id: "6", nome: "12ª Classe B", nivel: "II Ciclo" },
];

const periodos = [
  { id: "1t", nome: "1º Trimestre", ano: "2024" },
  { id: "2t", nome: "2º Trimestre", ano: "2024" },
  { id: "3t", nome: "3º Trimestre", ano: "2024" },
  { id: "anual", nome: "Avaliação Anual", ano: "2024" },
];

const estudantesMock = [
  { id: "1", nome: "Ana Maria Silva", numero: "2024001" },
  { id: "2", nome: "Bruno José Santos", numero: "2024002" },
  { id: "3", nome: "Carla Fernanda Lopes", numero: "2024003" },
  { id: "4", nome: "Daniel Pedro Costa", numero: "2024004" },
  { id: "5", nome: "Eva Rosa Pereira", numero: "2024005" },
  { id: "6", nome: "Francisco Manuel Dias", numero: "2024006" },
  { id: "7", nome: "Graça Helena Nunes", numero: "2024007" },
  { id: "8", nome: "Hugo Miguel Ferreira", numero: "2024008" },
];

// Mock grades data for students
const mockGradesData: Record<string, { disciplina: string; nota1T: number; nota2T: number; nota3T: number; media: number }[]> = {
  "1": [
    { disciplina: "Matemática", nota1T: 14, nota2T: 15, nota3T: 16, media: 15 },
    { disciplina: "Português", nota1T: 16, nota2T: 17, nota3T: 15, media: 16 },
    { disciplina: "Física", nota1T: 13, nota2T: 14, nota3T: 15, media: 14 },
    { disciplina: "Química", nota1T: 15, nota2T: 14, nota3T: 16, media: 15 },
    { disciplina: "Biologia", nota1T: 17, nota2T: 16, nota3T: 18, media: 17 },
    { disciplina: "História", nota1T: 14, nota2T: 15, nota3T: 14, media: 14 },
    { disciplina: "Geografia", nota1T: 15, nota2T: 16, nota3T: 15, media: 15 },
    { disciplina: "Inglês", nota1T: 18, nota2T: 17, nota3T: 19, media: 18 },
  ],
  "2": [
    { disciplina: "Matemática", nota1T: 12, nota2T: 13, nota3T: 14, media: 13 },
    { disciplina: "Português", nota1T: 14, nota2T: 15, nota3T: 14, media: 14 },
    { disciplina: "Física", nota1T: 11, nota2T: 12, nota3T: 13, media: 12 },
    { disciplina: "Química", nota1T: 13, nota2T: 12, nota3T: 14, media: 13 },
    { disciplina: "Biologia", nota1T: 15, nota2T: 14, nota3T: 16, media: 15 },
    { disciplina: "História", nota1T: 12, nota2T: 13, nota3T: 12, media: 12 },
    { disciplina: "Geografia", nota1T: 13, nota2T: 14, nota3T: 13, media: 13 },
    { disciplina: "Inglês", nota1T: 16, nota2T: 15, nota3T: 17, media: 16 },
  ],
};

// Generate similar data for other students
for (let i = 3; i <= 8; i++) {
  mockGradesData[i.toString()] = [
    { disciplina: "Matemática", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Português", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Física", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Química", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Biologia", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "História", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Geografia", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
    { disciplina: "Inglês", nota1T: Math.floor(Math.random() * 8) + 10, nota2T: Math.floor(Math.random() * 8) + 10, nota3T: Math.floor(Math.random() * 8) + 10, media: Math.floor(Math.random() * 8) + 10 },
  ];
}

export function GerarBoletinsModal({ open, onOpenChange }: GerarBoletinsModalProps) {
  const { toast } = useToast();
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setEstudantesSelecionados(estudantesMock.map(e => e.id));
    } else {
      setEstudantesSelecionados([]);
    }
  };

  const handleSelectEstudante = (id: string, checked: boolean) => {
    if (checked) {
      setEstudantesSelecionados([...estudantesSelecionados, id]);
    } else {
      setEstudantesSelecionados(estudantesSelecionados.filter(e => e !== id));
      setSelectAll(false);
    }
  };

  const generateBoletimPDF = (estudante: typeof estudantesMock[0], turma: typeof turmas[0], periodo: typeof periodos[0]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BOLETIM DE NOTAS", pageWidth / 2, 18, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema de Gestão Escolar", pageWidth / 2, 28, { align: "center" });
    doc.text(`Ano Lectivo ${periodo.ano}`, pageWidth / 2, 35, { align: "center" });
    
    // Student info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    let yPos = 55;
    
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO ESTUDANTE", 14, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${estudante.nome}`, 14, yPos);
    yPos += 6;
    doc.text(`Nº de Matrícula: ${estudante.numero}`, 14, yPos);
    yPos += 6;
    doc.text(`Turma: ${turma.nome}`, 14, yPos);
    yPos += 6;
    doc.text(`Nível: ${turma.nivel}`, 14, yPos);
    yPos += 6;
    doc.text(`Período: ${periodo.nome}`, 14, yPos);
    yPos += 15;
    
    // Grades table
    const grades = mockGradesData[estudante.id] || mockGradesData["1"];
    
    const tableData = grades.map(g => [
      g.disciplina,
      g.nota1T.toString(),
      g.nota2T.toString(),
      g.nota3T.toString(),
      g.media.toString(),
      g.media >= 10 ? "Aprovado" : "Reprovado"
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [["Disciplina", "1º Trim.", "2º Trim.", "3º Trim.", "Média", "Situação"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: "bold",
        halign: "center"
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center", fontStyle: "bold" },
        5: { halign: "center" }
      },
      didParseCell: (data) => {
        if (data.column.index === 5 && data.section === "body") {
          if (data.cell.text[0] === "Reprovado") {
            data.cell.styles.textColor = [220, 53, 69];
          } else {
            data.cell.styles.textColor = [40, 167, 69];
          }
        }
      }
    });
    
    // Calculate overall average
    const overallAverage = grades.reduce((sum, g) => sum + g.media, 0) / grades.length;
    
    // @ts-ignore - autoTable adds this property
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFont("helvetica", "bold");
    doc.text(`Média Geral: ${overallAverage.toFixed(1)}`, 14, finalY);
    doc.text(`Situação Final: ${overallAverage >= 10 ? "APROVADO" : "REPROVADO"}`, 14, finalY + 8);
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Documento gerado em: ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO")}`, 14, footerY);
    
    // Signature lines
    doc.setDrawColor(0, 0, 0);
    doc.line(14, footerY + 15, 80, footerY + 15);
    doc.line(130, footerY + 15, 196, footerY + 15);
    
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Director Pedagógico", 47, footerY + 20, { align: "center" });
    doc.text("Encarregado de Educação", 163, footerY + 20, { align: "center" });
    
    return doc;
  };

  const handleGenerate = async (action: 'download' | 'print') => {
    if (!turmaSelecionada || !periodoSelecionado) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione a turma e o período",
        variant: "destructive",
      });
      return;
    }

    if (estudantesSelecionados.length === 0) {
      toast({
        title: "Selecione estudantes",
        description: "Selecione pelo menos um estudante para gerar boletins",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const turma = turmas.find(t => t.id === turmaSelecionada)!;
      const periodo = periodos.find(p => p.id === periodoSelecionado)!;
      const selectedStudents = estudantesMock.filter(e => estudantesSelecionados.includes(e.id));

      if (selectedStudents.length === 1) {
        // Single student - generate one PDF
        const doc = generateBoletimPDF(selectedStudents[0], turma, periodo);
        
        if (action === 'download') {
          doc.save(`Boletim_${selectedStudents[0].nome.replace(/\s/g, "_")}_${periodo.nome.replace(/\s/g, "_")}.pdf`);
        } else {
          // Print - open in new window
          const pdfBlob = doc.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const printWindow = window.open(pdfUrl, '_blank');
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          }
        }
      } else {
        // Multiple students - generate combined PDF
        const doc = new jsPDF();
        
        selectedStudents.forEach((estudante, index) => {
          if (index > 0) {
            doc.addPage();
          }
          
          const pageWidth = doc.internal.pageSize.getWidth();
          
          // Header
          doc.setFillColor(46, 125, 50);
          doc.rect(0, 0, pageWidth, 40, "F");
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("BOLETIM DE NOTAS", pageWidth / 2, 18, { align: "center" });
          
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text("Sistema de Gestão Escolar", pageWidth / 2, 28, { align: "center" });
          doc.text(`Ano Lectivo ${periodo.ano}`, pageWidth / 2, 35, { align: "center" });
          
          // Student info
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(11);
          
          let yPos = 55;
          
          doc.setFont("helvetica", "bold");
          doc.text("DADOS DO ESTUDANTE", 14, yPos);
          yPos += 8;
          
          doc.setFont("helvetica", "normal");
          doc.text(`Nome: ${estudante.nome}`, 14, yPos);
          yPos += 6;
          doc.text(`Nº de Matrícula: ${estudante.numero}`, 14, yPos);
          yPos += 6;
          doc.text(`Turma: ${turma.nome}`, 14, yPos);
          yPos += 6;
          doc.text(`Nível: ${turma.nivel}`, 14, yPos);
          yPos += 6;
          doc.text(`Período: ${periodo.nome}`, 14, yPos);
          yPos += 15;
          
          // Grades table
          const grades = mockGradesData[estudante.id] || mockGradesData["1"];
          
          const tableData = grades.map(g => [
            g.disciplina,
            g.nota1T.toString(),
            g.nota2T.toString(),
            g.nota3T.toString(),
            g.media.toString(),
            g.media >= 10 ? "Aprovado" : "Reprovado"
          ]);
          
          autoTable(doc, {
            startY: yPos,
            head: [["Disciplina", "1º Trim.", "2º Trim.", "3º Trim.", "Média", "Situação"]],
            body: tableData,
            theme: "grid",
            headStyles: {
              fillColor: [46, 125, 50],
              textColor: 255,
              fontStyle: "bold",
              halign: "center"
            },
            columnStyles: {
              0: { halign: "left" },
              1: { halign: "center" },
              2: { halign: "center" },
              3: { halign: "center" },
              4: { halign: "center", fontStyle: "bold" },
              5: { halign: "center" }
            },
            didParseCell: (data) => {
              if (data.column.index === 5 && data.section === "body") {
                if (data.cell.text[0] === "Reprovado") {
                  data.cell.styles.textColor = [220, 53, 69];
                } else {
                  data.cell.styles.textColor = [40, 167, 69];
                }
              }
            }
          });
          
          // Calculate overall average
          const overallAverage = grades.reduce((sum, g) => sum + g.media, 0) / grades.length;
          
          // @ts-ignore - autoTable adds this property
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          
          doc.setFont("helvetica", "bold");
          doc.text(`Média Geral: ${overallAverage.toFixed(1)}`, 14, finalY);
          doc.text(`Situação Final: ${overallAverage >= 10 ? "APROVADO" : "REPROVADO"}`, 14, finalY + 8);
          
          // Footer
          const footerY = doc.internal.pageSize.getHeight() - 30;
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`Documento gerado em: ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO")}`, 14, footerY);
          
          // Signature lines
          doc.setDrawColor(0, 0, 0);
          doc.line(14, footerY + 15, 80, footerY + 15);
          doc.line(130, footerY + 15, 196, footerY + 15);
          
          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);
          doc.text("Director Pedagógico", 47, footerY + 20, { align: "center" });
          doc.text("Encarregado de Educação", 163, footerY + 20, { align: "center" });
        });
        
        if (action === 'download') {
          doc.save(`Boletins_${turma.nome.replace(/\s/g, "_")}_${periodo.nome.replace(/\s/g, "_")}.pdf`);
        } else {
          // Print - open in new window
          const pdfBlob = doc.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const printWindow = window.open(pdfUrl, '_blank');
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          }
        }
      }

      toast({
        title: action === 'download' ? "PDF gerado com sucesso" : "Documento enviado para impressão",
        description: `${estudantesSelecionados.length} boletim(ns) da ${turma.nome} - ${periodo.nome}`,
      });

      onOpenChange(false);
      
      // Reset state
      setTurmaSelecionada("");
      setPeriodoSelecionado("");
      setEstudantesSelecionados([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Erro ao gerar boletins:", error);
      toast({
        title: "Erro ao gerar boletins",
        description: "Ocorreu um erro ao gerar os boletins. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Boletins de Notas
          </DialogTitle>
          <DialogDescription>
            Selecione a turma, período e os estudantes para gerar os boletins
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Turma Selection */}
          <div className="space-y-2">
            <Label htmlFor="turma">Turma *</Label>
            <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
              <SelectTrigger id="turma">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome} - {turma.nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período Selection */}
          <div className="space-y-2">
            <Label htmlFor="periodo">Período *</Label>
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger id="periodo">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((periodo) => (
                  <SelectItem key={periodo.id} value={periodo.id}>
                    {periodo.nome} ({periodo.ano})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estudantes Selection */}
          {turmaSelecionada && periodoSelecionado && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Estudantes
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Selecionar todos
                  </label>
                </div>
              </div>
              
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-3">
                  {estudantesMock.map((estudante) => (
                    <div
                      key={estudante.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`estudante-${estudante.id}`}
                        checked={estudantesSelecionados.includes(estudante.id)}
                        onCheckedChange={(checked) =>
                          handleSelectEstudante(estudante.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`estudante-${estudante.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        <span className="font-medium">{estudante.nome}</span>
                        <span className="text-muted-foreground ml-2">
                          Nº {estudante.numero}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <p className="text-xs text-muted-foreground">
                {estudantesSelecionados.length} de {estudantesMock.length} estudante(s) selecionado(s)
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGenerate('print')}
            disabled={isGenerating || !turmaSelecionada || !periodoSelecionado || estudantesSelecionados.length === 0}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            Imprimir
          </Button>
          <Button
            onClick={() => handleGenerate('download')}
            disabled={isGenerating || !turmaSelecionada || !periodoSelecionado || estudantesSelecionados.length === 0}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Gerar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
