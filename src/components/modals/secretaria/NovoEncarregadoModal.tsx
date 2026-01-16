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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  const [formData, setFormData] = useState({
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
  });
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<string[]>([]);
  const [searchEstudante, setSearchEstudante] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha o nome e telefone.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Encarregado criado",
      description: formData.criarCredenciais
        ? "Encarregado criado e credenciais enviadas com sucesso."
        : "Encarregado criado com sucesso.",
    });
    
    // Reset form
    setFormData({
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
    });
    setEstudantesSelecionados([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Encarregado de Educação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h4 className="font-medium">Dados Pessoais</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo do encarregado"
                  required
                />
              </div>
              <div>
                <Label htmlFor="parentesco">Parentesco</Label>
                <Select
                  value={formData.parentesco}
                  onValueChange={(value) => setFormData({ ...formData, parentesco: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
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
              </div>
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                  placeholder="Profissão"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="localTrabalho">Local de Trabalho</Label>
                <Input
                  id="localTrabalho"
                  value={formData.localTrabalho}
                  onChange={(e) => setFormData({ ...formData, localTrabalho: e.target.value })}
                  placeholder="Empresa ou instituição"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Documento */}
          <div className="space-y-4">
            <h4 className="font-medium">Documento de Identificação</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.documentoTipo}
                  onValueChange={(value) => setFormData({ ...formData, documentoTipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bi">BI</SelectItem>
                    <SelectItem value="passaporte">Passaporte</SelectItem>
                    <SelectItem value="cedula">Cédula</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="documentoNumero">Número</Label>
                <Input
                  id="documentoNumero"
                  value={formData.documentoNumero}
                  onChange={(e) => setFormData({ ...formData, documentoNumero: e.target.value })}
                  placeholder="Número do documento"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contactos */}
          <div className="space-y-4">
            <h4 className="font-medium">Contactos</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone Principal *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="+244 9XX XXX XXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefoneAlt">Telefone Alternativo</Label>
                <Input
                  id="telefoneAlt"
                  value={formData.telefoneAlt}
                  onChange={(e) => setFormData({ ...formData, telefoneAlt: e.target.value })}
                  placeholder="+244 9XX XXX XXX"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Endereço completo"
                  rows={2}
                />
              </div>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="criarCredenciais"
              checked={formData.criarCredenciais}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, criarCredenciais: checked as boolean })
              }
            />
            <Label htmlFor="criarCredenciais" className="text-sm">
              Criar credenciais de acesso ao portal (email ou SMS)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Encarregado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoEncarregadoModal;
