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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Phone, AlertCircle, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  nameSchema,
  phoneSchema,
  optionalPhoneSchema,
  optionalEmailSchema,
  optionalAddressSchema,
  observationSchema,
} from "@/lib/validation";

interface Estudante {
  id: string;
  numero: string;
  nome: string;
  classe: string;
  turma: string;
  turno: string;
  encarregado: string;
  telefoneEncarregado: string;
  estadoFinanceiro: string;
  estadoMatricula: string;
  endereco: string;
  dataNascimento: string;
  naturalidade: string;
  nacionalidade: string;
  genero: string;
  documentoId: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudante: Estudante | null;
}

// Schema de validação
const dadosAdminSchema = z.object({
  endereco: optionalAddressSchema,
  encarregado: nameSchema,
  telefoneEncarregado: phoneSchema,
  telefoneAlternativo: optionalPhoneSchema,
  emailEncarregado: optionalEmailSchema,
  observacoes: observationSchema,
});

type DadosAdminFormData = z.infer<typeof dadosAdminSchema>;

const EditarDadosAdminModal = ({ open, onOpenChange, estudante }: Props) => {
  const { toast } = useToast();

  const form = useForm<DadosAdminFormData>({
    resolver: zodResolver(dadosAdminSchema),
    defaultValues: {
      endereco: "",
      encarregado: "",
      telefoneEncarregado: "",
      telefoneAlternativo: "",
      emailEncarregado: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (estudante) {
      form.reset({
        endereco: estudante.endereco || "",
        encarregado: estudante.encarregado || "",
        telefoneEncarregado: estudante.telefoneEncarregado || "",
        telefoneAlternativo: "",
        emailEncarregado: "",
        observacoes: "",
      });
    }
  }, [estudante, form]);

  const onSubmit = (data: DadosAdminFormData) => {
    toast({
      title: "Dados actualizados",
      description: "Os dados administrativos foram actualizados com sucesso.",
    });
    onOpenChange(false);
  };

  if (!estudante) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Dados Administrativos
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Info Banner */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Apenas dados administrativos podem ser alterados</p>
                <p className="text-xs mt-1">
                  Dados académicos, notas e frequência são geridos pela Direção Pedagógica.
                </p>
              </div>
            </div>

            {/* Student Info (Read-only) */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{estudante.nome}</h3>
                  <p className="text-sm text-muted-foreground">Nº {estudante.numero}</p>
                </div>
                <Badge variant="secondary">
                  {estudante.classe} {estudante.turma}
                </Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Dados bloqueados
                </span>
              </div>
            </div>

            <Separator />

            {/* Editable Fields */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </h4>
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Rua, número, bairro, município..."
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contactos do Encarregado
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="encarregado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Encarregado *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefoneEncarregado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Principal *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+244 9XX XXX XXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefoneAlternativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Alternativo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+244 9XX XXX XXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailEncarregado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@exemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas ou observações administrativas..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarDadosAdminModal;