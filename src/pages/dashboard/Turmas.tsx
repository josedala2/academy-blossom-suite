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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

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

// Sample students data
const sampleStudents = [
  { id: 1, numero: "2024001", nome: "João Manuel Silva", status: "active" },
  { id: 2, numero: "2024002", nome: "Ana Beatriz Santos", status: "active" },
  { id: 3, numero: "2024003", nome: "Carlos Eduardo Mendes", status: "active" },
  { id: 4, numero: "2024004", nome: "Diana Rosa Ferreira", status: "active" },
  { id: 5, numero: "2024005", nome: "Emanuel José Costa", status: "active" },
];

// Sample schedule data
const sampleSchedule = [
  { dia: "Segunda", horarios: ["08:00 - Matemática", "09:00 - Português", "10:00 - Física"] },
  { dia: "Terça", horarios: ["08:00 - Química", "09:00 - Biologia", "10:00 - Inglês"] },
  { dia: "Quarta", horarios: ["08:00 - História", "09:00 - Geografia", "10:00 - Ed. Física"] },
  { dia: "Quinta", horarios: ["08:00 - Matemática", "09:00 - Português", "10:00 - Física"] },
  { dia: "Sexta", horarios: ["08:00 - Química", "09:00 - Biologia", "10:00 - TIC"] },
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    </DashboardLayout>
  );
};

export default Turmas;
