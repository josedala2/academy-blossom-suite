import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  FileText,
  Eye,
  ArrowLeft,
  FileCheck,
  FileClock,
  FileX,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  MapPin,
  MessageSquare,
  Send,
  RefreshCw,
  Calendar,
  User,
  FileBarChart,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Tipos de estado do documento
type EstadoSolicitacao = 
  | "solicitado" 
  | "em_analise" 
  | "em_producao" 
  | "pronto_entrega" 
  | "entregue" 
  | "cancelado";

// Interface para solicitação de documento
interface SolicitacaoDocumento {
  id: string;
  codigoRastreio: string;
  tipo: string;
  tipoNome: string;
  estudante: string;
  estudanteId: string;
  classe: string;
  dataSolicitacao: string;
  dataPrevisao: string;
  dataEntrega: string | null;
  estado: EstadoSolicitacao;
  canal: "presencial" | "online" | "portal";
  observacoes: string;
  historico: {
    data: string;
    estado: string;
    descricao: string;
    responsavel: string;
  }[];
}

// Mock data para solicitações
const solicitacoesMock: SolicitacaoDocumento[] = [
  {
    id: "1",
    codigoRastreio: "DOC-2026-00001",
    tipo: "declaracao_matricula",
    tipoNome: "Declaração de Matrícula",
    estudante: "João Manuel Silva",
    estudanteId: "EST001",
    classe: "10ª A",
    dataSolicitacao: "2026-01-18 09:30",
    dataPrevisao: "2026-01-20",
    dataEntrega: null,
    estado: "em_producao",
    canal: "portal",
    observacoes: "Urgente - necessário para visto",
    historico: [
      { data: "2026-01-18 09:30", estado: "solicitado", descricao: "Solicitação recebida via Portal do Estudante", responsavel: "Sistema" },
      { data: "2026-01-18 10:15", estado: "em_analise", descricao: "Documento em análise pela secretaria", responsavel: "Maria Fernandes" },
      { data: "2026-01-18 14:00", estado: "em_producao", descricao: "Documento em processo de emissão", responsavel: "João Cardoso" },
    ],
  },
  {
    id: "2",
    codigoRastreio: "DOC-2026-00002",
    tipo: "certificado_habilitacoes",
    tipoNome: "Certificado de Habilitações",
    estudante: "Ana Beatriz Santos",
    estudanteId: "EST002",
    classe: "12ª B",
    dataSolicitacao: "2026-01-17 14:20",
    dataPrevisao: "2026-02-16",
    dataEntrega: null,
    estado: "em_analise",
    canal: "presencial",
    observacoes: "",
    historico: [
      { data: "2026-01-17 14:20", estado: "solicitado", descricao: "Solicitação presencial na secretaria", responsavel: "João Cardoso" },
      { data: "2026-01-17 16:00", estado: "em_analise", descricao: "Verificação de dados académicos", responsavel: "Maria Fernandes" },
    ],
  },
  {
    id: "3",
    codigoRastreio: "DOC-2026-00003",
    tipo: "declaracao_frequencia",
    tipoNome: "Declaração de Frequência",
    estudante: "Carlos Eduardo Mendes",
    estudanteId: "EST003",
    classe: "11ª A",
    dataSolicitacao: "2026-01-16 11:00",
    dataPrevisao: "2026-01-21",
    dataEntrega: "2026-01-18 15:30",
    estado: "entregue",
    canal: "online",
    observacoes: "",
    historico: [
      { data: "2026-01-16 11:00", estado: "solicitado", descricao: "Solicitação online recebida", responsavel: "Sistema" },
      { data: "2026-01-16 14:00", estado: "em_analise", descricao: "Documento em análise", responsavel: "Maria Fernandes" },
      { data: "2026-01-17 09:00", estado: "em_producao", descricao: "Documento em produção", responsavel: "João Cardoso" },
      { data: "2026-01-17 16:00", estado: "pronto_entrega", descricao: "Documento pronto para levantamento", responsavel: "João Cardoso" },
      { data: "2026-01-18 15:30", estado: "entregue", descricao: "Documento entregue ao encarregado", responsavel: "Maria Fernandes" },
    ],
  },
  {
    id: "4",
    codigoRastreio: "DOC-2026-00004",
    tipo: "guia_transferencia",
    tipoNome: "Guia de Transferência",
    estudante: "Diana Rosa Ferreira",
    estudanteId: "EST004",
    classe: "10ª C",
    dataSolicitacao: "2026-01-15 10:00",
    dataPrevisao: "2026-01-25",
    dataEntrega: null,
    estado: "pronto_entrega",
    canal: "presencial",
    observacoes: "Transferência para Luanda",
    historico: [
      { data: "2026-01-15 10:00", estado: "solicitado", descricao: "Solicitação de transferência recebida", responsavel: "Maria Fernandes" },
      { data: "2026-01-15 14:00", estado: "em_analise", descricao: "Verificação da situação académica e financeira", responsavel: "João Cardoso" },
      { data: "2026-01-17 09:00", estado: "em_producao", descricao: "Elaboração do documento de transferência", responsavel: "Maria Fernandes" },
      { data: "2026-01-19 11:00", estado: "pronto_entrega", descricao: "Documento pronto - aguardando levantamento", responsavel: "João Cardoso" },
    ],
  },
  {
    id: "5",
    codigoRastreio: "DOC-2026-00005",
    tipo: "historico_escolar",
    tipoNome: "Histórico Escolar",
    estudante: "Emanuel José Costa",
    estudanteId: "EST005",
    classe: "9ª A",
    dataSolicitacao: "2026-01-14 09:00",
    dataPrevisao: "2026-01-29",
    dataEntrega: null,
    estado: "cancelado",
    canal: "portal",
    observacoes: "Cancelado a pedido do encarregado",
    historico: [
      { data: "2026-01-14 09:00", estado: "solicitado", descricao: "Solicitação via portal", responsavel: "Sistema" },
      { data: "2026-01-14 11:00", estado: "em_analise", descricao: "Documento em análise", responsavel: "Maria Fernandes" },
      { data: "2026-01-16 10:00", estado: "cancelado", descricao: "Cancelado a pedido do encarregado de educação", responsavel: "João Cardoso" },
    ],
  },
  {
    id: "6",
    codigoRastreio: "DOC-2026-00006",
    tipo: "declaracao_matricula",
    tipoNome: "Declaração de Matrícula",
    estudante: "Fernanda Luísa Alves",
    estudanteId: "EST006",
    classe: "8ª B",
    dataSolicitacao: "2026-01-19 08:00",
    dataPrevisao: "2026-01-21",
    dataEntrega: null,
    estado: "solicitado",
    canal: "portal",
    observacoes: "",
    historico: [
      { data: "2026-01-19 08:00", estado: "solicitado", descricao: "Solicitação recebida via Portal do Estudante", responsavel: "Sistema" },
    ],
  },
];

const SecretariaRastreioDocumentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoDocumento | null>(null);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [novaObservacao, setNovaObservacao] = useState("");

  const solicitacoes = solicitacoesMock;

  const filteredSolicitacoes = solicitacoes.filter((sol) => {
    const matchesSearch =
      sol.estudante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.codigoRastreio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === "todos" || sol.estado === estadoFilter;
    const matchesTipo = tipoFilter === "todos" || sol.tipo === tipoFilter;
    const matchesCanal = canalFilter === "todos" || sol.canal === canalFilter;
    return matchesSearch && matchesEstado && matchesTipo && matchesCanal;
  });

  const getEstadoBadge = (estado: EstadoSolicitacao) => {
    const config = {
      solicitado: { icon: Clock, label: "Solicitado", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
      em_analise: { icon: AlertCircle, label: "Em Análise", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      em_producao: { icon: RefreshCw, label: "Em Produção", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      pronto_entrega: { icon: Package, label: "Pronto Entrega", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      entregue: { icon: CheckCircle2, label: "Entregue", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" },
      cancelado: { icon: FileX, label: "Cancelado", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    };
    const { icon: Icon, label, className } = config[estado];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getCanalBadge = (canal: string) => {
    const config = {
      presencial: { label: "Presencial", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
      online: { label: "Online", className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
      portal: { label: "Portal", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
    };
    const { label, className } = config[canal as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getProgressValue = (estado: EstadoSolicitacao) => {
    const values = {
      solicitado: 20,
      em_analise: 40,
      em_producao: 60,
      pronto_entrega: 80,
      entregue: 100,
      cancelado: 0,
    };
    return values[estado];
  };

  const handleVerDetalhes = (sol: SolicitacaoDocumento) => {
    setSelectedSolicitacao(sol);
    setDetalhesOpen(true);
  };

  const handleAvancarEstado = () => {
    if (!selectedSolicitacao) return;
    
    const proximoEstado: Record<EstadoSolicitacao, EstadoSolicitacao | null> = {
      solicitado: "em_analise",
      em_analise: "em_producao",
      em_producao: "pronto_entrega",
      pronto_entrega: "entregue",
      entregue: null,
      cancelado: null,
    };

    const novoEstado = proximoEstado[selectedSolicitacao.estado];
    if (novoEstado) {
      toast.success(`Estado actualizado para: ${novoEstado.replace(/_/g, " ").toUpperCase()}`);
    }
  };

  const handleAdicionarObservacao = () => {
    if (!novaObservacao.trim()) return;
    toast.success("Observação adicionada com sucesso");
    setNovaObservacao("");
  };

  // Estatísticas
  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => ["solicitado", "em_analise", "em_producao"].includes(s.estado)).length,
    prontosEntrega: solicitacoes.filter(s => s.estado === "pronto_entrega").length,
    entregues: solicitacoes.filter(s => s.estado === "entregue").length,
    cancelados: solicitacoes.filter(s => s.estado === "cancelado").length,
    viaPortal: solicitacoes.filter(s => s.canal === "portal").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/secretaria/documentos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Rastreio de Documentos
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o estado das solicitações de documentos
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.info("Actualizando dados...")}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.prontosEntrega}</div>
                  <div className="text-xs text-muted-foreground">Prontos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.entregues}</div>
                  <div className="text-xs text-muted-foreground">Entregues</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <FileX className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.cancelados}</div>
                  <div className="text-xs text-muted-foreground">Cancelados</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.viaPortal}</div>
                  <div className="text-xs text-muted-foreground">Via Portal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por estudante ou código de rastreio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Estados</SelectItem>
                  <SelectItem value="solicitado">Solicitado</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="em_producao">Em Produção</SelectItem>
                  <SelectItem value="pronto_entrega">Pronto Entrega</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="declaracao_matricula">Declaração de Matrícula</SelectItem>
                  <SelectItem value="declaracao_frequencia">Declaração de Frequência</SelectItem>
                  <SelectItem value="certificado_habilitacoes">Certificado de Habilitações</SelectItem>
                  <SelectItem value="guia_transferencia">Guia de Transferência</SelectItem>
                  <SelectItem value="historico_escolar">Histórico Escolar</SelectItem>
                </SelectContent>
              </Select>
              <Select value={canalFilter} onValueChange={setCanalFilter}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Canais</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="portal">Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Solicitações ({filteredSolicitacoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitacoes.map((sol) => (
                  <TableRow key={sol.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {sol.codigoRastreio}
                    </TableCell>
                    <TableCell>{sol.tipoNome}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sol.estudante}</div>
                        <div className="text-xs text-muted-foreground">{sol.classe}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getCanalBadge(sol.canal)}</TableCell>
                    <TableCell className="w-32">
                      <div className="space-y-1">
                        <Progress value={getProgressValue(sol.estado)} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          {getProgressValue(sol.estado)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(sol.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(sol.dataPrevisao).toLocaleDateString("pt-AO")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Detalhes"
                          onClick={() => handleVerDetalhes(sol)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesOpen} onOpenChange={setDetalhesOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSolicitacao && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedSolicitacao.codigoRastreio}
                </DialogTitle>
                <DialogDescription>
                  Detalhes da solicitação de documento
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Progresso Visual */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{getProgressValue(selectedSolicitacao.estado)}%</span>
                  </div>
                  <Progress value={getProgressValue(selectedSolicitacao.estado)} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Solicitado</span>
                    <span>Análise</span>
                    <span>Produção</span>
                    <span>Pronto</span>
                    <span>Entregue</span>
                  </div>
                </div>

                {/* Informações */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Documento</div>
                    <div className="font-medium">{selectedSolicitacao.tipoNome}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Estado Actual</div>
                    {getEstadoBadge(selectedSolicitacao.estado)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Estudante</div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedSolicitacao.estudante}</span>
                      <span className="text-sm text-muted-foreground">({selectedSolicitacao.classe})</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Canal de Solicitação</div>
                    {getCanalBadge(selectedSolicitacao.canal)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Data de Solicitação</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {selectedSolicitacao.dataSolicitacao}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Previsão de Entrega</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {new Date(selectedSolicitacao.dataPrevisao).toLocaleDateString("pt-AO")}
                    </div>
                  </div>
                </div>

                {selectedSolicitacao.observacoes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Observações</div>
                    <div>{selectedSolicitacao.observacoes}</div>
                  </div>
                )}

                {/* Histórico */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Histórico de Rastreio
                  </h4>
                  <div className="space-y-4">
                    {selectedSolicitacao.historico.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${
                            index === 0 ? "bg-primary" : "bg-muted-foreground/30"
                          }`} />
                          {index < selectedSolicitacao.historico.length - 1 && (
                            <div className="w-px h-full bg-muted-foreground/30" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{item.estado.replace(/_/g, " ").toUpperCase()}</span>
                            <span className="text-xs text-muted-foreground">{item.data}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                          <p className="text-xs text-muted-foreground">Por: {item.responsavel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adicionar Observação */}
                {selectedSolicitacao.estado !== "entregue" && selectedSolicitacao.estado !== "cancelado" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adicionar Observação</label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Escreva uma observação..."
                        value={novaObservacao}
                        onChange={(e) => setNovaObservacao(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button size="sm" onClick={handleAdicionarObservacao}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDetalhesOpen(false)}>
                  Fechar
                </Button>
                {selectedSolicitacao.estado !== "entregue" && selectedSolicitacao.estado !== "cancelado" && (
                  <Button onClick={handleAvancarEstado}>
                    <Send className="h-4 w-4 mr-2" />
                    Avançar Estado
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SecretariaRastreioDocumentos;
