import { useState, useRef } from "react";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  Link2,
  ExternalLink,
  Play,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  File,
  Image,
  FileVideo,
  FileAudio,
  Download,
  X,
  Paperclip,
  FolderOpen,
  BarChart3,
  Eye,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { useELearningTracking } from "@/contexts/ELearningTrackingContext";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface Material {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image" | "video" | "audio" | "other";
  size: string;
  uploadedAt: string;
  classId?: string;
}

interface OnlineClass {
  id: string;
  title: string;
  subject: string;
  class: string;
  platform: "google-meet" | "zoom" | "teams" | "custom";
  date: string;
  time: string;
  duration: number;
  link: string;
  description: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  recordingEnabled: boolean;
  studentsNotified: boolean;
  materials: Material[];
}

interface ELearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const platforms = [
  { id: "google-meet", name: "Google Meet", icon: "🎥", color: "bg-green-500" },
  { id: "zoom", name: "Zoom", icon: "📹", color: "bg-blue-500" },
  { id: "teams", name: "Microsoft Teams", icon: "💼", color: "bg-purple-500" },
  { id: "custom", name: "Link Personalizado", icon: "🔗", color: "bg-gray-500" },
];

const getFileIcon = (type: Material["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "doc":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "image":
      return <Image className="h-5 w-5 text-green-500" />;
    case "video":
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    case "audio":
      return <FileAudio className="h-5 w-5 text-orange-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const getFileType = (fileName: string): Material["type"] => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "txt", "odt"].includes(ext || "")) return "doc";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) return "image";
  if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext || "")) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext || "")) return "audio";
  return "other";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const ELearningModal = ({ isOpen, onClose, teacher }: ELearningModalProps) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { getClassStats, getStudentAccessHistory } = useELearningTracking();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const materialFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("classes");
  const [selectedClassForMaterials, setSelectedClassForMaterials] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedClassForStats, setSelectedClassForStats] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    class: "",
    platform: "google-meet" as OnlineClass["platform"],
    date: "",
    time: "",
    duration: 60,
    link: "",
    description: "",
    recordingEnabled: false,
    notifyStudents: true,
  });

  // Materials for the class being created
  const [pendingMaterials, setPendingMaterials] = useState<Material[]>([]);

  // Mock online classes for this teacher
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([
    {
      id: "1",
      title: "Introdução às Equações de 2º Grau",
      subject: "Matemática",
      class: "10ª A",
      platform: "google-meet",
      date: "2026-01-20",
      time: "10:00",
      duration: 60,
      link: "https://meet.google.com/abc-defg-hij",
      description: "Aula sobre resolução de equações quadráticas",
      status: "scheduled",
      recordingEnabled: true,
      studentsNotified: true,
      materials: [
        { id: "m1", name: "Exercícios_Equações.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2026-01-18" },
        { id: "m2", name: "Fórmulas_Resolvente.pdf", type: "pdf", size: "850 KB", uploadedAt: "2026-01-18" },
      ],
    },
    {
      id: "2",
      title: "Leis de Newton - Revisão",
      subject: "Física",
      class: "11ª B",
      platform: "zoom",
      date: "2026-01-21",
      time: "14:00",
      duration: 90,
      link: "https://zoom.us/j/1234567890",
      description: "Revisão das três leis de Newton para o exame",
      status: "scheduled",
      recordingEnabled: false,
      studentsNotified: true,
      materials: [
        { id: "m3", name: "Resumo_Leis_Newton.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2026-01-19" },
        { id: "m4", name: "Vídeo_Experiência.mp4", type: "video", size: "45.3 MB", uploadedAt: "2026-01-19" },
        { id: "m5", name: "Apresentação_Aula.pptx", type: "doc", size: "5.8 MB", uploadedAt: "2026-01-19" },
      ],
    },
  ]);

  // General materials library
  const [generalMaterials, setGeneralMaterials] = useState<Material[]>([
    { id: "g1", name: "Programa_Anual_Matemática.pdf", type: "pdf", size: "3.2 MB", uploadedAt: "2026-01-10" },
    { id: "g2", name: "Tabela_Periódica.png", type: "image", size: "1.5 MB", uploadedAt: "2026-01-05" },
    { id: "g3", name: "Regras_Ortografia.docx", type: "doc", size: "890 KB", uploadedAt: "2026-01-08" },
  ]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateMeetingLink = () => {
    const links: Record<string, string> = {
      "google-meet": `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
      "zoom": `https://zoom.us/j/${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      "teams": `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(2, 15)}`,
      "custom": "",
    };
    
    if (formData.platform !== "custom") {
      handleInputChange("link", links[formData.platform]);
      toast({
        title: "Link gerado",
        description: "O link da reunião foi gerado automaticamente",
      });
    }
  };

  const handleFileUpload = (files: FileList | null, forClass: boolean = false) => {
    if (!files || files.length === 0) return;

    const newMaterials: Material[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split("T")[0],
    }));

    if (forClass) {
      setPendingMaterials((prev) => [...prev, ...newMaterials]);
    } else {
      setGeneralMaterials((prev) => [...prev, ...newMaterials]);
    }

    toast({
      title: "Ficheiros adicionados",
      description: `${files.length} ficheiro(s) carregado(s) com sucesso`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, forClass: boolean = false) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files, forClass);
  };

  const handleRemovePendingMaterial = (materialId: string) => {
    setPendingMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  const handleRemoveGeneralMaterial = (materialId: string) => {
    setGeneralMaterials((prev) => prev.filter((m) => m.id !== materialId));
    toast({
      title: "Material removido",
      description: "O ficheiro foi removido da biblioteca",
    });
  };

  const handleRemoveClassMaterial = (classId: string, materialId: string) => {
    setOnlineClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, materials: c.materials.filter((m) => m.id !== materialId) }
          : c
      )
    );
    toast({
      title: "Material removido",
      description: "O ficheiro foi removido da aula",
    });
  };

  const handleAddMaterialToClass = (classId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newMaterials: Material[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split("T")[0],
      classId,
    }));

    setOnlineClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, materials: [...c.materials, ...newMaterials] }
          : c
      )
    );

    toast({
      title: "Materiais adicionados",
      description: `${files.length} ficheiro(s) adicionado(s) à aula`,
    });
  };

  const handleCreateClass = () => {
    if (!formData.title || !formData.subject || !formData.class || !formData.date || !formData.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.link) {
      toast({
        title: "Link em falta",
        description: "Por favor gere ou insira um link para a aula",
        variant: "destructive",
      });
      return;
    }

    const newClass: OnlineClass = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      class: formData.class,
      platform: formData.platform,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      link: formData.link,
      description: formData.description,
      status: "scheduled",
      recordingEnabled: formData.recordingEnabled,
      studentsNotified: formData.notifyStudents,
      materials: pendingMaterials,
    };

    setOnlineClasses((prev) => [newClass, ...prev]);
    
    // Send notification if notifyStudents is enabled
    if (formData.notifyStudents) {
      addNotification({
        type: "elearning",
        title: "Nova Aula Online Agendada",
        message: `${formData.title} - ${formData.subject} | ${new Date(formData.date).toLocaleDateString("pt-AO")} às ${formData.time}`,
        link: "/dashboard/portal-estudante",
      });
    }

    toast({
      title: "Aula criada com sucesso!",
      description: formData.notifyStudents 
        ? `Os alunos da turma ${formData.class} serão notificados`
        : "A aula foi agendada",
    });

    // Reset form
    setFormData({
      title: "",
      subject: "",
      class: "",
      platform: "google-meet",
      date: "",
      time: "",
      duration: 60,
      link: "",
      description: "",
      recordingEnabled: false,
      notifyStudents: true,
    });
    setPendingMaterials([]);
    setActiveTab("classes");
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência",
    });
  };

  const handleDeleteClass = (classId: string) => {
    setOnlineClasses((prev) => prev.filter((c) => c.id !== classId));
    toast({
      title: "Aula eliminada",
      description: "A aula foi removida com sucesso",
    });
  };

  const handleStartClass = (onlineClass: OnlineClass) => {
    window.open(onlineClass.link, "_blank");
    setOnlineClasses((prev) =>
      prev.map((c) =>
        c.id === onlineClass.id ? { ...c, status: "live" as const } : c
      )
    );
    toast({
      title: "Aula iniciada",
      description: "A aula está agora em directo",
    });
  };

  const getPlatformInfo = (platformId: string) => {
    return platforms.find((p) => p.id === platformId) || platforms[3];
  };

  const getStatusBadge = (status: OnlineClass["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary">Agendada</Badge>;
      case "live":
        return <Badge className="bg-red-500 animate-pulse">Em Directo</Badge>;
      case "completed":
        return <Badge variant="outline">Concluída</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
    }
  };

  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            E-Learning - {teacher.name}
          </DialogTitle>
          <DialogDescription>
            Gerir aulas online e materiais de apoio para as turmas atribuídas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">Minhas Aulas</TabsTrigger>
            <TabsTrigger value="materials">
              <FolderOpen className="h-4 w-4 mr-1" />
              Materiais
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-1" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-1" />
              Nova Aula
            </TabsTrigger>
          </TabsList>

          {/* My Classes Tab */}
          <TabsContent value="classes" className="space-y-4 mt-4">
            {onlineClasses.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma aula agendada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie a sua primeira aula online para os seus alunos
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Aula
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {onlineClasses.map((onlineClass) => {
                  const platform = getPlatformInfo(onlineClass.platform);
                  return (
                    <Card key={onlineClass.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center text-lg shrink-0`}>
                              {platform.icon}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium">{onlineClass.title}</h4>
                                {getStatusBadge(onlineClass.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(onlineClass.date).toLocaleDateString("pt-AO")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {onlineClass.time} ({onlineClass.duration}min)
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {onlineClass.class}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {onlineClass.subject}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {platform.name}
                                </Badge>
                                {onlineClass.recordingEnabled && (
                                  <Badge variant="secondary" className="text-xs">
                                    🔴 Gravação
                                  </Badge>
                                )}
                                {onlineClass.materials.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Paperclip className="h-3 w-3 mr-1" />
                                    {onlineClass.materials.length} material(is)
                                  </Badge>
                                )}
                              </div>

                              {/* Materials Section */}
                              {onlineClass.materials.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    Materiais de Apoio:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {onlineClass.materials.map((material) => (
                                      <div
                                        key={material.id}
                                        className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 text-xs group"
                                      >
                                        {getFileIcon(material.type)}
                                        <span className="max-w-[150px] truncate">{material.name}</span>
                                        <button
                                          onClick={() => handleRemoveClassMaterial(onlineClass.id, material.id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="h-3 w-3 text-destructive" />
                                        </button>
                                      </div>
                                    ))}
                                    <input
                                      type="file"
                                      multiple
                                      className="hidden"
                                      id={`add-material-${onlineClass.id}`}
                                      onChange={(e) => handleAddMaterialToClass(onlineClass.id, e.target.files)}
                                    />
                                    <label
                                      htmlFor={`add-material-${onlineClass.id}`}
                                      className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-primary/50 text-xs text-primary cursor-pointer hover:bg-primary/5 transition-colors"
                                    >
                                      <Plus className="h-3 w-3" />
                                      Adicionar
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyLink(onlineClass.link)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClass(onlineClass.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            {onlineClass.status === "scheduled" && (
                              <Button
                                size="sm"
                                onClick={() => handleStartClass(onlineClass)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Iniciar
                              </Button>
                            )}
                            {onlineClass.status === "live" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => window.open(onlineClass.link, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Entrar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Student notification info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Notificação Automática</p>
                    <p className="text-sm text-muted-foreground">
                      Os alunos matriculados nas suas turmas receberão notificações automáticas 
                      sobre as aulas agendadas, incluindo o link de acesso e materiais de apoio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Library Tab */}
          <TabsContent value="materials" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Biblioteca de Materiais
                </CardTitle>
                <CardDescription>
                  Faça upload de materiais para utilizar nas suas aulas. 
                  Os alunos só têm acesso aos materiais anexados às aulas das suas turmas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, false)}
                >
                  <input
                    ref={materialFileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, false)}
                  />
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste ficheiros ou clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    PDF, Word, PowerPoint, Imagens, Vídeos, Áudio (máx. 50MB por ficheiro)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => materialFileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Ficheiros
                  </Button>
                </div>

                {/* Materials List */}
                {generalMaterials.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Ficheiros na Biblioteca ({generalMaterials.length})
                    </p>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {generalMaterials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              {getFileIcon(material.type)}
                              <div>
                                <p className="font-medium text-sm">{material.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {material.size} • Carregado em {new Date(material.uploadedAt).toLocaleDateString("pt-AO")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveGeneralMaterial(material.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum material na biblioteca</p>
                    <p className="text-sm">Faça upload de ficheiros para começar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info about access */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Acesso Controlado</p>
                    <p className="text-sm text-muted-foreground">
                      Os materiais da biblioteca são privados. Para partilhar com alunos, 
                      anexe-os a uma aula específica - apenas os alunos matriculados nessa turma terão acesso.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Class Tab */}
          <TabsContent value="create" className="space-y-6 mt-4">
            <div className="grid gap-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título da Aula *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Introdução às Equações de 2º Grau"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              {/* Subject and Class */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Disciplina *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleInputChange("subject", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Turma *</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => handleInputChange("class", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <div className="grid grid-cols-4 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => {
                        handleInputChange("platform", platform.id);
                        handleInputChange("link", "");
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.platform === platform.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <p className="text-xs mt-1 font-medium">{platform.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => handleInputChange("duration", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Meeting Link */}
              <div className="space-y-2">
                <Label htmlFor="link">Link da Reunião *</Label>
                <div className="flex gap-2">
                  <Input
                    id="link"
                    placeholder={
                      formData.platform === "custom"
                        ? "Insira o link personalizado"
                        : "Clique em gerar ou insira manualmente"
                    }
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    className="flex-1"
                  />
                  {formData.platform !== "custom" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={generateMeetingLink}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Gerar Link
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.platform === "custom"
                    ? "Insira um link de qualquer plataforma de videoconferência"
                    : "Gere automaticamente um link ou insira um existente"}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o conteúdo da aula..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Materials Upload */}
              <div className="space-y-2">
                <Label>Materiais de Apoio</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, true)}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, true)}
                  />
                  <div className="text-center">
                    <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste ficheiros ou clique para anexar materiais de apoio
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Anexar Ficheiros
                    </Button>
                  </div>
                </div>

                {/* Pending Materials */}
                {pendingMaterials.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Ficheiros a anexar ({pendingMaterials.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pendingMaterials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm group"
                        >
                          {getFileIcon(material.type)}
                          <span className="max-w-[200px] truncate">{material.name}</span>
                          <span className="text-xs text-muted-foreground">{material.size}</span>
                          <button
                            onClick={() => handleRemovePendingMaterial(material.id)}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Activar Gravação</p>
                    <p className="text-xs text-muted-foreground">
                      Permitir gravação da aula (depende da plataforma)
                    </p>
                  </div>
                  <Switch
                    checked={formData.recordingEnabled}
                    onCheckedChange={(checked) => handleInputChange("recordingEnabled", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Notificar Alunos</p>
                    <p className="text-xs text-muted-foreground">
                      Enviar notificação aos alunos da turma seleccionada
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifyStudents}
                    onCheckedChange={(checked) => handleInputChange("notifyStudents", checked)}
                  />
                </div>
              </div>

              {/* Info Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Acesso Restrito</p>
                      <p className="text-sm text-muted-foreground">
                        Apenas os alunos matriculados na turma <strong>{formData.class || "seleccionada"}</strong> terão 
                        acesso ao link, materiais de apoio e receberão notificações sobre esta aula.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setActiveTab("classes")}>
                Cancelar
              </Button>
              <Button onClick={handleCreateClass}>
                <Video className="h-4 w-4 mr-2" />
                Criar Aula Online
              </Button>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Class Selection for Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Estatísticas de Acesso
                  </CardTitle>
                  <CardDescription>
                    Veja quais alunos acederam às suas aulas e baixaram materiais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {onlineClasses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma aula disponível para estatísticas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Class Selector */}
                      <div className="flex items-center gap-3">
                        <Label>Selecione uma aula:</Label>
                        <Select
                          value={selectedClassForStats || ""}
                          onValueChange={setSelectedClassForStats}
                        >
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Escolha uma aula" />
                          </SelectTrigger>
                          <SelectContent>
                            {onlineClasses.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.title} - {c.subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Stats Display */}
                      {selectedClassForStats && (() => {
                        const stats = getClassStats(selectedClassForStats);
                        const accessHistory = getStudentAccessHistory(selectedClassForStats);
                        const selectedClass = onlineClasses.find(c => c.id === selectedClassForStats);
                        
                        return (
                          <div className="space-y-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-3">
                              <Card className="bg-blue-500/10 border-blue-500/20">
                                <CardContent className="p-4 text-center">
                                  <Eye className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                                  <p className="text-2xl font-bold text-blue-500">{stats.accessCount}</p>
                                  <p className="text-xs text-muted-foreground">Acessos à Aula</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-green-500/10 border-green-500/20">
                                <CardContent className="p-4 text-center">
                                  <Download className="h-6 w-6 mx-auto text-green-500 mb-2" />
                                  <p className="text-2xl font-bold text-green-500">{stats.downloadCount}</p>
                                  <p className="text-xs text-muted-foreground">Downloads</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-purple-500/10 border-purple-500/20">
                                <CardContent className="p-4 text-center">
                                  <UserCheck className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                                  <p className="text-2xl font-bold text-purple-500">{stats.uniqueStudents.length}</p>
                                  <p className="text-xs text-muted-foreground">Alunos Únicos</p>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Students List */}
                            {stats.uniqueStudents.length > 0 && (
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Alunos que Acederam</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {stats.uniqueStudents.map((student, i) => (
                                      <Badge key={i} variant="secondary" className="gap-1">
                                        <UserCheck className="h-3 w-3" />
                                        {student}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Activity Log */}
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Histórico de Actividades</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {accessHistory.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhuma actividade registada ainda
                                  </p>
                                ) : (
                                  <ScrollArea className="h-[200px]">
                                    <div className="space-y-2">
                                      {accessHistory.map((log) => (
                                        <div
                                          key={log.id}
                                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                                        >
                                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                            log.type === "class_access" 
                                              ? "bg-blue-500/10 text-blue-500" 
                                              : "bg-green-500/10 text-green-500"
                                          }`}>
                                            {log.type === "class_access" ? (
                                              <Eye className="h-4 w-4" />
                                            ) : (
                                              <Download className="h-4 w-4" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                              {log.studentName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {log.type === "class_access" 
                                                ? "Acedeu à aula" 
                                                : `Baixou: ${log.materialName}`}
                                            </p>
                                          </div>
                                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: pt })}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })()}

                      {!selectedClassForStats && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Selecione uma aula para ver as estatísticas</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ELearningModal;
