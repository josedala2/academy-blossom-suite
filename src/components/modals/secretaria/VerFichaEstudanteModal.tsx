import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  CreditCard,
  BookOpen,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface Estudante {
  id: string;
  numero: string;
  nome: string;
  classe: string;
  turma: string;
  turno: string;
  encarregado: string;
  telefoneEncarregado: string;
  estadoFinanceiro: string;
  estadoMatricula: string;
  endereco: string;
  dataNascimento: string;
  naturalidade: string;
  nacionalidade: string;
  genero: string;
  documentoId: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudante: Estudante | null;
}

// Mock data adicional
const mockNotas = [
  { disciplina: "Matemática", t1: 14, t2: 16, t3: null, media: 15 },
  { disciplina: "Português", t1: 12, t2: 14, t3: null, media: 13 },
  { disciplina: "Física", t1: 15, t2: 17, t3: null, media: 16 },
  { disciplina: "Química", t1: 13, t2: 15, t3: null, media: 14 },
];

const mockFrequencia = {
  totalAulas: 120,
  presencas: 110,
  faltas: 10,
  faltasJustificadas: 6,
  percentagem: 91.7,
};

const mockFinanceiro = [
  { mes: "Janeiro", valor: 25000, estado: "pago", dataPagamento: "2024-01-10" },
  { mes: "Fevereiro", valor: 25000, estado: "pago", dataPagamento: "2024-02-08" },
  { mes: "Março", valor: 25000, estado: "pendente", dataPagamento: null },
];

const VerFichaEstudanteModal = ({ open, onOpenChange, estudante }: Props) => {
  if (!estudante) return null;

  const getEstadoFinanceiroColor = (estado: string) => {
    switch (estado) {
      case "regular":
      case "pago":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "devedor":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ficha do Estudante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold">{estudante.nome}</h2>
                <p className="text-muted-foreground">Nº {estudante.numero}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {estudante.classe} {estudante.turma}
                </Badge>
                <Badge variant="outline">{estudante.turno}</Badge>
                <Badge className={getEstadoFinanceiroColor(estudante.estadoFinanceiro)}>
                  {estudante.estadoFinanceiro}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="academico">Académico</TabsTrigger>
              <TabsTrigger value="frequencia">Frequência</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(estudante.dataNascimento).toLocaleDateString("pt-AO")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Género</p>
                    <p className="font-medium">{estudante.genero === "M" ? "Masculino" : "Feminino"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Naturalidade</p>
                    <p className="font-medium">{estudante.naturalidade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nacionalidade</p>
                    <p className="font-medium">{estudante.nacionalidade}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Documento de Identificação</p>
                    <p className="font-medium flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {estudante.documentoId}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {estudante.endereco}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Encarregado de Educação</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{estudante.encarregado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {estudante.telefoneEncarregado}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academico" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Notas do Ano Letivo
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Apenas Leitura
                  </Badge>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Disciplina</th>
                        <th className="text-center py-2">1º Trim.</th>
                        <th className="text-center py-2">2º Trim.</th>
                        <th className="text-center py-2">3º Trim.</th>
                        <th className="text-center py-2">Média</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockNotas.map((nota) => (
                        <tr key={nota.disciplina} className="border-b">
                          <td className="py-2">{nota.disciplina}</td>
                          <td className="text-center py-2">{nota.t1}</td>
                          <td className="text-center py-2">{nota.t2}</td>
                          <td className="text-center py-2 text-muted-foreground">
                            {nota.t3 || "-"}
                          </td>
                          <td className="text-center py-2 font-medium">{nota.media}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="frequencia" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Resumo de Frequência</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Apenas Leitura
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{mockFrequencia.totalAulas}</p>
                      <p className="text-sm text-muted-foreground">Total Aulas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{mockFrequencia.presencas}</p>
                      <p className="text-sm text-muted-foreground">Presenças</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{mockFrequencia.faltas}</p>
                      <p className="text-sm text-muted-foreground">Faltas</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{mockFrequencia.percentagem}%</p>
                      <p className="text-sm text-muted-foreground">Assiduidade</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">{mockFrequencia.faltasJustificadas}</span> faltas justificadas de {mockFrequencia.faltas} total
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Estado Financeiro
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Apenas Consulta
                  </Badge>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Mês</th>
                        <th className="text-right py-2">Valor</th>
                        <th className="text-center py-2">Estado</th>
                        <th className="text-right py-2">Data Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockFinanceiro.map((item) => (
                        <tr key={item.mes} className="border-b">
                          <td className="py-2">{item.mes}</td>
                          <td className="text-right py-2">
                            {item.valor.toLocaleString("pt-AO")} Kz
                          </td>
                          <td className="text-center py-2">
                            <Badge className={getEstadoFinanceiroColor(item.estado)}>
                              {item.estado}
                            </Badge>
                          </td>
                          <td className="text-right py-2 text-muted-foreground">
                            {item.dataPagamento
                              ? new Date(item.dataPagamento).toLocaleDateString("pt-AO")
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Para registar pagamentos ou alterar estados financeiros, contacte a Contabilidade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerFichaEstudanteModal;
