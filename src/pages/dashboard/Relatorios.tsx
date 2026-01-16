import { useState } from "react";
import {
  Download,
  FileText,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,
  TrendingUp,
  Calendar,
  Loader2,
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const reportCategories = [
  {
    title: "Relatórios Académicos",
    icon: GraduationCap,
    color: "primary",
    reports: [
      { id: "pauta-turma", name: "Pauta Geral por Turma", description: "Notas de todos os estudantes por turma" },
      { id: "desempenho-disciplina", name: "Desempenho por Disciplina", description: "Médias e estatísticas por disciplina" },
      { id: "ranking-estudantes", name: "Ranking de Estudantes", description: "Classificação por média geral" },
      { id: "frequencia-mensal", name: "Frequência Mensal", description: "Relatório de presenças e faltas" },
      { id: "boletim-individual", name: "Boletim Individual", description: "Boletim de notas por estudante" },
    ],
  },
  {
    title: "Relatórios Financeiros",
    icon: CreditCard,
    color: "secondary",
    reports: [
      { id: "propinas-recebidas", name: "Propinas Recebidas", description: "Receitas mensais por turma" },
      { id: "propinas-atraso", name: "Propinas em Atraso", description: "Lista de devedores" },
      { id: "resumo-financeiro", name: "Resumo Financeiro", description: "Balanço de receitas e despesas" },
      { id: "projecao-receitas", name: "Projecção de Receitas", description: "Estimativa de cobranças" },
      { id: "despesas-categoria", name: "Despesas por Categoria", description: "Análise de custos operacionais" },
    ],
  },
  {
    title: "Relatórios de Estudantes",
    icon: Users,
    color: "accent",
    reports: [
      { id: "lista-estudantes", name: "Lista de Estudantes", description: "Listagem completa por turma" },
      { id: "estatisticas-genero", name: "Estatísticas por Género", description: "Distribuição por género" },
      { id: "estudantes-categoria", name: "Estudantes por Categoria", description: "Bolsistas, RTE, etc." },
      { id: "novos-matriculados", name: "Novos Matriculados", description: "Matrículas do período" },
      { id: "transferencias", name: "Transferências", description: "Entradas e saídas" },
    ],
  },
  {
    title: "Relatórios Estratégicos",
    icon: TrendingUp,
    color: "primary",
    reports: [
      { id: "dashboard-executivo", name: "Dashboard Executivo", description: "Resumo para Direção" },
      { id: "indicadores-desempenho", name: "Indicadores de Desempenho", description: "KPIs da escola" },
      { id: "comparativo-anual", name: "Comparativo Anual", description: "Evolução ano a ano" },
      { id: "taxa-aprovacao", name: "Taxa de Aprovação", description: "Análise de resultados" },
      { id: "previsoes-tendencias", name: "Previsões e Tendências", description: "Análise preditiva" },
    ],
  },
];

const recentReports = [
  { id: 1, name: "Pauta 10ª A - Janeiro 2026", date: "2026-01-15", type: "PDF" },
  { id: 2, name: "Relatório Financeiro - Dezembro 2025", date: "2026-01-10", type: "Excel" },
  { id: 3, name: "Lista de Devedores", date: "2026-01-08", type: "PDF" },
  { id: 4, name: "Frequência Mensal - Dezembro", date: "2025-12-30", type: "PDF" },
];

// Sample data for reports
const sampleStudentData = [
  { numero: "2024001", nome: "João Silva", turma: "10ª A", media: 14.5, estado: "Aprovado" },
  { numero: "2024002", nome: "Ana Ferreira", turma: "10ª A", media: 17.2, estado: "Aprovado" },
  { numero: "2024003", nome: "Carlos Santos", turma: "10ª A", media: 12.8, estado: "Aprovado" },
  { numero: "2024004", nome: "Maria Neto", turma: "10ª A", media: 15.6, estado: "Aprovado" },
  { numero: "2024005", nome: "Pedro Mendes", turma: "10ª A", media: 9.2, estado: "Reprovado" },
  { numero: "2024006", nome: "Luísa Costa", turma: "11ª A", media: 16.1, estado: "Aprovado" },
  { numero: "2024007", nome: "Ricardo Alves", turma: "11ª A", media: 13.4, estado: "Aprovado" },
  { numero: "2024008", nome: "Teresa Martins", turma: "11ª A", media: 11.0, estado: "Aprovado" },
];

const sampleFinancialData = [
  { estudante: "João Silva", turma: "10ª A", valor: "17.500 Kz", estado: "Pago", data: "2026-01-08" },
  { estudante: "Ana Ferreira", turma: "10ª A", valor: "17.500 Kz", estado: "Pendente", data: "-" },
  { estudante: "Carlos Santos", turma: "11ª B", valor: "17.500 Kz", estado: "Atraso", data: "-" },
  { estudante: "Maria Neto", turma: "9ª C", valor: "15.000 Kz", estado: "Pago", data: "2026-01-05" },
  { estudante: "Pedro Costa", turma: "12ª A", valor: "20.000 Kz", estado: "Pago", data: "2026-01-10" },
];

const Relatorios = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedTrimester, setSelectedTrimester] = useState("1tri");
  const [quickReportType, setQuickReportType] = useState("");
  const [quickReportClass, setQuickReportClass] = useState("");
  const [quickReportFormat, setQuickReportFormat] = useState("");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [isQuickGenerating, setIsQuickGenerating] = useState(false);

  const generatePDF = (title: string, data: any[], columns: string[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Ano Lectivo: ${selectedYear} | Período: ${selectedTrimester === "anual" ? "Anual" : selectedTrimester.replace("tri", "º Trimestre")}`, 105, 28, { align: "center" });
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-AO")}`, 105, 34, { align: "center" });

    doc.setTextColor(0);

    autoTable(doc, {
      startY: 42,
      head: [columns],
      body: data.map(row => columns.map(col => {
        const key = col.toLowerCase().replace(/\s+/g, "").replace("nº", "numero");
        return row[key] || row[col] || "-";
      })),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    return doc;
  };

  const generateExcel = (title: string, data: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    return wb;
  };

  const handleReportDownload = async (reportId: string, reportName: string) => {
    setGeneratingReport(reportId);

    await new Promise(resolve => setTimeout(resolve, 1200));

    let doc: jsPDF;
    const fileName = `${reportId}_${new Date().toISOString().split("T")[0]}`;

    switch (reportId) {
      case "pauta-turma":
      case "ranking-estudantes":
      case "boletim-individual":
        doc = generatePDF(reportName, sampleStudentData, ["Nº", "Nome", "Turma", "Média", "Estado"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "desempenho-disciplina":
        const disciplineData = [
          { disciplina: "Matemática", media: "13.5", aprovados: "85%", reprovados: "15%" },
          { disciplina: "Português", media: "14.2", aprovados: "88%", reprovados: "12%" },
          { disciplina: "Física", media: "12.8", aprovados: "82%", reprovados: "18%" },
          { disciplina: "Química", media: "13.1", aprovados: "84%", reprovados: "16%" },
          { disciplina: "Biologia", media: "14.8", aprovados: "91%", reprovados: "9%" },
        ];
        doc = generatePDF(reportName, disciplineData, ["Disciplina", "Média", "Aprovados", "Reprovados"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "frequencia-mensal":
        const frequencyData = [
          { estudante: "João Silva", turma: "10ª A", presencas: "18", faltas: "2", percentagem: "90%" },
          { estudante: "Ana Ferreira", turma: "10ª A", presencas: "20", faltas: "0", percentagem: "100%" },
          { estudante: "Carlos Santos", turma: "10ª A", presencas: "15", faltas: "5", percentagem: "75%" },
        ];
        doc = generatePDF(reportName, frequencyData, ["Estudante", "Turma", "Presenças", "Faltas", "Percentagem"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "propinas-recebidas":
      case "propinas-atraso":
      case "resumo-financeiro":
        doc = generatePDF(reportName, sampleFinancialData, ["Estudante", "Turma", "Valor", "Estado", "Data"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "projecao-receitas":
      case "despesas-categoria":
        const financialProjection = [
          { mes: "Janeiro", previsto: "15.000.000 Kz", realizado: "12.540.000 Kz", diferenca: "-2.460.000 Kz" },
          { mes: "Fevereiro", previsto: "15.000.000 Kz", realizado: "-", diferenca: "-" },
          { mes: "Março", previsto: "15.000.000 Kz", realizado: "-", diferenca: "-" },
        ];
        doc = generatePDF(reportName, financialProjection, ["Mês", "Previsto", "Realizado", "Diferença"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "lista-estudantes":
      case "novos-matriculados":
      case "transferencias":
        doc = generatePDF(reportName, sampleStudentData, ["Nº", "Nome", "Turma", "Média", "Estado"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "estatisticas-genero":
        const genderData = [
          { turma: "10ª A", masculino: "18", feminino: "22", total: "40" },
          { turma: "10ª B", masculino: "20", feminino: "18", total: "38" },
          { turma: "11ª A", masculino: "15", feminino: "20", total: "35" },
          { turma: "11ª B", masculino: "17", feminino: "19", total: "36" },
        ];
        doc = generatePDF(reportName, genderData, ["Turma", "Masculino", "Feminino", "Total"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "estudantes-categoria":
        const categoryData = [
          { categoria: "Regular", quantidade: "680", percentagem: "80.3%" },
          { categoria: "Bolseiro", quantidade: "95", percentagem: "11.2%" },
          { categoria: "RTE", quantidade: "45", percentagem: "5.3%" },
          { categoria: "Funcionário", quantidade: "27", percentagem: "3.2%" },
        ];
        doc = generatePDF(reportName, categoryData, ["Categoria", "Quantidade", "Percentagem"]);
        doc.save(`${fileName}.pdf`);
        break;

      case "dashboard-executivo":
      case "indicadores-desempenho":
      case "comparativo-anual":
      case "taxa-aprovacao":
      case "previsoes-tendencias":
        const kpiData = [
          { indicador: "Taxa de Aprovação", valor: "87%", meta: "90%", variacao: "+5%" },
          { indicador: "Taxa de Cobrança", valor: "87%", meta: "95%", variacao: "+8%" },
          { indicador: "Média Geral", valor: "14.2", meta: "14.0", variacao: "+0.2" },
          { indicador: "Frequência Média", valor: "92%", meta: "95%", variacao: "-1%" },
          { indicador: "Satisfação Encarregados", valor: "4.2/5", meta: "4.5/5", variacao: "+0.3" },
        ];
        doc = generatePDF(reportName, kpiData, ["Indicador", "Valor", "Meta", "Variação"]);
        doc.save(`${fileName}.pdf`);
        break;

      default:
        doc = generatePDF(reportName, sampleStudentData, ["Nº", "Nome", "Turma", "Média", "Estado"]);
        doc.save(`${fileName}.pdf`);
    }

    toast.success(`Relatório "${reportName}" gerado com sucesso!`);
    setGeneratingReport(null);
  };

  const handleRecentReportDownload = async (report: typeof recentReports[0]) => {
    setGeneratingReport(`recent-${report.id}`);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (report.type === "PDF") {
      const doc = generatePDF(report.name, sampleStudentData, ["Nº", "Nome", "Turma", "Média", "Estado"]);
      doc.save(`${report.name.replace(/\s+/g, "_")}.pdf`);
    } else {
      const wb = generateExcel(report.name, sampleStudentData);
      XLSX.writeFile(wb, `${report.name.replace(/\s+/g, "_")}.xlsx`);
    }

    toast.success(`Relatório "${report.name}" baixado!`);
    setGeneratingReport(null);
  };

  const handleQuickGenerate = async () => {
    if (!quickReportType || !quickReportClass || !quickReportFormat) {
      toast.error("Preencha todos os campos para gerar o relatório");
      return;
    }

    setIsQuickGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const reportTypes: Record<string, string> = {
      pauta: "Pauta de Notas",
      freq: "Relatório de Frequência",
      fin: "Relatório Financeiro",
      list: "Lista de Estudantes",
    };

    const turmas: Record<string, string> = {
      all: "Todas as Turmas",
      "10a": "10ª A",
      "10b": "10ª B",
      "11a": "11ª A",
    };

    const reportName = `${reportTypes[quickReportType]} - ${turmas[quickReportClass]}`;
    const fileName = `relatorio_${quickReportType}_${quickReportClass}_${new Date().toISOString().split("T")[0]}`;

    if (quickReportFormat === "pdf") {
      const doc = generatePDF(reportName, sampleStudentData, ["Nº", "Nome", "Turma", "Média", "Estado"]);
      doc.save(`${fileName}.pdf`);
    } else if (quickReportFormat === "excel") {
      const wb = generateExcel(reportName, sampleStudentData);
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      // CSV
      const csvContent = sampleStudentData.map(row =>
        Object.values(row).join(",")
      ).join("\n");
      const blob = new Blob([`Nº,Nome,Turma,Média,Estado\n${csvContent}`], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Relatório "${reportName}" gerado com sucesso!`);
    setIsQuickGenerating(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Relatórios
            </h1>
            <p className="text-muted-foreground">
              Gere e exporte relatórios académicos e financeiros
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1tri">1º Trimestre</SelectItem>
                <SelectItem value="2tri">2º Trimestre</SelectItem>
                <SelectItem value="3tri">3º Trimestre</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Relatórios Gerados</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-2xl font-bold text-primary">24</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold text-secondary">89</p>
                </div>
                <Download className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Agendados</p>
                  <p className="text-2xl font-bold text-accent">5</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Report Categories */}
          <div className="lg:col-span-2 space-y-6">
            {reportCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        category.color === "primary"
                          ? "bg-primary/10 text-primary"
                          : category.color === "secondary"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {category.reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleReportDownload(report.id, report.name)}
                          disabled={generatingReport === report.id}
                        >
                          {generatingReport === report.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatórios Recentes</CardTitle>
                <CardDescription>Últimos relatórios gerados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.date).toLocaleDateString("pt-AO")} •{" "}
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {report.type}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRecentReportDownload(report)}
                      disabled={generatingReport === `recent-${report.id}`}
                    >
                      {generatingReport === `recent-${report.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Generate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gerar Relatório Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={quickReportType} onValueChange={setQuickReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pauta">Pauta de Notas</SelectItem>
                    <SelectItem value="freq">Frequência</SelectItem>
                    <SelectItem value="fin">Financeiro</SelectItem>
                    <SelectItem value="list">Lista de Estudantes</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={quickReportClass} onValueChange={setQuickReportClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="10a">10ª A</SelectItem>
                    <SelectItem value="10b">10ª B</SelectItem>
                    <SelectItem value="11a">11ª A</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={quickReportFormat} onValueChange={setQuickReportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={handleQuickGenerate}
                  disabled={isQuickGenerating}
                >
                  {isQuickGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      A gerar...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Relatório
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Relatorios;
