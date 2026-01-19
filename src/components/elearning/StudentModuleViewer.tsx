import { useState } from "react";
import {
  BookOpen,
  Play,
  Download,
  ChevronRight,
  ChevronDown,
  Clock,
  FileText,
  FileVideo,
  FileAudio,
  Image,
  File,
  CheckCircle,
  Lock,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Module, Lesson, Content, getContentIcon, getContentColor, ContentType } from "./types";

interface StudentModuleViewerProps {
  studentId: string;
  studentName: string;
  onContentAccess?: (lessonId: string, contentId: string) => void;
}

// Mock data for student courses - representing modules published for their class
const mockStudentModules: Module[] = [
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
        description: "Revisão das operações básicas com números inteiros e racionais",
        order: 1,
        duration: 45,
        isPublished: true,
        contents: [
          { id: "c1", name: "Introdução_Matemática.mp4", type: "video", size: "45.3 MB", uploadedAt: "2026-01-15", duration: "32:15" },
          { id: "c2", name: "Exercícios_Práticos.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2026-01-15" },
          { id: "c3", name: "Resumo_Aula.pdf", type: "pdf", size: "850 KB", uploadedAt: "2026-01-15" },
        ],
      },
      {
        id: "les2",
        title: "Aula 2 - Equações de 1º Grau",
        description: "Resolução de equações simples e problemas aplicados",
        order: 2,
        duration: 60,
        isPublished: true,
        contents: [
          { id: "c4", name: "Equações_Explicação.mp4", type: "video", size: "52.1 MB", uploadedAt: "2026-01-16", duration: "45:30" },
          { id: "c5", name: "Apresentação_Equações.pptx", type: "presentation", size: "5.8 MB", uploadedAt: "2026-01-16" },
          { id: "c6", name: "Lista_Exercícios.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2026-01-16" },
        ],
      },
      {
        id: "les3",
        title: "Aula 3 - Equações de 2º Grau",
        description: "Fórmula resolvente e discriminante",
        order: 3,
        duration: 75,
        isPublished: true,
        contents: [
          { id: "c7", name: "Fórmula_Resolvente.mp4", type: "video", size: "68.4 MB", uploadedAt: "2026-01-17", duration: "55:20" },
          { id: "c8", name: "Exercícios_Avançados.pdf", type: "pdf", size: "3.5 MB", uploadedAt: "2026-01-17" },
        ],
      },
    ],
  },
  {
    id: "mod2",
    title: "Módulo 2 - Geometria Plana",
    description: "Estudo das figuras geométricas e suas propriedades",
    order: 2,
    isPublished: true,
    createdAt: "2026-01-20",
    lessons: [
      {
        id: "les4",
        title: "Aula 1 - Triângulos",
        description: "Classificação e propriedades dos triângulos",
        order: 1,
        duration: 50,
        isPublished: true,
        contents: [
          { id: "c9", name: "Triângulos_Aula.mp4", type: "video", size: "42.8 MB", uploadedAt: "2026-01-20", duration: "38:45" },
          { id: "c10", name: "Exercícios_Triângulos.pdf", type: "pdf", size: "1.8 MB", uploadedAt: "2026-01-20" },
        ],
      },
      {
        id: "les5",
        title: "Aula 2 - Quadriláteros",
        description: "Tipos de quadriláteros e cálculo de áreas",
        order: 2,
        duration: 55,
        isPublished: true,
        contents: [
          { id: "c11", name: "Quadriláteros_Parte1.mp4", type: "video", size: "38.2 MB", uploadedAt: "2026-01-21", duration: "28:10" },
          { id: "c12", name: "Quadriláteros_Parte2.mp4", type: "video", size: "35.6 MB", uploadedAt: "2026-01-21", duration: "25:35" },
          { id: "c13", name: "Resumo_Fórmulas.pdf", type: "pdf", size: "950 KB", uploadedAt: "2026-01-21" },
        ],
      },
    ],
  },
  {
    id: "mod3",
    title: "Módulo 3 - Física - Mecânica",
    description: "Leis do movimento e aplicações práticas",
    order: 3,
    isPublished: true,
    createdAt: "2026-01-18",
    lessons: [
      {
        id: "les6",
        title: "Aula 1 - Leis de Newton",
        description: "As três leis fundamentais do movimento",
        order: 1,
        duration: 65,
        isPublished: true,
        contents: [
          { id: "c14", name: "Newton_Explicação.mp4", type: "video", size: "58.3 MB", uploadedAt: "2026-01-18", duration: "48:20" },
          { id: "c15", name: "Podcast_Newton.mp3", type: "audio", size: "12.5 MB", uploadedAt: "2026-01-18", duration: "25:00" },
          { id: "c16", name: "Exercícios_Newton.pdf", type: "pdf", size: "2.3 MB", uploadedAt: "2026-01-18" },
        ],
      },
      {
        id: "les7",
        title: "Aula 2 - Trabalho e Energia",
        description: "Conceitos de trabalho, energia cinética e potencial",
        order: 2,
        duration: 70,
        isPublished: true,
        contents: [
          { id: "c17", name: "Energia_Trabalho.mp4", type: "video", size: "62.1 MB", uploadedAt: "2026-01-19", duration: "52:15" },
          { id: "c18", name: "Apresentação_Energia.pptx", type: "presentation", size: "8.2 MB", uploadedAt: "2026-01-19" },
        ],
      },
    ],
  },
];

// Mock progress data
const mockProgress: Record<string, { completed: boolean; progress: number }> = {
  "les1": { completed: true, progress: 100 },
  "les2": { completed: true, progress: 100 },
  "les3": { completed: false, progress: 45 },
  "les4": { completed: false, progress: 0 },
  "les5": { completed: false, progress: 0 },
  "les6": { completed: true, progress: 100 },
  "les7": { completed: false, progress: 30 },
};

const StudentModuleViewer = ({ studentId, studentName, onContentAccess }: StudentModuleViewerProps) => {
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<string[]>(["mod1"]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleContentAccess = (content: Content) => {
    if (onContentAccess && selectedLesson) {
      onContentAccess(selectedLesson.id, content.id);
    }

    if (content.url) {
      window.open(content.url, "_blank");
    } else if (content.type === "video" || content.type === "audio") {
      toast({
        title: "A reproduzir conteúdo",
        description: `A iniciar ${content.name}`,
      });
    } else {
      toast({
        title: "Download iniciado",
        description: `A descarregar ${content.name}`,
      });
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <FileVideo className="h-4 w-4" />;
      case "audio":
        return <FileAudio className="h-4 w-4" />;
      case "presentation":
        return <FileText className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Calculate module progress
  const getModuleProgress = (module: Module) => {
    if (module.lessons.length === 0) return 0;
    const totalProgress = module.lessons.reduce((acc, lesson) => {
      return acc + (mockProgress[lesson.id]?.progress || 0);
    }, 0);
    return Math.round(totalProgress / module.lessons.length);
  };

  // Calculate total progress
  const totalLessons = mockStudentModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = Object.values(mockProgress).filter(p => p.completed).length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Layers className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">O Meu Progresso</h3>
                <span className="text-sm font-medium">{overallProgress}% completo</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {completedLessons} de {totalLessons} aulas concluídas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Módulos e Aulas
          </h3>
          <Badge variant="secondary">
            {mockStudentModules.length} módulo{mockStudentModules.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-3">
            {mockStudentModules.map((module, moduleIndex) => {
              const moduleProgress = getModuleProgress(module);
              const isExpanded = expandedModules.includes(module.id);
              
              return (
                <Card key={module.id} className="overflow-hidden">
                  <Collapsible open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {moduleIndex + 1}
                          </div>
                          
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          
                          <div className="flex-1">
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                              {module.description}
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">{moduleProgress}%</p>
                              <p className="text-xs text-muted-foreground">
                                {module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="w-16">
                              <Progress value={moduleProgress} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="p-0 pb-3">
                        <div className="space-y-1 px-4">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const lessonProgress = mockProgress[lesson.id];
                            const isCompleted = lessonProgress?.completed;
                            const progress = lessonProgress?.progress || 0;
                            
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleOpenLesson(lesson)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                  isCompleted
                                    ? "bg-primary/5 hover:bg-primary/10"
                                    : "bg-muted/30 hover:bg-muted/50"
                                }`}
                              >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                  isCompleted
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {moduleIndex + 1}.{lessonIndex + 1}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-sm ${isCompleted ? "text-primary" : ""}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {lesson.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration} min
                                      </span>
                                    )}
                                    <span>{lesson.contents.length} conteúdo{lesson.contents.length !== 1 ? "s" : ""}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {progress > 0 && !isCompleted && (
                                    <div className="text-right">
                                      <p className="text-xs font-medium">{progress}%</p>
                                    </div>
                                  )}
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <Play className="h-4 w-4 mr-1" />
                                    {isCompleted ? "Rever" : progress > 0 ? "Continuar" : "Iniciar"}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Lesson Content Modal */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {selectedLesson.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedLesson.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Lesson info */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  {selectedLesson.duration && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLesson.duration} minutos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedLesson.contents.length} conteúdo{selectedLesson.contents.length !== 1 ? "s" : ""}</span>
                  </div>
                  {mockProgress[selectedLesson.id]?.completed && (
                    <Badge className="bg-primary/10 text-primary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluída
                    </Badge>
                  )}
                </div>

                {/* Content list */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Conteúdos da Aula</h4>
                  {selectedLesson.contents.map((content, index) => (
                    <Card key={content.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${getContentColor(content.type)}`}>
                            {getContentTypeIcon(content.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">#{index + 1}</span>
                              <p className="font-medium text-sm truncate">{content.name}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {getContentIcon(content.type)} {content.type}
                              </Badge>
                              <span>{content.size}</span>
                              {content.duration && <span>• {content.duration}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {content.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleContentAccess(content)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Abrir
                              </Button>
                            )}
                            {(content.type === "video" || content.type === "audio") && !content.url && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleContentAccess(content)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Reproduzir
                              </Button>
                            )}
                            {content.type !== "video" && content.type !== "audio" && !content.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleContentAccess(content)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Descarregar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedLesson.contents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum conteúdo disponível nesta aula</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentModuleViewer;
