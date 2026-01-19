import { useState } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  ClipboardCheck,
  Award,
  Download,
  Eye,
  RefreshCw,
  PauseCircle,
  Send,
  BookOpen,
  GraduationCap,
  Receipt,
  AlertCircle,
  CheckCircle,
  MapPin,
  Video,
  ExternalLink,
  Play,
  FileVideo,
  File,
  Image,
  FileAudio,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";

// Student enrollment data
const studentData = {
  name: "Maria Costa",
  studentId: "EST-2024-1234",
  class: "10ª Classe - Turma A",
  course: "Ciências Físicas e Biológicas",
  enrollmentStatus: "active",
  enrollmentDate: "15 Fev 2024",
  academicYear: "2025/2026",
};

// Class schedule
const weeklySchedule = [
  { day: "Segunda", classes: [
    { time: "08:00 - 09:30", subject: "Matemática", room: "Sala 101", teacher: "Prof. João Santos" },
    { time: "09:45 - 11:15", subject: "Português", room: "Sala 205", teacher: "Prof. Maria Silva" },
    { time: "11:30 - 13:00", subject: "Física", room: "Lab. Física", teacher: "Prof. Carlos Neto" },
  ]},
  { day: "Terça", classes: [
    { time: "08:00 - 09:30", subject: "Química", room: "Lab. Química", teacher: "Prof. Ana Costa" },
    { time: "09:45 - 11:15", subject: "Biologia", room: "Sala 108", teacher: "Prof. Pedro Lima" },
    { time: "11:30 - 13:00", subject: "Inglês", room: "Sala 202", teacher: "Prof. Rita Fernandes" },
  ]},
  { day: "Quarta", classes: [
    { time: "08:00 - 09:30", subject: "Matemática", room: "Sala 101", teacher: "Prof. João Santos" },
    { time: "09:45 - 11:15", subject: "História", room: "Sala 305", teacher: "Prof. Manuel Costa" },
    { time: "11:30 - 13:00", subject: "Geografia", room: "Sala 306", teacher: "Prof. Luísa Oliveira" },
  ]},
  { day: "Quinta", classes: [
    { time: "08:00 - 09:30", subject: "Física", room: "Lab. Física", teacher: "Prof. Carlos Neto" },
    { time: "09:45 - 11:15", subject: "Português", room: "Sala 205", teacher: "Prof. Maria Silva" },
    { time: "14:00 - 15:30", subject: "Educação Física", room: "Ginásio", teacher: "Prof. André Sousa" },
  ]},
  { day: "Sexta", classes: [
    { time: "08:00 - 09:30", subject: "Química", room: "Lab. Química", teacher: "Prof. Ana Costa" },
    { time: "09:45 - 11:15", subject: "Matemática", room: "Sala 101", teacher: "Prof. João Santos" },
    { time: "11:30 - 13:00", subject: "Biologia", room: "Sala 108", teacher: "Prof. Pedro Lima" },
  ]},
];

// Payment methods available
const paymentMethods = {
  mobile: { label: "Pagamento Móvel (Multicaixa Express)", icon: "📱" },
  transferencia: { label: "Transferência Bancária", icon: "🏦" },
  deposito: { label: "Depósito Bancário", icon: "💵" },
  referencia: { label: "Referência Multicaixa", icon: "🔢" },
  pos: { label: "Terminal POS", icon: "💳" },
  numerario: { label: "Numerário", icon: "💰" },
};

// Payments data
const payments = [
  { id: 1, month: "Janeiro 2026", amount: "35.000 Kz", status: "paid", date: "05 Jan 2026", receipt: "REC-2026-001", method: "deposito" as keyof typeof paymentMethods },
  { id: 2, month: "Fevereiro 2026", amount: "35.000 Kz", status: "pending", dueDate: "05 Fev 2026", receipt: null, method: null },
  { id: 3, month: "Dezembro 2025", amount: "35.000 Kz", status: "paid", date: "03 Dez 2025", receipt: "REC-2025-012", method: "transferencia" as keyof typeof paymentMethods },
  { id: 4, month: "Novembro 2025", amount: "35.000 Kz", status: "paid", date: "04 Nov 2025", receipt: "REC-2025-011", method: "mobile" as keyof typeof paymentMethods },
  { id: 5, month: "Outubro 2025", amount: "35.000 Kz", status: "paid", date: "02 Out 2025", receipt: "REC-2025-010", method: "referencia" as keyof typeof paymentMethods },
];

