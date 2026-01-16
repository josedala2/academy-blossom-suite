import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  FileText,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";

interface Estudante {
  id: string;
  nome: string;
  classe: string;
}

interface Encarregado {
  id: string;
  nome: string;
  parentesco: string;
  telefone: string;
  telefoneAlt: string | null;
  email: string | null;
  endereco: string;
  profissao: string;
  localTrabalho: string;
  documentoId: string;
  estudantes: Estudante[];
  temCredenciais: boolean;
  ultimoAcesso: string | null;
  dataCriacao: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encarregado: Encarregado | null;
}

// Mock histórico de comunicação
const mockHistorico = [
  {
    id: "1",
    tipo: "email",
    assunto: "Reunião de Pais",
    data: "2024-01-10 14:30",
    estado: "lido",
  },
  {
    id: "2",
    tipo: "sms",
    assunto: "Aviso de falta",
    data: "2024-01-08 09:15",
    estado: "entregue",
  },
  {
    id: "3",
    tipo: "email",
    assunto: "Boletim do 1º Trimestre",
    data: "2023-12-15 10:00",
    estado: "lido",
  },
];

const VerEncarregadoModal = ({ open, onOpenChange, encarregado }: Props) => {
  if (!encarregado) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Encarregado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold">{encarregado.nome}</h2>
                <p className="text-muted-foreground">{encarregado.parentesco}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {encarregado.temCredenciais ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Acesso Activo
                  </Badge>
                ) : (
                  <Badge variant="outline">Sem Credenciais</Badge>
                )}
                <Badge variant="secondary">
                  {encarregado.estudantes.length} educando(s)
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contactos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contactos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{encarregado.telefone}</span>
                  <Badge variant="outline" className="text-xs">Principal</Badge>
                </div>
                {encarregado.telefoneAlt && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{encarregado.telefoneAlt}</span>
                  </div>
                )}
                {encarregado.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{encarregado.email}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{encarregado.endereco}</span>
                </div>
              </CardContent>
            </Card>

            {/* Profissão */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{encarregado.profissao}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {encarregado.localTrabalho}
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{encarregado.documentoId}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estudantes Associados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Estudantes Associados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {encarregado.estudantes.map((est) => (
                  <div
                    key={est.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{est.nome}</span>
                    <Badge variant="secondary">{est.classe}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Comunicação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Histórico de Comunicação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockHistorico.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="uppercase text-xs">
                        {item.tipo}
                      </Badge>
                      <span className="font-medium">{item.assunto}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.data}
                      <Badge
                        variant="secondary"
                        className={
                          item.estado === "lido"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }
                      >
                        {item.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acesso */}
          {encarregado.temCredenciais && (
            <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Último acesso ao portal
              </span>
              <span className="font-medium">{encarregado.ultimoAcesso}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerEncarregadoModal;
