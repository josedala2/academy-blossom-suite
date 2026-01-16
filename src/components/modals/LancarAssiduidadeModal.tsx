import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar, CheckCircle2, XCircle, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  numero: string;
  nome: string;
  status: string;
  presencas: number;
  faltas: number;
  justificadas: number;
}

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

interface LancarAssiduidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassItem | null;
  students: Student[];
}

type AttendanceStatus = "presente" | "falta" | "justificada" | "atraso";

interface AttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
  observation: string;
}

const disciplinas = [
  "Matemática",
  "Português",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "História",
  "Geografia",
  "Educação Física",
  "TIC",
];

const LancarAssiduidadeModal = ({
  open,
  onOpenChange,
  selectedClass,
  students,
}: LancarAssiduidadeModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [selectedTempo, setSelectedTempo] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    students.map((s) => ({
      studentId: s.id,
      status: "presente" as AttendanceStatus,
      observation: "",
    }))
  );
  const [selectAll, setSelectAll] = useState(true);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleObservationChange = (studentId: number, observation: string) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, observation } : record
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setAttendanceRecords((prev) =>
      prev.map((record) => ({
        ...record,
        status: checked ? "presente" : "falta",
      }))
    );
  };

  const handleSave = () => {
    if (!selectedDisciplina || !selectedTempo) {
      toast({
        title: "Campos obrigatórios",
        description: "Seleccione a disciplina e o tempo lectivo.",
        variant: "destructive",
      });
      return;
    }

    const presentes = attendanceRecords.filter((r) => r.status === "presente").length;
    const faltas = attendanceRecords.filter((r) => r.status === "falta").length;
    const justificadas = attendanceRecords.filter((r) => r.status === "justificada").length;
    const atrasos = attendanceRecords.filter((r) => r.status === "atraso").length;

    toast({
      title: "Assiduidade registada",
      description: `${presentes} presentes, ${faltas} faltas, ${justificadas} justificadas, ${atrasos} atrasos`,
    });
    onOpenChange(false);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "presente":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Presente
          </Badge>
        );
      case "falta":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="h-3 w-3 mr-1" />
            Falta
          </Badge>
        );
      case "justificada":
        return (
          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Justificada
          </Badge>
        );
      case "atraso":
        return (
          <Badge className="bg-accent/20 text-accent border-accent/30">
            <Clock className="h-3 w-3 mr-1" />
            Atraso
          </Badge>
        );
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "presente").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "falta").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Lançar Assiduidade - {selectedClass?.name}
          </DialogTitle>
          <DialogDescription>
            Registe a presença dos alunos para a aula
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Data</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Disciplina</Label>
              <Select
                value={selectedDisciplina}
                onValueChange={setSelectedDisciplina}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Tempo Lectivo</Label>
              <Select value={selectedTempo} onValueChange={setSelectedTempo}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Tempo (07:30 - 08:20)</SelectItem>
                  <SelectItem value="2">2º Tempo (08:20 - 09:10)</SelectItem>
                  <SelectItem value="3">3º Tempo (09:30 - 10:20)</SelectItem>
                  <SelectItem value="4">4º Tempo (10:20 - 11:10)</SelectItem>
                  <SelectItem value="5">5º Tempo (11:30 - 12:20)</SelectItem>
                  <SelectItem value="6">6º Tempo (12:20 - 13:10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-center">
              <p className="text-xl font-bold text-primary">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Presentes</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg text-center">
              <p className="text-xl font-bold text-destructive">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Faltas</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg text-center">
              <p className="text-xl font-bold text-secondary">
                {attendanceRecords.filter((r) => r.status === "justificada").length}
              </p>
              <p className="text-xs text-muted-foreground">Justificadas</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg text-center">
              <p className="text-xl font-bold text-accent">
                {attendanceRecords.filter((r) => r.status === "atraso").length}
              </p>
              <p className="text-xs text-muted-foreground">Atrasos</p>
            </div>
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Checkbox
              id="selectAll"
              checked={selectAll}
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
            />
            <Label htmlFor="selectAll" className="cursor-pointer">
              Marcar todos como presentes
            </Label>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Nº</TableHead>
                  <TableHead>Nome do Aluno</TableHead>
                  <TableHead className="w-40">Estado</TableHead>
                  <TableHead className="w-48">Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const record = attendanceRecords.find(
                    (r) => r.studentId === student.id
                  );
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">
                        {student.numero}
                      </TableCell>
                      <TableCell className="font-medium">{student.nome}</TableCell>
                      <TableCell>
                        <Select
                          value={record?.status || "presente"}
                          onValueChange={(value) =>
                            handleStatusChange(student.id, value as AttendanceStatus)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="presente">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                Presente
                              </span>
                            </SelectItem>
                            <SelectItem value="falta">
                              <span className="flex items-center gap-1">
                                <XCircle className="h-3 w-3 text-destructive" />
                                Falta
                              </span>
                            </SelectItem>
                            <SelectItem value="justificada">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-secondary" />
                                Justificada
                              </span>
                            </SelectItem>
                            <SelectItem value="atraso">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-accent" />
                                Atraso
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Observação..."
                          className="h-8 text-xs"
                          value={record?.observation || ""}
                          onChange={(e) =>
                            handleObservationChange(student.id, e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Assiduidade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LancarAssiduidadeModal;
