import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  BookOpen,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Module, Lesson, getContentIcon, getContentColor } from "./types";

interface ModuleManagerProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}

const ModuleManager = ({ modules, onModulesChange, onSelectLesson }: ModuleManagerProps) => {
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [newModuleData, setNewModuleData] = useState({ title: "", description: "" });
  const [newLessonData, setNewLessonData] = useState({ title: "", description: "" });
  const [showNewModule, setShowNewModule] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);

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

    onModulesChange([...modules, newModule]);
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

    onModulesChange(updatedModules);
    setNewLessonData({ title: "", description: "" });
    setShowNewLesson(null);
    toast({ title: "Aula criada", description: newLesson.title });
  };

  const handleDeleteModule = (moduleId: string) => {
    onModulesChange(modules.filter((m) => m.id !== moduleId));
    toast({ title: "Módulo eliminado" });
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
        : m
    );
    onModulesChange(updatedModules);
    toast({ title: "Aula eliminada" });
  };

  const toggleModulePublish = (moduleId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, isPublished: !m.isPublished } : m
    );
    onModulesChange(updatedModules);
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
    onModulesChange(updatedModules);
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, title } : m
    );
    onModulesChange(updatedModules);
    setEditingModule(null);
  };

  const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, title } : l
            ),
          }
        : m
    );
    onModulesChange(updatedModules);
    setEditingLesson(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Módulos e Aulas</h3>
          <p className="text-sm text-muted-foreground">
            Organize o seu conteúdo em módulos e aulas
          </p>
        </div>
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
      <ScrollArea className="h-[400px] pr-2">
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
                          
                          {editingModule === module.id ? (
                            <Input
                              value={module.title}
                              onChange={(e) => {
                                const updatedModules = modules.map((m) =>
                                  m.id === module.id ? { ...m, title: e.target.value } : m
                                );
                                onModulesChange(updatedModules);
                              }}
                              onBlur={() => setEditingModule(null)}
                              onKeyDown={(e) => e.key === "Enter" && setEditingModule(null)}
                              className="h-7 text-sm flex-1"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <CardTitle className="text-sm flex-1">{module.title}</CardTitle>
                          )}

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
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingModule(module.id);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
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
                                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                                >
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {index + 1}.{lessonIndex + 1}
                                  </span>
                                  
                                  {editingLesson?.moduleId === module.id &&
                                  editingLesson?.lessonId === lesson.id ? (
                                    <Input
                                      value={lesson.title}
                                      onChange={(e) => {
                                        const updatedModules = modules.map((m) =>
                                          m.id === module.id
                                            ? {
                                                ...m,
                                                lessons: m.lessons.map((l) =>
                                                  l.id === lesson.id
                                                    ? { ...l, title: e.target.value }
                                                    : l
                                                ),
                                              }
                                            : m
                                        );
                                        onModulesChange(updatedModules);
                                      }}
                                      onBlur={() => setEditingLesson(null)}
                                      onKeyDown={(e) => e.key === "Enter" && setEditingLesson(null)}
                                      className="h-6 text-xs flex-1"
                                      autoFocus
                                    />
                                  ) : (
                                    <span
                                      className="text-sm flex-1 cursor-pointer hover:underline"
                                      onClick={() => onSelectLesson(module.id, lesson.id)}
                                    >
                                      {lesson.title}
                                    </span>
                                  )}

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
                                      onClick={() => toggleLessonPublish(module.id, lesson.id)}
                                    >
                                      {lesson.isPublished ? (
                                        <EyeOff className="h-3 w-3" />
                                      ) : (
                                        <Eye className="h-3 w-3" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() =>
                                        setEditingLesson({ moduleId: module.id, lessonId: lesson.id })
                                      }
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-destructive hover:text-destructive"
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
                              onChange={(e) =>
                                setNewLessonData((prev) => ({ ...prev, title: e.target.value }))
                              }
                              autoFocus
                              className="h-8 text-sm"
                            />
                            <Textarea
                              placeholder="Descrição (opcional)"
                              value={newLessonData.description}
                              onChange={(e) =>
                                setNewLessonData((prev) => ({ ...prev, description: e.target.value }))
                              }
                              rows={2}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleAddLesson(module.id)}>
                                <Save className="h-3 w-3 mr-1" />
                                Criar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setShowNewLesson(null);
                                  setNewLessonData({ title: "", description: "" });
                                }}
                              >
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
                            <Plus className="h-3 w-3 mr-1" />
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
    </div>
  );
};

export default ModuleManager;
