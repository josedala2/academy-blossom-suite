import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserPlus,
  FileSpreadsheet,
  FileText,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NovaMatriculaModal from "@/components/modals/NovaMatriculaModal";
import VerPerfilEstudanteModal from "@/components/modals/VerPerfilEstudanteModal";
import EditarEstudanteModal from "@/components/modals/EditarEstudanteModal";
import EnviarEmailEstudanteModal from "@/components/modals/EnviarEmailEstudanteModal";
import ConfirmarEliminarEstudanteModal from "@/components/modals/ConfirmarEliminarEstudanteModal";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const students = [
  {
    id: 1,
    name: "João Manuel Silva",
    number: "2024001",
    class: "10ª A",
    guardian: "Maria Silva",
    phone: "923 456 789",
    status: "active",
    payments: "ok",
  },
  {
    id: 2,
    name: "Ana Luísa Ferreira",
    number: "2024002",
    class: "10ª A",
    guardian: "Pedro Ferreira",
    phone: "924 567 890",
    status: "active",
    payments: "pending",
  },
  {
    id: 3,
    name: "Carlos Eduardo Santos",
    number: "2024003",
    class: "11ª B",
    guardian: "Luísa Santos",
    phone: "925 678 901",
    status: "active",
    payments: "ok",
  },
  {
    id: 4,
    name: "Maria José Neto",
    number: "2024004",
    class: "9ª C",
    guardian: "António Neto",
    phone: "926 789 012",
    status: "inactive",
    payments: "overdue",
  },
  {
    id: 5,
    name: "Pedro Joaquim Costa",
    number: "2024005",
    class: "12ª A",
    guardian: "Rosa Costa",
    phone: "927 890 123",
    status: "active",
    payments: "ok",
  },
  {
    id: 6,
    name: "Luísa Margarida Oliveira",
    number: "2024006",
    class: "8ª B",
    guardian: "Manuel Oliveira",
    phone: "928 901 234",
    status: "active",
    payments: "ok",
  },
];

const Estudantes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentsList, setStudentsList] = useState<Student[]>(students);

  const filteredStudents = studentsList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.number.includes(searchTerm);
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleVerPerfil = (student: Student) => {
    setSelectedStudent(student);
    setIsPerfilModalOpen(true);
  };

  const handleEditar = (student: Student) => {
    setSelectedStudent(student);
    setIsEditarModalOpen(true);
  };

  const handleEnviarEmail = (student: Student) => {
    setSelectedStudent(student);
    setIsEmailModalOpen(true);
  };

  const handleEliminar = (student: Student) => {
    setSelectedStudent(student);
    setIsEliminarModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleConfirmDelete = (studentId: number) => {
    setStudentsList((prev) => prev.filter((s) => s.id !== studentId));
    toast({
      title: "Estudante eliminado",
      description: "O estudante foi removido do sistema com sucesso.",
    });
  };

  const exportToExcel = () => {
    const exportData = filteredStudents.map((student) => ({
      "Nº Matrícula": student.number,
      "Nome": student.name,
      "Turma": student.class,
      "Encarregado": student.guardian,
      "Telefone": student.phone,
      "Estado": student.status === "active" ? "Activo" : "Inactivo",
      "Propinas": student.payments === "ok" ? "Em dia" : student.payments === "pending" ? "Pendente" : "Em atraso",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudantes");
    
    // Set column widths
    ws["!cols"] = [
      { wch: 12 }, // Nº Matrícula
      { wch: 30 }, // Nome
      { wch: 10 }, // Turma
      { wch: 25 }, // Encarregado
      { wch: 15 }, // Telefone
      { wch: 10 }, // Estado
      { wch: 12 }, // Propinas
    ];

    XLSX.writeFile(wb, `estudantes_${new Date().toISOString().split("T")[0]}.xlsx`);
    
    toast({
      title: "Exportação concluída!",
      description: `${filteredStudents.length} estudantes exportados para Excel.`,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Lista de Estudantes", 14, 22);
    
    // Subtitle with date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-AO")}`, 14, 30);
    doc.text(`Total: ${filteredStudents.length} estudantes`, 14, 36);

    // Table data
    const tableData = filteredStudents.map((student) => [
      student.number,
      student.name,
      student.class,
      student.guardian,
      student.phone,
      student.status === "active" ? "Activo" : "Inactivo",
      student.payments === "ok" ? "Em dia" : student.payments === "pending" ? "Pendente" : "Atraso",
    ]);

    autoTable(doc, {
      head: [["Nº", "Nome", "Turma", "Encarregado", "Telefone", "Estado", "Propinas"]],
      body: tableData,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`estudantes_${new Date().toISOString().split("T")[0]}.pdf`);
    
    toast({
      title: "Exportação concluída!",
      description: `${filteredStudents.length} estudantes exportados para PDF.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Estudantes
            </h1>
            <p className="text-muted-foreground">
              Gerir matrículas, perfis e informações dos estudantes
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
            <Button onClick={() => setIsMatriculaModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nova Matrícula
            </Button>
          </div>
        </div>

        {/* Modal Nova Matrícula */}
        <NovaMatriculaModal
          open={isMatriculaModalOpen}
          onOpenChange={setIsMatriculaModalOpen}
        />

        {/* Modal Ver Perfil */}
        <VerPerfilEstudanteModal
          isOpen={isPerfilModalOpen}
          onClose={() => setIsPerfilModalOpen(false)}
          student={selectedStudent}
          onSendEmail={() => {
            setIsPerfilModalOpen(false);
            setIsEmailModalOpen(true);
          }}
        />

        {/* Modal Editar */}
        <EditarEstudanteModal
          isOpen={isEditarModalOpen}
          onClose={() => setIsEditarModalOpen(false)}
          student={selectedStudent}
          onSave={handleSaveStudent}
        />

        {/* Modal Enviar Email */}
        <EnviarEmailEstudanteModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          student={selectedStudent}
        />

        {/* Modal Confirmar Eliminar */}
        <ConfirmarEliminarEstudanteModal
          isOpen={isEliminarModalOpen}
          onClose={() => setIsEliminarModalOpen(false)}
          student={selectedStudent}
          onConfirm={handleConfirmDelete}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Estudantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Matrículas Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,198</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Com Propinas Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">12</div>
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
                  placeholder="Pesquisar por nome ou número..."
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
                  <SelectItem value="12ª A">12ª A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Nº</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Propinas</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.number}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.class}</Badge>
                    </TableCell>
                    <TableCell>{student.guardian}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {student.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                        className={
                          student.status === "active"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : ""
                        }
                      >
                        {student.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.payments === "ok"
                            ? "border-primary text-primary"
                            : student.payments === "pending"
                            ? "border-accent text-accent"
                            : "border-destructive text-destructive"
                        }
                      >
                        {student.payments === "ok"
                          ? "Em dia"
                          : student.payments === "pending"
                          ? "Pendente"
                          : "Atraso"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerPerfil(student)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditar(student)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEnviarEmail(student)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleEliminar(student)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredStudents.length} de {studentsList.length} estudantes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Estudantes;
