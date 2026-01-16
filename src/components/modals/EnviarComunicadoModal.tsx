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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send, Users, GraduationCap, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const comunicadoSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, { message: "Título deve ter pelo menos 5 caracteres" })
    .max(100, { message: "Título deve ter no máximo 100 caracteres" }),
  mensagem: z
    .string()
    .trim()
    .min(20, { message: "Mensagem deve ter pelo menos 20 caracteres" })
    .max(2000, { message: "Mensagem deve ter no máximo 2000 caracteres" }),
  prioridade: z.string().min(1, { message: "Seleccione a prioridade" }),
  turmasSelecionadas: z.array(z.string()).optional(),
  enviarEncarregados: z.boolean().default(true),
  enviarProfessores: z.boolean().default(false),
  enviarTodosEstudantes: z.boolean().default(false),
});

type ComunicadoFormData = z.infer<typeof comunicadoSchema>;

interface EnviarComunicadoModalProps {
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

const prioridades = [
  { value: "baixa", label: "Baixa", color: "bg-muted text-muted-foreground" },
  { value: "normal", label: "Normal", color: "bg-primary/10 text-primary" },
  { value: "alta", label: "Alta", color: "bg-accent/10 text-accent" },
  { value: "urgente", label: "Urgente", color: "bg-destructive/10 text-destructive" },
];

const EnviarComunicadoModal = ({ open, onOpenChange }: EnviarComunicadoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);

  const form = useForm<ComunicadoFormData>({
    resolver: zodResolver(comunicadoSchema),
    defaultValues: {
      titulo: "",
      mensagem: "",
      prioridade: "normal",
      turmasSelecionadas: [],
      enviarEncarregados: true,
      enviarProfessores: false,
      enviarTodosEstudantes: false,
    },
  });

  const enviarEncarregados = form.watch("enviarEncarregados");
  const enviarProfessores = form.watch("enviarProfessores");
  const enviarTodosEstudantes = form.watch("enviarTodosEstudantes");

  const handleTurmaToggle = (turmaValue: string) => {
    setSelectedTurmas((prev) => {
      const newSelection = prev.includes(turmaValue)
        ? prev.filter((t) => t !== turmaValue)
        : [...prev, turmaValue];
      form.setValue("turmasSelecionadas", newSelection);
      return newSelection;
    });
  };

  const handleSelectAllTurmas = () => {
    const allValues = turmasDisponiveis.map((t) => t.value);
    setSelectedTurmas(allValues);
    form.setValue("turmasSelecionadas", allValues);
  };

  const handleClearTurmas = () => {
    setSelectedTurmas([]);
    form.setValue("turmasSelecionadas", []);
  };

  const getDestinatariosCount = () => {
    let count = 0;
    if (enviarTodosEstudantes) count += 1234; // Total de estudantes
    if (enviarEncarregados) count += selectedTurmas.length * 35; // ~35 encarregados por turma
    if (enviarProfessores) count += 48; // Total de professores
    return count;
  };

  const onSubmit = async (data: ComunicadoFormData) => {
    // Validação adicional
    if (!data.enviarEncarregados && !data.enviarProfessores && !data.enviarTodosEstudantes) {
      toast.error("Seleccione pelo menos um grupo de destinatários");
      return;
    }

    if (data.enviarEncarregados && selectedTurmas.length === 0 && !data.enviarTodosEstudantes) {
      toast.error("Seleccione pelo menos uma turma para enviar aos encarregados");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const destinatarios = [];
    if (data.enviarEncarregados) destinatarios.push("Encarregados");
    if (data.enviarProfessores) destinatarios.push("Professores");
    if (data.enviarTodosEstudantes) destinatarios.push("Todos os Estudantes");

    toast.success("Comunicado enviado com sucesso!", {
      description: `Enviado para ${getDestinatariosCount()} destinatários (${destinatarios.join(", ")})`,
    });

    form.reset();
    setSelectedTurmas([]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setSelectedTurmas([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Enviar Comunicado
          </DialogTitle>
          <DialogDescription>
            Envie comunicados para encarregados, professores ou turmas específicas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Comunicado */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Informações do Comunicado
              </h3>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Comunicado *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Reunião de Pais - 1º Trimestre"
                          {...field}
                        />
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
                          placeholder="Escreva aqui o conteúdo do comunicado..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/2000 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {prioridades.map((prioridade) => (
                            <SelectItem key={prioridade.value} value={prioridade.value}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    prioridade.value === "baixa"
                                      ? "bg-muted-foreground"
                                      : prioridade.value === "normal"
                                      ? "bg-primary"
                                      : prioridade.value === "alta"
                                      ? "bg-accent"
                                      : "bg-destructive"
                                  }`}
                                />
                                {prioridade.label}
                              </div>
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

            {/* Destinatários */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Destinatários
              </h3>

              <div className="grid gap-4">
                {/* Grupos de Destinatários */}
                <div className="grid gap-3 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="enviarEncarregados"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <UserCheck className="h-4 w-4 text-primary" />
                            Encarregados
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Encarregados das turmas seleccionadas
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enviarProfessores"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <GraduationCap className="h-4 w-4 text-secondary" />
                            Professores
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Todos os professores (48)
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enviarTodosEstudantes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <Users className="h-4 w-4 text-accent" />
                            Estudantes
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Todos os estudantes (1.234)
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Selecção de Turmas */}
                {enviarEncarregados && !enviarTodosEstudantes && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Seleccionar Turmas</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAllTurmas}
                        >
                          Seleccionar Todas
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearTurmas}
                        >
                          Limpar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {turmasDisponiveis.map((turma) => (
                        <Button
                          key={turma.value}
                          type="button"
                          variant={selectedTurmas.includes(turma.value) ? "default" : "outline"}
                          size="sm"
                          className="justify-start text-xs"
                          onClick={() => handleTurmaToggle(turma.value)}
                        >
                          {turma.label.replace(" - Turma ", " ")}
                        </Button>
                      ))}
                    </div>
                    {selectedTurmas.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {selectedTurmas.length} turma(s) seleccionada(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resumo */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h4 className="text-sm font-medium">Resumo do Envio</h4>
              <div className="flex flex-wrap gap-2">
                {enviarEncarregados && (
                  <Badge variant="secondary">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Encarregados
                  </Badge>
                )}
                {enviarProfessores && (
                  <Badge variant="secondary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Professores
                  </Badge>
                )}
                {enviarTodosEstudantes && (
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    Estudantes
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Total estimado: <strong>{getDestinatariosCount()}</strong> destinatários
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Comunicado
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

export default EnviarComunicadoModal;
