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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface EnviarEmailEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const emailSchema = z.object({
  destinatario: z.string().min(1, "Seleccione o destinatário"),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const emailTemplates = [
  { value: "reuniao", label: "Convocatória para Reunião", subject: "Convocatória para Reunião de Pais" },
  { value: "propinas", label: "Aviso de Propinas", subject: "Aviso de Propinas Pendentes" },
  { value: "desempenho", label: "Relatório de Desempenho", subject: "Relatório de Desempenho Escolar" },
  { value: "custom", label: "Mensagem Personalizada", subject: "" },
];

const EnviarEmailEstudanteModal = ({
  isOpen,
  onClose,
  student,
}: EnviarEmailEstudanteModalProps) => {
  const { toast } = useToast();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      destinatario: "encarregado",
      assunto: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Email enviado!",
      description: `Mensagem enviada para ${
        data.destinatario === "encarregado" ? student?.guardian : student?.name
      }.`,
    });

    form.reset();
    onClose();
  };

  const handleTemplateChange = (template: string) => {
    const selected = emailTemplates.find((t) => t.value === template);
    if (selected && selected.subject) {
      form.setValue("assunto", selected.subject);
      
      let message = "";
      switch (template) {
        case "reuniao":
          message = `Prezado(a) Encarregado(a) de Educação,\n\nVimos por este meio convocar V. Exa. para uma reunião de pais que terá lugar nas instalações da escola.\n\nA sua presença é muito importante para o acompanhamento do percurso escolar do seu educando(a) ${student?.name}.\n\nAgradecemos a sua atenção.\n\nCom os melhores cumprimentos,\nA Direcção`;
          break;
        case "propinas":
          message = `Prezado(a) Encarregado(a) de Educação,\n\nVimos por este meio informar que existem propinas pendentes referentes ao estudante ${student?.name} (Nº ${student?.number}).\n\nSolicitamos a regularização da situação o mais breve possível.\n\nPara mais informações, por favor contacte a secretaria da escola.\n\nCom os melhores cumprimentos,\nA Administração`;
          break;
        case "desempenho":
          message = `Prezado(a) Encarregado(a) de Educação,\n\nApresentamos o relatório de desempenho escolar do estudante ${student?.name} (Turma: ${student?.class}).\n\nPara mais detalhes sobre o progresso académico, convidamos V. Exa. a agendar uma reunião com o director de turma.\n\nCom os melhores cumprimentos,\nA Coordenação Pedagógica`;
          break;
        default:
          message = "";
      }
      form.setValue("mensagem", message);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Email
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-muted rounded-lg flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{student.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{student.class}</Badge>
              <span className="text-xs text-muted-foreground">Nº {student.number}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatário *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="encarregado">
                          Encarregado ({student.guardian})
                        </SelectItem>
                        <SelectItem value="estudante">
                          Estudante ({student.name})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Modelo</FormLabel>
                <Select onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Usar modelo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              control={form.control}
              name="assunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto *</FormLabel>
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
                  <FormLabel>Mensagem *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva a sua mensagem..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarEmailEstudanteModal;
