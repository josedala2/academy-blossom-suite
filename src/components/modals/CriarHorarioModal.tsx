import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Clock, BookOpen, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

// Schema principal do formulário
const horarioFormSchema = z.object({
  turma: z.string().min(1, { message: "Seleccione a turma" }),
  semestre: z.string().min(1, { message: "Seleccione o semestre" }),
});

// Schema para adicionar nova aula
const aulaFormSchema = z.object({
  day: z.string().min(1, { message: "Seleccione o dia" }),
  time: z.string().min(1, { message: "Seleccione a hora" }),
  subject: z.string().min(1, { message: "Seleccione a disciplina" }),
  teacher: z.string().min(1, { message: "Seleccione o professor" }),
  room: z.string().min(1, { message: "Seleccione a sala" }),
});

type HorarioFormData = z.infer<typeof horarioFormSchema>;
type AulaFormData = z.infer<typeof aulaFormSchema>;

const CriarHorarioModal = ({
  isOpen,
  onClose,
  onSave,
}: CriarHorarioModalProps) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);

  const mainForm = useForm<HorarioFormData>({
    resolver: zodResolver(horarioFormSchema),
    defaultValues: {
      turma: "",
      semestre: "",
    },
  });

  const aulaForm = useForm<AulaFormData>({
    resolver: zodResolver(aulaFormSchema),
    defaultValues: {
      day: "",
      time: "",
      subject: "",
      teacher: "",
      room: "",
    },
  });

  const handleAddEntry = (data: AulaFormData) => {
    // Check for conflicts
    const hasConflict = entries.some(
      (entry) => entry.day === data.day && entry.time === data.time
    );

    if (hasConflict) {
      toast({
        title: "Conflito de horário",
        description: `Já existe uma aula ${data.day} às ${data.time}.`,
        variant: "destructive",
      });
      return;
    }

    const newEntry: ScheduleEntry = {
      id: Date.now().toString(),
      day: data.day,
      time: data.time,
      subject: data.subject,
      teacher: data.teacher,
      room: data.room,
    };

    setEntries([...entries, newEntry]);
    aulaForm.reset();

    toast({
      title: "Aula adicionada",
      description: `${data.subject} - ${data.day} às ${data.time}`,
    });
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aula removida",
      description: "A aula foi removida do horário.",
    });
  };

  const handleSubmit = (data: HorarioFormData) => {
    if (entries.length === 0) {
      toast({
        title: "Horário vazio",
        description: "Adicione pelo menos uma aula ao horário.",
        variant: "destructive",
      });
      return;
    }

    onSave({ turma: data.turma, semestre: data.semestre, entries });

    toast({
      title: "Horário criado!",
      description: `Horário da turma ${data.turma} foi criado com sucesso.`,
    });

    // Reset form
    mainForm.reset();
    aulaForm.reset();
    setEntries([]);
    onClose();
  };

  const handleClose = () => {
    mainForm.reset();
    aulaForm.reset();
    setEntries([]);
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
            <Form {...mainForm}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={mainForm.control}
                  name="turma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione a turma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="10ª A">10ª Classe A</SelectItem>
                          <SelectItem value="10ª B">10ª Classe B</SelectItem>
                          <SelectItem value="11ª A">11ª Classe A</SelectItem>
                          <SelectItem value="11ª B">11ª Classe B</SelectItem>
                          <SelectItem value="12ª A">12ª Classe A</SelectItem>
                          <SelectItem value="12ª B">12ª Classe B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mainForm.control}
                  name="semestre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semestre *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione o semestre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1sem">1º Semestre</SelectItem>
                          <SelectItem value="2sem">2º Semestre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            {/* Add New Entry Form */}
            <Card className="p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Aula
              </h3>
              <Form {...aulaForm}>
                <form onSubmit={aulaForm.handleSubmit(handleAddEntry)}>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <FormField
                      control={aulaForm.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Dia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={aulaForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hora" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={aulaForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disciplina</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Disciplina" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={aulaForm.control}
                      name="teacher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Professor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher} value={teacher}>
                                  {teacher}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={aulaForm.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sala</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sala" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rooms.map((room) => (
                                <SelectItem key={room} value={room}>
                                  {room}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-4 w-full"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Aula
                  </Button>
                </form>
              </Form>
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
          <Button onClick={mainForm.handleSubmit(handleSubmit)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Horário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CriarHorarioModal;