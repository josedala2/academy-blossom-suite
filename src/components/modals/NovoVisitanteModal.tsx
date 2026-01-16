import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Users, Plus } from "lucide-react";

const visitanteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  contacto: z
    .string()
    .trim()
    .min(9, { message: "Contacto deve ter pelo menos 9 dígitos" })
    .max(15, { message: "Contacto inválido" })
    .regex(/^[0-9+\s-]+$/, { message: "Contacto deve conter apenas números" }),
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" })
    .optional()
    .or(z.literal("")),
  motivo: z.string().min(1, { message: "Seleccione o motivo da visita" }),
  observacoes: z
    .string()
    .trim()
    .max(500, { message: "Observações devem ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

type VisitanteFormData = z.infer<typeof visitanteSchema>;

interface NovoVisitanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const motivosComuns = [
  { value: "matricula", label: "Informações de Matrícula" },
  { value: "notas", label: "Consulta de Notas" },
  { value: "transferencia", label: "Transferência de Escola" },
  { value: "documentos", label: "Solicitar Documentos" },
  { value: "pagamentos", label: "Questões de Pagamento" },
  { value: "reuniao", label: "Reunião Agendada" },
  { value: "reclamacao", label: "Reclamação" },
  { value: "outros", label: "Outros" },
];

const NovoVisitanteModal = ({ open, onOpenChange }: NovoVisitanteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VisitanteFormData>({
    resolver: zodResolver(visitanteSchema),
    defaultValues: {
      nome: "",
      contacto: "",
      email: "",
      motivo: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: VisitanteFormData) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const motivoLabel = motivosComuns.find((m) => m.value === data.motivo)?.label;

    toast.success("Visitante registado com sucesso!", {
      description: `${data.nome} - ${motivoLabel}`,
    });

    form.reset();
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Registar Visitante
          </DialogTitle>
          <DialogDescription>
            Registe a visita para acompanhamento e histórico
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maria José Fernandes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 923 456 789" {...field} />
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
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ex: email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Visita *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione o motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {motivosComuns.map((motivo) => (
                        <SelectItem key={motivo.value} value={motivo.value}>
                          {motivo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes adicionais sobre a visita..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A registar...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Registar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoVisitanteModal;
