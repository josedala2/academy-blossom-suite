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
  Search,
  Eye,
  Edit,
  Plus,
  Users,
  Mail,
  Phone,
  ArrowLeft,
  Key,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import NovoEncarregadoModal from "@/components/modals/secretaria/NovoEncarregadoModal";
import VerEncarregadoModal from "@/components/modals/secretaria/VerEncarregadoModal";
import EditarEncarregadoModal from "@/components/modals/secretaria/EditarEncarregadoModal";
import { useToast } from "@/hooks/use-toast";

// Mock data
const encarregados = [
  {
    id: "1",
    nome: "Maria da Conceição Silva",
    parentesco: "Mãe",
    telefone: "+244 923 456 789",
    telefoneAlt: "+244 912 111 222",
    email: "maria.silva@email.com",
    endereco: "Rua das Flores, 123, Luanda",
    profissao: "Professora",
    localTrabalho: "Escola Primária Ngola Kiluanje",
    documentoId: "BI: 000111222LA041",
    estudantes: [
      { id: "1", nome: "João Manuel Silva", classe: "10ª A" },
      { id: "6", nome: "Pedro Manuel Silva", classe: "8ª B" },
    ],
    temCredenciais: true,
    ultimoAcesso: "2024-01-15 09:30",
    dataCriacao: "2023-09-01",
  },
  {
    id: "2",
    nome: "Pedro António Santos",
    parentesco: "Pai",
    telefone: "+244 912 345 678",
    telefoneAlt: null,
    email: "pedro.santos@empresa.co.ao",
    endereco: "Av. 4 de Fevereiro, 456, Luanda",
    profissao: "Engenheiro",
    localTrabalho: "Sonangol EP",
    documentoId: "BI: 000333444LA042",
    estudantes: [{ id: "2", nome: "Ana Beatriz Santos", classe: "11ª B" }],
    temCredenciais: true,
    ultimoAcesso: "2024-01-10 14:15",
    dataCriacao: "2023-09-15",
  },
  {
    id: "3",
    nome: "Sofia Helena Mendes",
    parentesco: "Mãe",
    telefone: "+244 934 567 890",
    telefoneAlt: "+244 923 999 888",
    email: "sofia.mendes@gmail.com",
    endereco: "Bairro Azul, Casa 78, Luanda",
    profissao: "Médica",
    localTrabalho: "Hospital Josina Machel",
    documentoId: "BI: 000555666LA043",
    estudantes: [{ id: "3", nome: "Carlos Eduardo Mendes", classe: "12ª A" }],
    temCredenciais: false,
    ultimoAcesso: null,
    dataCriacao: "2023-10-01",
  },
  {
    id: "4",
    nome: "António José Ferreira",
    parentesco: "Pai",
    telefone: "+244 945 678 901",
    telefoneAlt: null,
    email: null,
    endereco: "Rua do Comércio, 90, Viana",
    profissao: "Comerciante",
    localTrabalho: "Mercado do Kikolo",
    documentoId: "BI: 000777888LA044",
    estudantes: [{ id: "4", nome: "Diana Rosa Ferreira", classe: "10ª C" }],
    temCredenciais: false,
    ultimoAcesso: null,
    dataCriacao: "2023-11-10",
  },
  {
    id: "5",
    nome: "Rosa Maria Costa",
    parentesco: "Mãe",
    telefone: "+244 956 789 012",
    telefoneAlt: "+244 944 555 666",
    email: "rosa.costa@email.com",
    endereco: "Morro Bento, Bloco 5, Apt 12",
    profissao: "Contabilista",
    localTrabalho: "ENSA Seguros",
    documentoId: "BI: 000999000LA045",
    estudantes: [
      { id: "5", nome: "Emanuel José Costa", classe: "11ª A" },
      { id: "7", nome: "Luísa Maria Costa", classe: "9ª B" },
    ],
    temCredenciais: true,
    ultimoAcesso: "2024-01-14 16:45",
    dataCriacao: "2023-08-20",
  },
];

const SecretariaEncarregados = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [novoEncarregadoOpen, setNovoEncarregadoOpen] = useState(false);
  const [selectedEncarregado, setSelectedEncarregado] = useState<typeof encarregados[0] | null>(null);
  const [verEncarregadoOpen, setVerEncarregadoOpen] = useState(false);
  const [editarEncarregadoOpen, setEditarEncarregadoOpen] = useState(false);

  const filteredEncarregados = encarregados.filter((enc) =>
    enc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enc.telefone.includes(searchTerm) ||
    enc.estudantes.some((est) =>
      est.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleVerEncarregado = (encarregado: typeof encarregados[0]) => {
    setSelectedEncarregado(encarregado);
    setVerEncarregadoOpen(true);
  };

  const handleEditarEncarregado = (encarregado: typeof encarregados[0]) => {
    setSelectedEncarregado(encarregado);
    setEditarEncarregadoOpen(true);
  };

  const handleReemitirCredenciais = (encarregado: typeof encarregados[0]) => {
    toast({
      title: "Credenciais enviadas",
      description: `Novas credenciais foram enviadas para ${encarregado.email || encarregado.telefone}`,
    });
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
                Gestão de Encarregados de Educação
              </h1>
              <p className="text-muted-foreground">
                Criar, editar e gerir perfis de encarregados
              </p>
            </div>
          </div>
          <Button onClick={() => setNovoEncarregadoOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Encarregado
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-foreground">
                {encarregados.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Encarregados
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">
                {encarregados.filter((e) => e.temCredenciais).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Com Credenciais
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-orange-600">
                {encarregados.filter((e) => !e.temCredenciais).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Sem Credenciais
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-blue-600">
                {encarregados.reduce((acc, e) => acc + e.estudantes.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Estudantes Associados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, telefone ou nome do estudante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Encarregados ({filteredEncarregados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contactos</TableHead>
                  <TableHead>Estudantes</TableHead>
                  <TableHead>Credenciais</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEncarregados.map((encarregado) => (
                  <TableRow key={encarregado.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{encarregado.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          {encarregado.parentesco} • {encarregado.profissao}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {encarregado.telefone}
                        </div>
                        {encarregado.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {encarregado.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {encarregado.estudantes.map((est) => (
                          <Badge key={est.id} variant="secondary" className="text-xs">
                            {est.nome.split(" ")[0]} ({est.classe})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {encarregado.temCredenciais ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="outline">Sem acesso</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Perfil"
                          onClick={() => handleVerEncarregado(encarregado)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() => handleEditarEncarregado(encarregado)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reemitir Credenciais"
                          onClick={() => handleReemitirCredenciais(encarregado)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Enviar Mensagem"
                        >
                          <MessageSquare className="h-4 w-4" />
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
      <NovoEncarregadoModal
        open={novoEncarregadoOpen}
        onOpenChange={setNovoEncarregadoOpen}
      />
      <VerEncarregadoModal
        open={verEncarregadoOpen}
        onOpenChange={setVerEncarregadoOpen}
        encarregado={selectedEncarregado}
      />
      <EditarEncarregadoModal
        open={editarEncarregadoOpen}
        onOpenChange={setEditarEncarregadoOpen}
        encarregado={selectedEncarregado}
      />
    </DashboardLayout>
  );
};

export default SecretariaEncarregados;
