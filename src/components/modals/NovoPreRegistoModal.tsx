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
  FormDescription,
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
import { Loader2, UserPlus, Upload } from "lucide-react";

const preRegistoSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  dataNascimento: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  genero: z.string().min(1, { message: "Seleccione o género" }),
  classePretendida: z.string().min(1, { message: "Seleccione a classe pretendida" }),
  nomeEncarregado: z
    .string()
    .trim()
    .min(3, { message: "Nome do encarregado deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  telefoneEncarregado: z
    .string()
    .trim()
    .min(9, { message: "Telefone deve ter pelo menos 9 dígitos" })
    .max(15, { message: "Telefone inválido" })
    .regex(/^[0-9+\s-]+$/, { message: "Telefone deve conter apenas números" }),
  emailEncarregado: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" })
    .optional()
    .or(z.literal("")),
  parentesco: z.string().min(1, { message: "Seleccione o grau de parentesco" }),
  endereco: z
    .string()
    .trim()
    .max(200, { message: "Endereço deve ter no máximo 200 caracteres" })
    .optional()
    .or(z.literal("")),
  observacoes: z
    .string()
    .trim()
    .max(500, { message: "Observações devem ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

type PreRegistoFormData = z.infer<typeof preRegistoSchema>;

interface NovoPreRegistoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const classesDisponiveis = [
  { value: "7", label: "7ª Classe" },
  { value: "8", label: "8ª Classe" },
  { value: "9", label: "9ª Classe" },
  { value: "10", label: "10ª Classe" },
  { value: "11", label: "11ª Classe" },
  { value: "12", label: "12ª Classe" },
];

const NovoPreRegistoModal = ({ open, onOpenChange }: NovoPreRegistoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PreRegistoFormData>({
    resolver: zodResolver(preRegistoSchema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      genero: "",
      classePretendida: "",
      nomeEncarregado: "",
      telefoneEncarregado: "",
      emailEncarregado: "",
      parentesco: "",
      endereco: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: PreRegistoFormData) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const numeroRegisto = `PR-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    toast.success("Pré-registo criado com sucesso!", {
      description: `Nº ${numeroRegisto} - ${data.nomeCompleto}`,
    });

    form.reset();
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            Novo Pré-Registo
          </DialogTitle>
          <DialogDescription>
            Crie um pré-registo para um novo estudante. O processo será encaminhado para análise.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados do Estudante */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Dados do Estudante
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João Manuel Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classePretendida"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Classe Pretendida *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione a classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classesDisponiveis.map((classe) => (
                            <SelectItem key={classe.value} value={classe.value}>
                              {classe.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dados do Encarregado */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Dados do Encarregado de Educação
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomeEncarregado"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria Santos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentesco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grau de Parentesco *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pai">Pai</SelectItem>
                          <SelectItem value="mae">Mãe</SelectItem>
                          <SelectItem value="avo">Avô/Avó</SelectItem>
                          <SelectItem value="tio">Tio/Tia</SelectItem>
                          <SelectItem value="irmao">Irmão/Irmã</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefoneEncarregado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 923 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailEncarregado"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email (opcional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Ex: email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua da Escola, Nº 123, Luanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Informações Adicionais
              </h3>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas relevantes sobre o pré-registo..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ex: Transferência de outra escola, necessidades especiais, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Upload Section */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Carregar Documentos</p>
                <p className="text-xs text-muted-foreground">
                  BI, Certidão, Boletim anterior (opcional)
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Seleccionar Ficheiros
                </Button>
              </div>
            </div>

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
                    A criar...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar Pré-Registo
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

export default NovoPreRegistoModal;
