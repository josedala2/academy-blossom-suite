import { useState } from "react";
import {
  Layers,
  BookOpen,
  Video,
  BarChart3,
  Plus,
  Upload,
  FileVideo,
  FileAudio,
  FileText,
  Image,
  Link2,
  Play,
  Users,
  Clock,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Save,
  X,
  ExternalLink,
  CheckCircle,
  Copy,
  File,
  FolderOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Module, Lesson, Content, ContentType, getContentIcon, getContentColor, getFileContentType, formatFileSize } from "@/components/elearning/types";

// Mock data for modules
const initialModules: Module[] = [
  {
    id: "mod1",
    title: "Módulo 1 - Introdução à Matemática",
    description: "Conceitos básicos e fundamentos da disciplina",
    order: 1,
    isPublished: true,
    createdAt: "2026-01-15",
    lessons: [
      {
        id: "les1",
        title: "Aula 1 - Números e Operações",
        description: "Revisão das operações básicas",
        order: 1,
        duration: 45,
        isPublished: true,
        contents: [
          { id: "c1", name: "Introdução_Matemática.mp4", type: "video", size: "45.3 MB", uploadedAt: "2026-01-15", duration: "32:15" },
          { id: "c2", name: "Exercícios_Práticos.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2026-01-15" },
        ],
      },
      {
        id: "les2",
        title: "Aula 2 - Equações de 1º Grau",
        description: "Resolução de equações simples",
        order: 2,
        duration: 60,
        isPublished: true,
        contents: [
          { id: "c3", name: "Apresentação_Equações.pptx", type: "presentation", size: "5.8 MB", uploadedAt: "2026-01-16" },
        ],
      },
    ],
  },
  {
    id: "mod2",
    title: "Módulo 2 - Geometria Plana",
    description: "Estudo das figuras geométricas",
    order: 2,
    isPublished: false,
    createdAt: "2026-01-18",
    lessons: [
      {
        id: "les3",
        title: "Aula 1 - Triângulos",
        description: "Classificação e propriedades",
        order: 1,
        duration: 50,
        isPublished: false,
        contents: [],
      },
    ],
  },
];

// Mock online classes
const mockOnlineClasses = [
  {
    id: "1",
    title: "Revisão de Trigonometria",
    subject: "Matemática",
    class: "10ª A",
    platform: "google-meet" as const,
    date: "2026-01-25",
    time: "10:00",
    duration: 60,
    link: "https://meet.google.com/abc-defg-hij",
    status: "scheduled" as const,
  },
  {
    id: "2",
    title: "Leis de Newton - Parte 2",
    subject: "Física",
    class: "11ª B",
    platform: "zoom" as const,
    date: "2026-01-26",
    time: "14:00",
    duration: 90,
    link: "https://zoom.us/j/1234567890",
    status: "scheduled" as const,
  },
];

const platformConfig = {
  "google-meet": { name: "Google Meet", icon: "🎥", color: "bg-green-500" },
  "zoom": { name: "Zoom", icon: "📹", color: "bg-blue-500" },
  "teams": { name: "Teams", icon: "💼", color: "bg-purple-500" },
  "custom": { name: "Link", icon: "🔗", color: "bg-gray-500" },
};

const ELearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("modules");
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<string[]>(["mod1"]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showNewModule, setShowNewModule] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);
  const [newModuleData, setNewModuleData] = useState({ title: "", description: "" });
  const [newLessonData, setNewLessonData] = useState({ title: "", description: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [linkData, setLinkData] = useState({ name: "", url: "", description: "" });

  // Stats
  const totalModules = modules.length;
  const publishedModules = modules.filter(m => m.isPublished).length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalContents = modules.reduce((acc, m) => acc + m.lessons.reduce((acc2, l) => acc2 + l.contents.length, 0), 0);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleAddModule = () => {
    if (!newModuleData.title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }

    const newModule: Module = {
      id: Date.now().toString(),
      title: newModuleData.title.trim(),
      description: newModuleData.description.trim(),
      order: modules.length + 1,
      lessons: [],
      isPublished: false,
      createdAt: new Date().toISOString(),
    };

    setModules([...modules, newModule]);
    setNewModuleData({ title: "", description: "" });
    setShowNewModule(false);
    setExpandedModules((prev) => [...prev, newModule.id]);
    toast({ title: "Módulo criado", description: newModule.title });
  };

  const handleAddLesson = (moduleId: string) => {
    if (!newLessonData.title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }

    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: newLessonData.title.trim(),
      description: newLessonData.description.trim(),
      order: module.lessons.length + 1,
      contents: [],
      isPublished: false,
    };

    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    );

    setModules(updatedModules);
    setNewLessonData({ title: "", description: "" });
    setShowNewLesson(null);
    toast({ title: "Aula criada", description: newLesson.title });
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
    toast({ title: "Módulo eliminado" });
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
        : m
    );
    setModules(updatedModules);
    toast({ title: "Aula eliminada" });
  };

  const toggleModulePublish = (moduleId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, isPublished: !m.isPublished } : m
    );
    setModules(updatedModules);
    const module = updatedModules.find(m => m.id === moduleId);
    toast({ 
      title: module?.isPublished ? "Módulo publicado" : "Módulo despublicado",
      description: module?.title 
    });
  };

  const toggleLessonPublish = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, isPublished: !l.isPublished } : l
            ),
          }
        : m
    );
    setModules(updatedModules);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!selectedModuleId || !selectedLessonId) {
      toast({
        title: "Selecione uma aula",
        description: "Por favor selecione um módulo e aula primeiro",
        variant: "destructive",
      });
      return;
    }

    const newContents: Content[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: getFileContentType(file.name),
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split("T")[0],
    }));

    const updatedModules = modules.map((m) =>
      m.id === selectedModuleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLessonId
                ? { ...l, contents: [...l.contents, ...newContents] }
                : l
            ),
          }
        : m
    );

    setModules(updatedModules);
    toast({
      title: "Conteúdo adicionado",
      description: `${files.length} ficheiro(s) carregado(s)`,
    });
  };

  const handleAddLink = () => {
    if (!linkData.name.trim() || !linkData.url.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    if (!selectedModuleId || !selectedLessonId) {
      toast({
        title: "Selecione uma aula",
        description: "Por favor selecione um módulo e aula primeiro",
        variant: "destructive",
      });
      return;
    }

    const newContent: Content = {
      id: Date.now().toString(),
      name: linkData.name.trim(),
      type: "other",
      size: "Link externo",
      url: linkData.url.trim(),
      description: linkData.description.trim(),
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    const updatedModules = modules.map((m) =>
      m.id === selectedModuleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLessonId
                ? { ...l, contents: [...l.contents, newContent] }
                : l
            ),
          }
        : m
    );

    setModules(updatedModules);
    setLinkData({ name: "", url: "", description: "" });
    toast({ title: "Link adicionado" });
  };

  const removeContent = (contentId: string) => {
    if (!selectedModuleId || !selectedLessonId) return;

    const updatedModules = modules.map((m) =>
      m.id === selectedModuleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLessonId
                ? { ...l, contents: l.contents.filter((c) => c.id !== contentId) }
                : l
            ),
          }
        : m
    );

    setModules(updatedModules);
    toast({ title: "Conteúdo removido" });
  };

  const currentModule = modules.find((m) => m.id === selectedModuleId);
  const currentLesson = currentModule?.lessons.find((l) => l.id === selectedLessonId);

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video": return <FileVideo className="h-4 w-4" />;
      case "audio": return <FileAudio className="h-4 w-4" />;
      case "presentation": return <FileText className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              E-Learning
            </h1>
            <p className="text-muted-foreground">
              Gerir módulos, aulas e conteúdos para ensino à distância
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalModules}</p>
                  <p className="text-xs text-muted-foreground">Módulos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publishedModules}</p>
                  <p className="text-xs text-muted-foreground">Publicados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Aulas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalContents}</p>
                  <p className="text-xs text-muted-foreground">Conteúdos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules" className="gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Módulos</span>
            </TabsTrigger>
            <TabsTrigger value="contents" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Conteúdos</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Aulas Online</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Gestão de Módulos</h4>
                    <p className="text-xs text-muted-foreground">
                      Crie e organize módulos do curso. Cada módulo pode ter múltiplas aulas com ordem personalizável.
                      Clique numa aula para adicionar conteúdos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Módulos e Aulas</h3>
              <Button onClick={() => setShowNewModule(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Novo Módulo
              </Button>
            </div>

            {/* New Module Form */}
            {showNewModule && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Título do módulo"
                    value={newModuleData.title}
                    onChange={(e) => setNewModuleData((prev) => ({ ...prev, title: e.target.value }))}
                    autoFocus
                  />
                  <Textarea
                    placeholder="Descrição (opcional)"
                    value={newModuleData.description}
                    onChange={(e) => setNewModuleData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddModule}>
                      <Save className="h-4 w-4 mr-1" />
                      Criar Módulo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowNewModule(false);
                        setNewModuleData({ title: "", description: "" });
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modules List */}
            <ScrollArea className="h-[500px] pr-2">
              {modules.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Nenhum módulo criado</p>
                  <p className="text-sm text-muted-foreground">
                    Crie o primeiro módulo para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modules
                    .sort((a, b) => a.order - b.order)
                    .map((module, index) => (
                      <Card key={module.id} className="overflow-hidden">
                        <Collapsible
                          open={expandedModules.includes(module.id)}
                          onOpenChange={() => toggleModule(module.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <CardHeader className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="secondary" className="text-xs">
                                  M{index + 1}
                                </Badge>
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                
                                <CardTitle className="text-sm flex-1">{module.title}</CardTitle>

                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={module.isPublished ? "default" : "outline"}
                                    className="text-xs"
                                  >
                                    {module.isPublished ? "Publicado" : "Rascunho"}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleModulePublish(module.id);
                                    }}
                                  >
                                    {module.isPublished ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5 opacity-50" />
                                    )}
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Eliminar Módulo?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta ação irá eliminar o módulo "{module.title}" e todas as suas aulas. Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-destructive hover:bg-destructive/90"
                                          onClick={() => handleDeleteModule(module.id)}
                                        >
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="p-3 pt-0 space-y-2">
                              {module.description && (
                                <p className="text-xs text-muted-foreground mb-3">
                                  {module.description}
                                </p>
                              )}

                              {/* Lessons */}
                              {module.lessons.length > 0 && (
                                <div className="space-y-1.5 mb-3">
                                  {module.lessons
                                    .sort((a, b) => a.order - b.order)
                                    .map((lesson, lessonIndex) => (
                                      <div
                                        key={lesson.id}
                                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors group cursor-pointer ${
                                          selectedModuleId === module.id && selectedLessonId === lesson.id
                                            ? "bg-primary/10 border border-primary/30"
                                            : "bg-muted/50 hover:bg-muted"
                                        }`}
                                        onClick={() => {
                                          setSelectedModuleId(module.id);
                                          setSelectedLessonId(lesson.id);
                                          setActiveTab("contents");
                                        }}
                                      >
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          {index + 1}.{lessonIndex + 1}
                                        </span>
                                        
                                        <span className="text-sm flex-1">
                                          {lesson.title}
                                        </span>

                                        <Badge variant="outline" className="text-[10px]">
                                          {lesson.contents.length} conteúdo{lesson.contents.length !== 1 ? "s" : ""}
                                        </Badge>

                                        {lesson.isPublished ? (
                                          <Badge className="text-[10px]">Publicada</Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-[10px]">Rascunho</Badge>
                                        )}

                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleLessonPublish(module.id, lesson.id);
                                            }}
                                          >
                                            <Eye className="h-3 w-3" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive hover:text-destructive"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Eliminar Aula?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Esta ação irá eliminar a aula "{lesson.title}" e todos os seus conteúdos.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                  className="bg-destructive hover:bg-destructive/90"
                                                  onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                >
                                                  Eliminar
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}

                              {/* New Lesson Form */}
                              {showNewLesson === module.id ? (
                                <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                                  <Input
                                    placeholder="Título da aula"
                                    value={newLessonData.title}
                                    onChange={(e) => setNewLessonData((prev) => ({ ...prev, title: e.target.value }))}
                                    autoFocus
                                  />
                                  <Textarea
                                    placeholder="Descrição (opcional)"
                                    value={newLessonData.description}
                                    onChange={(e) => setNewLessonData((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleAddLesson(module.id)}>
                                      <Save className="h-4 w-4 mr-1" />
                                      Criar Aula
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setShowNewLesson(null);
                                        setNewLessonData({ title: "", description: "" });
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setShowNewLesson(module.id)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar Aula
                                </Button>
                              )}
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Contents Tab */}
          <TabsContent value="contents" className="space-y-4">
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Upload de Conteúdos</h4>
                    <p className="text-xs text-muted-foreground">
                      🎬 Vídeos (MP4, AVI, MOV) • 🎵 Áudio (MP3, WAV) • 
                      📊 Apresentações (PPT, PPTX) • 📄 PDFs e documentos • 🖼️ Imagens • 🔗 Links externos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Module/Lesson selector sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Selecionar Aula</CardTitle>
                  <CardDescription className="text-xs">
                    Escolha a aula para adicionar conteúdos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-2">
                    {modules.length === 0 ? (
                      <div className="text-center py-6">
                        <Layers className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Nenhum módulo criado</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setActiveTab("modules")}
                        >
                          Criar módulo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {modules.map((mod) => (
                          <div key={mod.id} className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/50 rounded">
                              {mod.title}
                            </div>
                            {mod.lessons.length === 0 ? (
                              <p className="text-xs text-muted-foreground px-2 py-1">
                                Nenhuma aula
                              </p>
                            ) : (
                              mod.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => {
                                    setSelectedModuleId(mod.id);
                                    setSelectedLessonId(lesson.id);
                                  }}
                                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                                    selectedModuleId === mod.id && selectedLessonId === lesson.id
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted"
                                  }`}
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="truncate flex-1">{lesson.title}</span>
                                  <Badge variant="secondary" className="text-[10px]">
                                    {lesson.contents.length}
                                  </Badge>
                                </button>
                              ))
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Content uploader */}
              <div className="lg:col-span-2 space-y-4">
                {!selectedModuleId || !selectedLessonId ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center py-12">
                      <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Selecione uma Aula</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Para adicionar conteúdos, primeiro selecione um módulo e depois clique numa aula na lista à esquerda.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Conteúdos da Aula</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentModule?.title} → {currentLesson?.title}
                        </p>
                      </div>
                    </div>

                    <Tabs defaultValue="upload">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload">
                          <Upload className="h-4 w-4 mr-1" />
                          Carregar
                        </TabsTrigger>
                        <TabsTrigger value="link">
                          <Link2 className="h-4 w-4 mr-1" />
                          Link Externo
                        </TabsTrigger>
                        <TabsTrigger value="list">
                          <File className="h-4 w-4 mr-1" />
                          Conteúdos ({currentLesson?.contents.length || 0})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                isDragging
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
                              onClick={() => document.getElementById("file-upload")?.click()}
                            >
                              <input
                                id="file-upload"
                                type="file"
                                multiple
                                className="hidden"
                                accept="video/*,audio/*,.ppt,.pptx,.pdf,.doc,.docx,image/*"
                                onChange={(e) => handleFileUpload(e.target.files)}
                              />
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h4 className="font-medium mb-2">
                                Arraste ficheiros ou clique para carregar
                              </h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Suporta vídeos, áudios, apresentações, PDFs e imagens
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="gap-1">
                                  <FileVideo className="h-3 w-3" /> Vídeo
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                  <FileAudio className="h-3 w-3" /> Áudio
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                  <FileText className="h-3 w-3" /> PPT
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                  <FileText className="h-3 w-3" /> PDF
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                  <Image className="h-3 w-3" /> Imagem
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="link" className="mt-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Adicionar Link Externo</CardTitle>
                            <CardDescription>
                              Adicione links para conteúdos externos como YouTube, Vimeo, etc.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Label>Nome do Conteúdo *</Label>
                              <Input
                                placeholder="Ex: Vídeo Explicativo - Introdução"
                                value={linkData.name}
                                onChange={(e) => setLinkData((prev) => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>URL *</Label>
                              <Input
                                placeholder="https://..."
                                value={linkData.url}
                                onChange={(e) => setLinkData((prev) => ({ ...prev, url: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição (Opcional)</Label>
                              <Textarea
                                placeholder="Breve descrição do conteúdo"
                                value={linkData.description}
                                onChange={(e) => setLinkData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={2}
                              />
                            </div>
                            <Button onClick={handleAddLink} className="w-full">
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar Link
                            </Button>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="list" className="mt-4">
                        {currentLesson?.contents.length === 0 ? (
                          <div className="text-center py-12">
                            <File className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">Nenhum conteúdo adicionado</p>
                            <p className="text-sm text-muted-foreground">
                              Carregue ficheiros ou adicione links externos
                            </p>
                          </div>
                        ) : (
                          <ScrollArea className="h-[300px] pr-2">
                            <div className="space-y-2">
                              {currentLesson?.contents.map((content, index) => (
                                <Card key={content.id} className="overflow-hidden">
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${getContentColor(content.type)}`}
                                      >
                                        {getContentTypeIcon(content.type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                                          <p className="font-medium text-sm truncate">{content.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <Badge variant="outline" className="text-[10px] capitalize">
                                            {getContentIcon(content.type)} {content.type}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">{content.size}</span>
                                          {content.url && (
                                            <a
                                              href={content.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline"
                                            >
                                              Abrir link
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {(content.type === "video" || content.type === "audio") && (
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Play className="h-4 w-4" />
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-destructive hover:text-destructive"
                                          onClick={() => removeContent(content.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Live Classes Tab */}
          <TabsContent value="live" className="space-y-4">
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Video className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Aulas Online ao Vivo</h4>
                    <p className="text-xs text-muted-foreground">
                      Agende e gerencie aulas online com integração Google Meet, Zoom e Microsoft Teams.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Aulas Agendadas</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nova Aula Online
              </Button>
            </div>

            <div className="grid gap-4">
              {mockOnlineClasses.map((aula) => {
                const platform = platformConfig[aula.platform];
                return (
                  <Card key={aula.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-lg ${platform.color} flex items-center justify-center text-white text-xl shrink-0`}>
                          {platform.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{aula.title}</h4>
                            <Badge variant="outline">{aula.subject}</Badge>
                            <Badge variant="secondary">{aula.class}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(aula.date).toLocaleDateString("pt-AO")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {aula.time} ({aula.duration} min)
                            </span>
                            <span className="flex items-center gap-1">
                              {platform.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(aula.link);
                              toast({ title: "Link copiado" });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => window.open(aula.link, "_blank")}>
                            <Play className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas de Acesso
                </CardTitle>
                <CardDescription>
                  Acompanhe o acesso dos estudantes aos conteúdos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>As estatísticas serão mostradas aqui</p>
                  <p className="text-sm">quando houver dados de acesso dos estudantes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ELearning;
