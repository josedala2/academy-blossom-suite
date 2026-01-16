import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  FileText,
  Download,
  FileSpreadsheet,
  Users,
  FolderOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Printer,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Mock data
const estudantesData = [
  { numero: "2024001", nome: "João Manuel Silva", classe: "10ª", turma: "A", estado: "activo", encarregado: "Maria Silva" },
  { numero: "2024002", nome: "Ana Beatriz Santos", classe: "11ª", turma: "B", estado: "activo", encarregado: "Pedro Santos" },
  { numero: "2024003", nome: "Carlos Eduardo Mendes", classe: "12ª", turma: "A", estado: "activo", encarregado: "Sofia Mendes" },
  { numero: "2024004", nome: "Diana Rosa Ferreira", classe: "10ª", turma: "C", estado: "activo", encarregado: "António Ferreira" },
  { numero: "2024005", nome: "Emanuel José Costa", classe: "11ª", turma: "A", estado: "suspenso", encarregado: "Rosa Costa" },
  { numero: "2024006", nome: "Francisca Maria Neto", classe: "10ª", turma: "B", estado: "activo", encarregado: "José Neto" },
  { numero: "2024007", nome: "Gabriel António Sousa", classe: "12ª", turma: "B", estado: "transferido", encarregado: "Ana Sousa" },
];

const documentosData = [
  { numero: "DM-2024-0001", tipo: "Declaração de Matrícula", estudante: "João Manuel Silva", data: "2024-01-15", emitidoPor: "Maria Fernandes" },
  { numero: "DF-2024-0015", tipo: "Declaração de Frequência", estudante: "Ana Beatriz Santos", data: "2024-01-14", emitidoPor: "João Cardoso" },
  { numero: "DS-2024-0008", tipo: "Declaração Simples", estudante: "Carlos Eduardo Mendes", data: "2024-01-14", emitidoPor: "Maria Fernandes" },
  { numero: "AT-2024-0003", tipo: "Atestado Administrativo", estudante: "Diana Rosa Ferreira", data: "2024-01-13", emitidoPor: "João Cardoso" },
  { numero: "DM-2024-0002", tipo: "Declaração de Matrícula", estudante: "Emanuel José Costa", data: "2024-01-12", emitidoPor: "Maria Fernandes" },
];

const processosData = [
  { numero: "PROC-2024-0001", tipo: "Transferência", estudante: "João Manuel Silva", data: "2024-01-15", estado: "em_analise" },
  { numero: "PROC-2024-0002", tipo: "Anulação", estudante: "Ana Beatriz Santos", data: "2024-01-14", estado: "aprovado" },
  { numero: "PROC-2024-0003", tipo: "Reingresso", estudante: "Carlos Eduardo Mendes", data: "2024-01-13", estado: "concluido" },
  { numero: "PROC-2024-0004", tipo: "Transferência", estudante: "Diana Rosa Ferreira", data: "2024-01-12", estado: "criado" },
];

const atendimentosData = [
  { data: "2024-01-15 09:30", tipo: "Pré-Registo", atendente: "Maria Fernandes", descricao: "Pré-registo de novo estudante" },
  { data: "2024-01-15 10:15", tipo: "Visitante", atendente: "João Cardoso", descricao: "Visita de pais interessados" },
  { data: "2024-01-15 11:00", tipo: "Documento", atendente: "Maria Fernandes", descricao: "Emissão de declaração" },
  { data: "2024-01-14 14:30", tipo: "Processo", atendente: "João Cardoso", descricao: "Início de processo de transferência" },
  { data: "2024-01-14 15:45", tipo: "Informação", atendente: "Maria Fernandes", descricao: "Esclarecimento sobre propinas" },
];

// Chart data
const documentosPorMes = [
  { mes: "Set", declaracoes: 45, atestados: 12, outros: 8 },
  { mes: "Out", declaracoes: 52, atestados: 15, outros: 10 },
  { mes: "Nov", declaracoes: 38, atestados: 18, outros: 12 },
  { mes: "Dez", declaracoes: 25, atestados: 8, outros: 5 },
  { mes: "Jan", declaracoes: 60, atestados: 22, outros: 15 },
];

const estudantesPorClasse = [
  { classe: "10ª", total: 180, masculino: 95, feminino: 85 },
  { classe: "11ª", total: 165, masculino: 80, feminino: 85 },
  { classe: "12ª", total: 145, masculino: 70, feminino: 75 },
];

const atendimentosPorTipo = [
  { name: "Pré-Registo", value: 35, color: "#3B82F6" },
  { name: "Visitante", value: 25, color: "#10B981" },
  { name: "Documento", value: 45, color: "#F59E0B" },
  { name: "Processo", value: 20, color: "#8B5CF6" },
  { name: "Informação", value: 30, color: "#EC4899" },
];

const processosPorEstado = [
  { name: "Criados", value: 12, color: "#94A3B8" },
  { name: "Em Análise", value: 8, color: "#FBBF24" },
  { name: "Aprovados", value: 15, color: "#3B82F6" },
  { name: "Concluídos", value: 25, color: "#22C55E" },
  { name: "Rejeitados", value: 3, color: "#EF4444" },
];

const atendimentosDiarios = [
  { dia: "Seg", atendimentos: 28 },
  { dia: "Ter", atendimentos: 35 },
  { dia: "Qua", atendimentos: 42 },
  { dia: "Qui", atendimentos: 38 },
  { dia: "Sex", atendimentos: 45 },
];

