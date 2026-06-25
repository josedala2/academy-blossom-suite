import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  ClipboardList,
  FileText,
  Search,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turma: ClassItem | null;
}

// Mock data — em produção viriam do backend filtrados por turma.id
const mockEstudantes = [
  { numero: "2024001", nome: "João Manuel Silva", media: 14.5, estado: "Activo" },
  { numero: "2024002", nome: "Ana Beatriz Santos", media: 16.2, estado: "Activo" },
  { numero: "2024003", nome: "Carlos Eduardo Mendes", media: 12.8, estado: "Activo" },
  { numero: "2024004", nome: "Diana Rosa Ferreira", media: 15.0, estado: "Activo" },
  { numero: "2024005", nome: "Emanuel José Costa", media: 13.7, estado: "Activo" },
  { numero: "2024006", nome: "Fernanda Lima", media: 11.4, estado: "Activo" },
  { numero: "2024007", nome: "Gabriel Neto", media: 17.1, estado: "Activo" },
  { numero: "2024008", nome: "Helena Costa", media: 10.2, estado: "Em Risco" },
];

const mockDisciplinas = [
  { codigo: "MAT", nome: "Matemática", carga: 6, professor: "Prof. António Fernandes", media: 13.4 },
  { codigo: "POR", nome: "Português", carga: 5, professor: "Prof.ª Maria Costa", media: 14.1 },
  { codigo: "FIS", nome: "Física", carga: 4, professor: "Prof. Pedro Santos", media: 12.8 },
  { codigo: "QUI", nome: "Química", carga: 4, professor: "Prof.ª Ana Neto", media: 13.0 },
  { codigo: "BIO", nome: "Biologia", carga: 3, professor: "Prof. Carlos Mendes", media: 14.5 },
  { codigo: "HIS", nome: "História", carga: 3, professor: "Prof.ª Rosa Oliveira", media: 15.2 },
  { codigo: "GEO", nome: "Geografia", carga: 3, professor: "Prof. João Baptista", media: 13.9 },
  { codigo: "ING", nome: "Inglês", carga: 3, professor: "Prof.ª Sofia Martins", media: 14.7 },
];

const mockProfessores = [
  { nome: "Prof. António Fernandes", disciplina: "Matemática", contacto: "923 111 222", email: "antonio.f@escola.ao" },
  { nome: "Prof.ª Maria Costa", disciplina: "Português", contacto: "923 222 333", email: "maria.c@escola.ao" },
  { nome: "Prof. Pedro Santos", disciplina: "Física", contacto: "923 333 444", email: "pedro.s@escola.ao" },
  { nome: "Prof.ª Ana Neto", disciplina: "Química", contacto: "923 444 555", email: "ana.n@escola.ao" },
  { nome: "Prof. Carlos Mendes", disciplina: "Biologia", contacto: "923 555 666", email: "carlos.m@escola.ao" },
];

const mockHorario = [
  { dia: "Segunda", aulas: ["08:00 Matemática", "09:00 Português", "10:00 Física", "11:00 Inglês"] },
  { dia: "Terça", aulas: ["08:00 Química", "09:00 Biologia", "10:00 História", "11:00 Geografia"] },
  { dia: "Quarta", aulas: ["08:00 Matemática", "09:00 Português", "10:00 Física", "11:00 Ed. Física"] },
  { dia: "Quinta", aulas: ["08:00 Química", "09:00 Biologia", "10:00 Inglês", "11:00 TIC"] },
  { dia: "Sexta", aulas: ["08:00 Matemática", "09:00 História", "10:00 Geografia", "11:00 Português"] },
];

const mockSumarios = [
  { data: "2026-06-24", disciplina: "Matemática", professor: "Prof. António Fernandes", conteudo: "Funções Quadráticas — resolução de equações e estudo do discriminante.", presencas: 33, faltas: 2 },
  { data: "2026-06-24", disciplina: "Português", professor: "Prof.ª Maria Costa", conteudo: "Análise textual: 'Mayombe' de Pepetela — contexto histórico.", presencas: 34, faltas: 1 },
  { data: "2026-06-23", disciplina: "Física", professor: "Prof. Pedro Santos", conteudo: "Cinemática — movimento rectilíneo uniforme. Exercícios de aplicação.", presencas: 32, faltas: 3 },
  { data: "2026-06-23", disciplina: "Química", professor: "Prof.ª Ana Neto", conteudo: "Tabela periódica — propriedades periódicas e tendências.", presencas: 35, faltas: 0 },
  { data: "2026-06-22", disciplina: "Biologia", professor: "Prof. Carlos Mendes", conteudo: "Sistema digestivo humano — órgãos e funções.", presencas: 33, faltas: 2 },
  { data: "2026-06-22", disciplina: "História", professor: "Prof.ª Rosa Oliveira", conteudo: "Independência de Angola — contexto político e social.", presencas: 34, faltas: 1 },
];

