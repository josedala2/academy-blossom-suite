import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Printer, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GerarBoletinsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const turmas = [
  { id: "1", nome: "10ª Classe A", nivel: "II Ciclo" },
  { id: "2", nome: "10ª Classe B", nivel: "II Ciclo" },
  { id: "3", nome: "11ª Classe A", nivel: "II Ciclo" },
  { id: "4", nome: "11ª Classe B", nivel: "II Ciclo" },
  { id: "5", nome: "12ª Classe A", nivel: "II Ciclo" },
  { id: "6", nome: "12ª Classe B", nivel: "II Ciclo" },
];

const periodos = [
  { id: "1t", nome: "1º Trimestre", ano: "2024" },
  { id: "2t", nome: "2º Trimestre", ano: "2024" },
  { id: "3t", nome: "3º Trimestre", ano: "2024" },
  { id: "anual", nome: "Avaliação Anual", ano: "2024" },
];

const estudantesMock = [
  { id: "1", nome: "Ana Maria Silva", numero: "2024001" },
  { id: "2", nome: "Bruno José Santos", numero: "2024002" },
  { id: "3", nome: "Carla Fernanda Lopes", numero: "2024003" },
  { id: "4", nome: "Daniel Pedro Costa", numero: "2024004" },
  { id: "5", nome: "Eva Rosa Pereira", numero: "2024005" },
  { id: "6", nome: "Francisco Manuel Dias", numero: "2024006" },
  { id: "7", nome: "Graça Helena Nunes", numero: "2024007" },
  { id: "8", nome: "Hugo Miguel Ferreira", numero: "2024008" },
];

export function GerarBoletinsModal({ open, onOpenChange }: GerarBoletinsModalProps) {
  const { toast } = useToast();
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setEstudantesSelecionados(estudantesMock.map(e => e.id));
    } else {
      setEstudantesSelecionados([]);
    }
  };

  const handleSelectEstudante = (id: string, checked: boolean) => {
    if (checked) {
      setEstudantesSelecionados([...estudantesSelecionados, id]);
    } else {
      setEstudantesSelecionados(estudantesSelecionados.filter(e => e !== id));
      setSelectAll(false);
    }
  };

  const handleGenerate = async (action: 'download' | 'print') => {
    if (!turmaSelecionada || !periodoSelecionado) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione a turma e o período",
        variant: "destructive",
      });
      return;
    }

    if (estudantesSelecionados.length === 0) {
      toast({
        title: "Selecione estudantes",
        description: "Selecione pelo menos um estudante para gerar boletins",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simular geração
    await new Promise(resolve => setTimeout(resolve, 2000));

    const turma = turmas.find(t => t.id === turmaSelecionada);
    const periodo = periodos.find(p => p.id === periodoSelecionado);

    toast({
      title: action === 'download' ? "Boletins gerados" : "Boletins enviados para impressão",
      description: `${estudantesSelecionados.length} boletim(ns) da ${turma?.nome} - ${periodo?.nome}`,
    });

    setIsGenerating(false);
    onOpenChange(false);
    
    // Reset state
    setTurmaSelecionada("");
    setPeriodoSelecionado("");
    setEstudantesSelecionados([]);
    setSelectAll(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Boletins de Notas
          </DialogTitle>
          <DialogDescription>
            Selecione a turma, período e os estudantes para gerar os boletins
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Turma Selection */}
          <div className="space-y-2">
            <Label htmlFor="turma">Turma *</Label>
            <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
              <SelectTrigger id="turma">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome} - {turma.nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período Selection */}
          <div className="space-y-2">
            <Label htmlFor="periodo">Período *</Label>
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger id="periodo">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((periodo) => (
                  <SelectItem key={periodo.id} value={periodo.id}>
                    {periodo.nome} ({periodo.ano})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estudantes Selection */}
          {turmaSelecionada && periodoSelecionado && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Estudantes
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Selecionar todos
                  </label>
                </div>
              </div>
              
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-3">
                  {estudantesMock.map((estudante) => (
                    <div
                      key={estudante.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`estudante-${estudante.id}`}
                        checked={estudantesSelecionados.includes(estudante.id)}
                        onCheckedChange={(checked) =>
                          handleSelectEstudante(estudante.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`estudante-${estudante.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        <span className="font-medium">{estudante.nome}</span>
                        <span className="text-muted-foreground ml-2">
                          Nº {estudante.numero}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <p className="text-xs text-muted-foreground">
                {estudantesSelecionados.length} de {estudantesMock.length} estudante(s) selecionado(s)
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGenerate('print')}
            disabled={isGenerating || !turmaSelecionada || !periodoSelecionado || estudantesSelecionados.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button
            onClick={() => handleGenerate('download')}
            disabled={isGenerating || !turmaSelecionada || !periodoSelecionado || estudantesSelecionados.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "A gerar..." : "Gerar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
