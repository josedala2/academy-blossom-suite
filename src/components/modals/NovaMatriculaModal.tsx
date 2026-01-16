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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

const matriculaSchema = z.object({
  // Dados do Estudante
  nomeCompleto: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  dataNascimento: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  naturalidade: z
    .string()
    .trim()
    .min(2, { message: "Naturalidade deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Naturalidade deve ter no máximo 100 caracteres" }),
  nacionalidade: z
    .string()
    .trim()
    .min(2, { message: "Nacionalidade deve ter pelo menos 2 caracteres" })
    .max(50, { message: "Nacionalidade deve ter no máximo 50 caracteres" }),
  genero: z.string().min(1, { message: "Seleccione o género" }),
  turma: z.string().min(1, { message: "Seleccione a turma" }),
  bilheteIdentidade: z
    .string()
    .trim()
    .max(20, { message: "BI deve ter no máximo 20 caracteres" })
    .optional()
    .or(z.literal("")),
  // Dados dos Pais
  nomePai: z
    .string()
    .trim()
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  profissaoPai: z
    .string()
    .trim()
    .max(100, { message: "Profissão deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  telefonePai: z
    .string()
    .trim()
    .max(15, { message: "Telefone inválido" })
    .regex(/^[0-9+\s-]*$/, { message: "Telefone deve conter apenas números" })
    .optional()
    .or(z.literal("")),
  nomeMae: z
    .string()
    .trim()
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  profissaoMae: z
    .string()
    .trim()
    .max(100, { message: "Profissão deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  telefoneMae: z
    .string()
    .trim()
    .max(15, { message: "Telefone inválido" })
    .regex(/^[0-9+\s-]*$/, { message: "Telefone deve conter apenas números" })
    .optional()
    .or(z.literal("")),
  // Dados do Encarregado de Educação
  nomeEncarregado: z
    .string()
    .trim()
    .min(3, { message: "Nome do encarregado deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  parentesco: z
    .string()
    .trim()
    .min(1, { message: "Seleccione o grau de parentesco" }),
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
  // Endereço
  endereco: z
    .string()
    .trim()
    .min(5, { message: "Endereço deve ter pelo menos 5 caracteres" })
    .max(200, { message: "Endereço deve ter no máximo 200 caracteres" }),
  bairro: z
    .string()
    .trim()
    .max(100, { message: "Bairro deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  municipio: z
    .string()
    .trim()
    .max(100, { message: "Município deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
  provincia: z
    .string()
    .trim()
    .max(50, { message: "Província deve ter no máximo 50 caracteres" })
    .optional()
    .or(z.literal("")),
});

type MatriculaFormData = z.infer<typeof matriculaSchema>;

interface NovaMatriculaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const turmasDisponiveis = [
  { value: "7a", label: "7ª Classe - Turma A" },
  { value: "7b", label: "7ª Classe - Turma B" },
  { value: "8a", label: "8ª Classe - Turma A" },
  { value: "8b", label: "8ª Classe - Turma B" },
  { value: "9a", label: "9ª Classe - Turma A" },
  { value: "9b", label: "9ª Classe - Turma B" },
  { value: "10a", label: "10ª Classe - Turma A" },
  { value: "10b", label: "10ª Classe - Turma B" },
  { value: "11a", label: "11ª Classe - Turma A" },
  { value: "11b", label: "11ª Classe - Turma B" },
  { value: "12a", label: "12ª Classe - Turma A" },
  { value: "12b", label: "12ª Classe - Turma B" },
];

const NovaMatriculaModal = ({ open, onOpenChange }: NovaMatriculaModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MatriculaFormData>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      naturalidade: "",
      nacionalidade: "Angolana",
      genero: "",
      turma: "",
      bilheteIdentidade: "",
      nomePai: "",
      profissaoPai: "",
      telefonePai: "",
      nomeMae: "",
      profissaoMae: "",
      telefoneMae: "",
      nomeEncarregado: "",
      parentesco: "",
      telefoneEncarregado: "",
      emailEncarregado: "",
      endereco: "",
      bairro: "",
      municipio: "",
      provincia: "Luanda",
    },
  });

  const onSubmit = async (data: MatriculaFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Matrícula registada com sucesso!", {
      description: `${data.nomeCompleto} foi matriculado(a) na ${turmasDisponiveis.find(t => t.value === data.turma)?.label}`,
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
            Nova Matrícula
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do estudante para efectuar a matrícula.
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
                  name="naturalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naturalidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Luanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nacionalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Angolana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bilheteIdentidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bilhete de Identidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 000000000LA000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="turma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione a turma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {turmasDisponiveis.map((turma) => (
                            <SelectItem key={turma.value} value={turma.value}>
                              {turma.label}
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

            {/* Dados dos Pais */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Dados dos Pais
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomePai"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome do Pai</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: António Manuel Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profissaoPai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão do Pai</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Engenheiro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefonePai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Pai</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 923 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomeMae"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Mãe</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria Santos Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profissaoMae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão da Mãe</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Professora" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefoneMae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone da Mãe</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 923 456 789" {...field} />
                      </FormControl>
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
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Endereço
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Rua / Avenida *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua da Escola, Nº 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Morro Bento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="municipio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Município</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Belas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Província</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Luanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    A registar...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registar Matrícula
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

export default NovaMatriculaModal;
