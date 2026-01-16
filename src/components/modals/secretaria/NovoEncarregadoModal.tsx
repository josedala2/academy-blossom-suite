import { useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, X, Search } from "lucide-react";
import {
  nameSchema,
  phoneSchema,
  optionalPhoneSchema,
  optionalEmailSchema,
  optionalAddressSchema,
  sanitizeString,
} from "@/lib/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Schema de validação OWASP compliant
const encarregadoSchema = z.object({
  nome: nameSchema,
  parentesco: z.string().optional(),
  telefone: phoneSchema,
  telefoneAlt: optionalPhoneSchema,
  email: optionalEmailSchema,
  endereco: optionalAddressSchema,
  profissao: z
    .string()
    .trim()
    .max(100, { message: "Profissão deve ter no máximo 100 caracteres" })
    .transform(sanitizeString)
    .optional()
    .or(z.literal("")),
  localTrabalho: z
    .string()
    .trim()
    .max(200, { message: "Local de trabalho deve ter no máximo 200 caracteres" })
    .transform(sanitizeString)
    .optional()
    .or(z.literal("")),
  documentoTipo: z.enum(["bi", "passaporte", "cedula"]),
  documentoNumero: z
    .string()
    .trim()
    .max(30, { message: "Número do documento deve ter no máximo 30 caracteres" })
    .regex(/^[a-zA-Z0-9-]*$/, { message: "Número do documento inválido" })
    .optional()
    .or(z.literal("")),
  criarCredenciais: z.boolean(),
});

type EncarregadoFormData = z.infer<typeof encarregadoSchema>;

// Mock estudantes para associar
const estudantesDisponiveis = [
  { id: "1", nome: "João Manuel Silva", classe: "10ª A" },
  { id: "2", nome: "Ana Beatriz Santos", classe: "11ª B" },
  { id: "3", nome: "Carlos Eduardo Mendes", classe: "12ª A" },
  { id: "4", nome: "Diana Rosa Ferreira", classe: "10ª C" },
  { id: "5", nome: "Emanuel José Costa", classe: "11ª A" },
];

const NovoEncarregadoModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<string[]>([]);
  const [searchEstudante, setSearchEstudante] = useState("");

  const form = useForm<EncarregadoFormData>({
    resolver: zodResolver(encarregadoSchema),
    defaultValues: {
      nome: "",
      parentesco: "",
      telefone: "",
      telefoneAlt: "",
      email: "",
      endereco: "",
      profissao: "",
      localTrabalho: "",
      documentoTipo: "bi",
      documentoNumero: "",
      criarCredenciais: true,
    },
  });

  const filteredEstudantes = estudantesDisponiveis.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) &&
      !estudantesSelecionados.includes(est.id)
  );

  const handleAddEstudante = (id: string) => {
    setEstudantesSelecionados([...estudantesSelecionados, id]);
    setSearchEstudante("");
  };

  const handleRemoveEstudante = (id: string) => {
    setEstudantesSelecionados(estudantesSelecionados.filter((e) => e !== id));
  };

  const onSubmit = (data: EncarregadoFormData) => {
    toast({
      title: "Encarregado criado",
      description: data.criarCredenciais
        ? "Encarregado criado e credenciais enviadas com sucesso."
        : "Encarregado criado com sucesso.",
    });
    
    form.reset();
    setEstudantesSelecionados([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    setEstudantesSelecionados([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Encarregado de Educação
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h4 className="font-medium">Dados Pessoais</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome completo do encarregado"
                          maxLength={100}
                          {...field}
                        />
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
                        <Input placeholder="Profissão" maxLength={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="localTrabalho"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Local de Trabalho</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa ou instituição" maxLength={200} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Documento */}
            <div className="space-y-4">
              <h4 className="font-medium">Documento de Identificação</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="documentoTipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bi">BI</SelectItem>
                          <SelectItem value="passaporte">Passaporte</SelectItem>
                          <SelectItem value="cedula">Cédula</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentoNumero"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do documento" maxLength={30} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input placeholder="+244 9XX XXX XXX" maxLength={20} {...field} />
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
                        <Input placeholder="+244 9XX XXX XXX" maxLength={20} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" maxLength={255} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Endereço completo" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Associar Estudantes */}
            <div className="space-y-4">
              <h4 className="font-medium">Associar Estudantes</h4>
              
              {/* Estudantes Selecionados */}
              {estudantesSelecionados.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {estudantesSelecionados.map((id) => {
                    const est = estudantesDisponiveis.find((e) => e.id === id);
                    return est ? (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {est.nome} ({est.classe})
                        <button
                          type="button"
                          onClick={() => handleRemoveEstudante(id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar estudante para associar..."
                  value={searchEstudante}
                  onChange={(e) => setSearchEstudante(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Resultados */}
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

            <Separator />

            {/* Credenciais */}
            <FormField
              control={form.control}
              name="criarCredenciais"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Criar credenciais de acesso ao portal (email ou SMS)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">Criar Encarregado</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoEncarregadoModal;
