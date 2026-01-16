import { useState, useEffect } from "react";
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
import { Edit, Trash2 } from "lucide-react";

interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface EditarAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  day: string;
  onSave: (day: string, originalTime: string, updatedLesson: Lesson) => void;
  onDelete: (day: string, time: string) => void;
}

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
  "Prof. António",
  "Prof.ª Maria",
  "Prof.ª Ana",
  "Prof. Pedro",
  "Prof.ª Rosa",
  "Prof.ª Luísa",
  "Prof. Carlos",
  "Prof. João",
  "Prof. Manuel",
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

const EditarAulaModal = ({
  isOpen,
  onClose,
  lesson,
  day,
  onSave,
  onDelete,
}: EditarAulaModalProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (lesson) {
      setSubject(lesson.subject);
      setTeacher(lesson.teacher);
      setRoom(lesson.room);
    }
  }, [lesson]);

  const handleSubmit = () => {
    if (!subject || !teacher || !room) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (!lesson) return;

    const updatedLesson: Lesson = {
      time: lesson.time,
      subject,
      teacher,
      room,
    };

    onSave(day, lesson.time, updatedLesson);

    toast({
      title: "Aula actualizada!",
      description: `${subject} - ${day} às ${lesson.time}`,
    });

    onClose();
  };

  const handleDelete = () => {
    if (!lesson) return;
    
    onDelete(day, lesson.time);
    
    toast({
      title: "Aula removida",
      description: `A aula de ${lesson.subject} foi removida.`,
    });
    
    onClose();
  };

  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Aula
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info fixa */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{day}</p>
            <p className="text-sm text-muted-foreground">{lesson.time}</p>
          </div>

          {/* Disciplina */}
          <div className="space-y-2">
            <Label htmlFor="subject">Disciplina *</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Seleccione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Professor */}
          <div className="space-y-2">
            <Label htmlFor="teacher">Professor *</Label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger id="teacher">
                <SelectValue placeholder="Seleccione o professor" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sala */}
          <div className="space-y-2">
            <Label htmlFor="room">Sala *</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger id="room">
                <SelectValue placeholder="Seleccione a sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Guardar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditarAulaModal;
