import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  BookOpen,
  Users,
  FileText,
  Calendar,
  GraduationCap,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface VerPerfilProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSendEmail: (teacher: Teacher) => void;
}

// Mock generators based on teacher data
const generateSumarios = (teacher: Teacher) => {
  const conteudos = [
    "Introdução ao tema da unidade",
    "Revisão de conceitos anteriores",
    "Exercícios práticos em grupo",
    "Avaliação formativa",
    "Resolução de problemas",
    "Apresentação de projecto",
    "Debate sobre o conteúdo",
    "Trabalho de casa corrigido",
  ];
  return Array.from({ length: 8 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 3);
    const subject = teacher.subjects[i % teacher.subjects.length] || "Disciplina";
    const cls = teacher.classes[i % teacher.classes.length] || "Turma";
    return {
      id: i + 1,
      data: d.toLocaleDateString("pt-PT"),
      turma: cls,
      disciplina: subject,
      conteudo: conteudos[i % conteudos.length],
      presentes: 25 + ((i * 3) % 10),
      faltas: (i * 2) % 6,
    };
  });
};

const generateHorario = (teacher: Teacher) => {
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const horas = ["08:00 - 09:30", "09:45 - 11:15", "11:30 - 13:00", "14:00 - 15:30"];
  const aulas: { dia: string; hora: string; turma: string; disciplina: string }[] = [];
  dias.forEach((dia, di) => {
    horas.slice(0, 2 + (di % 2)).forEach((hora, hi) => {
      aulas.push({
        dia,
        hora,
        turma: teacher.classes[(di + hi) % teacher.classes.length] || "—",
        disciplina:
          teacher.subjects[(di + hi) % teacher.subjects.length] || "—",
      });
    });
  });
  return aulas;
};

const generateAvaliacoes = (teacher: Teacher) =>
  teacher.classes.flatMap((cls, ci) =>
    teacher.subjects.slice(0, 2).map((sub, si) => ({
      id: `${ci}-${si}`,
      turma: cls,
      disciplina: sub,
      tipo: ["Teste", "Prova", "Trabalho"][(ci + si) % 3],
      data: new Date(Date.now() - (ci + si) * 86400000 * 5).toLocaleDateString(
        "pt-PT",
      ),
      media: (12 + ((ci + si) % 6) + Math.random()).toFixed(1),
    })),
  );

const VerPerfilProfessorModal = ({
  isOpen,
  onClose,
  teacher,
  onSendEmail,
}: VerPerfilProfessorModalProps) => {
  if (!teacher) return null;

  const sumarios = generateSumarios(teacher);
  const horario = generateHorario(teacher);
  const avaliacoes = generateAvaliacoes(teacher);
  const totalAulas = sumarios.length + 42;
  const totalAlunos = teacher.classes.length * 28;
  const mediaGeral =
    avaliacoes.length > 0
      ? (
          avaliacoes.reduce((acc, a) => acc + parseFloat(a.media), 0) /
          avaliacoes.length
        ).toFixed(1)
      : "—";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Perfil do Professor</DialogTitle>
        </DialogHeader>

        {/* Header com Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="h-20 w-20 rounded-full gradient-hero flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary-foreground">
              {teacher.name
                .replace("Prof. ", "")
                .replace("Prof.ª ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground truncate">
              {teacher.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant={teacher.status === "active" ? "default" : "secondary"}
                className={
                  teacher.status === "active"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : ""
                }
              >
                {teacher.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {teacher.email}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> {teacher.phone}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="geral" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="turmas">Turmas</TabsTrigger>
            <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
            <TabsTrigger value="horario">Horário</TabsTrigger>
            <TabsTrigger value="sumarios">Sumários</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-3">
            <TabsContent value="geral" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{teacher.classes.length}</p>
                    <p className="text-xs text-muted-foreground">Turmas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <BookOpen className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{teacher.subjects.length}</p>
                    <p className="text-xs text-muted-foreground">Disciplinas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <GraduationCap className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{totalAlunos}</p>
                    <p className="text-xs text-muted-foreground">Alunos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <TrendingUp className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{mediaGeral}</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Resumo de Actividade
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Aulas leccionadas</p>
                      <p className="font-medium">{totalAulas}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sumários registados</p>
                      <p className="font-medium">{sumarios.length + 30}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avaliações criadas</p>
                      <p className="font-medium">{avaliacoes.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assiduidade</p>
                      <p className="font-medium text-primary">96%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="turmas" className="space-y-2 mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacher.classes.map((cls, i) => (
                    <TableRow key={cls}>
                      <TableCell className="font-medium">{cls}</TableCell>
                      <TableCell>{25 + (i % 8)}</TableCell>
                      <TableCell>
                        {teacher.subjects[i % teacher.subjects.length]}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {(13 + (i % 5) + Math.random()).toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="disciplinas" className="space-y-2 mt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {teacher.subjects.map((subject, i) => (
                  <Card key={subject}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {subject}
                        </h4>
                        <Badge variant="outline">{4 + (i % 3)}h/sem</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Turmas: {teacher.classes.slice(0, 2).join(", ")}
                      </p>
                      <div className="flex gap-3 text-xs pt-1">
                        <span>Aulas: <strong>{32 + i * 2}</strong></span>
                        <span>Média: <strong>{(13 + (i % 5)).toFixed(1)}</strong></span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="horario" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Disciplina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {horario.map((h, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{h.dia}</TableCell>
                      <TableCell className="text-sm">{h.hora}</TableCell>
                      <TableCell>{h.turma}</TableCell>
                      <TableCell>{h.disciplina}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sumarios" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="hidden md:table-cell">Conteúdo</TableHead>
                    <TableHead>Pres./Falt.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sumarios.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm">{s.data}</TableCell>
                      <TableCell>{s.turma}</TableCell>
                      <TableCell>{s.disciplina}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {s.conteudo}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="text-primary">{s.presentes}</span>
                        {" / "}
                        <span className="text-destructive">{s.faltas}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="avaliacoes" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoes.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-sm">{a.data}</TableCell>
                      <TableCell>{a.turma}</TableCell>
                      <TableCell>{a.disciplina}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{a.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            parseFloat(a.media) >= 10
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }
                        >
                          {a.media}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Acções */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onSendEmail(teacher);
              onClose();
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
          <Button variant="outline" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Horário Completo
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Perfil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerPerfilProfessorModal;
