import { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Trophy,
  RefreshCw,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Quiz, QuizQuestion, QuizAttempt, getQuestionTypeLabel } from "./types";

interface QuizTakerProps {
  quiz: Quiz;
  studentId: string;
  previousAttempts?: QuizAttempt[];
  onComplete: (attempt: QuizAttempt) => void;
  onClose: () => void;
}

const QuizTaker = ({ quiz, studentId, previousAttempts = [], onComplete, onClose }: QuizTakerProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState((quiz.timeLimit || 30) * 60); // in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const attemptsUsed = previousAttempts.length;
  const canRetake = attemptsUsed < quiz.maxAttempts;
  const bestScore = previousAttempts.length > 0
    ? Math.max(...previousAttempts.map((a) => a.score))
    : null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / quiz.questions.length) * 100;

  // Timer
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = (): { score: number; totalPoints: number; passed: boolean } => {
    let earnedPoints = 0;
    let totalPoints = 0;

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === "multiple_choice" || question.type === "true_false") {
        const correctOption = question.options.find((o) => o.isCorrect);
        if (userAnswer === correctOption?.id) {
          earnedPoints += question.points;
        }
      } else if (question.type === "short_answer") {
        if (
          userAnswer?.toLowerCase().trim() ===
          question.correctAnswer?.toLowerCase().trim()
        ) {
          earnedPoints += question.points;
        }
      }
    }

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    return {
      score: scorePercentage,
      totalPoints,
      passed: scorePercentage >= quiz.passingScore,
    };
  };

  const handleSubmit = () => {
    const { score, totalPoints, passed } = calculateScore();

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      studentId,
      answers,
      score,
      totalPoints,
      passed,
      startedAt: new Date(Date.now() - ((quiz.timeLimit || 30) * 60 - timeRemaining) * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    };

    setResult(attempt);
    setIsCompleted(true);
    setShowSubmitDialog(false);
    onComplete(attempt);

    toast({
      title: passed ? "Parabéns! Quiz concluído!" : "Quiz concluído",
      description: `Obteve ${score}% (${passed ? "Aprovado" : "Reprovado"})`,
      variant: passed ? "default" : "destructive",
    });
  };

  const isQuestionCorrect = (question: QuizQuestion): boolean => {
    const userAnswer = answers[question.id];
    if (question.type === "multiple_choice" || question.type === "true_false") {
      const correctOption = question.options.find((o) => o.isCorrect);
      return userAnswer === correctOption?.id;
    } else if (question.type === "short_answer") {
      return (
        userAnswer?.toLowerCase().trim() ===
        question.correctAnswer?.toLowerCase().trim()
      );
    }
    return false;
  };

  // Start Screen
  if (!isStarted && !isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <CardDescription className="text-base">{quiz.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <ClipboardList className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground">Questões</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <Clock className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{quiz.timeLimit}</p>
              <p className="text-xs text-muted-foreground">Minutos</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <Target className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{quiz.passingScore}%</p>
              <p className="text-xs text-muted-foreground">Nota Mínima</p>
            </div>
          </div>

          {previousAttempts.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-600">Tentativas anteriores</p>
                  <p className="text-sm text-muted-foreground">
                    {attemptsUsed} de {quiz.maxAttempts} tentativas utilizadas
                  </p>
                </div>
                {bestScore !== null && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Melhor nota</p>
                    <p className="text-2xl font-bold text-blue-600">{bestScore}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!canRetake && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Tentativas esgotadas</p>
                <p className="text-sm text-muted-foreground">
                  Já utilizou todas as {quiz.maxAttempts} tentativas permitidas
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Voltar
            </Button>
            <Button
              onClick={() => setIsStarted(true)}
              disabled={!canRetake}
              className="flex-1"
            >
              Iniciar Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results Screen
  if (isCompleted && result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div
            className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4 ${
              result.passed
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {result.passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Parabéns!" : "Quiz Concluído"}
          </CardTitle>
          <CardDescription className="text-base">
            {result.passed
              ? "Você foi aprovado neste quiz!"
              : "Não atingiu a nota mínima. Tente novamente!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p
              className={`text-6xl font-bold ${
                result.passed ? "text-green-500" : "text-destructive"
              }`}
            >
              {result.score}%
            </p>
            <p className="text-muted-foreground">
              Nota mínima: {quiz.passingScore}%
            </p>
          </div>

          <Progress
            value={result.score}
            className={`h-3 ${result.passed ? "[&>div]:bg-green-500" : ""}`}
          />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">
                {quiz.questions.filter((q) => isQuestionCorrect(q)).length}
              </p>
              <p className="text-xs text-muted-foreground">Corretas</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold">
                {quiz.questions.filter((q) => !isQuestionCorrect(q)).length}
              </p>
              <p className="text-xs text-muted-foreground">Incorretas</p>
            </div>
          </div>

          {/* Show explanations */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowExplanations(!showExplanations)}
          >
            {showExplanations ? "Ocultar" : "Ver"} Correção
          </Button>

          {showExplanations && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {quiz.questions.map((question, index) => {
                const isCorrect = isQuestionCorrect(question);
                const userAnswer = answers[question.id];
                
                return (
                  <Card
                    key={question.id}
                    className={`${
                      isCorrect ? "border-green-500/30" : "border-destructive/30"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCorrect
                              ? "bg-green-500/10 text-green-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {index + 1}. {question.question}
                          </p>
                          {(question.type === "multiple_choice" ||
                            question.type === "true_false") && (
                            <div className="mt-2 space-y-1">
                              {question.options.map((opt) => (
                                <p
                                  key={opt.id}
                                  className={`text-sm ${
                                    opt.isCorrect
                                      ? "text-green-600 font-medium"
                                      : userAnswer === opt.id
                                      ? "text-destructive line-through"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {opt.isCorrect && "✓ "}
                                  {opt.text}
                                </p>
                              ))}
                            </div>
                          )}
                          {question.type === "short_answer" && (
                            <div className="mt-2 text-sm">
                              <p className="text-muted-foreground">
                                Sua resposta: {userAnswer || "(vazio)"}
                              </p>
                              <p className="text-green-600 font-medium">
                                Resposta correta: {question.correctAnswer}
                              </p>
                            </div>
                          )}
                          {question.explanation && (
                            <p className="mt-2 text-sm text-muted-foreground italic">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Voltar às Aulas
            </Button>
            {canRetake && attemptsUsed < quiz.maxAttempts && (
              <Button
                onClick={() => {
                  setIsStarted(false);
                  setIsCompleted(false);
                  setAnswers({});
                  setResult(null);
                  setTimeRemaining((quiz.timeLimit || 30) * 60);
                  setCurrentQuestionIndex(0);
                }}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz in Progress
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header with timer */}
      <Card className="sticky top-0 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Respondidas</p>
                <p className="font-medium">
                  {answeredCount}/{quiz.questions.length}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 60
                    ? "bg-destructive/10 text-destructive"
                    : timeRemaining < 300
                    ? "bg-orange-500/10 text-orange-600"
                    : "bg-muted"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{getQuestionTypeLabel(currentQuestion.type)}</Badge>
            <Badge>{currentQuestion.points} pontos</Badge>
          </div>
          <CardTitle className="text-lg mt-3">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Choice / True False */}
          {(currentQuestion.type === "multiple_choice" ||
            currentQuestion.type === "true_false") && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    answers[currentQuestion.id] === option.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Short Answer */}
          {currentQuestion.type === "short_answer" && (
            <Input
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Digite sua resposta..."
              className="text-lg p-4"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="flex gap-1">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                currentQuestionIndex === index
                  ? "bg-primary text-primary-foreground"
                  : answers[quiz.questions[index].id]
                  ? "bg-green-500/20 text-green-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowSubmitDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Submeter
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submeter Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {answeredCount < quiz.questions.length ? (
                <span className="text-orange-600">
                  Atenção: Respondeu apenas {answeredCount} de {quiz.questions.length}{" "}
                  questões.
                </span>
              ) : (
                "Tem a certeza que deseja submeter? Esta ação não pode ser desfeita."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rever Respostas</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submeter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizTaker;