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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Search, User, AlertTriangle, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { observationSchema, sanitizeString } from "@/lib/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - Estudantes com dados conforme Decreto 227/25
const estudantes = [
  { id: "1", nome: "João Manuel Silva", numero: "2024001", classe: "10ª A", bi: "007654321LA045", iua: "AO-2024-EDU-000001" },
  { id: "2", nome: "Ana Beatriz Santos", numero: "2024002", classe: "11ª B", bi: "008765432LA046", iua: "AO-2024-EDU-000002" },
  { id: "3", nome: "Carlos Eduardo Mendes", numero: "2024003", classe: "12ª A", bi: "009876543LA047", iua: "AO-2024-EDU-000003" },
  { id: "4", nome: "Diana Rosa Ferreira", numero: "2024004", classe: "10ª C", bi: "010987654LA048", iua: "AO-2024-EDU-000004" },
  { id: "5", nome: "Emanuel José Costa", numero: "2024005", classe: "11ª A", bi: "011098765LA049", iua: "AO-2024-EDU-000005" },
];

// Tipos de documento conforme Decreto Presidencial n.º 227/25
const tiposDocumento = [
  { 
    value: "declaracao_matricula", 
    label: "Declaração de Matrícula", 
    codigo: "DM",
    requerAprovacao: false,
    descricao: "Confirma a matrícula do estudante na instituição (Art. 4.º, alínea c)",
    prazoEmissao: "Imediato"
  },
  { 
    value: "declaracao_frequencia", 
    label: "Declaração de Frequência", 
    codigo: "DF",
    requerAprovacao: false,
    descricao: "Confirma a frequência regular do estudante (Prazo: até 5 dias úteis)",
    prazoEmissao: "Até 5 dias úteis"
  },
  { 
    value: "certificado_habilitacoes", 
    label: "Certificado de Habilitações", 
    codigo: "CH",
    requerAprovacao: true,
    descricao: "Conclusão do Ensino Primário ou I Ciclo do Secundário (Art. 4.º, alínea a)",
    prazoEmissao: "Até 30 dias úteis"
  },
  { 
    value: "diploma", 
    label: "Diploma", 
    codigo: "DP",
    requerAprovacao: true,
    descricao: "Conclusão do II Ciclo - Técnico Médio Nível 5 QNQ (Art. 4.º, alínea b)",
    prazoEmissao: "Até 30 dias úteis"
  },
  { 
    value: "guia_transferencia", 
    label: "Guia de Transferência", 
    codigo: "GT",
    requerAprovacao: true,
    descricao: "Mobilidade entre instituições de ensino (Art. 4.º, alínea g)",
    prazoEmissao: "Até 10 dias úteis"
  },
  { 
    value: "historico_escolar", 
    label: "Histórico Escolar", 
    codigo: "HE",
    requerAprovacao: true,
    descricao: "Registo completo do percurso académico",
    prazoEmissao: "Até 15 dias úteis"
  },
  { 
    value: "declaracao_simples", 
    label: "Declaração Simples", 
    codigo: "DS",
    requerAprovacao: true,
    descricao: "Declaração genérica para diversos fins",
    prazoEmissao: "Até 5 dias úteis"
  },
  { 
    value: "atestado", 
    label: "Atestado Administrativo", 
    codigo: "AT",
    requerAprovacao: true,
    descricao: "Atestado para situações administrativas especiais",
    prazoEmissao: "Até 5 dias úteis"
  },
];

// Schema de validação
const documentoSchema = z.object({
  tipoDocumento: z.string().min(1, { message: "Seleccione o tipo de documento" }),
  estudanteId: z.string().min(1, { message: "Seleccione o estudante" }),
  finalidade: z.string().trim().max(200, { message: "Finalidade deve ter no máximo 200 caracteres" }).optional().or(z.literal("")),
  observacoes: observationSchema,
  vias: z.string().min(1, { message: "Seleccione o número de vias" }),
});

