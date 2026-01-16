import { useState } from "react";
import {
  Plus,
  Download,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CriarHorarioModal from "@/components/modals/CriarHorarioModal";
import { useToast } from "@/hooks/use-toast";
const schedule = {
  "Segunda": [
    { time: "07:30 - 08:15", subject: "Matemática", teacher: "Prof. António", room: "Sala 101" },
    { time: "08:15 - 09:00", subject: "Matemática", teacher: "Prof. António", room: "Sala 101" },
    { time: "09:15 - 10:00", subject: "Português", teacher: "Prof.ª Maria", room: "Sala 101" },
    { time: "10:00 - 10:45", subject: "Português", teacher: "Prof.ª Maria", room: "Sala 101" },
    { time: "11:00 - 11:45", subject: "Inglês", teacher: "Prof.ª Ana", room: "Sala 101" },
    { time: "11:45 - 12:30", subject: "Física", teacher: "Prof. Pedro", room: "Lab. Física" },
  ],
  "Terça": [
    { time: "07:30 - 08:15", subject: "História", teacher: "Prof. Carlos", room: "Sala 101" },
    { time: "08:15 - 09:00", subject: "História", teacher: "Prof. Carlos", room: "Sala 101" },
    { time: "09:15 - 10:00", subject: "Química", teacher: "Prof.ª Rosa", room: "Lab. Química" },
    { time: "10:00 - 10:45", subject: "Química", teacher: "Prof.ª Rosa", room: "Lab. Química" },
    { time: "11:00 - 11:45", subject: "Geografia", teacher: "Prof. João", room: "Sala 101" },
    { time: "11:45 - 12:30", subject: "Ed. Física", teacher: "Prof. Manuel", room: "Ginásio" },
  ],
  "Quarta": [
    { time: "07:30 - 08:15", subject: "Biologia", teacher: "Prof.ª Luísa", room: "Lab. Bio" },
    { time: "08:15 - 09:00", subject: "Biologia", teacher: "Prof.ª Luísa", room: "Lab. Bio" },
    { time: "09:15 - 10:00", subject: "Matemática", teacher: "Prof. António", room: "Sala 101" },
    { time: "10:00 - 10:45", subject: "Português", teacher: "Prof.ª Maria", room: "Sala 101" },
    { time: "11:00 - 11:45", subject: "Inglês", teacher: "Prof.ª Ana", room: "Sala 101" },
    { time: "11:45 - 12:30", subject: "Inglês", teacher: "Prof.ª Ana", room: "Sala 101" },
  ],
  "Quinta": [
    { time: "07:30 - 08:15", subject: "Física", teacher: "Prof. Pedro", room: "Lab. Física" },
    { time: "08:15 - 09:00", subject: "Física", teacher: "Prof. Pedro", room: "Lab. Física" },
    { time: "09:15 - 10:00", subject: "Matemática", teacher: "Prof. António", room: "Sala 101" },
    { time: "10:00 - 10:45", subject: "Matemática", teacher: "Prof. António", room: "Sala 101" },
    { time: "11:00 - 11:45", subject: "História", teacher: "Prof. Carlos", room: "Sala 101" },
    { time: "11:45 - 12:30", subject: "Geografia", teacher: "Prof. João", room: "Sala 101" },
  ],
  "Sexta": [
    { time: "07:30 - 08:15", subject: "Português", teacher: "Prof.ª Maria", room: "Sala 101" },
    { time: "08:15 - 09:00", subject: "Português", teacher: "Prof.ª Maria", room: "Sala 101" },
    { time: "09:15 - 10:00", subject: "Química", teacher: "Prof.ª Rosa", room: "Lab. Química" },
    { time: "10:00 - 10:45", subject: "Biologia", teacher: "Prof.ª Luísa", room: "Lab. Bio" },
    { time: "11:00 - 11:45", subject: "Ed. Física", teacher: "Prof. Manuel", room: "Ginásio" },
    { time: "11:45 - 12:30", subject: "Ed. Física", teacher: "Prof. Manuel", room: "Ginásio" },
  ],
};

const subjectColors: Record<string, string> = {
  "Matemática": "bg-primary/10 text-primary border-primary/20",
  "Português": "bg-secondary/10 text-secondary border-secondary/20",
  "Inglês": "bg-accent/10 text-accent border-accent/20",
  "Física": "bg-blue-100 text-blue-700 border-blue-200",
  "Química": "bg-purple-100 text-purple-700 border-purple-200",
  "Biologia": "bg-green-100 text-green-700 border-green-200",
  "História": "bg-amber-100 text-amber-700 border-amber-200",
  "Geografia": "bg-teal-100 text-teal-700 border-teal-200",
  "Ed. Física": "bg-rose-100 text-rose-700 border-rose-200",
};

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const Horarios = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("10ª A");
  const [view, setView] = useState<"week" | "day">("week");
  const [isCriarModalOpen, setIsCriarModalOpen] = useState(false);

  const handleSaveSchedule = (scheduleData: { turma: string; semestre: string; entries: any[] }) => {
    console.log("Novo horário criado:", scheduleData);
    toast({
      title: "Horário criado com sucesso!",
      description: `Horário da turma ${scheduleData.turma} foi guardado.`,
    });
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Horários
            </h1>
            <p className="text-muted-foreground">
              Gestão de horários de aulas por turma
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={() => setIsCriarModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Horário
            </Button>
          </div>
        </div>

        {/* Create Schedule Modal */}
        <CriarHorarioModal
          isOpen={isCriarModalOpen}
          onClose={() => setIsCriarModalOpen(false)}
          onSave={handleSaveSchedule}
        />

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10ª A">10ª Classe A</SelectItem>
                    <SelectItem value="10ª B">10ª Classe B</SelectItem>
                    <SelectItem value="11ª A">11ª Classe A</SelectItem>
                    <SelectItem value="11ª B">11ª Classe B</SelectItem>
                    <SelectItem value="12ª A">12ª Classe A</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="1sem">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1sem">1º Semestre</SelectItem>
                    <SelectItem value="2sem">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={view === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("week")}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Semana
                </Button>
                <Button
                  variant={view === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("day")}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Dia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Horário - {selectedClass}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Semana Actual</span>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                  <div className="p-3 bg-muted rounded-lg text-center font-medium text-sm">
                    Hora
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="p-3 bg-muted rounded-lg text-center font-medium text-sm"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {schedule["Segunda"].map((slot, slotIndex) => (
                  <div key={slotIndex} className="grid grid-cols-6 gap-2 mb-2">
                    <div className="p-3 bg-muted/50 rounded-lg text-center text-sm font-medium">
                      {slot.time}
                    </div>
                    {days.map((day) => {
                      const daySchedule = schedule[day as keyof typeof schedule];
                      const lesson = daySchedule[slotIndex];
                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-lg border text-sm ${
                            subjectColors[lesson.subject] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <p className="font-medium">{lesson.subject}</p>
                          <p className="text-xs opacity-80">{lesson.teacher}</p>
                          <p className="text-xs opacity-60">{lesson.room}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3">Legenda:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(subjectColors).map(([subject, color]) => (
                  <Badge key={subject} variant="outline" className={color}>
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Horarios;
