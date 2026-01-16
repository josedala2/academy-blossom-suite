import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  History,
  Calendar,
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClassItem {
  id: number;
  name: string;
  level: string;
  section: string;
  shift: string;
  room: string;
  students: number;
  capacity: number;
  director: string;
  subjects: number;
  status: string;
}

interface HistoricoAssiduidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassItem | null;
}

// Sample historical data
const historicoRegistos = [
  {
    id: 1,
    data: "2024-01-15",
    disciplina: "Matemática",
    tempo: "1º Tempo",
    professor: "Prof. António Fernandes",
    presentes: 32,
    faltas: 3,
    justificadas: 1,
    atrasos: 2,
    total: 35,
  },
  {
    id: 2,
    data: "2024-01-15",
    disciplina: "Português",
    tempo: "2º Tempo",
    professor: "Prof.ª Maria Costa",
    presentes: 33,
    faltas: 2,
    justificadas: 0,
    atrasos: 1,
    total: 35,
  },
  {
    id: 3,
    data: "2024-01-14",
    disciplina: "Física",
    tempo: "1º Tempo",
    professor: "Prof. Pedro Santos",
    presentes: 30,
    faltas: 4,
    justificadas: 2,
    atrasos: 1,
    total: 35,
  },
  {
    id: 4,
    data: "2024-01-14",
    disciplina: "Química",
    tempo: "3º Tempo",
    professor: "Prof.ª Ana Neto",
    presentes: 34,
    faltas: 1,
    justificadas: 0,
    atrasos: 0,
    total: 35,
  },
  {
    id: 5,
    data: "2024-01-13",
    disciplina: "Biologia",
    tempo: "2º Tempo",
    professor: "Prof. Carlos Mendes",
    presentes: 31,
    faltas: 3,
    justificadas: 1,
    atrasos: 2,
    total: 35,
  },
  {
    id: 6,
    data: "2024-01-12",
    disciplina: "Inglês",
    tempo: "4º Tempo",
    professor: "Prof.ª Rosa Oliveira",
    presentes: 33,
    faltas: 2,
    justificadas: 0,
    atrasos: 1,
    total: 35,
  },
  {
    id: 7,
    data: "2024-01-11",
    disciplina: "História",
    tempo: "1º Tempo",
    professor: "Prof. João Lima",
    presentes: 29,
    faltas: 5,
    justificadas: 3,
    atrasos: 1,
    total: 35,
  },
  {
    id: 8,
    data: "2024-01-10",
    disciplina: "Geografia",
    tempo: "3º Tempo",
    professor: "Prof.ª Teresa Dias",
    presentes: 32,
    faltas: 2,
    justificadas: 1,
    atrasos: 1,
    total: 35,
  },
];

// Weekly trend data
const trendData = [
  { semana: "Sem 1", taxa: 88 },
  { semana: "Sem 2", taxa: 91 },
  { semana: "Sem 3", taxa: 89 },
  { semana: "Sem 4", taxa: 93 },
  { semana: "Sem 5", taxa: 92 },
  { semana: "Sem 6", taxa: 94 },
];

// Student attendance details
const alunosFaltas = [
  { id: 1, numero: "2024001", nome: "João Manuel Silva", totalFaltas: 5, justificadas: 2, ultimaFalta: "2024-01-15" },
  { id: 2, numero: "2024003", nome: "Carlos Eduardo Mendes", totalFaltas: 8, justificadas: 3, ultimaFalta: "2024-01-14" },
  { id: 3, numero: "2024005", nome: "Emanuel José Costa", totalFaltas: 4, justificadas: 1, ultimaFalta: "2024-01-13" },
  { id: 4, numero: "2024006", nome: "Fernanda Lima", totalFaltas: 6, justificadas: 4, ultimaFalta: "2024-01-12" },
  { id: 5, numero: "2024008", nome: "Helena Costa", totalFaltas: 9, justificadas: 3, ultimaFalta: "2024-01-11" },
];

const disciplinas = [
  "Todas",
  "Matemática",
  "Português",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "História",
  "Geografia",
];

