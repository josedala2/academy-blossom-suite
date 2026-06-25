import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { 
  ArrowLeft, 
  Search, 
  History,
  User,
  GraduationCap,
  Calendar,
  FileText,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Minus,
  Award
} from "lucide-react";

interface Estudante {
  id: string;
  nome: string;
  numeroMatricula: string;
  turmaActual: string;
  foto?: string;
}

interface HistoricoAno {
  anoLectivo: string;
  turma: string;
  mediaGeral: number;
  resultado: "aprovado" | "reprovado" | "em_curso";
  disciplinas: {
    nome: string;
    notaT1: number;
    notaT2: number;
    notaT3: number;
    mediaFinal: number;
  }[];
}

const estudantesMock: Estudante[] = [
  { id: "1", nome: "Ana Maria Silva", numeroMatricula: "2024001", turmaActual: "10ª A" },
  { id: "2", nome: "João Pedro Santos", numeroMatricula: "2024002", turmaActual: "10ª A" },
  { id: "3", nome: "Maria José Fernandes", numeroMatricula: "2024003", turmaActual: "11ª B" },
  { id: "4", nome: "Carlos Alberto Mendes", numeroMatricula: "2024004", turmaActual: "12ª A" },
];

const historicoMock: Record<string, HistoricoAno[]> = {
  "1": [
    {
      anoLectivo: "2023/2024",
      turma: "9ª A",
      mediaGeral: 15.2,
      resultado: "aprovado",
      disciplinas: [
        { nome: "Matemática", notaT1: 14, notaT2: 16, notaT3: 15, mediaFinal: 15 },
        { nome: "Português", notaT1: 16, notaT2: 17, notaT3: 16, mediaFinal: 16.3 },
        { nome: "Física", notaT1: 13, notaT2: 14, notaT3: 15, mediaFinal: 14 },
        { nome: "Química", notaT1: 15, notaT2: 15, notaT3: 16, mediaFinal: 15.3 },
        { nome: "Biologia", notaT1: 16, notaT2: 17, notaT3: 17, mediaFinal: 16.7 },
        { nome: "História", notaT1: 14, notaT2: 15, notaT3: 14, mediaFinal: 14.3 },
        { nome: "Geografia", notaT1: 15, notaT2: 14, notaT3: 15, mediaFinal: 14.7 },
        { nome: "Inglês", notaT1: 17, notaT2: 18, notaT3: 17, mediaFinal: 17.3 },
      ],
    },
    {
      anoLectivo: "2022/2023",
      turma: "8ª A",
      mediaGeral: 14.5,
      resultado: "aprovado",
      disciplinas: [
        { nome: "Matemática", notaT1: 13, notaT2: 14, notaT3: 14, mediaFinal: 13.7 },
        { nome: "Português", notaT1: 15, notaT2: 16, notaT3: 15, mediaFinal: 15.3 },
        { nome: "Física", notaT1: 12, notaT2: 13, notaT3: 14, mediaFinal: 13 },
        { nome: "Química", notaT1: 14, notaT2: 14, notaT3: 15, mediaFinal: 14.3 },
        { nome: "Biologia", notaT1: 15, notaT2: 16, notaT3: 16, mediaFinal: 15.7 },
        { nome: "História", notaT1: 13, notaT2: 14, notaT3: 14, mediaFinal: 13.7 },
        { nome: "Geografia", notaT1: 14, notaT2: 14, notaT3: 15, mediaFinal: 14.3 },
        { nome: "Inglês", notaT1: 16, notaT2: 17, notaT3: 16, mediaFinal: 16.3 },
      ],
    },
  ],
};

const HistoricoAcademico = () => {
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState("");
  const [estudanteSelecionado, setEstudanteSelecionado] = useState<Estudante | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<string>("");

  const estudantesFiltrados = estudantesMock.filter(
    (e) =>
      e.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      e.numeroMatricula.includes(pesquisa)
  );

  const historico = estudanteSelecionado ? historicoMock[estudanteSelecionado.id] || [] : [];

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case "aprovado":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Aprovado</Badge>;
      case "reprovado":
        return <Badge variant="destructive">Reprovado</Badge>;
      case "em_curso":
        return <Badge variant="secondary">Em Curso</Badge>;
      default:
        return null;
    }
  };

  const getTendencia = (nota1: number, nota3: number) => {
    if (nota3 > nota1) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (nota3 < nota1) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const anoActual = historico.find((h) => h.anoLectivo === anoSelecionado);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/estudantes")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                Histórico Académico
              </h1>
              <p className="text-muted-foreground">
                Consulte o histórico de notas e progressão dos estudantes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Estudantes */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Estudantes
              </CardTitle>
              <CardDescription>
                Seleccione um estudante para ver o histórico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome ou matrícula..."
                  className="pl-10"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {estudantesFiltrados.map((estudante) => (
                  <div
                    key={estudante.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      estudanteSelecionado?.id === estudante.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setEstudanteSelecionado(estudante);
                      const hist = historicoMock[estudante.id];
                      if (hist && hist.length > 0) {
                        setAnoSelecionado(hist[0].anoLectivo);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{estudante.nome}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{estudante.numeroMatricula}</span>
                          <span>•</span>
                          <span>{estudante.turmaActual}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico do Estudante */}
          <Card className="lg:col-span-2">
            {estudanteSelecionado ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {estudanteSelecionado.nome}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>Matrícula: {estudanteSelecionado.numeroMatricula}</span>
                        <span>•</span>
                        <span>Turma Actual: {estudanteSelecionado.turmaActual}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Imprimir</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar PDF</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {historico.length > 0 ? (
                    <>
                      {/* Selector de Ano */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Ano Lectivo:</span>
                        </div>
                        <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {historico.map((h) => (
                              <SelectItem key={h.anoLectivo} value={h.anoLectivo}>
                                {h.anoLectivo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {anoActual && (
                        <>
                          {/* Resumo do Ano */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-muted/50">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Turma</p>
                                    <p className="font-semibold">{anoActual.turma}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/50">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Média Geral</p>
                                    <p className="font-semibold">{anoActual.mediaGeral.toFixed(1)} valores</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/50">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Resultado</p>
                                    {getResultadoBadge(anoActual.resultado)}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Tabela de Notas */}
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Disciplina</TableHead>
                                  <TableHead className="text-center">1º Trim.</TableHead>
                                  <TableHead className="text-center">2º Trim.</TableHead>
                                  <TableHead className="text-center">3º Trim.</TableHead>
                                  <TableHead className="text-center">Média</TableHead>
                                  <TableHead className="text-center">Tendência</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {anoActual.disciplinas.map((disc) => (
                                  <TableRow key={disc.nome}>
                                    <TableCell className="font-medium">{disc.nome}</TableCell>
                                    <TableCell className="text-center">{disc.notaT1}</TableCell>
                                    <TableCell className="text-center">{disc.notaT2}</TableCell>
                                    <TableCell className="text-center">{disc.notaT3}</TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={disc.mediaFinal >= 10 ? "default" : "destructive"}>
                                        {disc.mediaFinal.toFixed(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {getTendencia(disc.notaT1, disc.notaT3)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum histórico disponível para este estudante.</p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seleccione um estudante para ver o histórico académico.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoricoAcademico;