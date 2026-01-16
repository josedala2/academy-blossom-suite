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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, CreditCard, Receipt } from "lucide-react";

const pagamentoSchema = z.object({
  estudanteId: z.string().min(1, { message: "Seleccione o estudante" }),
  tipoPagamento: z.string().min(1, { message: "Seleccione o tipo de pagamento" }),
  mesPagamento: z.string().min(1, { message: "Seleccione o mês" }),
  valor: z
    .string()
    .min(1, { message: "Valor é obrigatório" })
    .regex(/^[0-9.,]+$/, { message: "Valor deve conter apenas números" }),
  metodoPagamento: z.string().min(1, { message: "Seleccione o método de pagamento" }),
  referencia: z
    .string()
    .trim()
    .max(50, { message: "Referência deve ter no máximo 50 caracteres" })
    .optional()
    .or(z.literal("")),
  observacoes: z
    .string()
    .trim()
    .max(500, { message: "Observações devem ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

type PagamentoFormData = z.infer<typeof pagamentoSchema>;

interface RegistarPagamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const estudantesExemplo = [
  { value: "1", label: "João Manuel Silva - 10ª A", pendente: "35.000 Kz" },
  { value: "2", label: "Maria Ana Santos - 8ª B", pendente: "17.500 Kz" },
  { value: "3", label: "Pedro José Neto - 11ª C", pendente: "0 Kz" },
  { value: "4", label: "Ana Luísa Ferreira - 9ª A", pendente: "52.500 Kz" },
  { value: "5", label: "Carlos Mendes - 7ª B", pendente: "35.000 Kz" },
];

const tiposPagamento = [
  { value: "propina", label: "Propina Mensal" },
  { value: "matricula", label: "Taxa de Matrícula" },
  { value: "material", label: "Material Escolar" },
  { value: "uniforme", label: "Uniforme" },
  { value: "transporte", label: "Transporte" },
  { value: "outro", label: "Outro" },
];

const meses = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const metodosPagamento = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "multicaixa", label: "Multicaixa Express" },
  { value: "deposito", label: "Depósito Bancário" },
  { value: "cheque", label: "Cheque" },
];

const RegistarPagamentoModal = ({ open, onOpenChange }: RegistarPagamentoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEstudante, setSelectedEstudante] = useState<typeof estudantesExemplo[0] | null>(null);

  const form = useForm<PagamentoFormData>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      estudanteId: "",
      tipoPagamento: "",
      mesPagamento: "",
      valor: "",
      metodoPagamento: "",
      referencia: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: PagamentoFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const estudante = estudantesExemplo.find(e => e.value === data.estudanteId);
    const mes = meses.find(m => m.value === data.mesPagamento);
    
    toast.success("Pagamento registado com sucesso!", {
      description: `${data.valor} Kz - ${estudante?.label} (${mes?.label})`,
    });
    
    form.reset();
    setSelectedEstudante(null);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleEstudanteChange = (value: string) => {
    const estudante = estudantesExemplo.find(e => e.value === value);
    setSelectedEstudante(estudante || null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Registar Pagamento
          </DialogTitle>
          <DialogDescription>
            Registe um pagamento de propina ou outra taxa escolar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados do Estudante */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Identificação do Estudante
              </h3>
              
              <FormField
                control={form.control}
                name="estudanteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estudante *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleEstudanteChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pesquisar estudante..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estudantesExemplo.map((estudante) => (
                          <SelectItem key={estudante.value} value={estudante.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{estudante.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedEstudante && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor Pendente:</span>
                    <span className={`font-bold ${selectedEstudante.pendente !== "0 Kz" ? "text-accent" : "text-primary"}`}>
                      {selectedEstudante.pendente}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dados do Pagamento */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Detalhes do Pagamento
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tipoPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Pagamento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposPagamento.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mesPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês de Referência *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {meses.map((mes) => (
                            <SelectItem key={mes.value} value={mes.value}>
                              {mes.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (Kz) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 17500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metodoPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pagamento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {metodosPagamento.map((metodo) => (
                            <SelectItem key={metodo.value} value={metodo.value}>
                              {metodo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referencia"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nº de Referência / Comprovativo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: TRF-2026-001234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notas adicionais sobre o pagamento..." 
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A registar...
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    Confirmar Pagamento
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

export default RegistarPagamentoModal;