const evolucaoMensal = [
  { mes: "Set", estudantes: 450, documentos: 65, processos: 8 },
  { mes: "Out", estudantes: 468, documentos: 77, processos: 12 },
  { mes: "Nov", estudantes: 475, documentos: 68, processos: 10 },
  { mes: "Dez", estudantes: 478, documentos: 38, processos: 5 },
  { mes: "Jan", estudantes: 490, documentos: 97, processos: 15 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

const SecretariaRelatorios = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [classeFilter, setClasseFilter] = useState("todas");
  const [estadoFilter, setEstadoFilter] = useState("todos");

  const filteredEstudantes = estudantesData.filter((est) => {
    const matchesClasse = classeFilter === "todas" || est.classe === classeFilter;
    const matchesEstado = estadoFilter === "todos" || est.estado === estadoFilter;
    return matchesClasse && matchesEstado;
  });

  const exportToPDF = (type: string) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("pt-AO");

    doc.setFontSize(18);
    doc.text("SGE - Sistema de Gestão Escolar", 105, 15, { align: "center" });
    doc.setFontSize(14);
    doc.text(`Relatório da Secretaria - ${getReportTitle(type)}`, 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${today}`, 105, 32, { align: "center" });

    let tableData: string[][] = [];
    let headers: string[] = [];

    switch (type) {
      case "estudantes":
        headers = ["Nº", "Nome", "Classe", "Turma", "Estado", "Encarregado"];
        tableData = filteredEstudantes.map((e) => [e.numero, e.nome, e.classe, e.turma, e.estado, e.encarregado]);
        break;
      case "documentos":
        headers = ["Número", "Tipo", "Estudante", "Data", "Emitido Por"];
        tableData = documentosData.map((d) => [d.numero, d.tipo, d.estudante, d.data, d.emitidoPor]);
        break;
      case "processos":
        headers = ["Número", "Tipo", "Estudante", "Data", "Estado"];
        tableData = processosData.map((p) => [p.numero, p.tipo, p.estudante, p.data, p.estado]);
        break;
      case "atendimentos":
        headers = ["Data/Hora", "Tipo", "Atendente", "Descrição"];
        tableData = atendimentosData.map((a) => [a.data, a.tipo, a.atendente, a.descricao]);
        break;
    }

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 40,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
    }

    doc.save(`relatorio_${type}_${today.replace(/\//g, "-")}.pdf`);
    toast({ title: "PDF exportado", description: `Relatório de ${getReportTitle(type)} exportado com sucesso.` });
  };

  const exportToExcel = (type: string) => {
    let data: Record<string, string>[] = [];
    let sheetName = "";

    switch (type) {
      case "estudantes":
        sheetName = "Estudantes";
        data = filteredEstudantes.map((e) => ({ "Número": e.numero, "Nome": e.nome, "Classe": e.classe, "Turma": e.turma, "Estado": e.estado, "Encarregado": e.encarregado }));
        break;
      case "documentos":
        sheetName = "Documentos";
        data = documentosData.map((d) => ({ "Número": d.numero, "Tipo": d.tipo, "Estudante": d.estudante, "Data": d.data, "Emitido Por": d.emitidoPor }));
        break;
      case "processos":
        sheetName = "Processos";
        data = processosData.map((p) => ({ "Número": p.numero, "Tipo": p.tipo, "Estudante": p.estudante, "Data": p.data, "Estado": p.estado }));
        break;
      case "atendimentos":
        sheetName = "Atendimentos";
        data = atendimentosData.map((a) => ({ "Data/Hora": a.data, "Tipo": a.tipo, "Atendente": a.atendente, "Descrição": a.descricao }));
        break;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const today = new Date().toLocaleDateString("pt-AO").replace(/\//g, "-");
    XLSX.writeFile(wb, `relatorio_${type}_${today}.xlsx`);
    toast({ title: "Excel exportado", description: `Relatório de ${getReportTitle(type)} exportado com sucesso.` });
  };

  const getReportTitle = (type: string) => {
    switch (type) {
      case "estudantes": return "Estudantes";
      case "documentos": return "Documentos Emitidos";
      case "processos": return "Processos Administrativos";
      case "atendimentos": return "Atendimentos";
      default: return type;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Activo</Badge>;
      case "suspenso": return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Suspenso</Badge>;
      case "transferido": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Transferido</Badge>;
      case "criado": return <Badge variant="outline">Criado</Badge>;
      case "em_analise": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Em Análise</Badge>;
      case "aprovado": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Aprovado</Badge>;
      case "concluido": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Concluído</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/secretaria">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Relatórios da Secretaria</h1>
              <p className="text-muted-foreground">Estatísticas, gráficos e exportação de dados</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{estudantesData.length}</div>
                  <div className="text-xs text-muted-foreground">Estudantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{documentosData.length}</div>
                  <div className="text-xs text-muted-foreground">Documentos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{processosData.length}</div>
                  <div className="text-xs text-muted-foreground">Processos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{atendimentosData.length}</div>
                  <div className="text-xs text-muted-foreground">Atendimentos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="estudantes" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Estudantes</span>
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="processos" className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Processos</span>
            </TabsTrigger>
            <TabsTrigger value="atendimentos" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Atendimentos</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard with Charts */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Evolução Mensal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução Mensal
                </CardTitle>
                <CardDescription>Acompanhamento de estudantes, documentos e processos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="estudantes" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Estudantes" />
                    <Area type="monotone" dataKey="documentos" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Documentos" />
                    <Area type="monotone" dataKey="processos" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Processos" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Documentos por Mês */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Documentos por Mês</CardTitle>
                  <CardDescription>Tipos de documentos emitidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={documentosPorMes}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="declaracoes" fill="#3B82F6" name="Declarações" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="atestados" fill="#10B981" name="Atestados" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outros" fill="#F59E0B" name="Outros" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Atendimentos por Tipo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Atendimentos por Tipo</CardTitle>
                  <CardDescription>Distribuição dos atendimentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={atendimentosPorTipo}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {atendimentosPorTipo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Estudantes por Classe */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estudantes por Classe</CardTitle>
                  <CardDescription>Distribuição por género</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={estudantesPorClasse} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="classe" type="category" className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="masculino" fill="#3B82F6" name="Masculino" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="feminino" fill="#EC4899" name="Feminino" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Processos por Estado */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Processos por Estado</CardTitle>
                  <CardDescription>Estado actual dos processos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={processosPorEstado}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {processosPorEstado.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Atendimentos Diários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Atendimentos da Semana</CardTitle>
                <CardDescription>Volume de atendimentos por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={atendimentosDiarios}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dia" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="atendimentos" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} name="Atendimentos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estudantes Tab */}
          <TabsContent value="estudantes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Estudantes</CardTitle>
                    <CardDescription>Relatório de estudantes por classe e estado</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToPDF("estudantes")}>
                      <Download className="h-4 w-4 mr-2" />PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToExcel("estudantes")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-xs">Classe</Label>
                    <Select value={classeFilter} onValueChange={setClasseFilter}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="10ª">10ª Classe</SelectItem>
                        <SelectItem value="11ª">11ª Classe</SelectItem>
                        <SelectItem value="12ª">12ª Classe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Estado</Label>
                    <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="suspenso">Suspenso</SelectItem>
                        <SelectItem value="transferido">Transferido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="ml-auto flex items-end">
                    <Badge variant="secondary">{filteredEstudantes.length} resultados</Badge>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Encarregado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstudantes.map((est) => (
                      <TableRow key={est.numero}>
                        <TableCell className="font-mono">{est.numero}</TableCell>
                        <TableCell className="font-medium">{est.nome}</TableCell>
                        <TableCell>{est.classe}</TableCell>
                        <TableCell>{est.turma}</TableCell>
                        <TableCell>{getEstadoBadge(est.estado)}</TableCell>
                        <TableCell>{est.encarregado}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Documentos Emitidos</CardTitle>
                    <CardDescription>Relatório de documentos emitidos pela Secretaria</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToPDF("documentos")}>
                      <Download className="h-4 w-4 mr-2" />PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToExcel("documentos")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estudante</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Emitido Por</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentosData.map((doc) => (
                      <TableRow key={doc.numero}>
                        <TableCell className="font-mono">{doc.numero}</TableCell>
                        <TableCell>{doc.tipo}</TableCell>
                        <TableCell>{doc.estudante}</TableCell>
                        <TableCell>{doc.data}</TableCell>
                        <TableCell>{doc.emitidoPor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processos Tab */}
          <TabsContent value="processos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Processos Administrativos</CardTitle>
                    <CardDescription>Relatório de processos de transferência, anulação e reingresso</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToPDF("processos")}>
                      <Download className="h-4 w-4 mr-2" />PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToExcel("processos")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estudante</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processosData.map((proc) => (
                      <TableRow key={proc.numero}>
                        <TableCell className="font-mono">{proc.numero}</TableCell>
                        <TableCell>{proc.tipo}</TableCell>
                        <TableCell>{proc.estudante}</TableCell>
                        <TableCell>{proc.data}</TableCell>
                        <TableCell>{getEstadoBadge(proc.estado)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Atendimentos Tab */}
          <TabsContent value="atendimentos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Atendimentos Realizados</CardTitle>
                    <CardDescription>Relatório de atendimentos realizados pela Secretaria</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToPDF("atendimentos")}>
                      <Download className="h-4 w-4 mr-2" />PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToExcel("atendimentos")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Atendente</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atendimentosData.map((atend, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{atend.data}</TableCell>
                        <TableCell><Badge variant="outline">{atend.tipo}</Badge></TableCell>
                        <TableCell>{atend.atendente}</TableCell>
                        <TableCell>{atend.descricao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Acções Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => { exportToPDF("estudantes"); exportToPDF("documentos"); exportToPDF("processos"); exportToPDF("atendimentos"); }}>
                <Download className="h-6 w-6 mb-2" />
                <span className="text-xs">Exportar Tudo (PDF)</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => { exportToExcel("estudantes"); exportToExcel("documentos"); exportToExcel("processos"); exportToExcel("atendimentos"); }}>
                <FileSpreadsheet className="h-6 w-6 mb-2" />
                <span className="text-xs">Exportar Tudo (Excel)</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => window.print()}>
                <Printer className="h-6 w-6 mb-2" />
                <span className="text-xs">Imprimir Página</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => toast({ title: "Relatório agendado", description: "O relatório mensal será enviado por email." })}>
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-xs">Agendar Relatório</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecretariaRelatorios;
