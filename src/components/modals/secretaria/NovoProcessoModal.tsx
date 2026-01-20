import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FolderPlus,
  Search,
  User,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  Upload,
  FileText,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { longTextSchema, sanitizeString } from "@/lib/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data
const estudantes = [
  { id: "1", nome: "João Manuel Silva", numero: "2024001", classe: "10ª A" },
  { id: "2", nome: "Ana Beatriz Santos", numero: "2024002", classe: "11ª B" },
  { id: "3", nome: "Carlos Eduardo Mendes", numero: "2024003", classe: "12ª A" },
  { id: "4", nome: "Diana Rosa Ferreira", numero: "2024004", classe: "10ª C" },
  { id: "5", nome: "Emanuel José Costa", numero: "2024005", classe: "11ª A" },
];

const tiposProcesso = [
  {
    value: "transferencia",
    label: "Transferência",
    icon: ArrowRightLeft,
    descricao: "Processo de transferência do estudante para outra instituição",
    camposExtra: ["escola_destino", "motivo_transferencia"],
  },
  {
    value: "anulacao",
    label: "Anulação de Matrícula",
    icon: XCircle,
    descricao: "Cancelamento da matrícula do estudante",
    camposExtra: ["motivo_anulacao"],
  },
  {
    value: "reingresso",
    label: "Reingresso",
    icon: RotateCcw,
    descricao: "Retorno do estudante após período de ausência",
    camposExtra: ["motivo_ausencia", "periodo_ausencia"],
  },
];

// Schema de validação do processo
const processoSchema = z.object({
  tipoProcesso: z.string().min(1, { message: "Seleccione o tipo de processo" }),
  estudanteId: z.string().min(1, { message: "Seleccione o estudante" }),
  descricao: longTextSchema.refine((val) => val && val.length >= 10, {
    message: "Descrição deve ter pelo menos 10 caracteres",
  }),
  escolaDestino: z.string().trim().max(200, { message: "Nome da escola deve ter no máximo 200 caracteres" }).optional().or(z.literal("")),
  periodoAusencia: z.string().trim().max(100, { message: "Período deve ter no máximo 100 caracteres" }).optional().or(z.literal("")),
});

type ProcessoFormData = z.infer<typeof processoSchema>;

interface Anexo {
  name: string;
  size: number;
  type: string;
  file: File;
}

const NovoProcessoModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [searchEstudante, setSearchEstudante] = useState("");
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProcessoFormData>({
    resolver: zodResolver(processoSchema),
    defaultValues: {
      tipoProcesso: "",
      estudanteId: "",
      descricao: "",
      escolaDestino: "",
      periodoAusencia: "",
    },
  });

  const tipoProcesso = form.watch("tipoProcesso");
  const estudanteId = form.watch("estudanteId");
  
  const tipoSelecionado = tiposProcesso.find((t) => t.value === tipoProcesso);
  const estudanteSelecionado = estudantes.find((e) => e.id === estudanteId);

  const filteredEstudantes = estudantes.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) ||
      est.numero.includes(searchEstudante)
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const newAnexos: Anexo[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo de ficheiro não suportado`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: Ficheiro muito grande (máx. 10MB)`);
        return;
      }
      newAnexos.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      });
    });

    if (errors.length > 0) {
      toast({
        title: "Erro ao adicionar ficheiros",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (newAnexos.length > 0) {
      setAnexos((prev) => [...prev, ...newAnexos]);
      toast({
        title: "Anexo(s) adicionado(s)",
        description: `${newAnexos.length} ficheiro(s) adicionado(s) ao processo.`,
      });
    }

    // Reset input to allow re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddAnexo = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAnexo = (index: number) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    return '📎';
  };

  const onSubmit = (data: ProcessoFormData) => {
    toast({
      title: "Processo criado",
      description: `Processo de ${tipoSelecionado?.label} criado com sucesso.`,
    });

    // Reset form
    setStep(1);
    form.reset();
    setSearchEstudante("");
    setAnexos([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    setSearchEstudante("");
    setAnexos([]);
    onOpenChange(false);
  };

  const canProceedStep1 = !!tipoProcesso;
  const canProceedStep2 = !!estudanteId;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Novo Processo Administrativo
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Tipo de Processo */}
            {step === 1 && (
              <div className="space-y-4">
                <FormLabel>Seleccione o tipo de processo</FormLabel>
                <div className="grid gap-3">
                  {tiposProcesso.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <Card
                        key={tipo.value}
                        className={`cursor-pointer transition-colors ${
                          tipoProcesso === tipo.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => form.setValue("tipoProcesso", tipo.value)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                tipoProcesso === tipo.value
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{tipo.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {tipo.descricao}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Seleccionar Estudante */}
            {step === 2 && (
              <div className="space-y-4">
                <FormLabel>Seleccione o estudante</FormLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome ou número..."
                    value={searchEstudante}
                    onChange={(e) => setSearchEstudante(sanitizeString(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                  {filteredEstudantes.map((est) => (
                    <div
                      key={est.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        estudanteId === est.id
                          ? "bg-primary/10 border border-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => form.setValue("estudanteId", est.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{est.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            Nº {est.numero}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{est.classe}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Detalhes e Anexos */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Resumo */}
                <Card className="bg-muted/50">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Processo</p>
                        <p className="font-medium">{tipoSelecionado?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estudante</p>
                        <p className="font-medium">{estudanteSelecionado?.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {estudanteSelecionado?.classe}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campos Extra por Tipo */}
                {tipoProcesso === "transferencia" && (
                  <FormField
                    control={form.control}
                    name="escolaDestino"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escola de Destino</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome da escola de destino"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {tipoProcesso === "reingresso" && (
                  <FormField
                    control={form.control}
                    name="periodoAusencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Período de Ausência</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Janeiro a Março de 2024"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Descrição */}
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição / Motivo *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva o motivo e detalhes do processo..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Anexos */}
                <div>
                  <FormLabel className="mb-2 block">Anexos</FormLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    {anexos.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed rounded-lg">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum anexo adicionado
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, Imagens ou Documentos Word (máx. 10MB)
                        </p>
                      </div>
                    ) : (
                      anexos.map((anexo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-lg">{getFileIcon(anexo.type)}</span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{anexo.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(anexo.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAnexo(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleAddAnexo}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar Anexo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between mt-6">
              <div>
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Anterior
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)
                    }
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit">Criar Processo</Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoProcessoModal;