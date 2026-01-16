import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, Calendar, Users, Award } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  class: string;
  subject: string;
  date: string;
  status: string;
  weight: number;
}

interface VerNotasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}

// Mock data for grades
const mockGrades = [
  { id: 1, student: "João Silva", number: "2024001", grade: 14, observation: "" },
  { id: 2, student: "Ana Ferreira", number: "2024002", grade: 18, observation: "Excelente" },
  { id: 3, student: "Carlos Santos", number: "2024003", grade: 12, observation: "" },
  { id: 4, student: "Maria Neto", number: "2024004", grade: 16, observation: "" },
  { id: 5, student: "Pedro Mendes", number: "2024005", grade: 9, observation: "Recuperação" },
  { id: 6, student: "Luísa Costa", number: "2024006", grade: 15, observation: "" },
  { id: 7, student: "Ricardo Alves", number: "2024007", grade: 17, observation: "" },
  { id: 8, student: "Teresa Martins", number: "2024008", grade: 11, observation: "" },
];

const VerNotasModal = ({ open, onOpenChange, exam }: VerNotasModalProps) => {
  if (!exam) return null;

  const averageGrade = mockGrades.reduce((sum, g) => sum + g.grade, 0) / mockGrades.length;
  const passedCount = mockGrades.filter(g => g.grade >= 10).length;
  const failedCount = mockGrades.filter(g => g.grade < 10).length;
  const maxGrade = Math.max(...mockGrades.map(g => g.grade));
  const minGrade = Math.min(...mockGrades.map(g => g.grade));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Notas da Avaliação
          </DialogTitle>
          <DialogDescription>
            Visualização das notas lançadas para esta avaliação
          </DialogDescription>
        </DialogHeader>

        {/* Exam Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-lg">{exam.name}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {exam.class}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {exam.subject}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(exam.date).toLocaleDateString("pt-AO")}
            </span>
            <Badge variant="secondary">Peso: {exam.weight}%</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{averageGrade.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Média</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <div className="text-xs text-muted-foreground">Aprovados</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-xs text-muted-foreground">Reprovados</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{maxGrade}</div>
            <div className="text-xs text-muted-foreground">Máxima</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{minGrade}</div>
            <div className="text-xs text-muted-foreground">Mínima</div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead className="text-center">Nota</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-mono text-sm">{grade.number}</TableCell>
                  <TableCell className="font-medium">{grade.student}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={grade.grade >= 14 ? "default" : grade.grade >= 10 ? "secondary" : "destructive"}
                      className={
                        grade.grade >= 14
                          ? "bg-primary/10 text-primary"
                          : grade.grade >= 10
                          ? "bg-secondary/10 text-secondary-foreground"
                          : ""
                      }
                    >
                      {grade.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {grade.grade >= 10 ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Aprovado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-600">
                        Reprovado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {grade.observation || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            Editar Notas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerNotasModal;
