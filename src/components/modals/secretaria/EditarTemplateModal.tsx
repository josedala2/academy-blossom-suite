import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, FileText, Settings, Eye } from "lucide-react";

interface Template {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ultimaEdicao: string;
  editadoPor: string;
  activo: boolean;
  requerAprovacao: boolean;
  numeracaoActual: number;
  campos: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

const camposDisponiveis = [
  { id: "nome_estudante", label: "Nome do Estudante" },
  { id: "numero_estudante", label: "Número do Estudante" },
  { id: "classe", label: "Classe" },
  { id: "turma", label: "Turma" },
  { id: "ano_lectivo", label: "Ano Lectivo" },
  { id: "data_matricula", label: "Data de Matrícula" },
  { id: "data_nascimento", label: "Data de Nascimento" },
  { id: "nome_encarregado", label: "Nome do Encarregado" },
  { id: "periodo", label: "Período/Trimestre" },
  { id: "assiduidade", label: "Percentagem de Assiduidade" },
  { id: "finalidade", label: "Finalidade" },
  { id: "texto_livre", label: "Texto Livre" },
  { id: "validade", label: "Validade do Documento" },
];

const EditarTemplateModal = ({ open, onOpenChange, template }: Props) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    requerAprovacao: false,
    activo: true,
  });
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>([]);
  const [conteudoTemplate, setConteudoTemplate] = useState("");

  useEffect(() => {
    if (template) {
      setFormData({
        codigo: template.codigo,
        nome: template.nome,
        descricao: template.descricao,
        requerAprovacao: template.requerAprovacao,
        activo: template.activo,
      });
      setCamposSelecionados(template.campos);
      // Mock content based on template type
      if (template.codigo === "DM") {
        setConteudoTemplate(
          `Declaramos para os devidos efeitos que {{nome_estudante}}, estudante da {{classe}} {{turma}}, encontra-se regularmente matriculado(a) nesta instituição de ensino no ano lectivo de {{ano_lectivo}}, desde {{data_matricula}}.

Por ser verdade, passamos a presente declaração.`
        );
      } else if (template.codigo === "DF") {
        setConteudoTemplate(
          `Declaramos para os devidos efeitos que {{nome_estudante}}, estudante da {{classe}} {{turma}}, frequenta regularmente esta instituição de ensino no {{periodo}} do ano lectivo de {{ano_lectivo}}, com uma assiduidade de {{assiduidade}}.

Por ser verdade, passamos a presente declaração.`
        );
      } else {
        setConteudoTemplate(
          `Declaramos para os devidos efeitos que {{nome_estudante}}, estudante da {{classe}}, se encontra a frequentar esta instituição no ano lectivo de {{ano_lectivo}}.

{{texto_livre}}

Por ser verdade, passamos a presente declaração.`
        );
      }
    }
  }, [template]);

  const handleInsertCampo = (campoId: string) => {
    setConteudoTemplate((prev) => prev + ` {{${campoId}}}`);
    if (!camposSelecionados.includes(campoId)) {
      setCamposSelecionados([...camposSelecionados, campoId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Template actualizado",
      description: `Template "${formData.nome}" actualizado com sucesso.`,
    });

    onOpenChange(false);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Template: {template.nome}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="conteudo" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Pré-visualização
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="geral" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) =>
                      setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
                    }
                    className="font-mono"
                    maxLength={4}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="nome">Nome do Template</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, activo: checked as boolean })
                    }
                  />
                  <Label htmlFor="activo">Template activo (disponível para emissão)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requerAprovacao"
                    checked={formData.requerAprovacao}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, requerAprovacao: checked as boolean })
                    }
                  />
                  <Label htmlFor="requerAprovacao">
                    Requer aprovação da Direcção antes da emissão
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última edição:</span>
                  <span>{template.ultimaEdicao} por {template.editadoPor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documentos emitidos:</span>
                  <span>{template.numeracaoActual}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Próximo número:</span>
                  <span className="font-mono">
                    {template.codigo}-2024-{String(template.numeracaoActual + 1).padStart(4, "0")}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conteudo" className="space-y-4 mt-4">
              <div>
                <Label className="mb-2 block">Campos Disponíveis</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Clique num campo para inserir no conteúdo
                </p>
                <div className="flex flex-wrap gap-2">
                  {camposDisponiveis.map((campo) => (
                    <Badge
                      key={campo.id}
                      variant={camposSelecionados.includes(campo.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInsertCampo(campo.id)}
                    >
                      {campo.label}
                      <Plus className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="conteudo">Conteúdo do Documento</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Use <code className="bg-muted px-1 rounded">{"{{campo}}"}</code> para campos dinâmicos
                </p>
                <Textarea
                  id="conteudo"
                  value={conteudoTemplate}
                  onChange={(e) => setConteudoTemplate(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-8 bg-white dark:bg-gray-950 min-h-[400px]">
                {/* Document Header */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold uppercase">
                    {formData.nome}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nº {template.codigo}-2024-{String(template.numeracaoActual + 1).padStart(4, "0")}
                  </p>
                </div>

                {/* Document Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {conteudoTemplate
                    .replace(/\{\{nome_estudante\}\}/g, "João Manuel Silva")
                    .replace(/\{\{numero_estudante\}\}/g, "2024001")
                    .replace(/\{\{classe\}\}/g, "10ª")
                    .replace(/\{\{turma\}\}/g, "A")
                    .replace(/\{\{ano_lectivo\}\}/g, "2024")
                    .replace(/\{\{data_matricula\}\}/g, "15 de Janeiro de 2024")
                    .replace(/\{\{data_nascimento\}\}/g, "15 de Maio de 2008")
                    .replace(/\{\{nome_encarregado\}\}/g, "Maria da Conceição Silva")
                    .replace(/\{\{periodo\}\}/g, "1º Trimestre")
                    .replace(/\{\{assiduidade\}\}/g, "95%")
                    .replace(/\{\{finalidade\}\}/g, "Apresentação junto às autoridades competentes")
                    .replace(/\{\{texto_livre\}\}/g, "[Texto adicional aqui]")
                    .replace(/\{\{validade\}\}/g, "90 dias")}
                </div>

                {/* Document Footer */}
                <div className="mt-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Luanda, {new Date().toLocaleDateString("pt-AO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-8">
                    <div className="w-48 mx-auto border-t border-gray-400 pt-2">
                      <p className="text-sm">O Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Alterações</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditarTemplateModal;
