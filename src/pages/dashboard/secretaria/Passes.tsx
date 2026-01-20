import { useState, useRef, useCallback, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  ArrowLeft,
  CreditCard,
  Printer,
  User,
  GraduationCap,
  Users,
  Briefcase,
  Download,
  Eye,
  QrCode,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileBarChart,
  Video,
  VideoOff,
  RotateCcw,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Tipos
type TipoPasse = "estudante" | "professor" | "funcionario";
type EstadoPasse = "activo" | "expirado" | "suspenso" | "pendente";

interface Pessoa {
  id: string;
  nome: string;
  foto: string | null;
  tipo: TipoPasse;
  identificador: string; // número de estudante, BI do professor, etc.
  classe?: string; // apenas para estudantes
  cargo?: string; // apenas para professores/funcionários
  departamento?: string;
  dataAdmissao: string;
  passeActivo: boolean;
  passeNumero: string | null;
  passeDataEmissao: string | null;
  passeDataValidade: string | null;
  passeEstado: EstadoPasse;
}

// Mock data
const pessoasMock: Pessoa[] = [
  {
    id: "EST001",
    nome: "João Manuel Silva",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0001",
    classe: "10ª A",
    dataAdmissao: "2024-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0001",
    passeDataEmissao: "2024-02-15",
    passeDataValidade: "2025-07-31",
    passeEstado: "activo",
  },
  {
    id: "EST002",
    nome: "Ana Beatriz Santos",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0002",
    classe: "11ª B",
    dataAdmissao: "2023-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0002",
    passeDataEmissao: "2024-02-15",
    passeDataValidade: "2025-07-31",
    passeEstado: "activo",
  },
  {
    id: "EST003",
    nome: "Carlos Eduardo Mendes",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0003",
    classe: "12ª A",
    dataAdmissao: "2022-02-01",
    passeActivo: false,
    passeNumero: null,
    passeDataEmissao: null,
    passeDataValidade: null,
    passeEstado: "pendente",
  },
  {
    id: "PROF001",
    nome: "Maria Fernandes de Sousa",
    foto: null,
    tipo: "professor",
    identificador: "000123456LA789",
    cargo: "Professora de Matemática",
    departamento: "Ciências Exactas",
    dataAdmissao: "2020-03-01",
    passeActivo: true,
    passeNumero: "PASS-PROF-2024-0001",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2025-12-31",
    passeEstado: "activo",
  },
  {
    id: "PROF002",
    nome: "António José Cardoso",
    foto: null,
    tipo: "professor",
    identificador: "000456789LA123",
    cargo: "Professor de Português",
    departamento: "Línguas",
    dataAdmissao: "2019-09-01",
    passeActivo: true,
    passeNumero: "PASS-PROF-2024-0002",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2024-12-31",
    passeEstado: "expirado",
  },
  {
    id: "FUNC001",
    nome: "Rosa Helena Ferreira",
    foto: null,
    tipo: "funcionario",
    identificador: "000789123LA456",
    cargo: "Secretária Administrativa",
    departamento: "Secretaria",
    dataAdmissao: "2018-01-15",
    passeActivo: true,
    passeNumero: "PASS-FUNC-2024-0001",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2025-12-31",
    passeEstado: "activo",
  },
  {
    id: "FUNC002",
    nome: "Pedro Nunes Costa",
    foto: null,
    tipo: "funcionario",
    identificador: "000321654LA987",
    cargo: "Vigilante",
    departamento: "Segurança",
    dataAdmissao: "2021-06-01",
    passeActivo: false,
    passeNumero: null,
    passeDataEmissao: null,
    passeDataValidade: null,
    passeEstado: "pendente",
  },
  {
    id: "EST004",
    nome: "Diana Rosa Almeida",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0004",
    classe: "9ª C",
    dataAdmissao: "2024-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0004",
    passeDataEmissao: "2024-02-20",
    passeDataValidade: "2025-07-31",
    passeEstado: "suspenso",
  },
];

const SecretariaPasses = () => {
  const [activeTab, setActiveTab] = useState<TipoPasse | "todos">("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [selectedPessoas, setSelectedPessoas] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const [emitirModalOpen, setEmitirModalOpen] = useState(false);
  
  // Webcam states
  const [webcamModalOpen, setWebcamModalOpen] = useState(false);
  const [webcamPessoa, setWebcamPessoa] = useState<Pessoa | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>(pessoasMock);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Webcam functions
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Erro ao aceder à webcam:", error);
      toast.error("Não foi possível aceder à webcam", {
        description: "Verifique se a câmara está conectada e as permissões estão concedidas.",
      });
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const photoData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(photoData);
        
        // Stop the webcam after capture
        stopWebcam();
      }
    }
  }, [stopWebcam]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startWebcam();
  }, [startWebcam]);

  const savePhoto = useCallback(() => {
    if (capturedPhoto && webcamPessoa) {
      // Update the person's photo in state
      setPessoas((prev) =>
        prev.map((p) =>
          p.id === webcamPessoa.id ? { ...p, foto: capturedPhoto } : p
        )
      );
      
      toast.success("Foto guardada com sucesso!", {
        description: `A foto de ${webcamPessoa.nome} foi actualizada.`,
      });
      
      closeWebcamModal();
    }
  }, [capturedPhoto, webcamPessoa]);

  const openWebcamModal = useCallback((pessoa: Pessoa) => {
    setWebcamPessoa(pessoa);
    setCapturedPhoto(null);
    setWebcamModalOpen(true);
  }, []);

  const closeWebcamModal = useCallback(() => {
    stopWebcam();
    setCapturedPhoto(null);
    setWebcamPessoa(null);
    setWebcamModalOpen(false);
  }, [stopWebcam]);

  // Auto-start webcam when modal opens
  useEffect(() => {
    if (webcamModalOpen && !capturedPhoto) {
      startWebcam();
    }
    
    return () => {
      if (!webcamModalOpen) {
        stopWebcam();
      }
    };
  }, [webcamModalOpen, capturedPhoto, startWebcam, stopWebcam]);

  const filteredPessoas = pessoas.filter((p) => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.identificador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = activeTab === "todos" || p.tipo === activeTab;
    const matchesEstado = estadoFilter === "todos" || p.passeEstado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getEstadoBadge = (estado: EstadoPasse) => {
    const config = {
      activo: { icon: CheckCircle2, label: "Activo", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      expirado: { icon: AlertCircle, label: "Expirado", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      suspenso: { icon: AlertCircle, label: "Suspenso", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      pendente: { icon: RefreshCw, label: "Pendente", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    };
    const { icon: Icon, label, className } = config[estado];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: TipoPasse) => {
    const icons = {
      estudante: GraduationCap,
      professor: Users,
      funcionario: Briefcase,
    };
    return icons[tipo];
  };

  const getTipoBadge = (tipo: TipoPasse) => {
    const config = {
      estudante: { label: "Estudante", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      professor: { label: "Professor", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
      funcionario: { label: "Funcionário", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
    };
    const { label, className } = config[tipo];
    const Icon = getTipoIcon(tipo);
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPessoas(filteredPessoas.map(p => p.id));
    } else {
      setSelectedPessoas([]);
    }
  };

  const handleSelectPessoa = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPessoas([...selectedPessoas, id]);
    } else {
      setSelectedPessoas(selectedPessoas.filter(p => p !== id));
    }
  };

  const handlePreview = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setPreviewOpen(true);
  };

  const handleImprimirPasse = (pessoa: Pessoa) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98], // Tamanho de cartão de crédito
    });

    // Background
    doc.setFillColor(25, 65, 120);
    doc.rect(0, 0, 85.6, 53.98, "F");

    // Header strip
    doc.setFillColor(200, 160, 50);
    doc.rect(0, 0, 85.6, 12, "F");

    // School name
    doc.setTextColor(25, 65, 120);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("SGE - SISTEMA DE GESTÃO ESCOLAR", 42.8, 5, { align: "center" });
    doc.setFontSize(6);
    doc.text("PASSE DE IDENTIFICAÇÃO", 42.8, 9, { align: "center" });

    // Photo placeholder
    doc.setFillColor(200, 200, 200);
    doc.rect(5, 16, 22, 28, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(6);
    doc.text("FOTO", 16, 31, { align: "center" });

    // Person info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(pessoa.nome.toUpperCase(), 30, 20);

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    
    const tipoLabels = { estudante: "ESTUDANTE", professor: "PROFESSOR(A)", funcionario: "FUNCIONÁRIO(A)" };
    doc.text(tipoLabels[pessoa.tipo], 30, 25);
    
    if (pessoa.classe) {
      doc.text(`Turma: ${pessoa.classe}`, 30, 30);
    }
    if (pessoa.cargo) {
      doc.text(pessoa.cargo, 30, 30);
    }
    if (pessoa.departamento) {
      doc.text(pessoa.departamento, 30, 35);
    }

    doc.text(`Nº: ${pessoa.identificador}`, 30, 40);

    // Pass number and validity
    doc.setFontSize(5);
    doc.text(`Passe: ${pessoa.passeNumero || "---"}`, 5, 48);
    doc.text(`Válido até: ${pessoa.passeDataValidade ? new Date(pessoa.passeDataValidade).toLocaleDateString("pt-AO") : "---"}`, 5, 51);

    // QR Code placeholder
    doc.setFillColor(255, 255, 255);
    doc.rect(70, 38, 12, 12, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(4);
    doc.text("QR", 76, 45, { align: "center" });

    doc.save(`passe_${pessoa.id}_${pessoa.nome.replace(/\s+/g, "_")}.pdf`);
    toast.success("Passe gerado com sucesso!", {
      description: `PDF do passe de ${pessoa.nome} foi descarregado.`,
    });
  };

  const handleImprimirSelecionados = () => {
    if (selectedPessoas.length === 0) {
      toast.error("Seleccione pelo menos uma pessoa");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("SGE - Sistema de Gestão Escolar", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Relatório de Passes a Imprimir", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-AO")}`, 105, 28, { align: "center" });

    const pessoasSelecionadas = pessoas.filter(p => selectedPessoas.includes(p.id));
    
    autoTable(doc, {
      head: [["Nome", "Tipo", "Identificador", "Estado", "Validade"]],
      body: pessoasSelecionadas.map(p => [
        p.nome,
        p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1),
        p.identificador,
        p.passeEstado,
        p.passeDataValidade || "Pendente",
      ]),
      startY: 35,
      theme: "striped",
      headStyles: { fillColor: [25, 65, 120] },
    });

    doc.save(`passes_lote_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success(`${selectedPessoas.length} passes preparados para impressão`);
  };

  const handleEmitirNovoPasse = () => {
    setEmitirModalOpen(true);
  };

  const handleConfirmarEmissao = () => {
    if (selectedPessoas.length === 0) {
      toast.error("Seleccione pelo menos uma pessoa");
      return;
    }
    
    toast.success(`${selectedPessoas.length} passes emitidos com sucesso`);
    setEmitirModalOpen(false);
    setSelectedPessoas([]);
  };

  // Estatísticas
  const stats = {
    totalEstudantes: pessoas.filter(p => p.tipo === "estudante").length,
    totalProfessores: pessoas.filter(p => p.tipo === "professor").length,
    totalFuncionarios: pessoas.filter(p => p.tipo === "funcionario").length,
    activos: pessoas.filter(p => p.passeEstado === "activo").length,
    expirados: pessoas.filter(p => p.passeEstado === "expirado").length,
    pendentes: pessoas.filter(p => p.passeEstado === "pendente").length,
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
                Impressão de Passes
              </h1>
              <p className="text-muted-foreground">
                Gerir e imprimir passes de identificação
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImprimirSelecionados} disabled={selectedPessoas.length === 0}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Selecionados ({selectedPessoas.length})
            </Button>
            <Button onClick={handleEmitirNovoPasse}>
              <CreditCard className="h-4 w-4 mr-2" />
              Emitir Passes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalEstudantes}</div>
                  <div className="text-xs text-muted-foreground">Estudantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalProfessores}</div>
                  <div className="text-xs text-muted-foreground">Professores</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalFuncionarios}</div>
                  <div className="text-xs text-muted-foreground">Funcionários</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
                  <div className="text-xs text-muted-foreground">Activos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.expirados}</div>
                  <div className="text-xs text-muted-foreground">Expirados</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-600">{stats.pendentes}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TipoPasse | "todos")}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="estudante">
                <GraduationCap className="h-4 w-4 mr-1" />
                Estudantes
              </TabsTrigger>
              <TabsTrigger value="professor">
                <Users className="h-4 w-4 mr-1" />
                Professores
              </TabsTrigger>
              <TabsTrigger value="funcionario">
                <Briefcase className="h-4 w-4 mr-1" />
                Funcionários
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Passes ({filteredPessoas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPessoas.length === filteredPessoas.length && filteredPessoas.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Identificador</TableHead>
                      <TableHead>Detalhe</TableHead>
                      <TableHead>Nº Passe</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead className="text-right">Acções</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPessoas.map((pessoa) => (
                      <TableRow key={pessoa.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPessoas.includes(pessoa.id)}
                            onCheckedChange={(checked) => handleSelectPessoa(pessoa.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {pessoa.foto ? (
                              <img
                                src={pessoa.foto}
                                alt={pessoa.nome}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">{pessoa.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTipoBadge(pessoa.tipo)}</TableCell>
                        <TableCell className="font-mono text-sm">{pessoa.identificador}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pessoa.classe || pessoa.cargo || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {pessoa.passeNumero || <span className="text-muted-foreground">---</span>}
                        </TableCell>
                        <TableCell>{getEstadoBadge(pessoa.passeEstado)}</TableCell>
                        <TableCell>
                          {pessoa.passeDataValidade ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {new Date(pessoa.passeDataValidade).toLocaleDateString("pt-AO")}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">---</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Capturar Foto"
                              onClick={() => openWebcamModal(pessoa)}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Pré-visualizar"
                              onClick={() => handlePreview(pessoa)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Imprimir Passe"
                              onClick={() => handleImprimirPasse(pessoa)}
                              disabled={pessoa.passeEstado === "pendente"}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md">
          {selectedPessoa && (
            <>
              <DialogHeader>
                <DialogTitle>Pré-visualização do Passe</DialogTitle>
                <DialogDescription>
                  Passe de identificação de {selectedPessoa.nome}
                </DialogDescription>
              </DialogHeader>

              {/* Card Preview */}
              <div className="relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-lg">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                
                {/* Header strip */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-accent flex flex-col items-center justify-center">
                  <span className="text-primary font-bold text-sm">SGE - SISTEMA DE GESTÃO ESCOLAR</span>
                  <span className="text-primary text-xs">PASSE DE IDENTIFICAÇÃO</span>
                </div>

                {/* Content */}
                <div className="absolute top-14 left-0 right-0 bottom-0 p-4 flex gap-4">
                  {/* Photo */}
                  {selectedPessoa.foto ? (
                    <img
                      src={selectedPessoa.foto}
                      alt={selectedPessoa.nome}
                      className="w-20 h-24 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-24 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 text-white space-y-1">
                    <h3 className="font-bold text-sm uppercase">{selectedPessoa.nome}</h3>
                    <p className="text-xs opacity-80">
                      {selectedPessoa.tipo === "estudante" ? "ESTUDANTE" : 
                       selectedPessoa.tipo === "professor" ? "PROFESSOR(A)" : "FUNCIONÁRIO(A)"}
                    </p>
                    {selectedPessoa.classe && (
                      <p className="text-xs">Turma: {selectedPessoa.classe}</p>
                    )}
                    {selectedPessoa.cargo && (
                      <p className="text-xs">{selectedPessoa.cargo}</p>
                    )}
                    <p className="text-xs opacity-80">Nº: {selectedPessoa.identificador}</p>
                  </div>

                  {/* QR Code */}
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-gray-800" />
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-20 p-2 text-white text-[10px] opacity-70">
                  <p>Passe: {selectedPessoa.passeNumero || "---"}</p>
                  <p>Válido até: {selectedPessoa.passeDataValidade ? new Date(selectedPessoa.passeDataValidade).toLocaleDateString("pt-AO") : "---"}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  handleImprimirPasse(selectedPessoa);
                  setPreviewOpen(false);
                }}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Emitir Modal */}
      <Dialog open={emitirModalOpen} onOpenChange={setEmitirModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emitir Novos Passes</DialogTitle>
            <DialogDescription>
              Confirme a emissão de passes para as pessoas seleccionadas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Serão emitidos passes para {selectedPessoas.length} pessoa(s).
            </p>

            {selectedPessoas.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {pessoas.filter(p => selectedPessoas.includes(p.id)).map(p => (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    {getTipoBadge(p.tipo)}
                    <span className="text-sm">{p.nome}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Emissão</label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Válido Até</label>
                <Input type="date" defaultValue="2025-12-31" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmitirModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarEmissao}>
              <CreditCard className="h-4 w-4 mr-2" />
              Confirmar Emissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webcam Capture Modal */}
      <Dialog open={webcamModalOpen} onOpenChange={(open) => !open && closeWebcamModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capturar Foto
            </DialogTitle>
            <DialogDescription>
              {webcamPessoa && `Capturando foto para ${webcamPessoa.nome}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video/Photo Preview Area */}
            <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Foto capturada"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isStreaming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                      <VideoOff className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">A iniciar câmara...</p>
                    </div>
                  )}
                </>
              )}
              
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              {capturedPhoto ? (
                <p>Foto capturada. Clique em "Guardar" para confirmar ou "Repetir" para tirar outra.</p>
              ) : (
                <p>Posicione a pessoa no centro do enquadramento e clique em "Capturar".</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {capturedPhoto ? (
                <>
                  <Button variant="outline" onClick={retakePhoto}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Repetir
                  </Button>
                  <Button onClick={savePhoto}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Guardar Foto
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={closeWebcamModal}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={capturePhoto} disabled={!isStreaming}>
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar
                  </Button>
                </>
              )}
            </div>

            {/* Current person info */}
            {webcamPessoa && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {webcamPessoa.foto ? (
                  <img
                    src={webcamPessoa.foto}
                    alt="Foto actual"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{webcamPessoa.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {webcamPessoa.tipo === "estudante" ? `Estudante - ${webcamPessoa.classe}` :
                     webcamPessoa.cargo}
                  </p>
                </div>
                {webcamPessoa.foto && (
                  <Badge variant="outline" className="ml-auto">
                    Foto existente
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SecretariaPasses;
