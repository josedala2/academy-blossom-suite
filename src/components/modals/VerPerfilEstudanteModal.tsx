import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CreditCard,
  Calendar,
  Users,
  FileText,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: number;
  name: string;
  number: string;
  class: string;
  guardian: string;
  phone: string;
  status: string;
  payments: string;
}

interface VerPerfilEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSendEmail: () => void;
}

// Mock data — histórico académico do estudante
const getMatriculaInfo = (student: Student) => ({
  dataMatricula: "15/09/2021",
  numeroProcesso: `MAT-${student.number}-2021`,
  anoIngresso: "2021/2022",
  classeIngresso: "7ª Classe",
  modalidade: "Regular",
  documentosEntregues: [
    { nome: "Certidão de Nascimento", entregue: true },
    { nome: "Bilhete de Identidade", entregue: true },
    { nome: "Cartão de Vacinas", entregue: true },
    { nome: "Certificado da Classe Anterior", entregue: true },
    { nome: "Fotografias tipo passe (4)", entregue: true },
    { nome: "Atestado Médico", entregue: false },
  ],
});

const getAnosLectivos = (student: Student) => [
  {
    ano: "2024/2025",
    classe: student.class,
    turma: student.class,
    status: "actual",
    mediaFinal: null,
    aprovado: null,
    frequencia: 94,
    disciplinas: 9,
    diretor: "Prof. Carlos Mendes",
  },
  {
    ano: "2023/2024",
    classe: "9ª Classe",
    turma: "9ª B",
    status: "concluido",
    mediaFinal: 15.8,
    aprovado: true,
    frequencia: 92,
    disciplinas: 9,
    diretor: "Prof. Ana Silva",
  },
  {
    ano: "2022/2023",
    classe: "8ª Classe",
    turma: "8ª A",
    status: "concluido",
    mediaFinal: 14.2,
    aprovado: true,
    frequencia: 89,
    disciplinas: 8,
    diretor: "Prof. João Pereira",
  },
  {
    ano: "2021/2022",
    classe: "7ª Classe",
    turma: "7ª C",
    status: "concluido",
    mediaFinal: 13.5,
    aprovado: true,
    frequencia: 91,
    disciplinas: 8,
    diretor: "Prof. Maria Lopes",
  },
];

const getNotasAnoActual = () => [
  { disciplina: "Matemática", t1: 14, t2: 15, t3: null, media: 14.5 },
  { disciplina: "Português", t1: 16, t2: 17, t3: null, media: 16.5 },
  { disciplina: "Inglês", t1: 15, t2: 14, t3: null, media: 14.5 },
  { disciplina: "Física", t1: 13, t2: 14, t3: null, media: 13.5 },
  { disciplina: "Química", t1: 14, t2: 15, t3: null, media: 14.5 },
  { disciplina: "Biologia", t1: 16, t2: 16, t3: null, media: 16.0 },
  { disciplina: "História", t1: 15, t2: 16, t3: null, media: 15.5 },
  { disciplina: "Geografia", t1: 14, t2: 15, t3: null, media: 14.5 },
  { disciplina: "Educação Física", t1: 17, t2: 18, t3: null, media: 17.5 },
];

const getHistoricoPropinas = () => [
  { mes: "Janeiro 2025", valor: "45.000,00 Kz", status: "pago", data: "05/01/2025" },
  { mes: "Fevereiro 2025", valor: "45.000,00 Kz", status: "pago", data: "03/02/2025" },
  { mes: "Março 2025", valor: "45.000,00 Kz", status: "pago", data: "07/03/2025" },
  { mes: "Abril 2025", valor: "45.000,00 Kz", status: "pendente", data: "—" },
];

const getOcorrencias = () => [
  {
    data: "12/03/2025",
    tipo: "Mérito",
    descricao: "Destaque na Olimpíada de Matemática — 2º lugar",
  },
  {
    data: "08/11/2024",
    tipo: "Mérito",
    descricao: "Melhor aluno do trimestre",
  },
  {
    data: "20/05/2024",
    tipo: "Advertência",
    descricao: "Falta sem justificação à aula de Física",
  },
];

