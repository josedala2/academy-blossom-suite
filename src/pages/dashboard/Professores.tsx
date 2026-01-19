import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Video,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VerPerfilProfessorModal from "@/components/modals/VerPerfilProfessorModal";
import EditarProfessorModal from "@/components/modals/EditarProfessorModal";
import EnviarEmailProfessorModal from "@/components/modals/EnviarEmailProfessorModal";
import NovoProfessorModal from "@/components/modals/NovoProfessorModal";
import VerHorarioProfessorModal from "@/components/modals/VerHorarioProfessorModal";
import ELearningModal from "@/components/modals/ELearningModal";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

const teachersData: Teacher[] = [
  {
    id: 1,
    name: "Prof. António Fernandes",
    email: "a.fernandes@sge.ao",
    phone: "923 111 222",
    subjects: ["Matemática", "Física"],
    classes: ["10ª A", "11ª B", "12ª A"],
    status: "active",
  },
  {
    id: 2,
    name: "Prof.ª Maria João Costa",
    email: "m.costa@sge.ao",
    phone: "924 222 333",
    subjects: ["Português", "Literatura"],
    classes: ["9ª A", "10ª B", "11ª A"],
    status: "active",
  },
  {
    id: 3,
    name: "Prof. Pedro Santos",
    email: "p.santos@sge.ao",
    phone: "925 333 444",
    subjects: ["História", "Geografia"],
    classes: ["8ª A", "9ª B", "10ª C"],
    status: "active",
  },
  {
    id: 4,
    name: "Prof.ª Ana Luísa Neto",
    email: "a.neto@sge.ao",
    phone: "926 444 555",
    subjects: ["Inglês"],
    classes: ["10ª A", "10ª B", "11ª A", "11ª B"],
    status: "active",
  },
  {
    id: 5,
    name: "Prof. Carlos Mendes",
    email: "c.mendes@sge.ao",
    phone: "927 555 666",
    subjects: ["Biologia", "Química"],
    classes: ["11ª A", "12ª A", "12ª B"],
    status: "inactive",
  },
  {
    id: 6,
    name: "Prof.ª Rosa Oliveira",
    email: "r.oliveira@sge.ao",
    phone: "928 666 777",
    subjects: ["Educação Física"],
    classes: ["8ª A", "8ª B", "9ª A", "9ª B"],
    status: "active",
  },
];

const Professores = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>(teachersData);

  // Modal states
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const [isELearningModalOpen, setIsELearningModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      !selectedSubject || selectedSubject === "all" || teacher.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const exportToExcel = () => {
    const exportData = filteredTeachers.map((t) => ({
      "Nome": t.name,
      "Email": t.email,
      "Telefone": t.phone,
      "Disciplinas": t.subjects.join(", "),
      "Turmas": t.classes.join(", "),
      "Estado": t.status === "active" ? "Activo" : "Inactivo",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Professores");
    XLSX.writeFile(wb, `professores_${new Date().toISOString().split("T")[0]}.xlsx`);

    toast({
      title: "Exportação concluída!",
      description: `${filteredTeachers.length} professores exportados para Excel.`,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lista de Professores", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-AO")}`, 14, 30);
    doc.text(`Total: ${filteredTeachers.length} professores`, 14, 36);

    const tableData = filteredTeachers.map((t) => [
      t.name,
      t.email,
      t.phone,
      t.subjects.join(", "),
      t.status === "active" ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      head: [["Nome", "Email", "Telefone", "Disciplinas", "Estado"]],
      body: tableData,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`professores_${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "Exportação concluída!",
      description: `${filteredTeachers.length} professores exportados para PDF.`,
    });
  };

  const handleVerPerfil = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsPerfilModalOpen(true);
  };

  const handleEditar = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditarModalOpen(true);
  };

  const handleEnviarEmail = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEmailModalOpen(true);
  };

  const handleVerHorario = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsHorarioModalOpen(true);
  };

  const handleELearning = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsELearningModalOpen(true);
  };

  const handleSaveTeacher = (data: {
    name: string;
    email: string;
    phone: string;
    subjects: string[];
    status: "active" | "inactive";
  }) => {
    if (selectedTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === selectedTeacher.id
            ? { ...t, ...data }
            : t
        )
      );
    }
  };

  const handleAddTeacher = (data: Teacher) => {
    setTeachers((prev) => [data, ...prev]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Professores
            </h1>
            <p className="text-muted-foreground">
              Gerir corpo docente, disciplinas e atribuições
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar para Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar para PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsNovoModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Professor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Professores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {teachers.filter((t) => t.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disciplinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">18</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Turmas Atribuídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">32</div>
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
                  placeholder="Pesquisar por nome ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                  <SelectItem value="Inglês">Inglês</SelectItem>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Química">Química</SelectItem>
                  <SelectItem value="Biologia">Biologia</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full gradient-hero flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {teacher.name
                          .replace("Prof. ", "")
                          .replace("Prof.ª ", "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleVerPerfil(teacher)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditar(teacher)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnviarEmail(teacher)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Disciplinas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="text-xs"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Turmas ({teacher.classes.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.slice(0, 3).map((cls) => (
                        <Badge key={cls} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                      {teacher.classes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.classes.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
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
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleELearning(teacher)}
                      className="text-primary"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      E-Learning
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVerHorario(teacher)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Horário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <VerPerfilProfessorModal
        isOpen={isPerfilModalOpen}
        onClose={() => setIsPerfilModalOpen(false)}
        teacher={selectedTeacher}
        onSendEmail={handleEnviarEmail}
      />

      <EditarProfessorModal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleSaveTeacher}
      />

      <EnviarEmailProfessorModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        teacher={selectedTeacher}
      />

      <NovoProfessorModal
        isOpen={isNovoModalOpen}
        onClose={() => setIsNovoModalOpen(false)}
        onSave={handleAddTeacher}
      />

      <VerHorarioProfessorModal
        isOpen={isHorarioModalOpen}
        onClose={() => setIsHorarioModalOpen(false)}
        teacher={selectedTeacher}
      />

      <ELearningModal
        isOpen={isELearningModalOpen}
        onClose={() => setIsELearningModalOpen(false)}
        teacher={selectedTeacher}
      />
    </DashboardLayout>
  );
};

export default Professores;
