import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Clock, BookOpen, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduleEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface CriarHorarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: { turma: string; semestre: string; entries: ScheduleEntry[] }) => void;
}

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const timeSlots = [
  "07:30 - 08:15",
  "08:15 - 09:00",
  "09:15 - 10:00",
  "10:00 - 10:45",
  "11:00 - 11:45",
  "11:45 - 12:30",
  "14:00 - 14:45",
  "14:45 - 15:30",
  "15:45 - 16:30",
  "16:30 - 17:15",
];

const subjects = [
  "Matemática",
  "Português",
  "Inglês",
  "Física",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Ed. Física",
  "Filosofia",
  "Desenho",
  "Informática",
];

const teachers = [
  "Prof. António Silva",
  "Prof.ª Maria Santos",
  "Prof.ª Ana Costa",
  "Prof. Pedro Fernandes",
  "Prof.ª Rosa Oliveira",
  "Prof.ª Luísa Pereira",
  "Prof. Carlos Nunes",
  "Prof. João Martins",
  "Prof. Manuel Gomes",
];

const rooms = [
  "Sala 101",
  "Sala 102",
  "Sala 201",
  "Sala 202",
  "Lab. Física",
  "Lab. Química",
  "Lab. Bio",
  "Lab. Informática",
  "Ginásio",
  "Biblioteca",
];

const CriarHorarioModal = ({
  isOpen,
  onClose,
  onSave,
}: CriarHorarioModalProps) => {
  const { toast } = useToast();
  const [turma, setTurma] = useState("");
  const [semestre, setSemestre] = useState("");
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  
  // Form state for new entry
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const handleAddEntry = () => {
    if (!newDay || !newTime || !newSubject || !newTeacher || !newRoom) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar uma aula.",
        variant: "destructive",
      });
      return;
    }

    // Check for conflicts
    const hasConflict = entries.some(
      (entry) => entry.day === newDay && entry.time === newTime
    );

    if (hasConflict) {
      toast({
        title: "Conflito de horário",
        description: `Já existe uma aula ${newDay} às ${newTime}.`,
        variant: "destructive",
      });
      return;
    }

    const newEntry: ScheduleEntry = {
      id: Date.now().toString(),
      day: newDay,
      time: newTime,
      subject: newSubject,
      teacher: newTeacher,
      room: newRoom,
    };

    setEntries([...entries, newEntry]);

    // Reset form
    setNewDay("");
    setNewTime("");
    setNewSubject("");
    setNewTeacher("");
    setNewRoom("");

    toast({
      title: "Aula adicionada",
      description: `${newSubject} - ${newDay} às ${newTime}`,
    });
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aula removida",
      description: "A aula foi removida do horário.",
    });
  };

  const handleSubmit = () => {
    if (!turma || !semestre) {
      toast({
        title: "Campos obrigatórios",
        description: "Seleccione a turma e o semestre.",
        variant: "destructive",
      });
      return;
    }

    if (entries.length === 0) {
      toast({
        title: "Horário vazio",
        description: "Adicione pelo menos uma aula ao horário.",
        variant: "destructive",
      });
      return;
    }

    onSave({ turma, semestre, entries });

    toast({
      title: "Horário criado!",
      description: `Horário da turma ${turma} foi criado com sucesso.`,
    });

    // Reset form
    setTurma("");
    setSemestre("");
    setEntries([]);
    onClose();
  };

  const handleClose = () => {
    setTurma("");
    setSemestre("");
    setEntries([]);
    setNewDay("");
    setNewTime("");
    setNewSubject("");
    setNewTeacher("");
    setNewRoom("");
    onClose();
  };

  // Group entries by day for display
  const entriesByDay = days.reduce((acc, day) => {
    acc[day] = entries.filter((entry) => entry.day === day).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, ScheduleEntry[]>);

  const subjectColors: Record<string, string> = {
    "Matemática": "bg-primary/10 text-primary",
    "Português": "bg-secondary/10 text-secondary",
    "Inglês": "bg-accent/10 text-accent",
    "Física": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Química": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "Biologia": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "História": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    "Geografia": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    "Ed. Física": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    "Filosofia": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    "Desenho": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    "Informática": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Criar Novo Horário
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turma">Turma *</Label>
                <Select value={turma} onValueChange={setTurma}>
                  <SelectTrigger id="turma">
                    <SelectValue placeholder="Seleccione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10ª A">10ª Classe A</SelectItem>
                    <SelectItem value="10ª B">10ª Classe B</SelectItem>
                    <SelectItem value="11ª A">11ª Classe A</SelectItem>
                    <SelectItem value="11ª B">11ª Classe B</SelectItem>
                    <SelectItem value="12ª A">12ª Classe A</SelectItem>
                    <SelectItem value="12ª B">12ª Classe B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre *</Label>
                <Select value={semestre} onValueChange={setSemestre}>
                  <SelectTrigger id="semestre">
                    <SelectValue placeholder="Seleccione o semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1sem">1º Semestre</SelectItem>
                    <SelectItem value="2sem">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add New Entry Form */}
            <Card className="p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Aula
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="newDay">Dia</Label>
                  <Select value={newDay} onValueChange={setNewDay}>
                    <SelectTrigger id="newDay">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newTime">Hora</Label>
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger id="newTime">
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSubject">Disciplina</Label>
                  <Select value={newSubject} onValueChange={setNewSubject}>
                    <SelectTrigger id="newSubject">
                      <SelectValue placeholder="Disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newTeacher">Professor</Label>
                  <Select value={newTeacher} onValueChange={setNewTeacher}>
                    <SelectTrigger id="newTeacher">
                      <SelectValue placeholder="Professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher} value={teacher}>
                          {teacher}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newRoom">Sala</Label>
                  <Select value={newRoom} onValueChange={setNewRoom}>
                    <SelectTrigger id="newRoom">
                      <SelectValue placeholder="Sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="button"
                className="mt-4 w-full"
                variant="secondary"
                onClick={handleAddEntry}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Aula
              </Button>
            </Card>

            {/* Schedule Preview */}
            {entries.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Pré-visualização do Horário ({entries.length} aulas)
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {days.map((day) => (
                    <div key={day} className="space-y-2">
                      <div className="p-2 bg-muted rounded-lg text-center font-medium text-sm">
                        {day}
                      </div>
                      {entriesByDay[day].length > 0 ? (
                        entriesByDay[day].map((entry) => (
                          <Card
                            key={entry.id}
                            className={`p-2 text-xs relative group ${
                              subjectColors[entry.subject] || "bg-muted"
                            }`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleRemoveEntry(entry.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <p className="font-medium truncate">{entry.subject}</p>
                            <p className="flex items-center gap-1 opacity-80">
                              <Clock className="h-3 w-3" />
                              {entry.time.split(" - ")[0]}
                            </p>
                            <p className="flex items-center gap-1 opacity-70 truncate">
                              <User className="h-3 w-3" />
                              {entry.teacher.replace("Prof. ", "").replace("Prof.ª ", "")}
                            </p>
                            <p className="flex items-center gap-1 opacity-60 truncate">
                              <MapPin className="h-3 w-3" />
                              {entry.room}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <div className="p-2 border border-dashed rounded-lg text-center text-xs text-muted-foreground">
                          Sem aulas
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Horário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CriarHorarioModal;