// Scheduled exams
const scheduledExams = [
  { id: 1, subject: "Matemática", type: "Exame Trimestral", date: "25 Jan 2026", time: "08:00", room: "Sala 101", status: "upcoming" },
  { id: 2, subject: "Física", type: "Mini-Teste", date: "28 Jan 2026", time: "10:00", room: "Lab. Física", status: "upcoming" },
  { id: 3, subject: "Português", type: "Exame Trimestral", date: "30 Jan 2026", time: "08:00", room: "Sala 205", status: "upcoming" },
  { id: 4, subject: "Química", type: "Trabalho Prático", date: "01 Fev 2026", time: "14:00", room: "Lab. Química", status: "upcoming" },
];

// Exam grades
const examGrades = [
  { id: 1, subject: "Matemática", type: "1º Trimestre", grade: 16, maxGrade: 20, date: "15 Dez 2025", status: "passed" },
  { id: 2, subject: "Português", type: "1º Trimestre", grade: 14, maxGrade: 20, date: "12 Dez 2025", status: "passed" },
  { id: 3, subject: "Física", type: "1º Trimestre", grade: 15, maxGrade: 20, date: "10 Dez 2025", status: "passed" },
  { id: 4, subject: "Química", type: "1º Trimestre", grade: 13, maxGrade: 20, date: "08 Dez 2025", status: "passed" },
  { id: 5, subject: "Biologia", type: "1º Trimestre", grade: 17, maxGrade: 20, date: "05 Dez 2025", status: "passed" },
  { id: 6, subject: "História", type: "1º Trimestre", grade: 12, maxGrade: 20, date: "03 Dez 2025", status: "passed" },
  { id: 7, subject: "Inglês", type: "Mini-Teste 3", grade: 18, maxGrade: 20, date: "20 Nov 2025", status: "passed" },
];

// Online classes available for student
type MaterialType = "pdf" | "video" | "audio" | "image" | "other";

interface OnlineMaterial {
  id: string;
  name: string;
  type: MaterialType;
  size: string;
}

interface OnlineClass {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  platform: "google-meet" | "zoom" | "teams" | "custom";
  date: string;
  time: string;
  duration: number;
  link: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  materials: OnlineMaterial[];
}

const onlineClasses: OnlineClass[] = [
  { 
    id: "1", 
    title: "Revisão de Trigonometria", 
    subject: "Matemática", 
    teacher: "Prof. João Santos",
    platform: "google-meet",
    date: "2026-01-20", 
    time: "10:00", 
    duration: 60,
    link: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    materials: [
      { id: "m1", name: "Exercícios de Trigonometria.pdf", type: "pdf", size: "2.3 MB" },
      { id: "m2", name: "Vídeo Explicativo.mp4", type: "video", size: "45 MB" },
    ]
  },
  { 
    id: "2", 
    title: "Aula Prática de Física", 
    subject: "Física", 
    teacher: "Prof. Carlos Neto",
    platform: "zoom",
    date: "2026-01-21", 
    time: "14:00", 
    duration: 90,
    link: "https://zoom.us/j/123456789",
    status: "scheduled",
    materials: [
      { id: "m3", name: "Guia de Laboratório.pdf", type: "pdf", size: "1.5 MB" },
    ]
  },
  { 
    id: "3", 
    title: "Análise Literária - Os Lusíadas", 
    subject: "Português", 
    teacher: "Prof. Maria Silva",
    platform: "teams",
    date: "2026-01-19", 
    time: "09:00", 
    duration: 60,
    link: "https://teams.microsoft.com/meet/123",
    status: "completed",
    materials: [
      { id: "m4", name: "Apresentação Os Lusíadas.pdf", type: "pdf", size: "5.2 MB" },
      { id: "m5", name: "Áudio do Poema.mp3", type: "audio", size: "8 MB" },
    ]
  },
  { 
    id: "4", 
    title: "Reacções Químicas - Parte 2", 
    subject: "Química", 
    teacher: "Prof. Ana Costa",
    platform: "google-meet",
    date: "2026-01-22", 
    time: "11:00", 
    duration: 60,
    link: "https://meet.google.com/xyz-uvwx-rst",
    status: "scheduled",
    materials: []
  },
];

