import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  FileText,
  Filter,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NovoPreRegistoModal from "@/components/modals/NovoPreRegistoModal";
import VerPreRegistoModal from "@/components/modals/VerPreRegistoModal";
import { toast } from "sonner";

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

const preRegistosData: PreRegisto[] = [
  {
    id: 1,
    numero: "PR-2026-0001",
    nome: "Ana Beatriz Fernandes",
    idade: 14,
    dataNascimento: "2012-03-15",
    classePretendida: "9ª Classe",
    nomeEncarregado: "Maria Fernandes",
    telefoneEncarregado: "923 456 789",
    emailEncarregado: "maria.f@email.com",
    estado: "pre-registo",
    dataRegisto: "2026-01-16",
    documentos: 2,
    observacoes: "",
  },
  {
    id: 2,
    numero: "PR-2026-0002",
    nome: "Carlos Manuel Silva",
    idade: 12,
    dataNascimento: "2014-07-22",
    classePretendida: "7ª Classe",
    nomeEncarregado: "José Silva",
    telefoneEncarregado: "912 345 678",
    emailEncarregado: "jose.silva@email.com",
    estado: "em-analise",
    dataRegisto: "2026-01-15",
    documentos: 4,
    observacoes: "A aguardar confirmação de vagas",
  },
  {
    id: 3,
    numero: "PR-2026-0003",
    nome: "Diana Costa Oliveira",
    idade: 16,
    dataNascimento: "2010-01-08",
    classePretendida: "11ª Classe",
    nomeEncarregado: "Rosa Costa",
    telefoneEncarregado: "934 567 890",
    emailEncarregado: "rosa.costa@email.com",
    estado: "aprovado",
    dataRegisto: "2026-01-14",
    documentos: 5,
    observacoes: "Transferência de outra escola",
  },
  {
    id: 4,
    numero: "PR-2026-0004",
    nome: "Eduardo Santos Neto",
    idade: 15,
    dataNascimento: "2011-05-30",
    classePretendida: "10ª Classe",
    nomeEncarregado: "António Santos",
    telefoneEncarregado: "945 678 901",
    emailEncarregado: "",
    estado: "rejeitado",
    dataRegisto: "2026-01-13",
    documentos: 1,
    observacoes: "Documentos incompletos - não respondeu ao contacto",
  },
  {
    id: 5,
    numero: "PR-2026-0005",
    nome: "Francisca Almeida",
    idade: 13,
    dataNascimento: "2013-09-12",
    classePretendida: "8ª Classe",
    nomeEncarregado: "Luísa Almeida",
    telefoneEncarregado: "956 789 012",
    emailEncarregado: "luisa.almeida@email.com",
    estado: "pre-registo",
    dataRegisto: "2026-01-16",
    documentos: 3,
    observacoes: "",
  },
];

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

const PreRegistos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const [preRegistos, setPreRegistos] = useState<PreRegisto[]>(preRegistosData);
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isVerModalOpen, setIsVerModalOpen] = useState(false);
  const [selectedPreRegisto, setSelectedPreRegisto] = useState<PreRegisto | null>(null);

  const filteredPreRegistos = preRegistos.filter((pr) => {
    const matchesSearch =
      pr.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.nomeEncarregado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === "all" || pr.estado === selectedEstado;
    const matchesClasse = selectedClasse === "all" || pr.classePretendida.includes(selectedClasse);
    return matchesSearch && matchesEstado && matchesClasse;
  });

  const stats = {
    total: preRegistos.length,
    preRegisto: preRegistos.filter((p) => p.estado === "pre-registo").length,
    emAnalise: preRegistos.filter((p) => p.estado === "em-analise").length,
    aprovado: preRegistos.filter((p) => p.estado === "aprovado").length,
    rejeitado: preRegistos.filter((p) => p.estado === "rejeitado").length,
  };

  const handleVerPerfil = (preRegisto: PreRegisto) => {
    setSelectedPreRegisto(preRegisto);
    setIsVerModalOpen(true);
  };

  const handleAtualizarEstado = (id: number, novoEstado: PreRegisto["estado"]) => {
    setPreRegistos((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, estado: novoEstado } : pr))
    );
    const estadoLabel = {
      "pre-registo": "Pré-registo",
      "em-analise": "Em análise",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
    };
    toast.success(`Estado actualizado para "${estadoLabel[novoEstado]}"`);
  };

  const handleEncaminhar = (preRegisto: PreRegisto) => {
    handleAtualizarEstado(preRegisto.id, "em-analise");
    toast.success("Pré-registo encaminhado para análise da Direcção");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Pré-Registos
            </h1>
            <p className="text-muted-foreground">
              Registo e acompanhamento de pedidos de matrícula
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setIsNovoModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pré-Registo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.preRegisto}</p>
                <p className="text-sm text-muted-foreground">Pré-registo</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.emAnalise}</p>
                <p className="text-sm text-muted-foreground">Em Análise</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.aprovado}</p>
                <p className="text-sm text-muted-foreground">Aprovados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{stats.rejeitado}</p>
                <p className="text-sm text-muted-foreground">Rejeitados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, número ou encarregado..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="pre-registo">Pré-registo</SelectItem>
                  <SelectItem value="em-analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Classes</SelectItem>
                  <SelectItem value="7ª">7ª Classe</SelectItem>
                  <SelectItem value="8ª">8ª Classe</SelectItem>
                  <SelectItem value="9ª">9ª Classe</SelectItem>
                  <SelectItem value="10ª">10ª Classe</SelectItem>
                  <SelectItem value="11ª">11ª Classe</SelectItem>
                  <SelectItem value="12ª">12ª Classe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Registo</TableHead>
                  <TableHead>Nome do Estudante</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Classe Pretendida</TableHead>
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Docs</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPreRegistos.map((preRegisto) => (
                  <TableRow key={preRegisto.id}>
                    <TableCell className="font-mono text-sm">{preRegisto.numero}</TableCell>
                    <TableCell className="font-medium">{preRegisto.nome}</TableCell>
                    <TableCell>{preRegisto.idade} anos</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{preRegisto.classePretendida}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{preRegisto.nomeEncarregado}</p>
                        <p className="text-xs text-muted-foreground">{preRegisto.telefoneEncarregado}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        {preRegisto.documentos}
                      </Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(preRegisto.estado)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(preRegisto.dataRegisto).toLocaleDateString("pt-AO")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerPerfil(preRegisto)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Documentos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {preRegisto.estado === "pre-registo" && (
                            <DropdownMenuItem onClick={() => handleEncaminhar(preRegisto)}>
                              <Send className="h-4 w-4 mr-2" />
                              Encaminhar para Análise
                            </DropdownMenuItem>
                          )}
                          {preRegisto.estado === "em-analise" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleAtualizarEstado(preRegisto.id, "aprovado")}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAtualizarEstado(preRegisto.id, "rejeitado")}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modals */}
        <NovoPreRegistoModal open={isNovoModalOpen} onOpenChange={setIsNovoModalOpen} />
        <VerPreRegistoModal
          open={isVerModalOpen}
          onOpenChange={setIsVerModalOpen}
          preRegisto={selectedPreRegisto}
        />
      </div>
    </DashboardLayout>
  );
};

export default PreRegistos;
