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
import DashboardLayout from "@/components/layout/DashboardLayout";

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

const Turmas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || cls.level === selectedLevel;
    const matchesShift = !selectedShift || cls.shift === selectedShift;
    return matchesSearch && matchesLevel && matchesShift;
  });

  const totalStudents = classes.reduce((acc, cls) => acc + cls.students, 0);
  const totalCapacity = classes.reduce((acc, cls) => acc + cls.capacity, 0);

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
          <Button>
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
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Estudantes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Horário
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Turmas;
