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
import { Loader2, ClipboardList, Calendar } from "lucide-react";

const avaliacaoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  tipo: z.string().min(1, { message: "Seleccione o tipo de avaliação" }),
  disciplina: z.string().min(1, { message: "Seleccione a disciplina" }),
  turma: z.string().min(1, { message: "Seleccione a turma" }),
  data: z.string().min(1, { message: "Data é obrigatória" }),
  hora: z.string().optional(),
  duracao: z.string().optional(),
  peso: z
    .string()
    .min(1, { message: "Peso é obrigatório" })
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 100;
    }, { message: "Peso deve ser entre 1 e 100" }),
  sala: z.string().optional(),
  conteudo: z
    .string()
    .trim()
    .max(500, { message: "Conteúdo deve ter no máximo 500 caracteres" })
    .optional(),
  observacoes: z
    .string()
    .trim()
    .max(300, { message: "Observações devem ter no máximo 300 caracteres" })
    .optional(),
});

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

interface NovaAvaliacaoModalProps {
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

const disciplinas = [
  { value: "matematica", label: "Matemática" },
  { value: "portugues", label: "Língua Portuguesa" },
  { value: "ingles", label: "Inglês" },
  { value: "fisica", label: "Física" },
  { value: "quimica", label: "Química" },
  { value: "biologia", label: "Biologia" },
  { value: "historia", label: "História" },
  { value: "geografia", label: "Geografia" },
  { value: "filosofia", label: "Filosofia" },
  { value: "educacao_fisica", label: "Educação Física" },
  { value: "informatica", label: "Informática" },
];

const tiposAvaliacao = [
  { value: "teste", label: "Teste" },
  { value: "exame", label: "Exame" },
  { value: "trabalho", label: "Trabalho Individual" },
  { value: "trabalho_grupo", label: "Trabalho de Grupo" },
  { value: "apresentacao", label: "Apresentação" },
  { value: "pratica", label: "Avaliação Prática" },
  { value: "oral", label: "Avaliação Oral" },
];

const NovaAvaliacaoModal = ({ open, onOpenChange }: NovaAvaliacaoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      disciplina: "",
      turma: "",
      data: "",
      hora: "",
      duracao: "",
      peso: "",
      sala: "",
      conteudo: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const turmaLabel = turmasDisponiveis.find(t => t.value === data.turma)?.label;
    const disciplinaLabel = disciplinas.find(d => d.value === data.disciplina)?.label;

    toast.success("Avaliação criada com sucesso!", {
      description: `${data.nome} agendada para ${turmaLabel} - ${disciplinaLabel}`,
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
            <ClipboardList className="h-5 w-5 text-primary" />
            Nova Avaliação
          </DialogTitle>
          <DialogDescription>
            Agende uma nova avaliação para uma turma
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Informações da Avaliação
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Avaliação *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Teste 1 - Funções Trigonométricas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Avaliação *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposAvaliacao.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
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
                  name="disciplina"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplina *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disciplinas.map((disc) => (
                            <SelectItem key={disc.value} value={disc.value}>
                              {disc.label}
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
                  name="turma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
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

                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (%) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" placeholder="Ex: 25" {...field} />
                      </FormControl>
                      <FormDescription>
                        Peso na nota final (1-100%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Data e Horário */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Data e Horário
              </h3>

              <div className="grid gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min="15" placeholder="Ex: 90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sala"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sala 12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Detalhes Adicionais
              </h3>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="conteudo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo Programático</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Liste os tópicos que serão avaliados..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
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
                          placeholder="Instruções adicionais para os estudantes..."
                          className="min-h-[60px]"
                          {...field} 
                        />
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
                    A criar...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Avaliação
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

export default NovaAvaliacaoModal;
