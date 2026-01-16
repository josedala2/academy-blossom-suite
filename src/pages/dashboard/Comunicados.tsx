import { useState } from "react";
import {
  Search,
  Plus,
  Send,
  Bell,
  Mail,
  MessageSquare,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";

const announcements = [
  {
    id: 1,
    title: "Reunião de Pais e Encarregados - 10ª Classe",
    content: "Informamos que a reunião de pais e encarregados da 10ª classe está agendada para o dia 20 de Janeiro às 14h00 no Anfiteatro Principal.",
    author: "Direção Pedagógica",
    date: "2026-01-15",
    target: "10ª Classe",
    status: "published",
    pinned: true,
    views: 234,
  },
  {
    id: 2,
    title: "Calendário de Exames - 1º Trimestre",
    content: "O calendário de exames do 1º trimestre já está disponível. Consulte no portal do estudante ou na secretaria.",
    author: "Secretaria",
    date: "2026-01-14",
    target: "Todos",
    status: "published",
    pinned: false,
    views: 567,
  },
  {
    id: 3,
    title: "Pagamento de Propinas - Janeiro",
    content: "Lembramos que o prazo para pagamento das propinas de Janeiro termina no dia 10. Evite multas e regularize a sua situação.",
    author: "Contabilidade",
    date: "2026-01-05",
    target: "Encarregados",
    status: "published",
    pinned: false,
    views: 445,
  },
  {
    id: 4,
    title: "Feriado Municipal - 25 de Janeiro",
    content: "Informamos que não haverá aulas no dia 25 de Janeiro devido ao feriado municipal.",
    author: "Direção",
    date: "2026-01-20",
    target: "Todos",
    status: "scheduled",
    pinned: false,
    views: 0,
  },
];

const messages = [
  {
    id: 1,
    from: "Maria Silva (Enc. João Silva)",
    subject: "Justificação de Faltas",
    preview: "Bom dia, venho por este meio justificar as faltas do meu educando...",
    date: "2026-01-16 09:30",
    read: false,
  },
  {
    id: 2,
    from: "Prof. António Fernandes",
    subject: "Sobre aluno Carlos Santos",
    preview: "Gostaria de informar sobre o comportamento do aluno nas últimas aulas...",
    date: "2026-01-15 14:22",
    read: true,
  },
  {
    id: 3,
    from: "Pedro Costa (Enc. Ana Costa)",
    subject: "Pedido de Declaração",
    preview: "Solicito uma declaração de matrícula para efeitos de...",
    date: "2026-01-15 11:45",
    read: true,
  },
];

const Comunicados = () => {
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Comunicados e Mensagens
            </h1>
            <p className="text-muted-foreground">
              Avisos, comunicados e mensagens internas
            </p>
          </div>
          <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Comunicado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Comunicado</DialogTitle>
                <DialogDescription>
                  Preencha os campos para criar um novo comunicado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input placeholder="Título do comunicado" />
                </div>
                <div className="space-y-2">
                  <Label>Destinatários</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="students">Estudantes</SelectItem>
                      <SelectItem value="guardians">Encarregados</SelectItem>
                      <SelectItem value="teachers">Professores</SelectItem>
                      <SelectItem value="10a">10ª Classe</SelectItem>
                      <SelectItem value="11a">11ª Classe</SelectItem>
                      <SelectItem value="12a">12ª Classe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea
                    placeholder="Escreva o conteúdo do comunicado..."
                    rows={6}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Data de Publicação</Label>
                    <Input type="datetime-local" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAnnouncementOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsNewAnnouncementOpen(false)}>
                  <Send className="h-4 w-4 mr-2" />
                  Publicar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Comunicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">156</div>
              <p className="text-xs text-muted-foreground">12 não lidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alcance Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,892</div>
              <p className="text-xs text-muted-foreground">Visualizações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">3</div>
              <p className="text-xs text-muted-foreground">Comunicados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              Comunicados
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagens
              <Badge variant="secondary" className="ml-2">12</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Pesquisar comunicados..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="published">Publicados</SelectItem>
                      <SelectItem value="scheduled">Agendados</SelectItem>
                      <SelectItem value="draft">Rascunhos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={announcement.pinned ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {announcement.pinned && (
                          <Pin className="h-5 w-5 text-primary mt-0.5" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span>{announcement.author}</span>
                            <span>•</span>
                            <span>{new Date(announcement.date).toLocaleDateString("pt-AO")}</span>
                            <span>•</span>
                            <Badge variant="outline">{announcement.target}</Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={announcement.status === "published" ? "default" : "secondary"}
                          className={
                            announcement.status === "published"
                              ? "bg-primary/10 text-primary"
                              : ""
                          }
                        >
                          {announcement.status === "published" ? "Publicado" : "Agendado"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pin className="h-4 w-4 mr-2" />
                              {announcement.pinned ? "Desafixar" : "Fixar"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{announcement.content}</p>
                    {announcement.status === "published" && (
                      <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {announcement.views} visualizações
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Caixa de Entrada</CardTitle>
                <CardDescription>Mensagens recebidas de encarregados e professores</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !message.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!message.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                            <p className={`font-medium truncate ${!message.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {message.from}
                            </p>
                          </div>
                          <p className="font-medium text-sm mt-1">{message.subject}</p>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {message.preview}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {message.date.split(" ")[1]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Comunicados;
