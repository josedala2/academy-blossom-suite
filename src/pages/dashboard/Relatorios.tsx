import {
  Download,
  FileText,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,
  TrendingUp,
  Calendar,
  PieChart,
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
import DashboardLayout from "@/components/layout/DashboardLayout";

const reportCategories = [
  {
    title: "Relatórios Académicos",
    icon: GraduationCap,
    color: "primary",
    reports: [
      { name: "Pauta Geral por Turma", description: "Notas de todos os estudantes por turma" },
      { name: "Desempenho por Disciplina", description: "Médias e estatísticas por disciplina" },
      { name: "Ranking de Estudantes", description: "Classificação por média geral" },
      { name: "Frequência Mensal", description: "Relatório de presenças e faltas" },
      { name: "Boletim Individual", description: "Boletim de notas por estudante" },
    ],
  },
  {
    title: "Relatórios Financeiros",
    icon: CreditCard,
    color: "secondary",
    reports: [
      { name: "Propinas Recebidas", description: "Receitas mensais por turma" },
      { name: "Propinas em Atraso", description: "Lista de devedores" },
      { name: "Resumo Financeiro", description: "Balanço de receitas e despesas" },
      { name: "Projecção de Receitas", description: "Estimativa de cobranças" },
      { name: "Despesas por Categoria", description: "Análise de custos operacionais" },
    ],
  },
  {
    title: "Relatórios de Estudantes",
    icon: Users,
    color: "accent",
    reports: [
      { name: "Lista de Estudantes", description: "Listagem completa por turma" },
      { name: "Estatísticas por Género", description: "Distribuição por género" },
      { name: "Estudantes por Categoria", description: "Bolsistas, RTE, etc." },
      { name: "Novos Matriculados", description: "Matrículas do período" },
      { name: "Transferências", description: "Entradas e saídas" },
    ],
  },
  {
    title: "Relatórios Estratégicos",
    icon: TrendingUp,
    color: "primary",
    reports: [
      { name: "Dashboard Executivo", description: "Resumo para Direção" },
      { name: "Indicadores de Desempenho", description: "KPIs da escola" },
      { name: "Comparativo Anual", description: "Evolução ano a ano" },
      { name: "Taxa de Aprovação", description: "Análise de resultados" },
      { name: "Previsões e Tendências", description: "Análise preditiva" },
    ],
  },
];

const recentReports = [
  { name: "Pauta 10ª A - Janeiro 2026", date: "2026-01-15", type: "PDF" },
  { name: "Relatório Financeiro - Dezembro 2025", date: "2026-01-10", type: "Excel" },
  { name: "Lista de Devedores", date: "2026-01-08", type: "PDF" },
  { name: "Frequência Mensal - Dezembro", date: "2025-12-30", type: "PDF" },
];

const Relatorios = () => {
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
            <Select defaultValue="2026">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="1tri">
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
                    {category.reports.map((report, rIndex) => (
                      <div
                        key={rIndex}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="h-4 w-4" />
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
                {recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.date).toLocaleDateString("pt-AO")} • {report.type}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
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
                <Select>
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
                <Select>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
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
