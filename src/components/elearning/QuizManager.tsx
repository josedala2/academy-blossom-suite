import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Save,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Target,
  Repeat,
  Eye,
  Edit,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Module,
  Quiz,
  QuizQuestion,
  QuizOption,
  QuestionType,
  getQuestionTypeLabel,
} from "./types";

interface QuizManagerProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
}

const QuizManager = ({ modules, onModulesChange }: QuizManagerProps) => {
  const { toast } = useToast();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  // New quiz form state
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 60,
    maxAttempts: 3,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const selectedLesson = selectedModule?.lessons.find((l) => l.id === selectedLessonId);

  const resetForm = () => {
    setQuizForm({
      title: "",
      description: "",
      timeLimit: 30,
      passingScore: 60,
      maxAttempts: 3,
    });
    setQuestions([]);
    setShowNewQuiz(false);
    setEditingQuiz(null);
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type,
      question: "",
      options:
        type === "true_false"
          ? [
              { id: "1", text: "Verdadeiro", isCorrect: true },
              { id: "2", text: "Falso", isCorrect: false },
            ]
          : type === "multiple_choice"
          ? [
              { id: "1", text: "", isCorrect: true },
              { id: "2", text: "", isCorrect: false },
            ]
          : [],
      points: 10,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestions([...expandedQuestions, newQuestion.id]);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [
              ...q.options,
              { id: Date.now().toString(), text: "", isCorrect: false },
            ],
          };
        }
        return q;
      })
    );
  };

  const handleUpdateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<QuizOption>
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, ...updates } : opt
            ),
          };
        }
        return q;
      })
    );
  };

  const handleSetCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              isCorrect: opt.id === optionId,
            })),
          };
        }
        return q;
      })
    );
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((opt) => opt.id !== optionId),
          };
        }
        return q;
      })
    );
  };

  const handleSaveQuiz = () => {
    if (!selectedModuleId || !selectedLessonId) {
      toast({
        title: "Selecione uma aula",
        description: "Por favor selecione um módulo e aula primeiro",
        variant: "destructive",
      });
      return;
    }

    if (!quizForm.title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Adicione pelo menos uma questão",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question.trim()) {
        toast({
          title: "Questão inválida",
          description: "Todas as questões devem ter um enunciado",
          variant: "destructive",
        });
        return;
      }
      if (q.type === "multiple_choice" && q.options.some((opt) => !opt.text.trim())) {
        toast({
          title: "Opções inválidas",
          description: "Todas as opções devem ter texto",
          variant: "destructive",
        });
        return;
      }
    }

    const quiz: Quiz = {
      id: editingQuiz?.id || Date.now().toString(),
      title: quizForm.title.trim(),
      description: quizForm.description.trim(),
      lessonId: selectedLessonId,
      questions,
      timeLimit: quizForm.timeLimit,
      passingScore: quizForm.passingScore,
      maxAttempts: quizForm.maxAttempts,
      isPublished: editingQuiz?.isPublished || false,
      createdAt: editingQuiz?.createdAt || new Date().toISOString(),
    };

    const updatedModules = modules.map((m) =>
      m.id === selectedModuleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLessonId ? { ...l, quiz } : l
            ),
          }
        : m
    );

    onModulesChange(updatedModules);
    resetForm();
    toast({
      title: editingQuiz ? "Quiz atualizado" : "Quiz criado",
      description: quiz.title,
    });
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit || 30,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
    });
    setQuestions(quiz.questions);
    setEditingQuiz(quiz);
    setShowNewQuiz(true);
  };

  const handleDeleteQuiz = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, quiz: undefined } : l
            ),
          }
        : m
    );
    onModulesChange(updatedModules);
    toast({ title: "Quiz eliminado" });
  };

  const handleToggleQuizPublish = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId && l.quiz
                ? { ...l, quiz: { ...l.quiz, isPublished: !l.quiz.isPublished } }
                : l
            ),
          }
        : m
    );
    onModulesChange(updatedModules);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Get all quizzes for display
  const allQuizzes = modules.flatMap((m) =>
    m.lessons
      .filter((l) => l.quiz)
      .map((l) => ({
        moduleId: m.id,
        moduleTitle: m.title,
        lessonId: l.id,
        lessonTitle: l.title,
        quiz: l.quiz!,
      }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Gestão de Quizzes</h4>
              <p className="text-xs text-muted-foreground">
                Crie avaliações para cada aula. Os quizzes ajudam a medir o progresso dos alunos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Selection + New Quiz Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Módulo</Label>
          <Select value={selectedModuleId || ""} onValueChange={setSelectedModuleId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar módulo" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Aula</Label>
          <Select
            value={selectedLessonId || ""}
            onValueChange={setSelectedLessonId}
            disabled={!selectedModuleId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar aula" />
            </SelectTrigger>
            <SelectContent>
              {selectedModule?.lessons.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.title} {l.quiz ? "(Com Quiz)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={() => setShowNewQuiz(true)}
            disabled={!selectedLessonId || (selectedLesson?.quiz && !editingQuiz)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {selectedLesson?.quiz ? "Aula já tem Quiz" : "Novo Quiz"}
          </Button>
        </div>
      </div>

      {/* Quiz Form */}
      {showNewQuiz && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {editingQuiz ? "Editar Quiz" : "Novo Quiz"}
            </CardTitle>
            <CardDescription>
              Aula: {selectedLesson?.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título do Quiz *</Label>
                <Input
                  value={quizForm.title}
                  onChange={(e) =>
                    setQuizForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex: Avaliação - Números e Operações"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={quizForm.description}
                  onChange={(e) =>
                    setQuizForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Breve descrição do quiz"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tempo Limite (min)
                </Label>
                <Input
                  type="number"
                  min={5}
                  max={180}
                  value={quizForm.timeLimit}
                  onChange={(e) =>
                    setQuizForm((prev) => ({
                      ...prev,
                      timeLimit: parseInt(e.target.value) || 30,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Nota Mínima (%)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={quizForm.passingScore}
                  onChange={(e) =>
                    setQuizForm((prev) => ({
                      ...prev,
                      passingScore: parseInt(e.target.value) || 60,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  Máx. Tentativas
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quizForm.maxAttempts}
                  onChange={(e) =>
                    setQuizForm((prev) => ({
                      ...prev,
                      maxAttempts: parseInt(e.target.value) || 3,
                    }))
                  }
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  Questões
                  <Badge variant="secondary">{questions.length}</Badge>
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddQuestion("multiple_choice")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Escolha Múltipla
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddQuestion("true_false")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    V/F
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddQuestion("short_answer")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Resp. Curta
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="overflow-hidden">
                      <Collapsible
                        open={expandedQuestions.includes(question.id)}
                        onOpenChange={() => toggleQuestion(question.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="secondary" className="text-xs">
                                Q{index + 1}
                              </Badge>
                              {expandedQuestions.includes(question.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span className="text-sm flex-1 truncate">
                                {question.question || "(Sem enunciado)"}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {getQuestionTypeLabel(question.type)}
                              </Badge>
                              <Badge className="text-xs">{question.points} pts</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestion(question.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="p-4 pt-0 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-3 space-y-2">
                                <Label>Enunciado *</Label>
                                <Textarea
                                  value={question.question}
                                  onChange={(e) =>
                                    handleUpdateQuestion(question.id, {
                                      question: e.target.value,
                                    })
                                  }
                                  placeholder="Digite a pergunta..."
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Pontuação</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={question.points}
                                  onChange={(e) =>
                                    handleUpdateQuestion(question.id, {
                                      points: parseInt(e.target.value) || 10,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            {/* Options for Multiple Choice / True False */}
                            {(question.type === "multiple_choice" ||
                              question.type === "true_false") && (
                              <div className="space-y-2">
                                <Label>Opções (marque a correta)</Label>
                                <div className="space-y-2">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center gap-2"
                                    >
                                      <Button
                                        variant={option.isCorrect ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        onClick={() =>
                                          handleSetCorrectOption(question.id, option.id)
                                        }
                                      >
                                        {option.isCorrect ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          <span className="text-xs">
                                            {String.fromCharCode(65 + optIndex)}
                                          </span>
                                        )}
                                      </Button>
                                      {question.type === "true_false" ? (
                                        <span className="flex-1 text-sm">
                                          {option.text}
                                        </span>
                                      ) : (
                                        <Input
                                          value={option.text}
                                          onChange={(e) =>
                                            handleUpdateOption(
                                              question.id,
                                              option.id,
                                              { text: e.target.value }
                                            )
                                          }
                                          placeholder={`Opção ${String.fromCharCode(
                                            65 + optIndex
                                          )}`}
                                          className="flex-1"
                                        />
                                      )}
                                      {question.type === "multiple_choice" &&
                                        question.options.length > 2 && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() =>
                                              handleDeleteOption(question.id, option.id)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                    </div>
                                  ))}
                                  {question.type === "multiple_choice" &&
                                    question.options.length < 6 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAddOption(question.id)}
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Adicionar Opção
                                      </Button>
                                    )}
                                </div>
                              </div>
                            )}

                            {/* Correct Answer for Short Answer */}
                            {question.type === "short_answer" && (
                              <div className="space-y-2">
                                <Label>Resposta Correta</Label>
                                <Input
                                  value={question.correctAnswer || ""}
                                  onChange={(e) =>
                                    handleUpdateQuestion(question.id, {
                                      correctAnswer: e.target.value,
                                    })
                                  }
                                  placeholder="Resposta esperada"
                                />
                              </div>
                            )}

                            {/* Explanation */}
                            <div className="space-y-2">
                              <Label>Explicação (opcional)</Label>
                              <Textarea
                                value={question.explanation || ""}
                                onChange={(e) =>
                                  handleUpdateQuestion(question.id, {
                                    explanation: e.target.value,
                                  })
                                }
                                placeholder="Explicação para mostrar após responder"
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}

                  {questions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma questão adicionada</p>
                      <p className="text-sm">Use os botões acima para adicionar questões</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleSaveQuiz}>
                <Save className="h-4 w-4 mr-1" />
                {editingQuiz ? "Atualizar Quiz" : "Criar Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Quizzes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Quizzes Criados
          <Badge variant="secondary">{allQuizzes.length}</Badge>
        </h3>

        {allQuizzes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum quiz criado</p>
              <p className="text-sm">Selecione uma aula e crie o primeiro quiz</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {allQuizzes.map((item) => (
              <Card key={item.quiz.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.quiz.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.lessonTitle} • {item.moduleTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p>{item.quiz.questions.length} questões</p>
                        <p className="text-muted-foreground">
                          {item.quiz.timeLimit} min • {item.quiz.passingScore}% mín
                        </p>
                      </div>
                      <Badge variant={item.quiz.isPublished ? "default" : "outline"}>
                        {item.quiz.isPublished ? "Publicado" : "Rascunho"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleToggleQuizPublish(item.moduleId, item.lessonId)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedModuleId(item.moduleId);
                            setSelectedLessonId(item.lessonId);
                            handleEditQuiz(item.quiz);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar Quiz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação irá eliminar o quiz "{item.quiz.title}" e todas
                                as suas questões. Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() =>
                                  handleDeleteQuiz(item.moduleId, item.lessonId)
                                }
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;