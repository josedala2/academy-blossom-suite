import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const professorSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone inválido"),
  subjects: z.array(z.string()).min(1, "Seleccione pelo menos uma disciplina"),
  status: z.enum(["active", "inactive"]),
});

type ProfessorFormData = z.infer<typeof professorSchema>;

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface EditarProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSave: (data: ProfessorFormData) => void;
}

const disciplinasDisponiveis = [
  "Matemática",
  "Português",
  "Inglês",
  "Física",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Educação Física",
  "Literatura",
];

const EditarProfessorModal = ({
  isOpen,
  onClose,
  teacher,
  onSave,
}: EditarProfessorModalProps) => {
  const { toast } = useToast();

  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subjects: [],
      status: "active",
    },
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects,
        status: teacher.status as "active" | "inactive",
      });
    }
  }, [teacher, form]);

  const onSubmit = (data: ProfessorFormData) => {
    onSave(data);
    toast({
      title: "Professor actualizado!",
      description: `Os dados de ${data.name} foram actualizados com sucesso.`,
    });
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Professor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Prof. Nome Completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@sge.ao"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="923 000 000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <FormLabel>Disciplinas</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {disciplinasDisponiveis.map((disciplina) => (
                      <FormField
                        key={disciplina}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(disciplina)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, disciplina]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (v) => v !== disciplina
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {disciplina}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione o estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Guardar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarProfessorModal;
