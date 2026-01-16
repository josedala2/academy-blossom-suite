import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

// Schema de validação
const aulaFormSchema = z.object({
  subject: z.string().min(1, { message: "Seleccione a disciplina" }),
  teacher: z.string().min(1, { message: "Seleccione o professor" }),
  room: z.string().min(1, { message: "Seleccione a sala" }),
});

type AulaFormData = z.infer<typeof aulaFormSchema>;

const EditarAulaModal = ({
  isOpen,
  onClose,
  lesson,
  day,
  onSave,
  onDelete,
}: EditarAulaModalProps) => {
  const { toast } = useToast();

  const form = useForm<AulaFormData>({
    resolver: zodResolver(aulaFormSchema),
    defaultValues: {
      subject: "",
      teacher: "",
      room: "",
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        subject: lesson.subject,
        teacher: lesson.teacher,
        room: lesson.room,
      });
    }
  }, [lesson, form]);

  const onSubmit = (data: AulaFormData) => {
    if (!lesson) return;

    const updatedLesson: Lesson = {
      time: lesson.time,
      subject: data.subject,
      teacher: data.teacher,
      room: data.room,
    };

    onSave(day, lesson.time, updatedLesson);

    toast({
      title: "Aula actualizada!",
      description: `${data.subject} - ${day} às ${lesson.time}`,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Info fixa */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{day}</p>
              <p className="text-sm text-muted-foreground">{lesson.time}</p>
            </div>

            {/* Disciplina */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplina *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione a disciplina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Professor */}
            <FormField
              control={form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione o professor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sala */}
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sala *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione a sala" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between sm:justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Alterações
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarAulaModal;