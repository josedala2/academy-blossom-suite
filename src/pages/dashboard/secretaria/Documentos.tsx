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
  FileText,
  Plus,
  Eye,
  Download,
  Printer,
  ArrowLeft,
  FileCheck,
  FileClock,
  FileX,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import EmitirDocumentoModal from "@/components/modals/secretaria/EmitirDocumentoModal";
import VerDocumentoModal from "@/components/modals/secretaria/VerDocumentoModal";

// Mock data
const documentosEmitidos = [
  {
    id: "1",
    numero: "DM-2024-0001",
    tipo: "declaracao_matricula",
    tipoNome: "Declaração de Matrícula",
    estudante: "João Manuel Silva",
    classe: "10ª A",
    dataEmissao: "2024-01-15 09:30",
    emitidoPor: "Maria Fernandes",
    estado: "emitido",
    aprovadoPor: null,
  },
  {
    id: "2",
    numero: "DF-2024-0015",
    tipo: "declaracao_frequencia",
    tipoNome: "Declaração de Frequência",
    estudante: "Ana Beatriz Santos",
    classe: "11ª B",
    dataEmissao: "2024-01-14 14:20",
    emitidoPor: "João Cardoso",
    estado: "emitido",
    aprovadoPor: null,
  },
  {
    id: "3",
    numero: "DS-2024-0008",
    tipo: "declaracao_simples",
    tipoNome: "Declaração Simples",
    estudante: "Carlos Eduardo Mendes",
    classe: "12ª A",
    dataEmissao: "2024-01-14 11:45",
    emitidoPor: "Maria Fernandes",
    estado: "pendente_aprovacao",
    aprovadoPor: null,
  },
  {
    id: "4",
    numero: "AT-2024-0003",
    tipo: "atestado",
    tipoNome: "Atestado Administrativo",
    estudante: "Diana Rosa Ferreira",
    classe: "10ª C",
    dataEmissao: "2024-01-13 16:00",
    emitidoPor: "João Cardoso",
    estado: "aprovado",
    aprovadoPor: "Dr. António Sousa",
  },
  {
    id: "5",
    numero: "DM-2024-0002",
    tipo: "declaracao_matricula",
    tipoNome: "Declaração de Matrícula",
    estudante: "Emanuel José Costa",
    classe: "11ª A",
    dataEmissao: "2024-01-12 10:15",
    emitidoPor: "Maria Fernandes",
    estado: "rejeitado",
    aprovadoPor: null,
  },
];

// Tipos de documento conforme Decreto Presidencial n.º 227/25
const tiposDocumento = [
  { value: "declaracao_matricula", label: "Declaração de Matrícula", requerAprovacao: false },
  { value: "declaracao_frequencia", label: "Declaração de Frequência", requerAprovacao: false },
  { value: "certificado_habilitacoes", label: "Certificado de Habilitações", requerAprovacao: true },
  { value: "diploma", label: "Diploma", requerAprovacao: true },
  { value: "guia_transferencia", label: "Guia de Transferência", requerAprovacao: true },
  { value: "historico_escolar", label: "Histórico Escolar", requerAprovacao: true },
  { value: "declaracao_simples", label: "Declaração Simples", requerAprovacao: true },
  { value: "atestado", label: "Atestado Administrativo", requerAprovacao: true },
];

const SecretariaDocumentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [emitirModalOpen, setEmitirModalOpen] = useState(false);
  const [verDocumentoOpen, setVerDocumentoOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<typeof documentosEmitidos[0] | null>(null);

  const filteredDocumentos = documentosEmitidos.filter((doc) => {
    const matchesSearch =
      doc.estudante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || doc.tipo === tipoFilter;
    const matchesEstado = estadoFilter === "todos" || doc.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "emitido":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Emitido
          </Badge>
        );
      case "pendente_aprovacao":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <FileClock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "aprovado":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <FileCheck className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <FileX className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const handleVerDocumento = (doc: typeof documentosEmitidos[0]) => {
    setSelectedDocumento(doc);
    setVerDocumentoOpen(true);
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
                Emissão de Documentos
              </h1>
              <p className="text-muted-foreground">
                Emitir e gerir documentos administrativos
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard/secretaria/templates">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Gerir Templates
              </Button>
            </Link>
            <Button onClick={() => setEmitirModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Emitir Documento
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-foreground">
                {documentosEmitidos.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Emitidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">
                {documentosEmitidos.filter((d) => d.estado === "emitido").length}
              </div>
              <div className="text-sm text-muted-foreground">Emitidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-yellow-600">
                {documentosEmitidos.filter((d) => d.estado === "pendente_aprovacao").length}
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-blue-600">
                {documentosEmitidos.filter((d) => d.estado === "aprovado").length}
              </div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-muted-foreground">
                {documentosEmitidos.filter((d) => d.tipo === "declaracao_matricula").length}
              </div>
              <div className="text-sm text-muted-foreground">Matrículas Hoje</div>
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
                  placeholder="Pesquisar por estudante ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Tipo de Documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  {tiposDocumento.map((tipo) => (
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
                  <SelectItem value="emitido">Emitido</SelectItem>
                  <SelectItem value="pendente_aprovacao">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
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
              <FileText className="h-5 w-5" />
              Documentos Emitidos ({filteredDocumentos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm">{doc.numero}</TableCell>
                    <TableCell>{doc.tipoNome}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{doc.estudante}</div>
                        <div className="text-xs text-muted-foreground">{doc.classe}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {doc.dataEmissao}
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(doc.estado)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Documento"
                          onClick={() => handleVerDocumento(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Descarregar PDF"
                          disabled={doc.estado === "pendente_aprovacao" || doc.estado === "rejeitado"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Imprimir"
                          disabled={doc.estado === "pendente_aprovacao" || doc.estado === "rejeitado"}
                        >
                          <Printer className="h-4 w-4" />
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
      <EmitirDocumentoModal
        open={emitirModalOpen}
        onOpenChange={setEmitirModalOpen}
      />
      <VerDocumentoModal
        open={verDocumentoOpen}
        onOpenChange={setVerDocumentoOpen}
        documento={selectedDocumento}
      />
    </DashboardLayout>
  );
};

export default SecretariaDocumentos;
