import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VerNotasModal from "@/components/modals/VerNotasModal";
import NovaAvaliacaoModal from "@/components/modals/NovaAvaliacaoModal";
import { GerarBoletinsModal } from "@/components/modals/GerarBoletinsModal";

const exams = [
  {
    id: 1,
    name: "Teste 1 - Matemática",
    class: "10ª A",
    subject: "Matemática",
    date: "2026-01-20",
    status: "scheduled",
    weight: 25,
  },
  {
    id: 2,
    name: "Exame Trimestral - Português",
    class: "11ª B",
    subject: "Português",
    date: "2026-01-25",
    status: "scheduled",
    weight: 40,
  },
  {
    id: 3,
    name: "Teste 2 - Física",
    class: "12ª A",
    subject: "Física",
    date: "2026-01-15",
    status: "completed",
    weight: 25,
  },
  {
    id: 4,
    name: "Trabalho de Grupo - História",
    class: "9ª C",
    subject: "História",
    date: "2026-01-18",
    status: "grading",
    weight: 15,
  },
];

const grades = [
  {
    student: "João Silva",
    class: "10ª A",
    math: 14,
    port: 16,
    eng: 15,
    phys: 13,
    chem: 14,
    bio: 15,
    hist: 17,
    geo: 14,
    average: 14.75,
  },
  {
    student: "Ana Ferreira",
    class: "10ª A",
    math: 18,
    port: 17,
    eng: 19,
    phys: 16,
    chem: 17,
    bio: 18,
    hist: 16,
    geo: 17,
    average: 17.25,
  },
  {
    student: "Carlos Santos",
    class: "10ª A",
    math: 12,
    port: 14,
    eng: 13,
    phys: 11,
    chem: 12,
    bio: 14,
    hist: 15,
    geo: 13,
    average: 13.0,
  },
  {
    student: "Maria Neto",
    class: "10ª A",
    math: 16,
    port: 15,
    eng: 17,
    phys: 15,
    chem: 16,
    bio: 16,
    hist: 14,
    geo: 15,
    average: 15.5,
  },
];

interface Exam {
  id: number;
  name: string;
  class: string;
  subject: string;
  date: string;
  status: string;
  weight: number;
}

const Avaliacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isNovaAvaliacaoOpen, setIsNovaAvaliacaoOpen] = useState(false);
  const [isVerNotasOpen, setIsVerNotasOpen] = useState(false);
  const [isGerarBoletinsOpen, setIsGerarBoletinsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleVerNotas = (exam: Exam) => {
    setSelectedExam(exam);
    setIsVerNotasOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Avaliações e Notas
            </h1>
            <p className="text-muted-foreground">
              Gestão de exames, testes e lançamento de notas
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Pautas
            </Button>
            <Button onClick={() => setIsNovaAvaliacaoOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avaliações Agendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Correção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Notas Lançadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">847</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Média Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">14.2</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exams">Avaliações</TabsTrigger>
            <TabsTrigger value="grades">Pauta de Notas</TabsTrigger>
            <TabsTrigger value="reports">Boletins</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar avaliação..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="10ª A">10ª A</SelectItem>
                      <SelectItem value="10ª B">10ª B</SelectItem>
                      <SelectItem value="11ª A">11ª A</SelectItem>
                      <SelectItem value="11ª B">11ª B</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="math">Matemática</SelectItem>
                      <SelectItem value="port">Português</SelectItem>
                      <SelectItem value="phys">Física</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Exams Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {exams.map((exam) => (
                <Card key={exam.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="outline"
                        className={
                          exam.status === "scheduled"
                            ? "border-secondary text-secondary"
                            : exam.status === "completed"
                            ? "border-primary text-primary"
                            : "border-accent text-accent"
                        }
                      >
                        {exam.status === "scheduled"
                          ? "Agendado"
                          : exam.status === "completed"
                          ? "Concluído"
                          : "Em Correção"}
                      </Badge>
                      <Badge variant="secondary">{exam.weight}%</Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{exam.name}</CardTitle>
                    <CardDescription>
                      {exam.class} • {exam.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(exam.date).toLocaleDateString("pt-AO")}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {exam.status === "completed" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleVerNotas(exam)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Notas
                        </Button>
                      ) : exam.status === "grading" ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleVerNotas(exam)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Lançar Notas
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pauta de Notas - 10ª A</CardTitle>
                    <CardDescription>1º Trimestre 2026</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="1tri">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1tri">1º Trimestre</SelectItem>
                        <SelectItem value="2tri">2º Trimestre</SelectItem>
                        <SelectItem value="3tri">3º Trimestre</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudante</TableHead>
                      <TableHead className="text-center">Mat</TableHead>
                      <TableHead className="text-center">Port</TableHead>
                      <TableHead className="text-center">Ing</TableHead>
                      <TableHead className="text-center">Fís</TableHead>
                      <TableHead className="text-center">Quím</TableHead>
                      <TableHead className="text-center">Bio</TableHead>
                      <TableHead className="text-center">Hist</TableHead>
                      <TableHead className="text-center">Geo</TableHead>
                      <TableHead className="text-center font-bold">Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {grade.student}
                        </TableCell>
                        <TableCell className="text-center">{grade.math}</TableCell>
                        <TableCell className="text-center">{grade.port}</TableCell>
                        <TableCell className="text-center">{grade.eng}</TableCell>
                        <TableCell className="text-center">{grade.phys}</TableCell>
                        <TableCell className="text-center">{grade.chem}</TableCell>
                        <TableCell className="text-center">{grade.bio}</TableCell>
                        <TableCell className="text-center">{grade.hist}</TableCell>
                        <TableCell className="text-center">{grade.geo}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={grade.average >= 14 ? "default" : "destructive"}
                            className={
                              grade.average >= 14
                                ? "bg-primary/10 text-primary"
                                : ""
                            }
                          >
                            {grade.average.toFixed(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Boletins de Notas</CardTitle>
                <CardDescription>
                  Gere e imprima boletins individuais dos estudantes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Selecione uma turma para gerar boletins
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Escolha a turma e o período para gerar os boletins individuais
                  </p>
                  <Button onClick={() => setIsGerarBoletinsOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Boletins
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <NovaAvaliacaoModal
          open={isNovaAvaliacaoOpen}
          onOpenChange={setIsNovaAvaliacaoOpen}
        />

        <VerNotasModal
          open={isVerNotasOpen}
          onOpenChange={setIsVerNotasOpen}
          exam={selectedExam}
        />

        <GerarBoletinsModal
          open={isGerarBoletinsOpen}
          onOpenChange={setIsGerarBoletinsOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Avaliacoes;