type DocumentoFormData = z.infer<typeof documentoSchema>;

const EmitirDocumentoModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [searchEstudante, setSearchEstudante] = useState("");

  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(documentoSchema),
    defaultValues: {
      tipoDocumento: "",
      estudanteId: "",
      finalidade: "",
      observacoes: "",
      vias: "1",
    },
  });

  const tipoDocumento = form.watch("tipoDocumento");
  const estudanteId = form.watch("estudanteId");

  const tipoSelecionado = tiposDocumento.find((t) => t.value === tipoDocumento);
  const estudanteSelecionado = estudantes.find((e) => e.id === estudanteId);

  const filteredEstudantes = estudantes.filter(
    (est) =>
      est.nome.toLowerCase().includes(searchEstudante.toLowerCase()) ||
      est.numero.includes(searchEstudante)
  );

  const onSubmit = (data: DocumentoFormData) => {
    if (tipoSelecionado?.requerAprovacao) {
      toast({
        title: "Documento enviado para aprovação",
        description: `O documento será analisado pela Direcção antes da emissão.`,
      });
    } else {
      toast({
        title: "Documento emitido",
        description: `${tipoSelecionado?.label} emitido com sucesso.`,
      });
    }

    // Reset form
    setStep(1);
    form.reset();
    setSearchEstudante("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    setSearchEstudante("");
    onOpenChange(false);
  };

  const canProceedStep1 = !!tipoDocumento;
  const canProceedStep2 = !!estudanteId;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Emitir Documento
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Tipo de Documento */}
            {step === 1 && (
              <div className="space-y-4">
                <FormLabel>Seleccione o tipo de documento</FormLabel>
                <div className="grid gap-3">
                  {tiposDocumento.map((tipo) => (
                    <Card
                      key={tipo.value}
                      className={`cursor-pointer transition-colors ${
                        tipoDocumento === tipo.value
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground/50"
                      }`}
                      onClick={() => form.setValue("tipoDocumento", tipo.value)}
                    >
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="font-mono">
                                {tipo.codigo}
                              </Badge>
                              <span className="font-medium">{tipo.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {tipo.descricao}
                            </p>
                            <p className="text-xs text-primary mt-1">
                              Prazo: {tipo.prazoEmissao}
                            </p>
                          </div>
                          {tipo.requerAprovacao && (
                            <Badge variant="outline" className="text-orange-600 shrink-0 ml-2">
                              <Lock className="h-3 w-3 mr-1" />
                              Aprovação
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                            Nº {est.numero} • BI: {est.bi}
                          </div>
                          <div className="text-xs text-primary">
                            IUA: {est.iua}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{est.classe}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Detalhes e Confirmação */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Resumo */}
                <Card className="bg-muted/50">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Documento</p>
                        <p className="font-medium">{tipoSelecionado?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estudante</p>
                        <p className="font-medium">{estudanteSelecionado?.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {estudanteSelecionado?.classe} • Nº {estudanteSelecionado?.numero}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {tipoSelecionado?.requerAprovacao && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium">Este documento requer aprovação</p>
                      <p className="text-xs mt-1">
                        Será enviado para a Direcção antes da emissão final.
                      </p>
                    </div>
                  </div>
                )}

                {(tipoDocumento === "declaracao_simples" || tipoDocumento === "atestado") && (
                  <FormField
                    control={form.control}
                    name="finalidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Finalidade / Motivo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Pedido de visto, abertura de conta bancária..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Vias</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 via</SelectItem>
                            <SelectItem value="2">2 vias</SelectItem>
                            <SelectItem value="3">3 vias</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Notas adicionais..."
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      (step === 1 && !canProceedStep1) ||
                      (step === 2 && !canProceedStep2)
                    }
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit">
                    {tipoSelecionado?.requerAprovacao ? "Enviar para Aprovação" : "Emitir Documento"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmitirDocumentoModal;