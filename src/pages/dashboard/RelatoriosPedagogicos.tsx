import { useState } from "react";
import {
  Download,
  FileText,
  Users,
  GraduationCap,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Award,
  Target,
  Filter,
  RefreshCw,
  ChevronRight,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Performance data by class
const classPerformanceData = [
  { turma: "10ª A", media: 14.5, aprovacao: 85, alunos: 32, professores: 8, avaliacoes: 24 },
  { turma: "10ª B", media: 13.8, aprovacao: 78, alunos: 28, professores: 8, avaliacoes: 22 },
  { turma: "11ª A", media: 15.2, aprovacao: 92, alunos: 30, professores: 9, avaliacoes: 26 },
  { turma: "11ª B", media: 14.1, aprovacao: 80, alunos: 29, professores: 9, avaliacoes: 23 },
  { turma: "12ª A", media: 15.8, aprovacao: 95, alunos: 25, professores: 10, avaliacoes: 28 },
  { turma: "12ª B", media: 14.6, aprovacao: 88, alunos: 27, professores: 10, avaliacoes: 25 },
];

// Performance data by teacher
const teacherPerformanceData = [
  { 
    id: 1, 
    nome: "Prof. João Santos", 
    disciplina: "Matemática", 
    turmas: ["10ª A", "10ª B", "11ª A"],
    mediaAlunos: 14.2,
    avaliacoesLancadas: 18,
    avaliacoesPendentes: 2,
    ultimaAvaliacao: "2026-01-18",
    taxaAprovacao: 82,
    tendencia: "up"
  },
  { 
    id: 2, 
    nome: "Prof. Maria Silva", 
    disciplina: "Português", 
    turmas: ["10ª A", "11ª B", "12ª A"],
    mediaAlunos: 15.1,
    avaliacoesLancadas: 22,
    avaliacoesPendentes: 0,
    ultimaAvaliacao: "2026-01-19",
    taxaAprovacao: 91,
    tendencia: "up"
  },
  { 
    id: 3, 
    nome: "Prof. Carlos Neto", 
    disciplina: "Física", 
    turmas: ["11ª A", "11ª B", "12ª A", "12ª B"],
    mediaAlunos: 12.8,
    avaliacoesLancadas: 15,
    avaliacoesPendentes: 5,
    ultimaAvaliacao: "2026-01-15",
    taxaAprovacao: 72,
    tendencia: "down"
  },
  { 
    id: 4, 
    nome: "Prof. Ana Costa", 
    disciplina: "Química", 
    turmas: ["10ª A", "10ª B", "11ª A", "11ª B"],
    mediaAlunos: 13.5,
    avaliacoesLancadas: 20,
    avaliacoesPendentes: 1,
    ultimaAvaliacao: "2026-01-17",
    taxaAprovacao: 78,
    tendencia: "neutral"
  },
  { 
    id: 5, 
    nome: "Prof. Pedro Lima", 
    disciplina: "Biologia", 
    turmas: ["10ª A", "10ª B"],
    mediaAlunos: 14.8,
    avaliacoesLancadas: 12,
    avaliacoesPendentes: 0,
    ultimaAvaliacao: "2026-01-19",
    taxaAprovacao: 88,
    tendencia: "up"
  },
  { 
    id: 6, 
    nome: "Prof. Rita Fernandes", 
    disciplina: "Inglês", 
    turmas: ["10ª A", "10ª B", "11ª A", "11ª B", "12ª A"],
    mediaAlunos: 15.5,
    avaliacoesLancadas: 25,
    avaliacoesPendentes: 0,
    ultimaAvaliacao: "2026-01-19",
    taxaAprovacao: 94,
    tendencia: "up"
  },
];

// Recent evaluations for supervision
const recentEvaluations = [
  { id: 1, professor: "Prof. João Santos", disciplina: "Matemática", turma: "10ª A", tipo: "Teste", data: "2026-01-18", status: "lançada", mediaNotas: 13.5, notasLancadas: 32, totalAlunos: 32 },
  { id: 2, professor: "Prof. Maria Silva", disciplina: "Português", turma: "11ª B", tipo: "Trabalho", data: "2026-01-19", status: "lançada", mediaNotas: 15.2, notasLancadas: 29, totalAlunos: 29 },
  { id: 3, professor: "Prof. Carlos Neto", disciplina: "Física", turma: "12ª A", tipo: "Exame", data: "2026-01-15", status: "pendente", mediaNotas: null, notasLancadas: 15, totalAlunos: 25 },
  { id: 4, professor: "Prof. Ana Costa", disciplina: "Química", turma: "10ª B", tipo: "Mini-teste", data: "2026-01-17", status: "lançada", mediaNotas: 12.8, notasLancadas: 28, totalAlunos: 28 },
  { id: 5, professor: "Prof. Pedro Lima", disciplina: "Biologia", turma: "10ª A", tipo: "Teste", data: "2026-01-19", status: "lançada", mediaNotas: 14.5, notasLancadas: 32, totalAlunos: 32 },
  { id: 6, professor: "Prof. Rita Fernandes", disciplina: "Inglês", turma: "12ª A", tipo: "Oral", data: "2026-01-19", status: "em_curso", mediaNotas: null, notasLancadas: 18, totalAlunos: 25 },
  { id: 7, professor: "Prof. Carlos Neto", disciplina: "Física", turma: "11ª A", tipo: "Trabalho", data: "2026-01-10", status: "pendente", mediaNotas: null, notasLancadas: 0, totalAlunos: 30 },
  { id: 8, professor: "Prof. João Santos", disciplina: "Matemática", turma: "11ª A", tipo: "Teste", data: "2026-01-12", status: "lançada", mediaNotas: 14.8, notasLancadas: 30, totalAlunos: 30 },
];

// Discipline performance radar data
const disciplineRadarData = [
  { disciplina: "Matemática", media: 14.2, target: 14 },
  { disciplina: "Português", media: 15.1, target: 14 },
  { disciplina: "Física", media: 12.8, target: 14 },
  { disciplina: "Química", media: 13.5, target: 14 },
  { disciplina: "Biologia", media: 14.8, target: 14 },
  { disciplina: "Inglês", media: 15.5, target: 14 },
];

// Monthly trend data
const monthlyTrendData = [
  { mes: "Set", media: 13.2, aprovacao: 75 },
  { mes: "Out", media: 13.8, aprovacao: 78 },
  { mes: "Nov", media: 14.1, aprovacao: 81 },
  { mes: "Dez", media: 14.5, aprovacao: 84 },
  { mes: "Jan", media: 14.8, aprovacao: 86 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--destructive))", "hsl(142.1 76.2% 36.3%)"];

const RelatoriosPedagogicos = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1trimestre");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [isExporting, setIsExporting] = useState(false);

  const totalStudents = classPerformanceData.reduce((acc, c) => acc + c.alunos, 0);
  const avgApproval = (classPerformanceData.reduce((acc, c) => acc + c.aprovacao, 0) / classPerformanceData.length).toFixed(1);
  const avgGrade = (classPerformanceData.reduce((acc, c) => acc + c.media, 0) / classPerformanceData.length).toFixed(1);
  const pendingEvaluations = teacherPerformanceData.reduce((acc, t) => acc + t.avaliacoesPendentes, 0);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Relatório Pedagógico", 14, 22);
      doc.setFontSize(10);
      doc.text(`Período: ${selectedPeriod === "1trimestre" ? "1º Trimestre" : selectedPeriod === "2trimestre" ? "2º Trimestre" : "Ano Lectivo"}`, 14, 30);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-AO")}`, 14, 36);

      // Summary stats
      doc.setFontSize(12);
      doc.text("Resumo Geral", 14, 48);
      doc.setFontSize(10);
      doc.text(`Total de Estudantes: ${totalStudents}`, 14, 56);
      doc.text(`Média Geral: ${avgGrade} valores`, 14, 62);
      doc.text(`Taxa de Aprovação: ${avgApproval}%`, 14, 68);

      // Class performance table
      doc.setFontSize(12);
      doc.text("Desempenho por Turma", 14, 82);
      
      autoTable(doc, {
        startY: 88,
        head: [["Turma", "Média", "Taxa Aprovação", "Alunos", "Avaliações"]],
        body: classPerformanceData.map(c => [
          c.turma,
          c.media.toFixed(1),
          `${c.aprovacao}%`,
          c.alunos.toString(),
          c.avaliacoes.toString()
        ]),
      });

      // Teacher performance table
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(12);
      doc.text("Desempenho por Professor", 14, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 21,
        head: [["Professor", "Disciplina", "Média Alunos", "Avaliações", "Taxa Aprovação"]],
        body: teacherPerformanceData.map(t => [
          t.nome,
          t.disciplina,
          t.mediaAlunos.toFixed(1),
          t.avaliacoesLancadas.toString(),
          `${t.taxaAprovacao}%`
        ]),
      });

      doc.save(`relatorio_pedagogico_${selectedPeriod}.pdf`);
      toast.success("Relatório PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Classes sheet
      const classesData = classPerformanceData.map(c => ({
        "Turma": c.turma,
        "Média": c.media,
        "Taxa Aprovação (%)": c.aprovacao,
        "Nº Alunos": c.alunos,
        "Nº Professores": c.professores,
        "Avaliações": c.avaliacoes
      }));
      const classesSheet = XLSX.utils.json_to_sheet(classesData);
      XLSX.utils.book_append_sheet(workbook, classesSheet, "Por Turma");

      // Teachers sheet
      const teachersData = teacherPerformanceData.map(t => ({
        "Professor": t.nome,
        "Disciplina": t.disciplina,
        "Turmas": t.turmas.join(", "),
        "Média Alunos": t.mediaAlunos,
        "Avaliações Lançadas": t.avaliacoesLancadas,
        "Pendentes": t.avaliacoesPendentes,
        "Taxa Aprovação (%)": t.taxaAprovacao
      }));
      const teachersSheet = XLSX.utils.json_to_sheet(teachersData);
      XLSX.utils.book_append_sheet(workbook, teachersSheet, "Por Professor");

      // Evaluations sheet
      const evalData = recentEvaluations.map(e => ({
        "Professor": e.professor,
        "Disciplina": e.disciplina,
        "Turma": e.turma,
        "Tipo": e.tipo,
        "Data": e.data,
        "Status": e.status === "lançada" ? "Lançada" : e.status === "pendente" ? "Pendente" : "Em Curso",
        "Média": e.mediaNotas || "-",
        "Notas Lançadas": `${e.notasLancadas}/${e.totalAlunos}`
      }));
      const evalSheet = XLSX.utils.json_to_sheet(evalData);
      XLSX.utils.book_append_sheet(workbook, evalSheet, "Avaliações");

      XLSX.writeFile(workbook, `relatorio_pedagogico_${selectedPeriod}.xlsx`);
      toast.success("Relatório Excel exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lançada":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Lançada</Badge>;
      case "pendente":
        return <Badge variant="destructive">Pendente</Badge>;
      case "em_curso":
        return <Badge variant="secondary">Em Curso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTendencyIcon = (tendency: string) => {
    switch (tendency) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Relatórios Pedagógicos</h1>
            <p className="text-muted-foreground">
              Supervisão e análise do desempenho académico
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1trimestre">1º Trimestre</SelectItem>
                <SelectItem value="2trimestre">2º Trimestre</SelectItem>
                <SelectItem value="3trimestre">3º Trimestre</SelectItem>
                <SelectItem value="anual">Ano Lectivo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting}>
              {isExporting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Estudantes</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                  <p className="text-2xl font-bold">{avgGrade} <span className="text-sm font-normal text-muted-foreground">valores</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Aprovação</p>
                  <p className="text-2xl font-bold">{avgApproval}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${pendingEvaluations > 0 ? "bg-orange-500/10" : "bg-green-500/10"}`}>
                  <ClipboardCheck className={`h-5 w-5 ${pendingEvaluations > 0 ? "text-orange-500" : "text-green-500"}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avaliações Pendentes</p>
                  <p className="text-2xl font-bold">{pendingEvaluations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visao-geral">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="turmas">
              <BookOpen className="h-4 w-4 mr-2" />
              Por Turma
            </TabsTrigger>
            <TabsTrigger value="professores">
              <GraduationCap className="h-4 w-4 mr-2" />
              Por Professor
            </TabsTrigger>
            <TabsTrigger value="supervisao">
              <Eye className="h-4 w-4 mr-2" />
              Supervisão
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="visao-geral" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance by Class Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Média por Turma</CardTitle>
                  <CardDescription>Desempenho académico comparativo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={classPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="turma" className="text-xs" />
                      <YAxis domain={[0, 20]} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Bar dataKey="media" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Média" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Approval Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Taxa de Aprovação por Turma</CardTitle>
                  <CardDescription>Percentagem de alunos aprovados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={classPerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="turma" type="category" className="text-xs" width={50} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value) => [`${value}%`, "Aprovação"]}
                      />
                      <Bar dataKey="aprovacao" fill="hsl(142.1 76.2% 36.3%)" radius={[0, 4, 4, 0]} name="Aprovação" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Discipline Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Desempenho por Disciplina</CardTitle>
                  <CardDescription>Comparação com meta (14 valores)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={disciplineRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="disciplina" className="text-xs" />
                      <PolarRadiusAxis domain={[0, 20]} />
                      <Radar name="Média" dataKey="media" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      <Radar name="Meta" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="5 5" />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Evolução Mensal</CardTitle>
                  <CardDescription>Tendência de desempenho ao longo do período</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
                      <YAxis yAxisId="left" domain={[10, 20]} className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="media" stroke="hsl(var(--primary))" name="Média" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="aprovacao" stroke="hsl(142.1 76.2% 36.3%)" name="Aprovação (%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="turmas" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Turma</CardTitle>
                <CardDescription>Análise detalhada de cada turma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classPerformanceData.map((turma) => (
                    <Card key={turma.turma} className="overflow-hidden">
                      <CardHeader className="pb-2 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{turma.turma}</CardTitle>
                          <Badge variant={turma.aprovacao >= 85 ? "default" : turma.aprovacao >= 70 ? "secondary" : "destructive"}>
                            {turma.aprovacao}% Aprovação
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Média Geral</span>
                            <span className="font-medium">{turma.media} valores</span>
                          </div>
                          <Progress value={(turma.media / 20) * 100} className="h-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{turma.alunos}</p>
                            <p className="text-xs text-muted-foreground">Alunos</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{turma.professores}</p>
                            <p className="text-xs text-muted-foreground">Professores</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{turma.avaliacoes}</p>
                            <p className="text-xs text-muted-foreground">Avaliações</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="professores" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Professores</CardTitle>
                <CardDescription>Avaliações lançadas e resultados por docente</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professor</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Turmas</TableHead>
                      <TableHead className="text-center">Média Alunos</TableHead>
                      <TableHead className="text-center">Avaliações</TableHead>
                      <TableHead className="text-center">Pendentes</TableHead>
                      <TableHead className="text-center">Taxa Aprovação</TableHead>
                      <TableHead className="text-center">Tendência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPerformanceData.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{teacher.disciplina}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.turmas.map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{teacher.mediaAlunos}</TableCell>
                        <TableCell className="text-center">{teacher.avaliacoesLancadas}</TableCell>
                        <TableCell className="text-center">
                          {teacher.avaliacoesPendentes > 0 ? (
                            <Badge variant="destructive">{teacher.avaliacoesPendentes}</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600">0</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={teacher.taxaAprovacao >= 85 ? "text-green-600" : teacher.taxaAprovacao >= 70 ? "text-orange-500" : "text-red-500"}>
                            {teacher.taxaAprovacao}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getTendencyIcon(teacher.tendencia)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supervision Tab */}
          <TabsContent value="supervisao" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Supervisão de Avaliações</h3>
                <p className="text-sm text-muted-foreground">Acompanhe as avaliações e notas lançadas pelos professores</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {classPerformanceData.map((c) => (
                      <SelectItem key={c.turma} value={c.turma}>{c.turma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Alerts Section */}
            {pendingEvaluations > 0 && (
              <Card className="border-orange-500/50 bg-orange-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-600">Atenção: Avaliações Pendentes</p>
                      <p className="text-sm text-muted-foreground">
                        Existem {pendingEvaluations} avaliação(ões) com notas por lançar. 
                        Verifique a lista abaixo para mais detalhes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Evaluations */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
                <CardDescription>Histórico de avaliações e estado de lançamento de notas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professor</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-center">Notas Lançadas</TableHead>
                      <TableHead className="text-center">Média</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEvaluations
                      .filter((e) => selectedClass === "all" || e.turma === selectedClass)
                      .map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">{evaluation.professor}</TableCell>
                          <TableCell>{evaluation.disciplina}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{evaluation.turma}</Badge>
                          </TableCell>
                          <TableCell>{evaluation.tipo}</TableCell>
                          <TableCell>{new Date(evaluation.data).toLocaleDateString("pt-AO")}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress 
                                value={(evaluation.notasLancadas / evaluation.totalAlunos) * 100} 
                                className="w-16 h-2" 
                              />
                              <span className="text-xs text-muted-foreground">
                                {evaluation.notasLancadas}/{evaluation.totalAlunos}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {evaluation.mediaNotas ? `${evaluation.mediaNotas}` : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(evaluation.status)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Teacher Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Actividade dos Professores</CardTitle>
                <CardDescription>Resumo de lançamento de notas por professor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherPerformanceData.map((teacher) => (
                    <div key={teacher.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{teacher.nome}</p>
                          <Badge variant="outline" className="text-xs">{teacher.disciplina}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Última avaliação: {new Date(teacher.ultimaAvaliacao).toLocaleDateString("pt-AO")}
                        </p>
                      </div>
                      <div className="text-center px-3">
                        <p className="text-lg font-bold text-green-600">{teacher.avaliacoesLancadas}</p>
                        <p className="text-xs text-muted-foreground">Lançadas</p>
                      </div>
                      <div className="text-center px-3">
                        <p className={`text-lg font-bold ${teacher.avaliacoesPendentes > 0 ? "text-orange-500" : "text-muted-foreground"}`}>
                          {teacher.avaliacoesPendentes}
                        </p>
                        <p className="text-xs text-muted-foreground">Pendentes</p>
                      </div>
                      <div className="text-center px-3">
                        <div className="flex items-center gap-1">
                          {getTendencyIcon(teacher.tendencia)}
                          <span className="font-medium">{teacher.taxaAprovacao}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Aprovação</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RelatoriosPedagogicos;
