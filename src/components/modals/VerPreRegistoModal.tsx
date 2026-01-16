import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Send,
  Edit,
  Printer,
} from "lucide-react";

interface PreRegisto {
  id: number;
  numero: string;
  nome: string;
  idade: number;
  dataNascimento: string;
  classePretendida: string;
  nomeEncarregado: string;
  telefoneEncarregado: string;
  emailEncarregado: string;
  estado: "pre-registo" | "em-analise" | "aprovado" | "rejeitado";
  dataRegisto: string;
  documentos: number;
  observacoes: string;
}

interface VerPreRegistoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preRegisto: PreRegisto | null;
}

const getEstadoBadge = (estado: PreRegisto["estado"]) => {
  switch (estado) {
    case "pre-registo":
      return (
        <Badge variant="outline" className="border-accent text-accent">
          <Clock className="h-3 w-3 mr-1" />
          Pré-registo
        </Badge>
      );
    case "em-analise":
      return (
        <Badge variant="outline" className="border-primary text-primary">
          <AlertCircle className="h-3 w-3 mr-1" />
          Em análise
        </Badge>
      );
    case "aprovado":
      return (
        <Badge variant="outline" className="border-green-500 text-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      );
    case "rejeitado":
      return (
        <Badge variant="outline" className="border-destructive text-destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>
      );
  }
};

const VerPreRegistoModal = ({ open, onOpenChange, preRegisto }: VerPreRegistoModalProps) => {
  if (!preRegisto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{preRegisto.nome}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span className="font-mono">{preRegisto.numero}</span>
                <span>•</span>
                {getEstadoBadge(preRegisto.estado)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados do Estudante */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
              Dados do Estudante
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{preRegisto.nome}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">
                    {new Date(preRegisto.dataNascimento).toLocaleDateString("pt-AO")} ({preRegisto.idade} anos)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classe Pretendida</p>
                  <p className="font-medium">{preRegisto.classePretendida}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documentos</p>
                  <p className="font-medium">{preRegisto.documentos} anexados</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados do Encarregado */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
              Dados do Encarregado de Educação
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{preRegisto.nomeEncarregado}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{preRegisto.telefoneEncarregado}</p>
                </div>
              </div>

              {preRegisto.emailEncarregado && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{preRegisto.emailEncarregado}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações do Processo */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
              Informações do Processo
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Registo</p>
                  <p className="font-medium">
                    {new Date(preRegisto.dataRegisto).toLocaleDateString("pt-AO")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  {getEstadoBadge(preRegisto.estado)}
                </div>
              </div>
            </div>

            {preRegisto.observacoes && (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="text-sm">{preRegisto.observacoes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            {preRegisto.estado === "pre-registo" && (
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Encaminhar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerPreRegistoModal;
