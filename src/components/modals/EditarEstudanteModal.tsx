import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";

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

interface EditarEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (student: Student) => void;
}

const editStudentSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  class: z.string().min(1, "Seleccione a turma"),
  guardian: z.string().min(3, "Nome do encarregado é obrigatório"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  status: z.string().min(1, "Seleccione o estado"),
  payments: z.string().min(1, "Seleccione o estado das propinas"),
});

type EditStudentFormData = z.infer<typeof editStudentSchema>;

const EditarEstudanteModal = ({
  isOpen,
  onClose,
  student,
  onSave,
}: EditarEstudanteModalProps) => {
  const { toast } = useToast();

  const form = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      class: "",
      guardian: "",
      phone: "",
      status: "",
      payments: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        class: student.class,
        guardian: student.guardian,
        phone: student.phone,
        status: student.status,
        payments: student.payments,
      });
    }
  }, [student, form]);

  const onSubmit = (data: EditStudentFormData) => {
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      name: data.name,
      class: data.class,
      guardian: data.guardian,
      phone: data.phone,
      status: data.status,
      payments: data.payments,
    };

    onSave(updatedStudent);

    toast({
      title: "Dados actualizados!",
      description: `Perfil de ${data.name} foi actualizado com sucesso.`,
    });

    onClose();
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Estudante
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Nº de Matrícula</p>
              <p className="font-medium">{student.number}</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do estudante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7ª A">7ª Classe A</SelectItem>
                        <SelectItem value="7ª B">7ª Classe B</SelectItem>
                        <SelectItem value="8ª A">8ª Classe A</SelectItem>
                        <SelectItem value="8ª B">8ª Classe B</SelectItem>
                        <SelectItem value="9ª A">9ª Classe A</SelectItem>
                        <SelectItem value="9ª B">9ª Classe B</SelectItem>
                        <SelectItem value="9ª C">9ª Classe C</SelectItem>
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
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
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
            </div>

            <FormField
              control={form.control}
              name="guardian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encarregado de Educação *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do encarregado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="923 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propinas *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ok">Em dia</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="overdue">Em atraso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Guardar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarEstudanteModal;
