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
  Eye,
  Edit,
  FileText,
  Users,
  CreditCard,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import VerFichaEstudanteModal from "@/components/modals/secretaria/VerFichaEstudanteModal";
import EditarDadosAdminModal from "@/components/modals/secretaria/EditarDadosAdminModal";

// Mock data
const estudantes = [
  {
    id: "1",
    numero: "2024001",
    nome: "João Manuel Silva",
    classe: "10ª",
    turma: "A",
    turno: "Manhã",
    encarregado: "Maria Silva",
    telefoneEncarregado: "+244 923 456 789",
    estadoFinanceiro: "regular",
    estadoMatricula: "activo",
    endereco: "Rua das Flores, 123, Luanda",
    dataNascimento: "2008-05-15",
    naturalidade: "Luanda",
    nacionalidade: "Angolana",
    genero: "M",
    documentoId: "BI: 000123456LA041",
  },
  {
    id: "2",
    numero: "2024002",
    nome: "Ana Beatriz Santos",
    classe: "11ª",
    turma: "B",
    turno: "Tarde",
    encarregado: "Pedro Santos",
    telefoneEncarregado: "+244 912 345 678",
    estadoFinanceiro: "devedor",
    estadoMatricula: "activo",
    endereco: "Av. 4 de Fevereiro, 456, Luanda",
    dataNascimento: "2007-08-22",
    naturalidade: "Benguela",
    nacionalidade: "Angolana",
    genero: "F",
    documentoId: "BI: 000987654LA042",
  },
  {
    id: "3",
    numero: "2024003",
    nome: "Carlos Eduardo Mendes",
    classe: "12ª",
    turma: "A",
    turno: "Manhã",
    encarregado: "Sofia Mendes",
    telefoneEncarregado: "+244 934 567 890",
    estadoFinanceiro: "regular",
    estadoMatricula: "activo",
    endereco: "Bairro Azul, Casa 78, Luanda",
    dataNascimento: "2006-02-10",
    naturalidade: "Luanda",
    nacionalidade: "Angolana",
    genero: "M",
    documentoId: "BI: 000456789LA043",
  },
  {
    id: "4",
    numero: "2024004",
    nome: "Diana Rosa Ferreira",
    classe: "10ª",
    turma: "C",
    turno: "Manhã",
    encarregado: "António Ferreira",
    telefoneEncarregado: "+244 945 678 901",
    estadoFinanceiro: "pendente",
    estadoMatricula: "activo",
    endereco: "Rua do Comércio, 90, Viana",
    dataNascimento: "2008-11-30",
    naturalidade: "Huambo",
    nacionalidade: "Angolana",
    genero: "F",
    documentoId: "BI: 000654321LA044",
  },
  {
    id: "5",
    numero: "2024005",
    nome: "Emanuel José Costa",
    classe: "11ª",
    turma: "A",
    turno: "Tarde",
    encarregado: "Rosa Costa",
    telefoneEncarregado: "+244 956 789 012",
    estadoFinanceiro: "regular",
    estadoMatricula: "suspenso",
    endereco: "Morro Bento, Bloco 5, Apt 12",
    dataNascimento: "2007-04-18",
    naturalidade: "Luanda",
    nacionalidade: "Angolana",
    genero: "M",
    documentoId: "BI: 000789012LA045",
  },
];

const SecretariaEstudantes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classeFilter, setClasseFilter] = useState("todas");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [selectedEstudante, setSelectedEstudante] = useState<typeof estudantes[0] | null>(null);
  const [verFichaOpen, setVerFichaOpen] = useState(false);
  const [editarDadosOpen, setEditarDadosOpen] = useState(false);

  const filteredEstudantes = estudantes.filter((est) => {
    const matchesSearch =
      est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.numero.includes(searchTerm) ||
      est.encarregado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClasse = classeFilter === "todas" || est.classe === classeFilter;
    const matchesEstado = estadoFilter === "todos" || est.estadoMatricula === estadoFilter;
    return matchesSearch && matchesClasse && matchesEstado;
  });

  const getEstadoFinanceiroColor = (estado: string) => {
    switch (estado) {
      case "regular":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "devedor":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEstadoMatriculaColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "suspenso":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "transferido":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "anulado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleVerFicha = (estudante: typeof estudantes[0]) => {
    setSelectedEstudante(estudante);
    setVerFichaOpen(true);
  };

  const handleEditarDados = (estudante: typeof estudantes[0]) => {
    setSelectedEstudante(estudante);
    setEditarDadosOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/secretaria">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestão de Estudantes
            </h1>
            <p className="text-muted-foreground">
              Consulta e actualização de dados administrativos
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="py-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ⚠️ <strong>Nota:</strong> A Secretaria pode actualizar dados administrativos (contactos, endereço, responsáveis). 
              Dados académicos como notas e frequência são apenas de consulta.
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, número ou encarregado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={classeFilter} onValueChange={setClasseFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Classes</SelectItem>
                  <SelectItem value="10ª">10ª Classe</SelectItem>
                  <SelectItem value="11ª">11ª Classe</SelectItem>
                  <SelectItem value="12ª">12ª Classe</SelectItem>
                </SelectContent>
              </Select>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="transferido">Transferido</SelectItem>
                  <SelectItem value="anulado">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-foreground">{estudantes.length}</div>
              <div className="text-sm text-muted-foreground">Total Estudantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">{estudantes.filter(e => e.estadoFinanceiro === "regular").length}</div>
              <div className="text-sm text-muted-foreground">Regulares</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-red-600">{estudantes.filter(e => e.estadoFinanceiro === "devedor").length}</div>
              <div className="text-sm text-muted-foreground">Devedores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-orange-600">{estudantes.filter(e => e.estadoMatricula === "suspenso").length}</div>
              <div className="text-sm text-muted-foreground">Suspensos</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Estudantes ({filteredEstudantes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Classe/Turma</TableHead>
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Estado Fin.</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstudantes.map((estudante) => (
                  <TableRow key={estudante.id}>
                    <TableCell className="font-mono text-sm">
                      {estudante.numero}
                    </TableCell>
                    <TableCell className="font-medium">{estudante.nome}</TableCell>
                    <TableCell>
                      {estudante.classe} {estudante.turma} - {estudante.turno}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{estudante.encarregado}</div>
                        <div className="text-xs text-muted-foreground">
                          {estudante.telefoneEncarregado}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoFinanceiroColor(estudante.estadoFinanceiro)}>
                        {estudante.estadoFinanceiro}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoMatriculaColor(estudante.estadoMatricula)}>
                        {estudante.estadoMatricula}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Ficha Completa"
                          onClick={() => handleVerFicha(estudante)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar Dados Administrativos"
                          onClick={() => handleEditarDados(estudante)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Emitir Documento"
                        >
                          <FileText className="h-4 w-4" />
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
      <VerFichaEstudanteModal
        open={verFichaOpen}
        onOpenChange={setVerFichaOpen}
        estudante={selectedEstudante}
      />
      <EditarDadosAdminModal
        open={editarDadosOpen}
        onOpenChange={setEditarDadosOpen}
        estudante={selectedEstudante}
      />
    </DashboardLayout>
  );
};

export default SecretariaEstudantes;
