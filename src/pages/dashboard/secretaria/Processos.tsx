import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Plus,
  Eye,
  ArrowLeft,
  FolderOpen,
  Clock,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import NovoProcessoModal from "@/components/modals/secretaria/NovoProcessoModal";
import VerProcessoModal from "@/components/modals/secretaria/VerProcessoModal";

// Mock data
const processos = [
  {
    id: "1",
    numero: "PROC-2024-0001",
    tipo: "transferencia",
    tipoNome: "Transferência",
    estudante: "João Manuel Silva",
    classe: "10ª A",
    dataCriacao: "2024-01-15",
    estado: "em_analise",
    criadoPor: "Maria Fernandes",
    descricao: "Transferência para Colégio ABC por mudança de residência",
    anexos: 3,
    observacoes: [
      { data: "2024-01-15", autor: "Maria Fernandes", texto: "Processo iniciado a pedido do encarregado" },
      { data: "2024-01-16", autor: "Admin", texto: "Documentos verificados, aguardando aprovação da Direcção" },
    ],
  },
  {
    id: "2",
    numero: "PROC-2024-0002",
    tipo: "anulacao",
    tipoNome: "Anulação de Matrícula",
    estudante: "Ana Beatriz Santos",
    classe: "11ª B",
    dataCriacao: "2024-01-14",
    estado: "aprovado",
    criadoPor: "João Cardoso",
    descricao: "Anulação por motivos pessoais da família",
    anexos: 2,
    observacoes: [
      { data: "2024-01-14", autor: "João Cardoso", texto: "Solicitação recebida" },
      { data: "2024-01-15", autor: "Dr. António Sousa", texto: "Aprovado. Proceder com arquivamento." },
    ],
  },
  {
    id: "3",
    numero: "PROC-2024-0003",
    tipo: "reingresso",
    tipoNome: "Reingresso",
    estudante: "Carlos Eduardo Mendes",
    classe: "12ª A",
    dataCriacao: "2024-01-13",
    estado: "concluido",
    criadoPor: "Maria Fernandes",
    descricao: "Reingresso após período de doença prolongada",
    anexos: 5,
    observacoes: [
      { data: "2024-01-13", autor: "Maria Fernandes", texto: "Processo de reingresso iniciado" },
      { data: "2024-01-14", autor: "Admin", texto: "Documentação médica verificada" },
      { data: "2024-01-15", autor: "Dr. António Sousa", texto: "Aprovado o reingresso" },
      { data: "2024-01-16", autor: "Maria Fernandes", texto: "Estudante reintegrado na turma 12ª A" },
    ],
  },
  {
    id: "4",
    numero: "PROC-2024-0004",
    tipo: "transferencia",
    tipoNome: "Transferência",
    estudante: "Diana Rosa Ferreira",
    classe: "10ª C",
    dataCriacao: "2024-01-12",
    estado: "criado",
    criadoPor: "João Cardoso",
    descricao: "Transferência para escola pública",
    anexos: 1,
    observacoes: [
      { data: "2024-01-12", autor: "João Cardoso", texto: "Aguardando documentos do encarregado" },
    ],
  },
  {
    id: "5",
    numero: "PROC-2024-0005",
    tipo: "anulacao",
    tipoNome: "Anulação de Matrícula",
    estudante: "Emanuel José Costa",
    classe: "11ª A",
    dataCriacao: "2024-01-10",
    estado: "rejeitado",
    criadoPor: "Maria Fernandes",
    descricao: "Pedido de anulação por dificuldades financeiras",
    anexos: 2,
    observacoes: [
      { data: "2024-01-10", autor: "Maria Fernandes", texto: "Processo iniciado" },
      { data: "2024-01-11", autor: "Dr. António Sousa", texto: "Rejeitado. Proposta alternativa de bolsa parcial." },
    ],
  },
];

const tiposProcesso = [
  { value: "transferencia", label: "Transferência", icon: ArrowRightLeft },
  { value: "anulacao", label: "Anulação de Matrícula", icon: XCircle },
  { value: "reingresso", label: "Reingresso", icon: RotateCcw },
];

const SecretariaProcessos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [novoProcessoOpen, setNovoProcessoOpen] = useState(false);
  const [verProcessoOpen, setVerProcessoOpen] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<typeof processos[0] | null>(null);

  const filteredProcessos = processos.filter((proc) => {
    const matchesSearch =
      proc.estudante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || proc.tipo === tipoFilter;
    const matchesEstado = estadoFilter === "todos" || proc.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "criado":
        return (
          <Badge variant="outline" className="border-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Criado
          </Badge>
        );
      case "em_analise":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Em Análise
          </Badge>
        );
      case "aprovado":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "concluido":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoInfo = tiposProcesso.find((t) => t.value === tipo);
    if (!tipoInfo) return null;
    const Icon = tipoInfo.icon;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {tipoInfo.label}
      </Badge>
    );
  };

  const handleVerProcesso = (processo: typeof processos[0]) => {
    setSelectedProcesso(processo);
    setVerProcessoOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/secretaria">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestão de Processos Administrativos
              </h1>
              <p className="text-muted-foreground">
                Transferências, anulações e reingressos
              </p>
            </div>
          </div>
          <Button onClick={() => setNovoProcessoOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-foreground">
                {processos.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-gray-600">
                {processos.filter((p) => p.estado === "criado").length}
              </div>
              <div className="text-sm text-muted-foreground">Criados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-yellow-600">
                {processos.filter((p) => p.estado === "em_analise").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-blue-600">
                {processos.filter((p) => p.estado === "aprovado").length}
              </div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">
                {processos.filter((p) => p.estado === "concluido").length}
              </div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Info */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Fluxo de Trabalho
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Badge variant="outline" className="border-gray-400">Criado</Badge>
              <span>→</span>
              <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>
              <span>→</span>
              <Badge className="bg-blue-100 text-blue-800">Aprovado</Badge>
              <span>→</span>
              <Badge className="bg-green-100 text-green-800">Concluído</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por estudante ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  {tiposProcesso.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Estados</SelectItem>
                  <SelectItem value="criado">Criado</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Processos ({filteredProcessos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Anexos</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcessos.map((processo) => (
                  <TableRow key={processo.id}>
                    <TableCell className="font-mono text-sm">
                      {processo.numero}
                    </TableCell>
                    <TableCell>{getTipoBadge(processo.tipo)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{processo.estudante}</div>
                        <div className="text-xs text-muted-foreground">
                          {processo.classe}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {processo.dataCriacao}
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(processo.estado)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{processo.anexos} ficheiros</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Processo"
                          onClick={() => handleVerProcesso(processo)}
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

      {/* Modals */}
      <NovoProcessoModal
        open={novoProcessoOpen}
        onOpenChange={setNovoProcessoOpen}
      />
      <VerProcessoModal
        open={verProcessoOpen}
        onOpenChange={setVerProcessoOpen}
        processo={selectedProcesso}
      />
    </DashboardLayout>
  );
};

export default SecretariaProcessos;