const platformConfig = {
  "google-meet": { name: "Google Meet", icon: "🎥", color: "bg-green-500" },
  "zoom": { name: "Zoom", icon: "📹", color: "bg-blue-500" },
  "teams": { name: "Teams", icon: "💼", color: "bg-purple-500" },
  "custom": { name: "Link", icon: "🔗", color: "bg-gray-500" },
};

// Document types available
const documentTypes = [
  { id: "declaracao_matricula", name: "Declaração de Matrícula", price: "2.500 Kz", time: "24 horas" },
  { id: "declaracao_frequencia", name: "Declaração de Frequência", price: "2.500 Kz", time: "24 horas" },
  { id: "certificado_habilitacoes", name: "Certificado de Habilitações", price: "5.000 Kz", time: "5 dias úteis" },
  { id: "historico_escolar", name: "Histórico Escolar", price: "3.500 Kz", time: "3 dias úteis" },
  { id: "boletim_notas", name: "Boletim de Notas", price: "1.500 Kz", time: "24 horas" },
];

const PortalEstudante = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState("Segunda");
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const handleDownloadReceipt = (receiptId: string) => {
    const payment = payments.find(p => p.receipt === receiptId);
    if (!payment) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SGE - Sistema de Gestão Escolar", pageWidth / 2, 18, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Recibo de Pagamento", pageWidth / 2, 30, { align: "center" });
    
    // Receipt number and date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Recibo Nº: ${receiptId}`, 20, 55);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString("pt-AO")}`, pageWidth - 20, 55, { align: "right" });
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 62, pageWidth - 20, 62);
    
    // Student info section
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO ESTUDANTE", 20, 75);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nome: ${studentData.name}`, 20, 85);
    doc.text(`Nº Estudante: ${studentData.studentId}`, 20, 93);
    doc.text(`Turma: ${studentData.class}`, 20, 101);
    doc.text(`Curso: ${studentData.course}`, 20, 109);
    doc.text(`Ano Lectivo: ${studentData.academicYear}`, 20, 117);
    
    // Payment details section
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DETALHES DO PAGAMENTO", 20, 135);
    
    // Payment table
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 142, pageWidth - 40, 12, "FD");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Descrição", 25, 150);
    doc.text("Mês Referência", 90, 150);
    doc.text("Valor", pageWidth - 25, 150, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    doc.rect(20, 154, pageWidth - 40, 12, "D");
    doc.text("Propina Mensal", 25, 162);
    doc.text(payment.month, 90, 162);
    doc.text(payment.amount, pageWidth - 25, 162, { align: "right" });
    
    // Total
    doc.setFillColor(34, 139, 34);
    doc.rect(20, 166, pageWidth - 40, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL PAGO:", 25, 175);
    doc.text(payment.amount, pageWidth - 25, 175, { align: "right" });
    
    // Payment confirmation
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data do Pagamento: ${payment.date}`, 20, 195);
    doc.text("Estado: PAGO", 20, 203);
    const methodLabel = payment.method ? paymentMethods[payment.method]?.label : "Não especificado";
    doc.text(`Método: ${methodLabel}`, 20, 211);
    
    // Footer note
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Este documento é válido como comprovativo de pagamento.", pageWidth / 2, 235, { align: "center" });
    doc.text("Conserve este recibo para efeitos de comprovação.", pageWidth / 2, 243, { align: "center" });
    
    // Signature area
    doc.setDrawColor(0, 0, 0);
    doc.line(pageWidth / 2 - 40, 270, pageWidth / 2 + 40, 270);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Assinatura e Carimbo", pageWidth / 2, 278, { align: "center" });
    
    // Save PDF
    doc.save(`Recibo_${receiptId}_${studentData.name.replace(/\s+/g, "_")}.pdf`);
    
    toast({
      title: "Recibo descarregado",
      description: `Recibo ${receiptId} foi descarregado com sucesso`,
    });
  };

  const handleRequestDocument = () => {
    if (!selectedDocument) {
      toast({
        title: "Seleccione um documento",
        description: "Por favor seleccione o tipo de documento a solicitar",
        variant: "destructive",
      });
      return;
    }
    
    const doc = documentTypes.find(d => d.id === selectedDocument);
    toast({
      title: "Documento solicitado",
      description: `${doc?.name} será preparado em ${doc?.time}. Valor: ${doc?.price}`,
    });
    setIsDocumentModalOpen(false);
    setSelectedDocument("");
  };

  const handleSuspendEnrollment = () => {
    if (!suspendReason) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor indique o motivo da suspensão",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Pedido de suspensão enviado",
      description: "O seu pedido será analisado pela secretaria em até 48 horas",
    });
    setIsSuspendModalOpen(false);
    setSuspendReason("");
  };

  const handleUpdateEnrollment = () => {
    toast({
      title: "Actualização solicitada",
      description: "Será contactado pela secretaria para actualizar os seus dados",
    });
    setIsUpdateModalOpen(false);
  };

  const averageGrade = examGrades.reduce((acc, g) => acc + g.grade, 0) / examGrades.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Portal do Estudante
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name || studentData.name}! Aqui pode consultar todas as suas informações académicas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUpdateModalOpen(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Matrícula
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsSuspendModalOpen(true)}>
              <PauseCircle className="h-4 w-4 mr-2" />
              Suspender Matrícula
            </Button>
            <Button size="sm" onClick={() => setIsDocumentModalOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Solicitar Documento
            </Button>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{studentData.name}</h2>
                  <Badge variant="default" className="bg-primary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nº Estudante</p>
                    <p className="font-medium">{studentData.studentId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turma</p>
                    <p className="font-medium">{studentData.class}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Curso</p>
                    <p className="font-medium">{studentData.course}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ano Lectivo</p>
                    <p className="font-medium">{studentData.academicYear}</p>
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-3xl font-bold text-primary">{averageGrade.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Média Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Horário</span>
            </TabsTrigger>
            <TabsTrigger value="elearning" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">E-Learning</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Exames</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Horário Semanal - {studentData.class}
                </CardTitle>
                <CardDescription>
                  O seu horário de aulas para a semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Day selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {weeklySchedule.map((day) => (
                    <Button
                      key={day.day}
                      variant={selectedDay === day.day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day.day)}
                    >
                      {day.day}
                    </Button>
                  ))}
                </div>

                {/* Classes for selected day */}
                <div className="space-y-3">
                  {weeklySchedule.find(d => d.day === selectedDay)?.classes.map((aula, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center min-w-[80px]">
                        <p className="text-sm font-medium">{aula.time.split(" - ")[0]}</p>
                        <p className="text-xs text-muted-foreground">{aula.time.split(" - ")[1]}</p>
                      </div>
                      <div className="h-12 w-1 bg-primary rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <p className="font-medium">{aula.subject}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {aula.room}
                          </span>
                          <span>{aula.teacher}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E-Learning Tab */}
          <TabsContent value="elearning">
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Aulas Online
                  </CardTitle>
                  <CardDescription>
                    Aceda às suas aulas online e materiais de apoio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onlineClasses.filter(c => c.status === "scheduled").length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Próximas Aulas
                        </h4>
                        {onlineClasses.filter(c => c.status === "scheduled").map((aula) => {
                          const platform = platformConfig[aula.platform];
                          return (
                            <div
                              key={aula.id}
                              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-lg ${platform.color} flex items-center justify-center text-white text-xl`}>
                                  {platform.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{aula.title}</p>
                                    <Badge variant="outline">{aula.subject}</Badge>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                      {platform.name}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(aula.date).toLocaleDateString("pt-AO")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {aula.time} ({aula.duration} min)
                                    </span>
                                    <span>{aula.teacher}</span>
                                  </div>
                                  
                                  {/* Materials */}
                                  {aula.materials.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {aula.materials.map((material) => (
                                        <Button
                                          key={material.id}
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs gap-1"
                                          onClick={() => {
                                            toast({
                                              title: "Download iniciado",
                                              description: `A descarregar ${material.name}`,
                                            });
                                          }}
                                        >
                                          {material.type === "pdf" && <FileText className="h-3 w-3" />}
                                          {material.type === "video" && <FileVideo className="h-3 w-3" />}
                                          {material.type === "audio" && <FileAudio className="h-3 w-3" />}
                                          {material.type === "image" && <Image className="h-3 w-3" />}
                                          {!["pdf", "video", "audio", "image"].includes(material.type) && <File className="h-3 w-3" />}
                                          {material.name}
                                          <Download className="h-3 w-3 ml-1" />
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => window.open(aula.link, "_blank")}
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Entrar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Completed Classes */}
                    {onlineClasses.filter(c => c.status === "completed").length > 0 && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Aulas Anteriores
                        </h4>
                        {onlineClasses.filter(c => c.status === "completed").map((aula) => {
                          const platform = platformConfig[aula.platform];
                          return (
                            <div
                              key={aula.id}
                              className="p-4 rounded-lg border bg-muted/20"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-lg`}>
                                  {platform.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium text-muted-foreground">{aula.title}</p>
                                    <Badge variant="outline" className="opacity-70">{aula.subject}</Badge>
                                    <Badge variant="secondary" className="opacity-70">Concluída</Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(aula.date).toLocaleDateString("pt-AO")}
                                    </span>
                                    <span>{aula.teacher}</span>
                                  </div>
                                  
                                  {/* Materials */}
                                  {aula.materials.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {aula.materials.map((material) => (
                                        <Button
                                          key={material.id}
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs gap-1"
                                          onClick={() => {
                                            toast({
                                              title: "Download iniciado",
                                              description: `A descarregar ${material.name}`,
                                            });
                                          }}
                                        >
                                          {material.type === "pdf" && <FileText className="h-3 w-3" />}
                                          {material.type === "video" && <FileVideo className="h-3 w-3" />}
                                          {material.type === "audio" && <FileAudio className="h-3 w-3" />}
                                          {material.type === "image" && <Image className="h-3 w-3" />}
                                          {!["pdf", "video", "audio", "image"].includes(material.type) && <File className="h-3 w-3" />}
                                          {material.name}
                                          <Download className="h-3 w-3 ml-1" />
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {onlineClasses.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma aula online disponível de momento</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* All Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Materiais de Apoio
                  </CardTitle>
                  <CardDescription>
                    Todos os materiais disponibilizados pelos professores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {onlineClasses.flatMap(c => c.materials.map(m => ({...m, subject: c.subject, teacher: c.teacher}))).map((material) => (
                      <div 
                        key={material.id} 
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          material.type === "pdf" ? "bg-red-100 text-red-600" :
                          material.type === "video" ? "bg-blue-100 text-blue-600" :
                          material.type === "audio" ? "bg-purple-100 text-purple-600" :
                          material.type === "image" ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {material.type === "pdf" && <FileText className="h-5 w-5" />}
                          {material.type === "video" && <FileVideo className="h-5 w-5" />}
                          {material.type === "audio" && <FileAudio className="h-5 w-5" />}
                          {material.type === "image" && <Image className="h-5 w-5" />}
                          {!["pdf", "video", "audio", "image"].includes(material.type) && <File className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{material.name}</p>
                          <p className="text-xs text-muted-foreground">{material.subject} • {material.size}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => {
                            toast({
                              title: "Download iniciado",
                              description: `A descarregar ${material.name}`,
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {onlineClasses.flatMap(c => c.materials).length === 0 && (
                      <div className="col-span-2 text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum material disponível de momento</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Propinas e Pagamentos
                </CardTitle>
                <CardDescription>
                  Histórico de pagamentos e recibos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        payment.status === "pending" 
                          ? "bg-accent/10 border-accent/30" 
                          : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          payment.status === "paid" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-accent/10 text-accent"
                        }`}>
                          {payment.status === "paid" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.month}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.status === "paid" 
                              ? `Pago em ${payment.date}` 
                              : `Vence em ${payment.dueDate}`
                            }
                          </p>
                          {payment.status === "paid" && payment.method && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <span>{paymentMethods[payment.method].icon}</span>
                              <span>{paymentMethods[payment.method].label}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{payment.amount}</p>
                          <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
                            {payment.status === "paid" ? "Pago" : "Pendente"}
                          </Badge>
                        </div>
                        {payment.receipt && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadReceipt(payment.receipt!)}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Summary */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {payments.filter(p => p.status === "paid").length}
                      </p>
                      <p className="text-xs text-muted-foreground">Meses Pagos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {payments.filter(p => p.status === "pending").length}
                      </p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {payments.filter(p => p.status === "paid").reduce((acc, p) => {
                          const value = parseInt(p.amount.replace(/\D/g, ""));
                          return acc + value;
                        }, 0).toLocaleString()} Kz
                      </p>
                      <p className="text-xs text-muted-foreground">Total Pago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Exames Marcados
                </CardTitle>
                <CardDescription>
                  Próximos exames e avaliações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-14 w-14 rounded-lg gradient-hero flex flex-col items-center justify-center text-primary-foreground">
                        <span className="text-xs">{exam.date.split(" ")[0]}</span>
                        <span className="text-lg font-bold">{exam.date.split(" ")[1]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{exam.subject}</p>
                          <Badge variant="outline">{exam.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exam.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exam.room}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-accent/10 text-accent border-accent/30">
                          Em breve
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {scheduledExams.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum exame marcado de momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Classificações
                </CardTitle>
                <CardDescription>
                  Notas dos exames e avaliações realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30"
                    >
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
                          grade.grade >= 14
                            ? "bg-primary"
                            : grade.grade >= 10
                            ? "bg-accent"
                            : "bg-destructive"
                        }`}
                      >
                        {grade.grade}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{grade.subject}</p>
                          <Badge variant="outline">{grade.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{grade.date}</p>
                      </div>
                      <div className="text-right">
                        <Progress 
                          value={(grade.grade / grade.maxGrade) * 100} 
                          className="w-24 h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {grade.grade}/{grade.maxGrade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade Summary */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{averageGrade.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {Math.max(...examGrades.map(g => g.grade))}
                    </p>
                    <p className="text-xs text-muted-foreground">Nota Mais Alta</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {Math.min(...examGrades.map(g => g.grade))}
                    </p>
                    <p className="text-xs text-muted-foreground">Nota Mais Baixa</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{examGrades.length}</p>
                    <p className="text-xs text-muted-foreground">Total Avaliações</p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Document Modal */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Documento</DialogTitle>
            <DialogDescription>
              Seleccione o tipo de documento que pretende solicitar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione um documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {doc.price} • {doc.time}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDocument && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm">
                  <strong>Preço:</strong> {documentTypes.find(d => d.id === selectedDocument)?.price}
                </p>
                <p className="text-sm">
                  <strong>Prazo:</strong> {documentTypes.find(d => d.id === selectedDocument)?.time}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRequestDocument}>
              <Send className="h-4 w-4 mr-2" />
              Solicitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Enrollment Modal */}
      <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suspender Matrícula</DialogTitle>
            <DialogDescription>
              Esta acção suspenderá temporariamente a sua matrícula. Poderá reactivá-la posteriormente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo da Suspensão *</Label>
              <Select value={suspendReason} onValueChange={setSuspendReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saude">Motivos de Saúde</SelectItem>
                  <SelectItem value="viagem">Viagem ao Exterior</SelectItem>
                  <SelectItem value="financeiro">Dificuldades Financeiras</SelectItem>
                  <SelectItem value="familiar">Motivos Familiares</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-sm text-accent flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                A suspensão será analisada pela secretaria antes de ser aprovada.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleSuspendEnrollment}>
              <PauseCircle className="h-4 w-4 mr-2" />
              Confirmar Suspensão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Enrollment Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Matrícula</DialogTitle>
            <DialogDescription>
              Solicite a actualização dos seus dados de matrícula
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Para actualizar os dados da sua matrícula (morada, contacto, encarregado de educação, etc.), 
              será necessário comparecer à secretaria com os documentos comprovativos.
            </p>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">Documentos necessários:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Bilhete de Identidade (original e cópia)</li>
                <li>• Comprovativo de morada actualizado</li>
                <li>• Documentos do Encarregado (se aplicável)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateEnrollment}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Solicitar Actualização
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PortalEstudante;