const HistoricoAssiduidadeModal = ({
  open,
  onOpenChange,
  selectedClass,
}: HistoricoAssiduidadeModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("Todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredRegistos = historicoRegistos.filter((registo) => {
    const matchesSearch =
      registo.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registo.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDisciplina =
      selectedDisciplina === "Todas" || registo.disciplina === selectedDisciplina;
    const matchesStartDate = !startDate || registo.data >= startDate;
    const matchesEndDate = !endDate || registo.data <= endDate;
    return matchesSearch && matchesDisciplina && matchesStartDate && matchesEndDate;
  });

  const totalPresentes = filteredRegistos.reduce((acc, r) => acc + r.presentes, 0);
  const totalFaltas = filteredRegistos.reduce((acc, r) => acc + r.faltas, 0);
  const totalJustificadas = filteredRegistos.reduce((acc, r) => acc + r.justificadas, 0);
  const totalAtrasos = filteredRegistos.reduce((acc, r) => acc + r.atrasos, 0);
  const taxaMedia =
    filteredRegistos.length > 0
      ? Math.round(
          (totalPresentes / (totalPresentes + totalFaltas + totalJustificadas)) * 100
        )
      : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico de Assiduidade - {selectedClass?.name}
          </DialogTitle>
          <DialogDescription>
            Consulte todos os registos de assiduidade desta turma
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="registos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registos">Registos</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            <TabsTrigger value="alunos">Por Aluno</TabsTrigger>
          </TabsList>

          {/* Registos Tab */}
          <TabsContent value="registos" className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Data início"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Data fim"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-5 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">{filteredRegistos.length}</p>
                  <p className="text-xs text-muted-foreground">Registos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">{totalPresentes}</p>
                  <p className="text-xs text-muted-foreground">Presenças</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-destructive">{totalFaltas}</p>
                  <p className="text-xs text-muted-foreground">Faltas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-secondary">{totalJustificadas}</p>
                  <p className="text-xs text-muted-foreground">Justificadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-accent">{taxaMedia}%</p>
                  <p className="text-xs text-muted-foreground">Taxa Média</p>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Data</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead className="text-center">
                      <CheckCircle2 className="h-4 w-4 inline text-primary" />
                    </TableHead>
                    <TableHead className="text-center">
                      <XCircle className="h-4 w-4 inline text-destructive" />
                    </TableHead>
                    <TableHead className="text-center">
                      <Clock className="h-4 w-4 inline text-accent" />
                    </TableHead>
                    <TableHead className="text-center">Taxa</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistos.map((registo) => {
                    const taxa = Math.round((registo.presentes / registo.total) * 100);
                    return (
                      <TableRow key={registo.id}>
                        <TableCell className="font-medium">
                          {formatDate(registo.data)}
                        </TableCell>
                        <TableCell>{registo.disciplina}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {registo.tempo}
                        </TableCell>
                        <TableCell>{registo.professor}</TableCell>
                        <TableCell className="text-center text-primary font-medium">
                          {registo.presentes}
                        </TableCell>
                        <TableCell className="text-center text-destructive font-medium">
                          {registo.faltas}
                        </TableCell>
                        <TableCell className="text-center text-accent font-medium">
                          {registo.atrasos}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              taxa >= 90 ? "default" : taxa >= 80 ? "secondary" : "destructive"
                            }
                          >
                            {taxa}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Histórico
              </Button>
            </div>
          </TabsContent>

          {/* Estatísticas Tab */}
          <TabsContent value="estatisticas" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa Média Geral</p>
                      <p className="text-2xl font-bold text-primary">91.5%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Melhor Semana</p>
                      <p className="text-2xl font-bold text-primary">94%</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pior Semana</p>
                      <p className="text-2xl font-bold text-destructive">88%</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Aulas</p>
                      <p className="text-2xl font-bold">{historicoRegistos.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Chart */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Evolução da Assiduidade</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="taxa"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        name="Taxa %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Best/Worst Disciplines */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 text-primary">Melhores Disciplinas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                      <span>Química</span>
                      <Badge>97%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                      <span>Português</span>
                      <Badge>94%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                      <span>Biologia</span>
                      <Badge>91%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 text-destructive">Disciplinas a Melhorar</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                      <span>História</span>
                      <Badge variant="destructive">83%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                      <span>Física</span>
                      <Badge variant="destructive">86%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                      <span>Geografia</span>
                      <Badge variant="destructive">88%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Por Aluno Tab */}
          <TabsContent value="alunos" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Alunos com Mais Faltas</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-center">Total Faltas</TableHead>
                      <TableHead className="text-center">Justificadas</TableHead>
                      <TableHead className="text-center">Injustificadas</TableHead>
                      <TableHead>Última Falta</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosFaltas.map((aluno) => {
                      const injustificadas = aluno.totalFaltas - aluno.justificadas;
                      const emRisco = injustificadas >= 5;
                      return (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-mono">{aluno.numero}</TableCell>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-center font-medium">
                            {aluno.totalFaltas}
                          </TableCell>
                          <TableCell className="text-center text-secondary">
                            {aluno.justificadas}
                          </TableCell>
                          <TableCell className="text-center text-destructive font-medium">
                            {injustificadas}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(aluno.ultimaFalta)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={emRisco ? "destructive" : "secondary"}
                              className={emRisco ? "" : "border-secondary text-secondary"}
                            >
                              {emRisco ? "Em Risco" : "Regular"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricoAssiduidadeModal;
