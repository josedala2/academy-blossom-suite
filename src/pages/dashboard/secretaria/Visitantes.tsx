import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Users,
  UserPlus,
  Phone,
  Mail,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  ArrowRight,
  Calendar,
  MessageSquare,
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
import NovoVisitanteModal from "@/components/modals/NovoVisitanteModal";
import ConverterVisitanteModal from "@/components/modals/ConverterVisitanteModal";
import { toast } from "sonner";

interface Visitante {
  id: number;
  nome: string;
  contacto: string;
  email: string;
  motivo: string;
  observacoes: string;
  dataVisita: string;
  horaVisita: string;
  atendidoPor: string;
  estado: "atendido" | "aguardando" | "convertido";
  seguimento: boolean;
}

const visitantesData: Visitante[] = [
  {
    id: 1,
    nome: "Maria José Fernandes",
    contacto: "923 456 789",
    email: "maria.jose@email.com",
    motivo: "Informações de Matrícula",
    observacoes: "Interessada em matricular o filho na 7ª classe",
    dataVisita: "2026-01-16",
    horaVisita: "09:30",
    atendidoPor: "Ana Silva",
    estado: "atendido",
    seguimento: true,
  },
  {
    id: 2,
    nome: "António Mendes",
    contacto: "912 345 678",
    email: "",
    motivo: "Consulta de Notas do Filho",
    observacoes: "Pai de João Mendes - 10ª A",
    dataVisita: "2026-01-16",
    horaVisita: "10:15",
    atendidoPor: "Carlos Neto",
    estado: "atendido",
    seguimento: false,
  },
  {
    id: 3,
    nome: "Rosa Ferreira",
    contacto: "934 567 890",
    email: "rosa.ferreira@email.com",
    motivo: "Matrícula do Filho",
    observacoes: "Convertido para pré-registo",
    dataVisita: "2026-01-15",
    horaVisita: "14:00",
    atendidoPor: "Ana Silva",
    estado: "convertido",
    seguimento: false,
  },
  {
    id: 4,
    nome: "Pedro Costa",
    contacto: "945 678 901",
    email: "pedro.c@email.com",
    motivo: "Reclamação sobre Propinas",
    observacoes: "Encaminhado para a contabilidade",
    dataVisita: "2026-01-15",
    horaVisita: "11:30",
    atendidoPor: "Maria Santos",
    estado: "atendido",
    seguimento: true,
  },
  {
    id: 5,
    nome: "Luísa Almeida",
    contacto: "956 789 012",
    email: "luisa.a@email.com",
    motivo: "Transferência de Escola",
    observacoes: "A aguardar documentos da escola anterior",
    dataVisita: "2026-01-14",
    horaVisita: "15:45",
    atendidoPor: "Carlos Neto",
    estado: "atendido",
    seguimento: true,
  },
  {
    id: 6,
    nome: "Fernando Santos",
    contacto: "967 890 123",
    email: "",
    motivo: "Informações Gerais",
    observacoes: "",
    dataVisita: "2026-01-16",
    horaVisita: "11:00",
    atendidoPor: "",
    estado: "aguardando",
    seguimento: false,
  },
];

const motivosComuns = [
  "Informações de Matrícula",
  "Consulta de Notas",
  "Matrícula do Filho",
  "Transferência de Escola",
  "Reclamação",
  "Documentos",
  "Pagamentos",
  "Reunião Agendada",
  "Outros",
];

