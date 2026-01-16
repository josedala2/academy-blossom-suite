import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  FileText,
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  ArrowLeft,
  Settings,
  Lock,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import NovoTemplateModal from "@/components/modals/secretaria/NovoTemplateModal";
import EditarTemplateModal from "@/components/modals/secretaria/EditarTemplateModal";
import { useToast } from "@/hooks/use-toast";

// Mock data
const templates = [
  {
    id: "1",
    codigo: "DM",
    nome: "Declaração de Matrícula",
    descricao: "Documento oficial que confirma a matrícula do estudante",
    ultimaEdicao: "2024-01-10",
    editadoPor: "Admin",
    activo: true,
    requerAprovacao: false,
    numeracaoActual: 2,
    campos: ["nome_estudante", "classe", "turma", "ano_lectivo", "data_matricula"],
  },
  {
    id: "2",
    codigo: "DF",
    nome: "Declaração de Frequência",
    descricao: "Confirma que o estudante frequenta regularmente a instituição",
    ultimaEdicao: "2024-01-08",
    editadoPor: "Admin",
    activo: true,
    requerAprovacao: false,
    numeracaoActual: 15,
    campos: ["nome_estudante", "classe", "turma", "periodo", "assiduidade"],
  },
  {
    id: "3",
    codigo: "DS",
    nome: "Declaração Simples",
    descricao: "Declaração genérica para diversos fins administrativos",
    ultimaEdicao: "2024-01-05",
    editadoPor: "Maria Fernandes",
    activo: true,
    requerAprovacao: true,
    numeracaoActual: 8,
    campos: ["nome_estudante", "classe", "finalidade", "texto_livre"],
  },
  {
    id: "4",
    codigo: "AT",
    nome: "Atestado Administrativo",
    descricao: "Atestado para situações administrativas especiais",
    ultimaEdicao: "2024-01-03",
    editadoPor: "Admin",
    activo: true,
    requerAprovacao: true,
    numeracaoActual: 3,
    campos: ["nome_estudante", "classe", "tipo_atestado", "motivo", "validade"],
  },
  {
    id: "5",
    codigo: "CT",
    nome: "Certificado de Transferência",
    descricao: "Documento para transferência de estudantes",
    ultimaEdicao: "2023-12-20",
    editadoPor: "Admin",
    activo: false,
    requerAprovacao: true,
    numeracaoActual: 0,
    campos: ["nome_estudante", "classe_origem", "escola_destino", "motivo"],
  },
];

const SecretariaTemplates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [novoTemplateOpen, setNovoTemplateOpen] = useState(false);
  const [editarTemplateOpen, setEditarTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const filteredTemplates = templates.filter(
    (t) =>
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditarTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setEditarTemplateOpen(true);
  };

  const handleDuplicar = (template: typeof templates[0]) => {
    toast({
      title: "Template duplicado",
      description: `"${template.nome}" foi duplicado com sucesso.`,
    });
  };

  const handleToggleActivo = (template: typeof templates[0]) => {
    toast({
      title: template.activo ? "Template desactivado" : "Template activado",
      description: `"${template.nome}" foi ${template.activo ? "desactivado" : "activado"}.`,
    });
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
                Gestão de Templates
              </h1>
              <p className="text-muted-foreground">
                Criar e editar modelos de documentos
              </p>
            </div>
          </div>
          <Button onClick={() => setNovoTemplateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-foreground">
                {templates.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Templates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">
                {templates.filter((t) => t.activo).length}
              </div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-orange-600">
                {templates.filter((t) => t.requerAprovacao).length}
              </div>
              <div className="text-sm text-muted-foreground">Requerem Aprovação</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-blue-600">
                {templates.reduce((acc, t) => acc + t.numeracaoActual, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Docs Emitidos</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`relative ${!template.activo ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2 font-mono">
                      {template.codigo}
                    </Badge>
                    <CardTitle className="text-base">{template.nome}</CardTitle>
                  </div>
                  <Switch
                    checked={template.activo}
                    onCheckedChange={() => handleToggleActivo(template)}
                  />
                </div>
                <CardDescription className="text-sm">
                  {template.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  {template.activo ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                  {template.requerAprovacao && (
                    <Badge variant="outline" className="text-orange-600">
                      <Lock className="h-3 w-3 mr-1" />
                      Requer Aprovação
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-semibold">{template.numeracaoActual}</div>
                    <div className="text-xs text-muted-foreground">Emitidos</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-semibold">{template.campos.length}</div>
                    <div className="text-xs text-muted-foreground">Campos</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Última edição: {template.ultimaEdicao} por {template.editadoPor}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditarTemplate(template)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Duplicar"
                    onClick={() => handleDuplicar(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Pré-visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Numeração Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações de Numeração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              A numeração dos documentos segue o formato: <code className="bg-muted px-1 rounded">[CÓDIGO]-[ANO]-[NÚMERO]</code>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Próximo Número</TableHead>
                  <TableHead>Exemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.filter(t => t.activo).map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-mono">{template.codigo}</TableCell>
                    <TableCell>{template.nome}</TableCell>
                    <TableCell>{String(template.numeracaoActual + 1).padStart(4, "0")}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {template.codigo}-2024-{String(template.numeracaoActual + 1).padStart(4, "0")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NovoTemplateModal
        open={novoTemplateOpen}
        onOpenChange={setNovoTemplateOpen}
      />
      <EditarTemplateModal
        open={editarTemplateOpen}
        onOpenChange={setEditarTemplateOpen}
        template={selectedTemplate}
      />
    </DashboardLayout>
  );
};

export default SecretariaTemplates;