const VerPerfilEstudanteModal = ({
  isOpen,
  onClose,
  student,
  onSendEmail,
}: VerPerfilEstudanteModalProps) => {
  if (!student) return null;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const matricula = getMatriculaInfo(student);
  const anosLectivos = getAnosLectivos(student);
  const notas = getNotasAnoActual();
  const propinas = getHistoricoPropinas();
  const ocorrencias = getOcorrencias();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil Completo do Estudante
          </DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary">
              {getInitials(student.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{student.name}</h2>
            <p className="text-sm text-muted-foreground">Nº {student.number}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{student.class}</Badge>
              <Badge
                className={
                  student.status === "active"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : ""
                }
                variant={student.status === "active" ? "default" : "secondary"}
              >
                {student.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                Matriculado desde {matricula.anoIngresso}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="geral" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="matricula">Matrícula</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="notas">Ano Actual</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-4">
            {/* Geral */}
            <TabsContent value="geral" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Anos Lectivos</p>
                  <p className="text-2xl font-bold text-primary">{anosLectivos.length}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Aprovações</p>
                  <p className="text-2xl font-bold text-green-600">
                    {anosLectivos.filter((a) => a.aprovado).length}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Média Global</p>
                  <p className="text-2xl font-bold">14.5</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Frequência</p>
                  <p className="text-2xl font-bold">94%</p>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Ocorrências & Mérito
                </h3>
                <div className="space-y-2">
                  {ocorrencias.map((o, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/40">
                      <Badge
                        variant={o.tipo === "Mérito" ? "default" : "destructive"}
                        className="flex-shrink-0"
                      >
                        {o.tipo}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{o.descricao}</p>
                        <p className="text-xs text-muted-foreground">{o.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Encarregado de Educação
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{student.guardian}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">email@exemplo.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Luanda, Angola</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Matrícula */}
            <TabsContent value="matricula" className="space-y-4 mt-0">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Dados da Matrícula
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Nº Processo</p>
                    <p className="font-medium">{matricula.numeroProcesso}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Matrícula</p>
                    <p className="font-medium">{matricula.dataMatricula}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ano de Ingresso</p>
                    <p className="font-medium">{matricula.anoIngresso}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Classe de Ingresso</p>
                    <p className="font-medium">{matricula.classeIngresso}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Modalidade</p>
                    <p className="font-medium">{matricula.modalidade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmada
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3">Documentos Entregues</h3>
                <div className="space-y-1.5">
                  {matricula.documentosEntregues.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/40"
                    >
                      <span>{doc.nome}</span>
                      {doc.entregue ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Entregue
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" /> Pendente
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Histórico — Anos Lectivos */}
            <TabsContent value="historico" className="space-y-3 mt-0">
              {anosLectivos.map((ano, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{ano.ano}</h3>
                        {ano.status === "actual" ? (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            Em Curso
                          </Badge>
                        ) : ano.aprovado ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Aprovado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Reprovado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ano.classe} • Turma {ano.turma}
                      </p>
                    </div>
                    {ano.mediaFinal !== null && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Média Final</p>
                        <p className="text-2xl font-bold text-primary">{ano.mediaFinal}</p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Frequência</p>
                        <p className="font-medium">{ano.frequencia}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Disciplinas</p>
                        <p className="font-medium">{ano.disciplinas}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Director</p>
                        <p className="font-medium truncate">{ano.diretor}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Notas Ano Actual */}
            <TabsContent value="notas" className="space-y-3 mt-0">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" /> Notas — 2024/2025
                  </h3>
                  <Badge variant="outline">{student.class}</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disciplina</TableHead>
                      <TableHead className="text-center">T1</TableHead>
                      <TableHead className="text-center">T2</TableHead>
                      <TableHead className="text-center">T3</TableHead>
                      <TableHead className="text-center">Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notas.map((n, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{n.disciplina}</TableCell>
                        <TableCell className="text-center">{n.t1}</TableCell>
                        <TableCell className="text-center">{n.t2}</TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {n.t3 ?? "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              n.media >= 10
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {n.media}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Financeiro */}
            <TabsContent value="financeiro" className="space-y-3 mt-0">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Histórico de Propinas
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data Pagamento</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propinas.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{p.mes}</TableCell>
                        <TableCell>{p.valor}</TableCell>
                        <TableCell className="text-muted-foreground">{p.data}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              p.status === "pago"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            }
                          >
                            {p.status === "pago" ? "Pago" : "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerPerfilEstudanteModal;