const Visitantes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");
  const [selectedMotivo, setSelectedMotivo] = useState<string>("all");
  const [visitantes, setVisitantes] = useState<Visitante[]>(visitantesData);
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  const [selectedVisitante, setSelectedVisitante] = useState<Visitante | null>(null);

  const filteredVisitantes = visitantes.filter((v) => {
    const matchesSearch =
      v.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contacto.includes(searchTerm) ||
      v.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === "all" || v.estado === selectedEstado;
    const matchesMotivo = selectedMotivo === "all" || v.motivo === selectedMotivo;
    return matchesSearch && matchesEstado && matchesMotivo;
  });

  const stats = {
    total: visitantes.length,
    hoje: visitantes.filter((v) => v.dataVisita === "2026-01-16").length,
    aguardando: visitantes.filter((v) => v.estado === "aguardando").length,
    convertidos: visitantes.filter((v) => v.estado === "convertido").length,
    seguimento: visitantes.filter((v) => v.seguimento).length,
  };

  const handleConverterParaCandidato = (visitante: Visitante) => {
    setSelectedVisitante(visitante);
    setIsConverterModalOpen(true);
  };

  const handleMarcarAtendido = (id: number) => {
    setVisitantes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: "atendido" as const } : v))
    );
    toast.success("Visitante marcado como atendido");
  };

  const handleMarcarSeguimento = (id: number, seguimento: boolean) => {
    setVisitantes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, seguimento } : v))
    );
    toast.success(seguimento ? "Marcado para seguimento" : "Seguimento removido");
  };

  const getEstadoBadge = (estado: Visitante["estado"]) => {
    switch (estado) {
      case "aguardando":
        return (
          <Badge variant="outline" className="border-accent text-accent">
            <Clock className="h-3 w-3 mr-1" />
            Aguardando
          </Badge>
        );
      case "atendido":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            Atendido
          </Badge>
        );
      case "convertido":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <UserPlus className="h-3 w-3 mr-1" />
            Convertido
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Visitantes
            </h1>
            <p className="text-muted-foreground">
              Registo e acompanhamento de visitantes e candidatos
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setIsNovoModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registar Visitante
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
          <Card className="border-primary/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.hoje}</p>
                <p className="text-sm text-muted-foreground">Hoje</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.aguardando}</p>
                <p className="text-sm text-muted-foreground">Aguardando</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.convertidos}</p>
                <p className="text-sm text-muted-foreground">Convertidos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{stats.seguimento}</p>
                <p className="text-sm text-muted-foreground">Seguimento</p>
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
                  placeholder="Pesquisar por nome, contacto ou motivo..."
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="atendido">Atendido</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMotivo} onValueChange={setSelectedMotivo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Motivos</SelectItem>
                  {motivosComuns.map((motivo) => (
                    <SelectItem key={motivo} value={motivo}>
                      {motivo}
                    </SelectItem>
                  ))}
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Atendido Por</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitantes.map((visitante) => (
                  <TableRow key={visitante.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{visitante.nome}</p>
                          {visitante.seguimento && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Seguimento
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {visitante.contacto}
                        </div>
                        {visitante.email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {visitante.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{visitante.motivo}</p>
                        {visitante.observacoes && (
                          <p className="text-xs text-muted-foreground truncate max-w-48">
                            {visitante.observacoes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(visitante.dataVisita).toLocaleDateString("pt-AO")}
                        <span className="text-muted-foreground">•</span>
                        {visitante.horaVisita}
                      </div>
                    </TableCell>
                    <TableCell>
                      {visitante.atendidoPor || (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getEstadoBadge(visitante.estado)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Adicionar Nota
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {visitante.estado === "aguardando" && (
                            <DropdownMenuItem onClick={() => handleMarcarAtendido(visitante.id)}>
                              <Clock className="h-4 w-4 mr-2" />
                              Marcar como Atendido
                            </DropdownMenuItem>
                          )}
                          {visitante.estado !== "convertido" && (
                            <DropdownMenuItem
                              onClick={() => handleConverterParaCandidato(visitante)}
                              className="text-green-600"
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Converter em Candidato
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleMarcarSeguimento(visitante.id, !visitante.seguimento)
                            }
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {visitante.seguimento ? "Remover Seguimento" : "Marcar para Seguimento"}
                          </DropdownMenuItem>
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
        <NovoVisitanteModal open={isNovoModalOpen} onOpenChange={setIsNovoModalOpen} />
        <ConverterVisitanteModal
          open={isConverterModalOpen}
          onOpenChange={setIsConverterModalOpen}
          visitante={selectedVisitante}
        />
      </div>
    </DashboardLayout>
  );
};

export default Visitantes;