const DetalhesTurmaModal = ({ open, onOpenChange, turma }: Props) => {
  const [filtroSumario, setFiltroSumario] = useState("");
  const [filtroEstudante, setFiltroEstudante] = useState("");

  const sumariosFiltrados = useMemo(
    () =>
      mockSumarios.filter(
        (s) =>
          s.disciplina.toLowerCase().includes(filtroSumario.toLowerCase()) ||
          s.conteudo.toLowerCase().includes(filtroSumario.toLowerCase()) ||
          s.professor.toLowerCase().includes(filtroSumario.toLowerCase())
      ),
    [filtroSumario]
  );

  const estudantesFiltrados = useMemo(
    () =>
      mockEstudantes.filter(
        (e) =>
          e.nome.toLowerCase().includes(filtroEstudante.toLowerCase()) ||
          e.numero.includes(filtroEstudante)
      ),
    [filtroEstudante]
  );

  if (!turma) return null;

  const ocupacao = Math.round((turma.students / turma.capacity) * 100);
  const mediaGeral =
    mockEstudantes.reduce((acc, e) => acc + e.media, 0) / mockEstudantes.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-6 w-6 text-primary" />
            {turma.name}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" /> {turma.room}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {turma.shift}
            </Badge>
            <Badge variant="secondary">Director: {turma.director}</Badge>
            <Badge>{turma.students}/{turma.capacity} estudantes</Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="geral" className="mt-2">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 h-auto">
            <TabsTrigger value="geral" className="text-xs">Geral</TabsTrigger>
            <TabsTrigger value="estudantes" className="text-xs">Estudantes</TabsTrigger>
            <TabsTrigger value="professores" className="text-xs">Professores</TabsTrigger>
            <TabsTrigger value="disciplinas" className="text-xs">Disciplinas</TabsTrigger>
            <TabsTrigger value="horario" className="text-xs">Horário</TabsTrigger>
            <TabsTrigger value="sumarios" className="text-xs">Sumários</TabsTrigger>
          </TabsList>

          {/* GERAL */}
          <TabsContent value="geral" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Estudantes</p>
                      <p className="text-2xl font-bold text-primary">{turma.students}</p>
                    </div>
                    <Users className="h-7 w-7 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Disciplinas</p>
                      <p className="text-2xl font-bold text-secondary">{mockDisciplinas.length}</p>
                    </div>
                    <BookOpen className="h-7 w-7 text-secondary/60" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Professores</p>
                      <p className="text-2xl font-bold text-accent">{mockProfessores.length}</p>
                    </div>
                    <GraduationCap className="h-7 w-7 text-accent/60" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Média Geral</p>
                      <p className="text-2xl font-bold">{mediaGeral.toFixed(1)}</p>
                    </div>
                    <TrendingUp className="h-7 w-7 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Taxa de Ocupação</p>
                  <span className="text-sm font-bold">{ocupacao}%</span>
                </div>
                <Progress value={ocupacao} className="h-3" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Director de Turma</p>
                  <p className="font-medium">{turma.director}</p>
                  <Separator />
                  <p className="text-xs text-muted-foreground">Ano Lectivo</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 2025/2026
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Sala</p>
                  <p className="font-medium">{turma.room}</p>
                  <Separator />
                  <p className="text-xs text-muted-foreground">Turno</p>
                  <p className="font-medium">{turma.shift}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ESTUDANTES */}
          <TabsContent value="estudantes" className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou número..."
                className="pl-10"
                value={filtroEstudante}
                onChange={(e) => setFiltroEstudante(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudantesFiltrados.map((e) => (
                    <TableRow key={e.numero}>
                      <TableCell className="font-mono text-xs">{e.numero}</TableCell>
                      <TableCell className="font-medium">{e.nome}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={e.media >= 14 ? "default" : e.media >= 10 ? "secondary" : "destructive"}>
                          {e.media.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            e.estado === "Activo"
                              ? "border-primary text-primary"
                              : "border-destructive text-destructive"
                          }
                        >
                          {e.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* PROFESSORES */}
          <TabsContent value="professores" className="space-y-3 mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="hidden sm:table-cell">Contacto</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProfessores.map((p) => (
                    <TableRow key={p.nome}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.disciplina}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs">{p.contacto}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* DISCIPLINAS */}
          <TabsContent value="disciplinas" className="space-y-3 mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">Carga (h/sem)</TableHead>
                    <TableHead className="hidden sm:table-cell">Professor</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDisciplinas.map((d) => (
                    <TableRow key={d.codigo}>
                      <TableCell className="font-mono text-xs">{d.codigo}</TableCell>
                      <TableCell className="font-medium">{d.nome}</TableCell>
                      <TableCell className="text-center">{d.carga}h</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{d.professor}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={d.media >= 14 ? "default" : d.media >= 10 ? "secondary" : "destructive"}>
                          {d.media.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* HORÁRIO */}
          <TabsContent value="horario" className="space-y-3 mt-4">
            <div className="grid gap-3">
              {mockHorario.map((d) => (
                <Card key={d.dia}>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {d.dia}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {d.aulas.map((a, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SUMÁRIOS */}
          <TabsContent value="sumarios" className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar sumário, disciplina ou professor..."
                className="pl-10"
                value={filtroSumario}
                onChange={(e) => setFiltroSumario(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {sumariosFiltrados.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    Nenhum sumário encontrado.
                  </CardContent>
                </Card>
              ) : (
                sumariosFiltrados.map((s, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">{s.disciplina}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(s.data).toLocaleDateString("pt-PT")}
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="secondary" className="gap-1">
                            <ClipboardList className="h-3 w-3" /> {s.presencas} pres.
                          </Badge>
                          <Badge variant="outline" className="border-destructive text-destructive">
                            {s.faltas} faltas
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.conteudo}</p>
                      <p className="text-xs text-muted-foreground italic">— {s.professor}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesTurmaModal;
