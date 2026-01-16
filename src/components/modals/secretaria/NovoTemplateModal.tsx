import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, X, GripVertical } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const camposDisponiveis = [
  { id: "nome_estudante", label: "Nome do Estudante", obrigatorio: true },
  { id: "numero_estudante", label: "Número do Estudante", obrigatorio: false },
  { id: "classe", label: "Classe", obrigatorio: true },
  { id: "turma", label: "Turma", obrigatorio: false },
  { id: "ano_lectivo", label: "Ano Lectivo", obrigatorio: true },
  { id: "data_matricula", label: "Data de Matrícula", obrigatorio: false },
  { id: "data_nascimento", label: "Data de Nascimento", obrigatorio: false },
  { id: "nome_encarregado", label: "Nome do Encarregado", obrigatorio: false },
  { id: "periodo", label: "Período/Trimestre", obrigatorio: false },
  { id: "assiduidade", label: "Percentagem de Assiduidade", obrigatorio: false },
  { id: "finalidade", label: "Finalidade", obrigatorio: false },
  { id: "texto_livre", label: "Texto Livre", obrigatorio: false },
  { id: "validade", label: "Validade do Documento", obrigatorio: false },
];

const NovoTemplateModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    requerAprovacao: false,
  });
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>([
    "nome_estudante",
    "classe",
    "ano_lectivo",
  ]);
  const [conteudoTemplate, setConteudoTemplate] = useState(
    `Declaramos para os devidos efeitos que {{nome_estudante}}, estudante da {{classe}}, encontra-se regularmente matriculado(a) nesta instituição de ensino no ano lectivo de {{ano_lectivo}}.

Por ser verdade, passamos a presente declaração.`
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nome) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha o código e nome do template.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template criado",
      description: `Template "${formData.nome}" criado com sucesso.`,
    });

    // Reset form
    setFormData({
      codigo: "",
      nome: "",
      descricao: "",
      requerAprovacao: false,
    });
    setCamposSelecionados(["nome_estudante", "classe", "ano_lectivo"]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Novo Template de Documento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
                }
                placeholder="Ex: DM, DF, AT"
                maxLength={4}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usado na numeração automática
              </p>
            </div>
            <div className="col-span-2">
              <Label htmlFor="nome">Nome do Template *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Declaração de Matrícula"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Breve descrição do propósito deste documento"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requerAprovacao"
              checked={formData.requerAprovacao}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requerAprovacao: checked as boolean })
              }
            />
            <Label htmlFor="requerAprovacao" className="text-sm">
              Requer aprovação da Direcção antes da emissão
            </Label>
          </div>

          <Separator />

          {/* Campos */}
          <div>
            <Label className="mb-2 block">Campos Disponíveis</Label>
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
            <Label htmlFor="conteudo">Conteúdo do Documento</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Use <code className="bg-muted px-1 rounded">{"{{campo}}"}</code> para inserir campos dinâmicos
            </p>
            <Textarea
              id="conteudo"
              value={conteudoTemplate}
              onChange={(e) => setConteudoTemplate(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Preview */}
          <div>
            <Label className="mb-2 block">Pré-visualização</Label>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoTemplateModal;
