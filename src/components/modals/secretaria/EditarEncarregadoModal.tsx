import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, Search, UserPlus, UserMinus } from "lucide-react";
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
  sanitizeString,
} from "@/lib/validation";

interface Estudante {
  id: string;
  nome: string;
  classe: string;
}

interface Encarregado {
  id: string;
  nome: string;
  parentesco: string;
  telefone: string;
  telefoneAlt: string | null;
  email: string | null;
  endereco: string;
  profissao: string;
  localTrabalho: string;
  documentoId: string;
  estudantes: Estudante[];
  temCredenciais: boolean;
  ultimoAcesso: string | null;
  dataCriacao: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encarregado: Encarregado | null;
}

// Mock estudantes para associar
const estudantesDisponiveis = [
  { id: "1", nome: "João Manuel Silva", classe: "10ª A" },
  { id: "2", nome: "Ana Beatriz Santos", classe: "11ª B" },
  { id: "3", nome: "Carlos Eduardo Mendes", classe: "12ª A" },
  { id: "4", nome: "Diana Rosa Ferreira", classe: "10ª C" },
  { id: "5", nome: "Emanuel José Costa", classe: "11ª A" },
  { id: "6", nome: "Pedro Manuel Silva", classe: "8ª B" },
  { id: "7", nome: "Luísa Maria Costa", classe: "9ª B" },
];

// Schema de validação
const encarregadoEditSchema = z.object({
  nome: nameSchema,
  parentesco: z.string().min(1, { message: "Seleccione o parentesco" }),
  telefone: phoneSchema,
  telefoneAlt: optionalPhoneSchema,
  email: optionalEmailSchema,
  endereco: optionalAddressSchema,
  profissao: z.string().trim().max(100, { message: "Profissão deve ter no máximo 100 caracteres" }).optional().or(z.literal("")),
  localTrabalho: z.string().trim().max(100, { message: "Local de trabalho deve ter no máximo 100 caracteres" }).optional().or(z.literal("")),
  documentoId: z.string().trim().max(50, { message: "Documento deve ter no máximo 50 caracteres" }).optional().or(z.literal("")),
});

type EncarregadoEditFormData = z.infer<typeof encarregadoEditSchema>;

const EditarEncarregadoModal = ({ open, onOpenChange, encarregado }: Props) => {
  const { toast } = useToast();
  const [estudantesAssociados, setEstudantesAssociados] = useState<string[]>([]);
  const [searchEstudante, setSearchEstudante] = useState("");

  const form = useForm<EncarregadoEditFormData>({
    resolver: zodResolver(encarregadoEditSchema),
    defaultValues: {
      nome: "",
      parentesco: "",
      telefone: "",
      telefoneAlt: "",
      email: "",
      endereco: "",
      profissao: "",
      localTrabalho: "",
      documentoId: "",
    },
  });

  useEffect(() => {
    if (encarregado) {
      form.reset({
        nome: encarregado.nome,
        parentesco: encarregado.parentesco.toLowerCase(),
        telefone: encarregado.telefone,
        telefoneAlt: encarregado.telefoneAlt || "",
        email: encarregado.email || "",
        endereco: encarregado.endereco,
        profissao: encarregado.profissao,
        localTrabalho: encarregado.localTrabalho,
        documentoId: encarregado.documentoId,
      });
      setEstudantesAssociados(encarregado.estudantes.map((e) => e.id));
    }
  }, [encarregado, form]);

  const filteredEstudantes = estudantesDisponiveis.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) &&
      !estudantesAssociados.includes(est.id)
  );

  const handleAddEstudante = (id: string) => {
    setEstudantesAssociados([...estudantesAssociados, id]);
    setSearchEstudante("");
  };

  const handleRemoveEstudante = (id: string) => {
    setEstudantesAssociados(estudantesAssociados.filter((e) => e !== id));
  };

  const onSubmit = (data: EncarregadoEditFormData) => {
    toast({
      title: "Dados actualizados",
      description: "Os dados do encarregado foram actualizados com sucesso.",
    });
    onOpenChange(false);
  };

  if (!encarregado) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Encarregado
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h4 className="font-medium">Dados Pessoais</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="parentesco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parentesco</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pai">Pai</SelectItem>
                          <SelectItem value="mae">Mãe</SelectItem>
                          <SelectItem value="avo">Avô/Avó</SelectItem>
                          <SelectItem value="tio">Tio/Tia</SelectItem>
                          <SelectItem value="irmao">Irmão/Irmã</SelectItem>
                          <SelectItem value="tutor">Tutor Legal</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="localTrabalho"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Trabalho</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="documentoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento de Identificação</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contactos */}
            <div className="space-y-4">
              <h4 className="font-medium">Contactos</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Principal *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefoneAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Alternativo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Estudantes Associados */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                Estudantes Associados
                <Badge variant="secondary">{estudantesAssociados.length}</Badge>
              </h4>
              
              {/* Lista de Associados */}
              <div className="space-y-2">
                {estudantesAssociados.map((id) => {
                  const est = estudantesDisponiveis.find((e) => e.id === id);
                  return est ? (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{est.nome}</span>
                        <Badge variant="outline">{est.classe}</Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEstudante(id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Desassociar
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Adicionar Estudante */}
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Associar Novo Estudante
                </FormLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar estudante..."
                    value={searchEstudante}
                    onChange={(e) => setSearchEstudante(sanitizeString(e.target.value))}
                    className="pl-10"
                  />
                </div>
                {searchEstudante && filteredEstudantes.length > 0 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {filteredEstudantes.map((est) => (
                      <button
                        key={est.id}
                        type="button"
                        onClick={() => handleAddEstudante(est.id)}
                        className="w-full px-3 py-2 text-left hover:bg-muted flex justify-between items-center"
                      >
                        <span>{est.nome}</span>
                        <Badge variant="outline">{est.classe}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

export default EditarEncarregadoModal;