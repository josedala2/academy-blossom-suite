import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  BookOpen,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LancarAssiduidadeModal from "@/components/modals/LancarAssiduidadeModal";
import HistoricoAssiduidadeModal from "@/components/modals/HistoricoAssiduidadeModal";
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
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
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

const classes = [
  {
    id: 1,
    name: "10ª Classe A",
    level: "10ª",
    section: "A",
    shift: "Manhã",
    room: "Sala 101",
    students: 35,
    capacity: 40,
    director: "Prof. António Fernandes",
    subjects: 12,
    status: "active",
  },
  {
    id: 2,
    name: "10ª Classe B",
    level: "10ª",
    section: "B",
    shift: "Tarde",
    room: "Sala 102",
    students: 38,
    capacity: 40,
    director: "Prof.ª Maria Costa",
    subjects: 12,
    status: "active",
  },
  {
    id: 3,
    name: "11ª Classe A",
    level: "11ª",
    section: "A",
    shift: "Manhã",
    room: "Sala 201",
    students: 32,
    capacity: 40,
    director: "Prof. Pedro Santos",
    subjects: 10,
    status: "active",
  },
  {
    id: 4,
    name: "11ª Classe B",
    level: "11ª",
    section: "B",
    shift: "Tarde",
    room: "Sala 202",
    students: 30,
    capacity: 40,
    director: "Prof.ª Ana Neto",
    subjects: 10,
    status: "active",
  },
  {
    id: 5,
    name: "12ª Classe A",
    level: "12ª",
    section: "A",
    shift: "Manhã",
    room: "Sala 301",
    students: 28,
    capacity: 35,
    director: "Prof. Carlos Mendes",
    subjects: 8,
    status: "active",
  },
  {
    id: 6,
    name: "9ª Classe A",
    level: "9ª",
    section: "A",
    shift: "Manhã",
    room: "Sala 001",
    students: 40,
    capacity: 40,
    director: "Prof.ª Rosa Oliveira",
    subjects: 14,
    status: "active",
  },
];

// Sample students data with attendance
const sampleStudents = [
  { id: 1, numero: "2024001", nome: "João Manuel Silva", status: "active", presencas: 18, faltas: 2, justificadas: 1 },
  { id: 2, numero: "2024002", nome: "Ana Beatriz Santos", status: "active", presencas: 20, faltas: 0, justificadas: 0 },
  { id: 3, numero: "2024003", nome: "Carlos Eduardo Mendes", status: "active", presencas: 15, faltas: 5, justificadas: 2 },
  { id: 4, numero: "2024004", nome: "Diana Rosa Ferreira", status: "active", presencas: 19, faltas: 1, justificadas: 0 },
  { id: 5, numero: "2024005", nome: "Emanuel José Costa", status: "active", presencas: 17, faltas: 3, justificadas: 1 },
  { id: 6, numero: "2024006", nome: "Fernanda Lima", status: "active", presencas: 16, faltas: 4, justificadas: 3 },
  { id: 7, numero: "2024007", nome: "Gabriel Neto", status: "active", presencas: 20, faltas: 0, justificadas: 0 },
  { id: 8, numero: "2024008", nome: "Helena Costa", status: "active", presencas: 14, faltas: 6, justificadas: 2 },
];

// Sample schedule data
const sampleSchedule = [
  { dia: "Segunda", horarios: ["08:00 - Matemática", "09:00 - Português", "10:00 - Física"] },
  { dia: "Terça", horarios: ["08:00 - Química", "09:00 - Biologia", "10:00 - Inglês"] },
  { dia: "Quarta", horarios: ["08:00 - História", "09:00 - Geografia", "10:00 - Ed. Física"] },
  { dia: "Quinta", horarios: ["08:00 - Matemática", "09:00 - Português", "10:00 - Física"] },
  { dia: "Sexta", horarios: ["08:00 - Química", "09:00 - Biologia", "10:00 - TIC"] },
];

// Attendance data by class
const attendanceByClassData = [
  { turma: "10ª A", presenca: 92, faltas: 8 },
  { turma: "10ª B", presenca: 88, faltas: 12 },
  { turma: "11ª A", presenca: 95, faltas: 5 },
  { turma: "11ª B", presenca: 85, faltas: 15 },
  { turma: "12ª A", presenca: 97, faltas: 3 },
  { turma: "12ª B", presenca: 90, faltas: 10 },
];

// Weekly attendance trend
const weeklyAttendanceData = [
  { semana: "Sem 1", presenca: 91 },
  { semana: "Sem 2", presenca: 93 },
  { semana: "Sem 3", presenca: 89 },
  { semana: "Sem 4", presenca: 94 },
  { semana: "Sem 5", presenca: 92 },
  { semana: "Sem 6", presenca: 96 },
];

// Attendance distribution
const attendanceDistributionData = [
  { name: "Presentes", value: 847, color: "hsl(var(--primary))" },
  { name: "Faltas Justificadas", value: 68, color: "hsl(var(--secondary))" },
  { name: "Faltas Injustificadas", value: 32, color: "hsl(var(--destructive))" },
];

// Daily attendance for heatmap
const dailyAttendanceMap = [
  { dia: "Seg", "10ª A": 95, "10ª B": 90, "11ª A": 97, "11ª B": 88, "12ª A": 98, "12ª B": 92 },
  { dia: "Ter", "10ª A": 92, "10ª B": 88, "11ª A": 95, "11ª B": 85, "12ª A": 96, "12ª B": 90 },
  { dia: "Qua", "10ª A": 88, "10ª B": 85, "11ª A": 92, "11ª B": 82, "12ª A": 94, "12ª B": 88 },
  { dia: "Qui", "10ª A": 93, "10ª B": 91, "11ª A": 96, "11ª B": 87, "12ª A": 97, "12ª B": 91 },
  { dia: "Sex", "10ª A": 90, "10ª B": 87, "11ª A": 94, "11ª B": 84, "12ª A": 95, "12ª B": 89 },
];

const Turmas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [classesList, setClassesList] = useState<ClassItem[]>(classes);

  // Modal states
  const [isNovaTurmaOpen, setIsNovaTurmaOpen] = useState(false);
  const [isVerDetalhesOpen, setIsVerDetalhesOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isEliminarOpen, setIsEliminarOpen] = useState(false);
  const [isEstudantesOpen, setIsEstudantesOpen] = useState(false);
  const [isHorarioOpen, setIsHorarioOpen] = useState(false);
  const [isAssiduidadeOpen, setIsAssiduidadeOpen] = useState(false);
  const [isLancarAssiduidadeOpen, setIsLancarAssiduidadeOpen] = useState(false);
  const [isHistoricoAssiduidadeOpen, setIsHistoricoAssiduidadeOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Form state for new/edit class
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    section: "",
    shift: "",
    room: "",
    capacity: 40,
    director: "",
  });

  const filteredClasses = classesList.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || selectedLevel === "all" || cls.level === selectedLevel;
    const matchesShift = !selectedShift || selectedShift === "all" || cls.shift === selectedShift;
    return matchesSearch && matchesLevel && matchesShift;
  });

  const totalStudents = classesList.reduce((acc, cls) => acc + cls.students, 0);
  const totalCapacity = classesList.reduce((acc, cls) => acc + cls.capacity, 0);

  const handleVerDetalhes = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsVerDetalhesOpen(true);
  };

  const handleEditar = (cls: ClassItem) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level,
      section: cls.section,
      shift: cls.shift,
      room: cls.room,
      capacity: cls.capacity,
      director: cls.director,
    });
    setIsEditarOpen(true);
  };

  const handleEliminar = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsEliminarOpen(true);
  };

  const handleVerEstudantes = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsEstudantesOpen(true);
  };

  const handleVerHorario = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsHorarioOpen(true);
  };

  const handleVerAssiduidade = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsAssiduidadeOpen(true);
  };

  const handleLancarAssiduidade = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsLancarAssiduidadeOpen(true);
  };

  const handleHistoricoAssiduidade = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsHistoricoAssiduidadeOpen(true);
  };

  const handleSaveNewTurma = () => {
    const newClass: ClassItem = {
      id: classesList.length + 1,
      name: `${formData.level} Classe ${formData.section}`,
      level: formData.level,
      section: formData.section,
      shift: formData.shift,
      room: formData.room,
      students: 0,
      capacity: formData.capacity,
      director: formData.director,
      subjects: 10,
      status: "active",
    };
    setClassesList([...classesList, newClass]);
    setIsNovaTurmaOpen(false);
    setFormData({ name: "", level: "", section: "", shift: "", room: "", capacity: 40, director: "" });
    toast({ title: "Turma criada", description: `${newClass.name} foi criada com sucesso.` });
  };

  const handleSaveEdit = () => {
    if (selectedClass) {
      setClassesList((prev) =>
        prev.map((c) =>
          c.id === selectedClass.id
            ? { ...c, ...formData, name: `${formData.level} Classe ${formData.section}` }
            : c
        )
      );
      setIsEditarOpen(false);
      toast({ title: "Turma actualizada", description: "Os dados da turma foram actualizados." });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedClass) {
      setClassesList((prev) => prev.filter((c) => c.id !== selectedClass.id));
      setIsEliminarOpen(false);
      toast({ title: "Turma eliminada", description: `${selectedClass.name} foi removida do sistema.` });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Turmas
            </h1>
            <p className="text-muted-foreground">
              Gerir turmas, salas e atribuições de professores
            </p>
          </div>
          <Button onClick={() => setIsNovaTurmaOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Turmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Estudantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Capacidade Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{totalCapacity}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa Ocupação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {Math.round((totalStudents / totalCapacity) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="turmas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="turmas">Turmas</TabsTrigger>
            <TabsTrigger value="assiduidade">Mapa de Assiduidade</TabsTrigger>
          </TabsList>

          <TabsContent value="turmas" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar turma..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="8ª">8ª Classe</SelectItem>
                      <SelectItem value="9ª">9ª Classe</SelectItem>
                      <SelectItem value="10ª">10ª Classe</SelectItem>
                      <SelectItem value="11ª">11ª Classe</SelectItem>
                      <SelectItem value="12ª">12ª Classe</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Classes Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="card-hover">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {cls.room} • {cls.shift}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleVerDetalhes(cls)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditar(cls)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleEliminar(cls)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {cls.students}/{cls.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-secondary" />
                    <span>{cls.subjects} disciplinas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>{cls.shift}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ocupação</span>
                    <span className="font-medium">
                      {Math.round((cls.students / cls.capacity) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(cls.students / cls.capacity) * 100}
                    className="h-2"
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Director de Turma
                  </p>
                  <p className="text-sm font-medium">{cls.director}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVerEstudantes(cls)}>
                    <Users className="h-4 w-4 mr-1" />
                    Estudantes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVerHorario(cls)}>
                    <Clock className="h-4 w-4 mr-1" />
                    Horário
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleVerAssiduidade(cls)} title="Ver Assiduidade">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleHistoricoAssiduidade(cls)} title="Histórico de Assiduidade">
                    <History className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleLancarAssiduidade(cls)} title="Lançar Assiduidade">
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
          </TabsContent>

          <TabsContent value="assiduidade" className="space-y-6">
            {/* Attendance Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa Média Presença</p>
                      <p className="text-2xl font-bold text-primary">91.5%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Faltas Justificadas</p>
                      <p className="text-2xl font-bold text-secondary">68</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Faltas Injustificadas</p>
                      <p className="text-2xl font-bold text-destructive">32</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alunos em Risco</p>
                      <p className="text-2xl font-bold text-accent">12</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Attendance by Class */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Assiduidade por Turma</CardTitle>
                  <CardDescription className="text-xs">Taxa de presença (%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceByClassData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="turma" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Presença %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tendência Semanal</CardTitle>
                  <CardDescription className="text-xs">Evolução da assiduidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
                        <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="presenca" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                          name="Presença %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Pie */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Distribuição</CardTitle>
                  <CardDescription className="text-xs">Presenças vs Faltas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {attendanceDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mapa de Assiduidade Semanal</CardTitle>
                <CardDescription>Taxa de presença (%) por turma e dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Dia</TableHead>
                        <TableHead className="text-center">10ª A</TableHead>
                        <TableHead className="text-center">10ª B</TableHead>
                        <TableHead className="text-center">11ª A</TableHead>
                        <TableHead className="text-center">11ª B</TableHead>
                        <TableHead className="text-center">12ª A</TableHead>
                        <TableHead className="text-center">12ª B</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyAttendanceMap.map((row) => (
                        <TableRow key={row.dia}>
                          <TableCell className="font-medium">{row.dia}</TableCell>
                          {["10ª A", "10ª B", "11ª A", "11ª B", "12ª A", "12ª B"].map((turma) => {
                            const value = row[turma as keyof typeof row] as number;
                            const bgColor = value >= 95 ? "bg-primary/20 text-primary" 
                              : value >= 90 ? "bg-secondary/20 text-secondary"
                              : value >= 85 ? "bg-accent/20 text-accent"
                              : "bg-destructive/20 text-destructive";
                            return (
                              <TableCell key={turma} className="text-center">
                                <span className={`inline-flex items-center justify-center w-12 h-8 rounded-md font-medium text-sm ${bgColor}`}>
                                  {value}%
                                </span>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Students with low attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alunos com Baixa Assiduidade</CardTitle>
                <CardDescription>Estudantes com menos de 85% de presença</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-center">Presenças</TableHead>
                      <TableHead className="text-center">Faltas</TableHead>
                      <TableHead className="text-center">Justificadas</TableHead>
                      <TableHead className="text-center">Taxa</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleStudents
                      .filter(s => (s.presencas / (s.presencas + s.faltas)) * 100 < 85)
                      .map((student) => {
                        const taxa = Math.round((student.presencas / (student.presencas + student.faltas)) * 100);
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono">{student.numero}</TableCell>
                            <TableCell className="font-medium">{student.nome}</TableCell>
                            <TableCell className="text-center">{student.presencas}</TableCell>
                            <TableCell className="text-center text-destructive">{student.faltas}</TableCell>
                            <TableCell className="text-center text-secondary">{student.justificadas}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="destructive">{taxa}%</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-destructive text-destructive">
                                Em Risco
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
      </div>

      {/* Modal Nova Turma */}
      <Dialog open={isNovaTurmaOpen} onOpenChange={setIsNovaTurmaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Turma</DialogTitle>
            <DialogDescription>Criar uma nova turma no sistema</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Classe</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8ª">8ª</SelectItem>
                    <SelectItem value="9ª">9ª</SelectItem>
                    <SelectItem value="10ª">10ª</SelectItem>
                    <SelectItem value="11ª">11ª</SelectItem>
                    <SelectItem value="12ª">12ª</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Secção</Label>
                <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Turno</Label>
                <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sala</Label>
                <Input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="Ex: Sala 101" />
              </div>
            </div>
            <div>
              <Label>Director de Turma</Label>
              <Input value={formData.director} onChange={(e) => setFormData({ ...formData, director: e.target.value })} placeholder="Nome do professor" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNovaTurmaOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewTurma}>Criar Turma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ver Detalhes */}
      <Dialog open={isVerDetalhesOpen} onOpenChange={setIsVerDetalhesOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClass?.name}</DialogTitle>
            <DialogDescription>Detalhes completos da turma</DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sala</p>
                  <p className="font-medium">{selectedClass.room}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Turno</p>
                  <p className="font-medium">{selectedClass.shift}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Estudantes</p>
                  <p className="font-medium">{selectedClass.students}/{selectedClass.capacity}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Disciplinas</p>
                  <p className="font-medium">{selectedClass.subjects}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Director de Turma</p>
                <p className="font-medium">{selectedClass.director}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Taxa de Ocupação</p>
                <Progress value={(selectedClass.students / selectedClass.capacity) * 100} className="h-3" />
                <p className="text-sm font-medium text-right">{Math.round((selectedClass.students / selectedClass.capacity) * 100)}%</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>Actualizar dados de {selectedClass?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Turno</Label>
                <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sala</Label>
                <Input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Director de Turma</Label>
              <Input value={formData.director} onChange={(e) => setFormData({ ...formData, director: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditarOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar */}
      <AlertDialog open={isEliminarOpen} onOpenChange={setIsEliminarOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar a turma {selectedClass?.name}? Esta acção não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Estudantes */}
      <Dialog open={isEstudantesOpen} onOpenChange={setIsEstudantesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estudantes - {selectedClass?.name}</DialogTitle>
            <DialogDescription>{selectedClass?.students} estudantes matriculados</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">{student.numero}</TableCell>
                  <TableCell>{student.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary text-primary">Activo</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Modal Horário */}
      <Dialog open={isHorarioOpen} onOpenChange={setIsHorarioOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Horário - {selectedClass?.name}</DialogTitle>
            <DialogDescription>Horário semanal da turma</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {sampleSchedule.map((dia) => (
              <div key={dia.dia} className="p-3 border rounded-lg">
                <p className="font-medium text-sm mb-2">{dia.dia}</p>
                <div className="flex flex-wrap gap-2">
                  {dia.horarios.map((h, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Assiduidade por Turma */}
      <Dialog open={isAssiduidadeOpen} onOpenChange={setIsAssiduidadeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Mapa de Assiduidade - {selectedClass?.name}</DialogTitle>
            <DialogDescription>Registo detalhado de presenças e faltas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">92%</p>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary">18</p>
                <p className="text-sm text-muted-foreground">Faltas Justificadas</p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-destructive">7</p>
                <p className="text-sm text-muted-foreground">Faltas Injustificadas</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Presenças</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleStudents.map((student) => {
                  const taxa = Math.round((student.presencas / (student.presencas + student.faltas)) * 100);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono">{student.numero}</TableCell>
                      <TableCell>{student.nome}</TableCell>
                      <TableCell className="text-center text-primary font-medium">{student.presencas}</TableCell>
                      <TableCell className="text-center text-destructive font-medium">{student.faltas}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={taxa >= 90 ? "default" : taxa >= 75 ? "secondary" : "destructive"}>
                          {taxa}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Lançar Assiduidade */}
      <LancarAssiduidadeModal
        open={isLancarAssiduidadeOpen}
        onOpenChange={setIsLancarAssiduidadeOpen}
        selectedClass={selectedClass}
        students={sampleStudents}
      />

      {/* Modal Histórico Assiduidade */}
      <HistoricoAssiduidadeModal
        open={isHistoricoAssiduidadeOpen}
        onOpenChange={setIsHistoricoAssiduidadeOpen}
        selectedClass={selectedClass}
      />
    </DashboardLayout>
  );
};

export default Turmas;
