import { useState, useMemo, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Download, Printer, Users, Loader2, Eye, ChevronLeft, ChevronRight, 
  Settings, Upload, X, Palette, RotateCcw, Save, Plus, Trash2, CheckCircle, MessageSquare, Edit3
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useBoletimSettings, colorPresets } from "@/hooks/useBoletimSettings";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Selection state
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"selecao" | "observacoes" | "personalizacao" | "preview">("selecao");
  const [previewIndex, setPreviewIndex] = useState(0);
  
  // Observations state per student
  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [observacoesExpanded, setObservacoesExpanded] = useState(false);
  
  // Use the custom hook for settings
  const {
    settings,
    logoUrl,
    isDirty,
    updateSettings,
    saveSettings,
    resetSettings,
    handleColorSelect,
    handleCustomColorChange,
    handleLogoUpload,
    handleRemoveLogo,
    updateSignature,
    addSignature,
    removeSignature,
  } = useBoletimSettings();

  // Get selected students data for preview
  const selectedStudentsData = useMemo(() => {
    return estudantesMock.filter(e => estudantesSelecionados.includes(e.id));
  }, [estudantesSelecionados]);

  const currentPreviewStudent = selectedStudentsData[previewIndex];
  const currentTurma = turmas.find(t => t.id === turmaSelecionada);
  const currentPeriodo = periodos.find(p => p.id === periodoSelecionado);

  const canShowPreview = turmaSelecionada && periodoSelecionado && estudantesSelecionados.length > 0;

  const handleLogoUploadEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await handleLogoUpload(file);
    if (!success) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ficheiro muito grande",
          description: "O logotipo deve ter no máximo 2MB",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione uma imagem (PNG, JPG, SVG)",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveSettings = () => {
    const success = saveSettings();
    if (success) {
      toast({
        title: "Configurações guardadas",
        description: "As personalizações do boletim foram guardadas com sucesso",
      });
    } else {
      toast({
        title: "Erro ao guardar",
        description: "Não foi possível guardar as configurações",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Configurações repostas",
      description: "As personalizações foram repostas para os valores predefinidos",
    });
  };

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
      // Clear observation when student is deselected
      setObservacoes(prev => {
        const newObs = { ...prev };
        delete newObs[id];
        return newObs;
      });
    }
  };

  const generateBoletimPDF = (estudante: typeof estudantesMock[0], turma: typeof turmas[0], periodo: typeof periodos[0]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header with custom color
    doc.setFillColor(settings.headerColorRgb[0], settings.headerColorRgb[1], settings.headerColorRgb[2]);
    doc.rect(0, 0, pageWidth, 45, "F");
    
    // Add logo if available
    let textStartY = 15;
    if (settings.logoBase64) {
      try {
        doc.addImage(settings.logoBase64, 'PNG', 14, 8, 25, 25);
        textStartY = 15;
      } catch (error) {
        console.log("Logo could not be added to PDF");
      }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BOLETIM DE NOTAS", pageWidth / 2, textStartY, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(settings.schoolName, pageWidth / 2, textStartY + 10, { align: "center" });
    doc.text(`Ano Lectivo ${periodo.ano}`, pageWidth / 2, textStartY + 17, { align: "center" });
    
    // Student info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    let yPos = 60;
    
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
        fillColor: [settings.headerColorRgb[0], settings.headerColorRgb[1], settings.headerColorRgb[2]],
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
    
    // Student observation
    const studentObservation = observacoes[estudante.id];
    let observationEndY = finalY + 8;
    if (studentObservation && studentObservation.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Observações:", 14, finalY + 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitObservation = doc.splitTextToSize(studentObservation.trim(), pageWidth - 28);
      doc.text(splitObservation, 14, finalY + 27);
      observationEndY = finalY + 27 + (splitObservation.length * 4);
    }
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 50;
    
    // Generation date
    if (settings.showGenerationDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Documento gerado em: ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO")}`, 14, footerY);
    }
    
    // Custom footer text
    if (settings.footerText) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(settings.footerText, pageWidth / 2, footerY + 8, { align: "center", maxWidth: pageWidth - 28 });
    }
    
    // Signature lines - dynamically positioned based on enabled signatures
    const enabledSignatures = settings.signatures.filter(s => s.enabled);
    if (enabledSignatures.length > 0) {
      const signatureY = footerY + 20;
      const signatureWidth = 60;
      const totalWidth = enabledSignatures.length * signatureWidth + (enabledSignatures.length - 1) * 20;
      let startX = (pageWidth - totalWidth) / 2;
      
      doc.setDrawColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      
      enabledSignatures.forEach((sig, index) => {
        const centerX = startX + signatureWidth / 2;
        doc.line(startX, signatureY, startX + signatureWidth, signatureY);
        doc.setFont("helvetica", "bold");
        doc.text(sig.label, centerX, signatureY + 5, { align: "center" });
        if (sig.name) {
          doc.setFont("helvetica", "normal");
          doc.text(sig.name, centerX, signatureY + 10, { align: "center" });
        }
        startX += signatureWidth + 20;
      });
    }
    
    return doc;
  };

  // Helper function to generate boletim page content (for multi-page PDF)
  const generateBoletimPage = (doc: jsPDF, estudante: typeof estudantesMock[0], turma: typeof turmas[0], periodo: typeof periodos[0]) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header with custom color
    doc.setFillColor(settings.headerColorRgb[0], settings.headerColorRgb[1], settings.headerColorRgb[2]);
    doc.rect(0, 0, pageWidth, 45, "F");
    
    // Add logo if available
    let textStartY = 15;
    if (settings.logoBase64) {
      try {
        doc.addImage(settings.logoBase64, 'PNG', 14, 8, 25, 25);
      } catch (error) {
        console.log("Logo could not be added to PDF");
      }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BOLETIM DE NOTAS", pageWidth / 2, textStartY, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(settings.schoolName, pageWidth / 2, textStartY + 10, { align: "center" });
    doc.text(`Ano Lectivo ${periodo.ano}`, pageWidth / 2, textStartY + 17, { align: "center" });
    
    // Student info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    let yPos = 60;
    
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
        fillColor: [settings.headerColorRgb[0], settings.headerColorRgb[1], settings.headerColorRgb[2]],
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
    
    // Student observation
    const studentObservation = observacoes[estudante.id];
    if (studentObservation && studentObservation.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Observações:", 14, finalY + 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitObservation = doc.splitTextToSize(studentObservation.trim(), pageWidth - 28);
      doc.text(splitObservation, 14, finalY + 27);
    }
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 50;
    
    // Generation date
    if (settings.showGenerationDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Documento gerado em: ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO")}`, 14, footerY);
    }
    
    // Custom footer text
    if (settings.footerText) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(settings.footerText, pageWidth / 2, footerY + 8, { align: "center", maxWidth: pageWidth - 28 });
    }
    
    // Signature lines - dynamically positioned based on enabled signatures
    const enabledSignatures = settings.signatures.filter(s => s.enabled);
    if (enabledSignatures.length > 0) {
      const signatureY = footerY + 20;
      const signatureWidth = 60;
      const totalWidth = enabledSignatures.length * signatureWidth + (enabledSignatures.length - 1) * 20;
      let startX = (pageWidth - totalWidth) / 2;
      
      doc.setDrawColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      
      enabledSignatures.forEach((sig, index) => {
        const centerX = startX + signatureWidth / 2;
        doc.line(startX, signatureY, startX + signatureWidth, signatureY);
        doc.setFont("helvetica", "bold");
        doc.text(sig.label, centerX, signatureY + 5, { align: "center" });
        if (sig.name) {
          doc.setFont("helvetica", "normal");
          doc.text(sig.name, centerX, signatureY + 10, { align: "center" });
        }
        startX += signatureWidth + 20;
      });
    }
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
        // Multiple students - generate combined PDF using helper function
        const doc = new jsPDF();
        
        selectedStudents.forEach((estudante, index) => {
          if (index > 0) {
            doc.addPage();
          }
          generateBoletimPage(doc, estudante, turma, periodo);
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
      setObservacoes({});
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

  // Preview component for boletim
  const BoletimPreview = ({ estudante, turma, periodo }: { 
    estudante: typeof estudantesMock[0]; 
    turma: typeof turmas[0]; 
    periodo: typeof periodos[0] 
  }) => {
    const grades = mockGradesData[estudante.id] || mockGradesData["1"];
    const overallAverage = grades.reduce((sum, g) => sum + g.media, 0) / grades.length;
    const isApproved = overallAverage >= 10;
    const enabledSignatures = settings.signatures.filter(s => s.enabled);
    const studentObservation = observacoes[estudante.id];

    return (
      <Card className="border-2 border-primary/20 bg-card shadow-lg">
        <CardContent className="p-0">
          {/* Header with custom color and logo */}
          <div 
            className="p-4 rounded-t-lg flex items-center gap-4"
            style={{ backgroundColor: settings.headerColor }}
          >
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-12 w-12 object-contain rounded bg-white/20 p-1"
              />
            )}
            <div className="flex-1 text-center text-white">
              <h3 className="text-lg font-bold">BOLETIM DE NOTAS</h3>
              <p className="text-sm opacity-90">{settings.schoolName}</p>
              <p className="text-sm opacity-90">Ano Lectivo {periodo.ano}</p>
            </div>
            {logoUrl && <div className="w-12" />} {/* Spacer for centering */}
          </div>

          {/* Student Info */}
          <div className="p-4 border-b">
            <h4 className="font-bold text-sm mb-2 text-muted-foreground uppercase">Dados do Estudante</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Nome:</span> {estudante.nome}</p>
              <p><span className="font-medium">Nº Matrícula:</span> {estudante.numero}</p>
              <p><span className="font-medium">Turma:</span> {turma.nome}</p>
              <p><span className="font-medium">Nível:</span> {turma.nivel}</p>
              <p className="col-span-2"><span className="font-medium">Período:</span> {periodo.nome}</p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: settings.headerColor }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-white">Disciplina</th>
                    <th className="px-2 py-2 text-center font-medium text-white">1º Trim.</th>
                    <th className="px-2 py-2 text-center font-medium text-white">2º Trim.</th>
                    <th className="px-2 py-2 text-center font-medium text-white">3º Trim.</th>
                    <th className="px-2 py-2 text-center font-medium text-white">Média</th>
                    <th className="px-3 py-2 text-center font-medium text-white">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={grade.disciplina} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                      <td className="px-3 py-2 font-medium">{grade.disciplina}</td>
                      <td className="px-2 py-2 text-center">{grade.nota1T}</td>
                      <td className="px-2 py-2 text-center">{grade.nota2T}</td>
                      <td className="px-2 py-2 text-center">{grade.nota3T}</td>
                      <td className="px-2 py-2 text-center font-bold">{grade.media}</td>
                      <td className="px-3 py-2 text-center">
                        <Badge variant={grade.media >= 10 ? "default" : "destructive"} className="text-xs">
                          {grade.media >= 10 ? "Aprovado" : "Reprovado"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Média Geral: <span className="text-lg font-bold">{overallAverage.toFixed(1)}</span></p>
              </div>
              <Badge variant={isApproved ? "default" : "destructive"} className="text-sm px-4 py-1">
                {isApproved ? "APROVADO" : "REPROVADO"}
              </Badge>
            </div>
          </div>

          {/* Observation */}
          {studentObservation && studentObservation.trim() && (
            <div className="p-4 border-t">
              <h4 className="font-bold text-sm mb-2 text-muted-foreground uppercase flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Observações
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">{studentObservation}</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t text-xs text-muted-foreground">
            {settings.showGenerationDate && (
              <p>Documento gerado em: {new Date().toLocaleDateString("pt-AO")} às {new Date().toLocaleTimeString("pt-AO")}</p>
            )}
            {settings.footerText && (
              <p className="mt-2 italic text-center">{settings.footerText}</p>
            )}
            {enabledSignatures.length > 0 && (
              <div className="flex justify-around mt-6 pt-4">
                {enabledSignatures.map((sig, index) => (
                  <div key={index} className="text-center flex-1">
                    <div className="border-t border-foreground/30 w-24 mx-auto mb-1"></div>
                    <p className="font-medium">{sig.label}</p>
                    {sig.name && <p className="text-xs">{sig.name}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Boletins de Notas
          </DialogTitle>
          <DialogDescription>
            Selecione a turma, período e os estudantes para gerar os boletins
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "selecao" | "observacoes" | "personalizacao" | "preview")} className="mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="selecao">
              <Users className="h-4 w-4 mr-2" />
              Seleção
            </TabsTrigger>
            <TabsTrigger value="observacoes" disabled={estudantesSelecionados.length === 0}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Observações
              {Object.keys(observacoes).filter(k => observacoes[k]?.trim()).length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                  {Object.keys(observacoes).filter(k => observacoes[k]?.trim()).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="personalizacao">
              <Settings className="h-4 w-4 mr-2" />
              Personalização
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!canShowPreview}>
              <Eye className="h-4 w-4 mr-2" />
              Pré-visualização
            </TabsTrigger>
          </TabsList>

          {/* Observações Tab */}
          <TabsContent value="observacoes" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Observações Personalizadas por Estudante
                </Label>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(observacoes).filter(k => observacoes[k]?.trim()).length} de {estudantesSelecionados.length} com observações
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Adicione observações individuais que aparecerão no boletim de cada estudante.
              </p>
            </div>
            
            <ScrollArea className="h-[350px] pr-2">
              <div className="space-y-3">
                {selectedStudentsData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Selecione estudantes na aba "Seleção" para adicionar observações.</p>
                  </div>
                ) : (
                  selectedStudentsData.map((estudante) => (
                    <div key={estudante.id} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {estudante.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{estudante.nome}</p>
                          <p className="text-xs text-muted-foreground">Nº {estudante.numero}</p>
                        </div>
                        {observacoes[estudante.id]?.trim() && (
                          <Badge variant="secondary" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Obs.
                          </Badge>
                        )}
                      </div>
                      <Textarea
                        placeholder="Ex: Excelente desempenho em Matemática. Precisa melhorar a participação nas aulas de Português."
                        value={observacoes[estudante.id] || ""}
                        onChange={(e) => setObservacoes(prev => ({
                          ...prev,
                          [estudante.id]: e.target.value
                        }))}
                        className="h-20 resize-none text-sm"
                        maxLength={500}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {(observacoes[estudante.id] || "").length}/500 caracteres
                        </p>
                        {observacoes[estudante.id]?.trim() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-destructive hover:text-destructive"
                            onClick={() => setObservacoes(prev => {
                              const newObs = { ...prev };
                              delete newObs[estudante.id];
                              return newObs;
                            })}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Limpar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Personalização Tab */}
          <TabsContent value="personalizacao" className="space-y-4 mt-4">
            <ScrollArea className="h-[420px] pr-4">
              {/* School Name */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="schoolName">Nome da Instituição</Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={(e) => updateSettings({ schoolName: e.target.value })}
                  placeholder="Nome da escola"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-2 mb-4">
                <Label>Logotipo</Label>
                <div className="flex items-start gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUploadEvent}
                  />
                  {logoUrl ? (
                    <div className="relative">
                      <img 
                        src={logoUrl} 
                        alt="Logo preview" 
                        className="h-20 w-20 object-contain rounded-lg border bg-muted p-2"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-20 w-20 flex flex-col items-center justify-center gap-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Carregar</span>
                    </Button>
                  )}
                  <div className="text-xs text-muted-foreground">
                    <p>Formatos: PNG, JPG, SVG</p>
                    <p>Tamanho máx: 2MB</p>
                  </div>
                </div>
              </div>

              {/* Header Color */}
              <div className="space-y-3 mb-6">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Cor do Cabeçalho
                </Label>
                
                {/* Color Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleColorSelect(preset)}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        settings.headerColor === preset.value 
                          ? "border-foreground ring-2 ring-offset-2 ring-primary" 
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="customColor" className="text-sm text-muted-foreground">Cor personalizada:</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="customColor"
                      type="color"
                      value={settings.headerColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={settings.headerColor.toUpperCase()}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-24 font-mono text-sm"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Signatures Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Campos de Assinatura
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSignature}
                    disabled={settings.signatures.length >= 4}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {settings.signatures.map((sig, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                      <Switch
                        checked={sig.enabled}
                        onCheckedChange={(checked) => updateSignature(index, { enabled: checked })}
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Título (ex: Director Pedagógico)"
                          value={sig.label}
                          onChange={(e) => updateSignature(index, { label: e.target.value })}
                          className="h-8"
                        />
                        <Input
                          placeholder="Nome (opcional)"
                          value={sig.name}
                          onChange={(e) => updateSignature(index, { name: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      {settings.signatures.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeSignature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Footer Section */}
              <div className="space-y-3 mb-4">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Rodapé
                </Label>
                
                <div className="flex items-center gap-2 mb-3">
                  <Switch
                    id="showDate"
                    checked={settings.showGenerationDate}
                    onCheckedChange={(checked) => updateSettings({ showGenerationDate: checked })}
                  />
                  <Label htmlFor="showDate" className="text-sm font-normal cursor-pointer">
                    Mostrar data de geração do documento
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText" className="text-sm text-muted-foreground">Texto personalizado do rodapé</Label>
                  <Textarea
                    id="footerText"
                    placeholder="Ex: Este documento não tem validade sem o selo da instituição."
                    value={settings.footerText}
                    onChange={(e) => updateSettings({ footerText: e.target.value })}
                    className="h-20 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleResetSettings}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Repor Predefinições
                </Button>
                <Button size="sm" onClick={handleSaveSettings} disabled={!isDirty}>
                  {isDirty ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Configurações
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Configurações Guardadas
                    </>
                  )}
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="selecao" className="space-y-4 mt-4">
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

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {estudantesSelecionados.length} de {estudantesMock.length} estudante(s) selecionado(s)
                  </p>
                  {canShowPreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewIndex(0);
                        setActiveTab("preview");
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Pré-visualizar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {canShowPreview && currentPreviewStudent && currentTurma && currentPeriodo ? (
              <div className="space-y-4">
                {/* Navigation for multiple students */}
                {selectedStudentsData.length > 1 && (
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                      disabled={previewIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <span className="text-sm font-medium">
                      {previewIndex + 1} de {selectedStudentsData.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewIndex(Math.min(selectedStudentsData.length - 1, previewIndex + 1))}
                      disabled={previewIndex === selectedStudentsData.length - 1}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                <ScrollArea className="h-[400px]">
                  <BoletimPreview
                    estudante={currentPreviewStudent}
                    turma={currentTurma}
                    periodo={currentPeriodo}
                  />
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Selecione a turma, período e pelo menos um estudante para pré-visualizar.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGenerate('print')}
            disabled={isGenerating || !canShowPreview}
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
            disabled={isGenerating || !canShowPreview}
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
