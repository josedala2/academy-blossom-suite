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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus } from "lucide-react";
import { codeSchema, sanitizeString, sanitizeHTML } from "@/lib/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Schema de validação OWASP compliant
const templateSchema = z.object({
  codigo: codeSchema
    .min(2, { message: "Código deve ter pelo menos 2 caracteres" })
    .max(4, { message: "Código deve ter no máximo 4 caracteres" })
    .transform((val) => val.toUpperCase()),
  nome: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .transform(sanitizeString),
  descricao: z
    .string()
    .trim()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres" })
    .transform(sanitizeString)
    .optional()
    .or(z.literal("")),
  requerAprovacao: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

// Campos conforme Decreto Presidencial n.º 227/25 - Art. 8.º
const camposDisponiveis = [
  // Dados Pessoais do Estudante (obrigatórios)
  { id: "nome_completo", label: "Nome Completo", obrigatorio: true, categoria: "pessoais" },
  { id: "filiacao", label: "Filiação (Pai e Mãe)", obrigatorio: true, categoria: "pessoais" },
  { id: "data_nascimento", label: "Data de Nascimento", obrigatorio: true, categoria: "pessoais" },
  { id: "local_nascimento", label: "Local de Nascimento", obrigatorio: false, categoria: "pessoais" },
  { id: "nacionalidade", label: "Nacionalidade", obrigatorio: false, categoria: "pessoais" },
  { id: "bi_numero", label: "Nº do Bilhete de Identidade", obrigatorio: true, categoria: "pessoais" },
  
  // Dados Académicos (obrigatórios conforme Art. 8.º)
  { id: "identificador_unico", label: "Identificador Único do Aluno (IUA)", obrigatorio: true, categoria: "academicos" },
  { id: "numero_sequencial", label: "Número Sequencial do Documento", obrigatorio: true, categoria: "academicos" },
  { id: "classe", label: "Classe", obrigatorio: true, categoria: "academicos" },
  { id: "turma", label: "Turma", obrigatorio: false, categoria: "academicos" },
  { id: "ano_lectivo", label: "Ano Lectivo", obrigatorio: true, categoria: "academicos" },
  { id: "ciclo", label: "Ciclo de Ensino", obrigatorio: false, categoria: "academicos" },
  { id: "curso", label: "Curso/Especialidade", obrigatorio: false, categoria: "academicos" },
  
  // Avaliação e Notas
  { id: "disciplinas_notas", label: "Discriminação de Disciplinas e Notas", obrigatorio: false, categoria: "avaliacao" },
  { id: "media_final", label: "Média Final", obrigatorio: false, categoria: "avaliacao" },
  { id: "nivel_qnq", label: "Nível/Grau de Qualificação (QNQ)", obrigatorio: false, categoria: "avaliacao" },
  
  // Validação e Segurança (Art. 8.º)
  { id: "codigo_seguranca", label: "Código Alfanumérico de Segurança", obrigatorio: false, categoria: "validacao" },
  { id: "codigo_qr", label: "Código QR (Verificação via PNC)", obrigatorio: false, categoria: "validacao" },
  
  // Dados Complementares
  { id: "data_matricula", label: "Data de Matrícula", obrigatorio: false, categoria: "complementares" },
  { id: "nome_encarregado", label: "Nome do Encarregado de Educação", obrigatorio: false, categoria: "complementares" },
  { id: "periodo", label: "Período/Trimestre", obrigatorio: false, categoria: "complementares" },
  { id: "assiduidade", label: "Percentagem de Assiduidade", obrigatorio: false, categoria: "complementares" },
  { id: "finalidade", label: "Finalidade do Documento", obrigatorio: false, categoria: "complementares" },
  { id: "texto_livre", label: "Texto Livre", obrigatorio: false, categoria: "complementares" },
  { id: "validade", label: "Validade do Documento", obrigatorio: false, categoria: "complementares" },
  
  // Transferências
  { id: "escola_origem", label: "Escola de Origem", obrigatorio: false, categoria: "transferencia" },
  { id: "escola_destino", label: "Escola de Destino", obrigatorio: false, categoria: "transferencia" },
  { id: "motivo_transferencia", label: "Motivo da Transferência", obrigatorio: false, categoria: "transferencia" },
  { id: "historico_escolar", label: "Histórico Escolar Anexo", obrigatorio: false, categoria: "transferencia" },
];

const NovoTemplateModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>([
    "nome_completo",
    "filiacao",
    "data_nascimento",
    "bi_numero",
    "identificador_unico",
    "classe",
    "ano_lectivo",
  ]);
  const [conteudoTemplate, setConteudoTemplate] = useState(
    `                              REPÚBLICA DE ANGOLA
                           MINISTÉRIO DA EDUCAÇÃO
                    [Insígnia da República de Angola]

                         [NOME DA INSTITUIÇÃO DE ENSINO]
                    Decreto Executivo n.º [NÚMERO] / Licença n.º [NÚMERO]

                              DECLARAÇÃO DE MATRÍCULA
                               N.º {{numero_sequencial}}

A Direcção desta Instituição de Ensino declara para os devidos efeitos que:

Nome Completo: {{nome_completo}}
Filiação: {{filiacao}}
Data de Nascimento: {{data_nascimento}}
Local de Nascimento: {{local_nascimento}}
Nacionalidade: {{nacionalidade}}
Bilhete de Identidade N.º: {{bi_numero}}
Identificador Único do Aluno: {{identificador_unico}}

Encontra-se regularmente matriculado(a) nesta Instituição de Ensino, na {{classe}}, Turma {{turma}}, no ano lectivo de {{ano_lectivo}}.

Data de Matrícula: {{data_matricula}}

Por ser verdade e me ter sido solicitada, mandei passar a presente Declaração que vai por mim assinada e autenticada com o selo branco em uso nesta Instituição.

Luanda, aos _____ dias do mês de _______________ de 20___

                              O(A) Director(a)
                         _________________________
                              (Nome e Assinatura)
                               [Selo Branco]

Código de Segurança: {{codigo_seguranca}}
[Código QR para verificação via Plataforma Nacional de Certificação]`
  );

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      descricao: "",
      requerAprovacao: false,
    },
  });

  const handleToggleCampo = (campoId: string) => {
    const campo = camposDisponiveis.find((c) => c.id === campoId);
    if (campo?.obrigatorio) return;

    if (camposSelecionados.includes(campoId)) {
      setCamposSelecionados(camposSelecionados.filter((c) => c !== campoId));
    } else {
      setCamposSelecionados([...camposSelecionados, campoId]);
    }
  };

  const handleInsertCampo = (campoId: string) => {
    setConteudoTemplate((prev) => prev + ` {{${campoId}}}`);
    if (!camposSelecionados.includes(campoId)) {
      setCamposSelecionados([...camposSelecionados, campoId]);
    }
  };

  const onSubmit = (data: TemplateFormData) => {
    // Sanitize template content before saving
    const sanitizedContent = sanitizeHTML(conteudoTemplate);
    
    toast({
      title: "Template criado",
      description: `Template "${data.nome}" criado com sucesso.`,
    });

    form.reset();
    setCamposSelecionados(["nome_estudante", "classe", "ano_lectivo"]);
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Novo Template de Documento
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: DM, DF, AT"
                        maxLength={4}
                        className="font-mono uppercase"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Usado na numeração automática
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nome do Template *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Declaração de Matrícula"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Breve descrição do propósito deste documento"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requerAprovacao"
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
                      Requer aprovação da Direcção antes da emissão
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            {/* Campos */}
            <div>
              <FormLabel className="mb-2 block">Campos Disponíveis</FormLabel>
              <p className="text-sm text-muted-foreground mb-3">
                Clique num campo para inserir no conteúdo do documento
              </p>
              <div className="flex flex-wrap gap-2">
                {camposDisponiveis.map((campo) => (
                  <Badge
                    key={campo.id}
                    variant={camposSelecionados.includes(campo.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleInsertCampo(campo.id)}
                  >
                    {campo.obrigatorio && <span className="text-red-500 mr-1">*</span>}
                    {campo.label}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Template Content */}
            <div>
              <FormLabel>Conteúdo do Documento</FormLabel>
              <p className="text-sm text-muted-foreground mb-2">
                Use <code className="bg-muted px-1 rounded">{"{{campo}}"}</code> para inserir campos dinâmicos
              </p>
              <Textarea
                value={conteudoTemplate}
                onChange={(e) => setConteudoTemplate(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            {/* Preview */}
            <div>
              <FormLabel className="mb-2 block">Pré-visualização</FormLabel>
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-950 text-sm whitespace-pre-wrap">
                {conteudoTemplate
                  .replace(/\{\{nome_estudante\}\}/g, "[Nome do Estudante]")
                  .replace(/\{\{numero_estudante\}\}/g, "[Nº Estudante]")
                  .replace(/\{\{classe\}\}/g, "[Classe]")
                  .replace(/\{\{turma\}\}/g, "[Turma]")
                  .replace(/\{\{ano_lectivo\}\}/g, "[Ano Lectivo]")
                  .replace(/\{\{data_matricula\}\}/g, "[Data Matrícula]")
                  .replace(/\{\{data_nascimento\}\}/g, "[Data Nascimento]")
                  .replace(/\{\{nome_encarregado\}\}/g, "[Nome Encarregado]")
                  .replace(/\{\{periodo\}\}/g, "[Período]")
                  .replace(/\{\{assiduidade\}\}/g, "[% Assiduidade]")
                  .replace(/\{\{finalidade\}\}/g, "[Finalidade]")
                  .replace(/\{\{texto_livre\}\}/g, "[Texto Livre]")
                  .replace(/\{\{validade\}\}/g, "[Validade]")}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">Criar Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoTemplateModal;
