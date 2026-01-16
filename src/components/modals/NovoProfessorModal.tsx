import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { UserPlus } from "lucide-react";

const novoProfessorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .trim()
    .min(9, "Telefone deve ter pelo menos 9 dígitos")
    .max(20, "Telefone inválido"),
  subjects: z.array(z.string()).min(1, "Seleccione pelo menos uma disciplina"),
  classes: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]),
});

type NovoProfessorFormData = z.infer<typeof novoProfessorSchema>;

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface NovoProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Teacher) => void;
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
  "Filosofia",
  "Desenho",
];

const turmasDisponiveis = [
  "8ª A",
  "8ª B",
  "9ª A",
  "9ª B",
  "10ª A",
  "10ª B",
  "10ª C",
  "11ª A",
  "11ª B",
  "12ª A",
  "12ª B",
];

const NovoProfessorModal = ({
  isOpen,
  onClose,
  onSave,
}: NovoProfessorModalProps) => {
  const { toast } = useToast();

  const form = useForm<NovoProfessorFormData>({
    resolver: zodResolver(novoProfessorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subjects: [],
      classes: [],
      status: "active",
    },
  });

  const onSubmit = async (data: NovoProfessorFormData) => {
    // Simular criação
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTeacher: Teacher = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      subjects: data.subjects,
      classes: data.classes || [],
      status: data.status,
    };

    onSave(newTeacher);

    toast({
      title: "Professor registado!",
      description: `${data.name} foi adicionado com sucesso ao sistema.`,
    });

    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Professor
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para registar um novo professor no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Dados Pessoais
              </h4>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Prof. João Silva"
                        {...field}
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@sge.ao"
                          {...field}
                          maxLength={255}
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
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="923 000 000"
                          {...field}
                          maxLength={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Disciplinas */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Disciplinas *
              </h4>

              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                                        field.value?.filter((v) => v !== disciplina)
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
            </div>

            {/* Turmas */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Turmas Atribuídas (opcional)
              </h4>

              <FormField
                control={form.control}
                name="classes"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {turmasDisponiveis.map((turma) => (
                        <FormField
                          key={turma}
                          control={form.control}
                          name="classes"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(turma)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...(field.value || []), turma]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter((v) => v !== turma)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {turma}
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
            </div>

            {/* Estado */}
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

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Registar Professor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoProfessorModal;
