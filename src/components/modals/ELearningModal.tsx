import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
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

const ELearningModal = ({ isOpen, onClose, teacher }: ELearningModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("classes");
  const [isCreating, setIsCreating] = useState(false);
  
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
    },
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
    };

    setOnlineClasses((prev) => [newClass, ...prev]);
    
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
    setIsCreating(false);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            E-Learning - {teacher.name}
          </DialogTitle>
          <DialogDescription>
            Gerir aulas online para as turmas atribuídas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classes">Minhas Aulas</TabsTrigger>
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
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center text-lg`}>
                              {platform.icon}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
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
                              <div className="flex items-center gap-2">
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
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
                      sobre as aulas agendadas, incluindo o link de acesso.
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
                        acesso ao link e receberão notificações sobre esta aula.
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ELearningModal;
