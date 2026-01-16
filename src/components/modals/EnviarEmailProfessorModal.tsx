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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const emailSchema = z.object({
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface EnviarEmailProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const EnviarEmailProfessorModal = ({
  isOpen,
  onClose,
  teacher,
}: EnviarEmailProfessorModalProps) => {
  const { toast } = useToast();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      assunto: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    // Simular envio de email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Email enviado!",
      description: `Email enviado com sucesso para ${teacher?.name}.`,
    });

    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Email</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Destinatário:</p>
          <p className="font-medium">{teacher.name}</p>
          <p className="text-sm text-muted-foreground">{teacher.email}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Assunto do email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva a sua mensagem aqui..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
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
                <Send className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarEmailProfessorModal;
