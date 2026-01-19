import { useState, useRef } from "react";
import {
  Settings,
  User,
  School,
  Bell,
  Lock,
  CreditCard,
  Users,
  Calendar,
  Shield,
  Save,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Configuracoes = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Por favor seleccione um ficheiro de imagem (PNG, JPG, SVG)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ficheiro muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Logotipo carregado",
      description: "Clique em 'Guardar Logotipo' para aplicar as alterações",
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Logotipo removido",
      description: "O logotipo foi removido com sucesso",
    });
  };

  const handleSaveLogo = () => {
    if (!logoFile) {
      toast({
        title: "Nenhum logotipo seleccionado",
        description: "Por favor seleccione um logotipo primeiro",
        variant: "destructive",
      });
      return;
    }

    // Here you would upload to storage
    toast({
      title: "Logotipo guardado",
      description: "O logotipo foi actualizado com sucesso",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerir configurações do sistema e preferências
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="school">
              <School className="h-4 w-4 mr-2" />
              Escola
            </TabsTrigger>
            <TabsTrigger value="academic">
              <Calendar className="h-4 w-4 mr-2" />
              Académico
            </TabsTrigger>
            <TabsTrigger value="financial">
              <CreditCard className="h-4 w-4 mr-2" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilizadores
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* School Settings */}
          <TabsContent value="school">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Escola</CardTitle>
                  <CardDescription>
                    Dados gerais da instituição de ensino
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Escola</Label>
                    <Input defaultValue="Escola Secundária Nº 1 de Luanda" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NIF</Label>
                      <Input defaultValue="5000123456" />
                    </div>
                    <div className="space-y-2">
                      <Label>Código INAGBE</Label>
                      <Input defaultValue="ESL001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Morada</Label>
                    <Textarea defaultValue="Rua Major Kanhangulo, nº 45, Maianga, Luanda" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input defaultValue="+244 923 456 789" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="geral@escola.ao" />
                    </div>
                  </div>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Alterações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logotipo e Identidade</CardTitle>
                  <CardDescription>
                    Personalize a aparência do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logotipo</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    
                    {logoPreview ? (
                      <div className="space-y-4">
                        <div className="relative border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-center justify-center">
                            <img 
                              src={logoPreview} 
                              alt="Preview do logotipo" 
                              className="max-h-32 max-w-full object-contain"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive/10 hover:bg-destructive/20"
                            onClick={handleRemoveLogo}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Alterar
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={handleSaveLogo}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Logotipo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                          isDragging 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Arraste uma imagem ou clique para selecionar
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG ou SVG (máx. 5MB)
                          </p>
                          <Button variant="outline" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar Ficheiro
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Principal</Label>
                    <div className="flex gap-2">
                      <Input type="color" defaultValue="#2E7D32" className="w-16 h-10" />
                      <Input defaultValue="#2E7D32" className="flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Settings */}
          <TabsContent value="academic">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ano Lectivo</CardTitle>
                  <CardDescription>
                    Configurações do ano lectivo actual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ano Lectivo</Label>
                      <Select defaultValue="2025-2026">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025-2026">2025/2026</SelectItem>
                          <SelectItem value="2024-2025">2024/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Período Actual</Label>
                      <Select defaultValue="1tri">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1tri">1º Trimestre</SelectItem>
                          <SelectItem value="2tri">2º Trimestre</SelectItem>
                          <SelectItem value="3tri">3º Trimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Início</Label>
                      <Input type="date" defaultValue="2025-09-01" />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Fim</Label>
                      <Input type="date" defaultValue="2026-07-15" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Critérios de Avaliação</CardTitle>
                  <CardDescription>
                    Configurar notas e aprovação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nota Mínima Aprovação</Label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nota Máxima</Label>
                      <Input type="number" defaultValue="20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>% Máximo de Faltas</Label>
                    <Input type="number" defaultValue="25" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Escala de Notas</Label>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="p-2 rounded bg-primary/10 text-center">
                        <p className="font-medium">Excelente</p>
                        <p className="text-muted-foreground">18-20</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/10 text-center">
                        <p className="font-medium">Bom</p>
                        <p className="text-muted-foreground">14-17</p>
                      </div>
                      <div className="p-2 rounded bg-accent/10 text-center">
                        <p className="font-medium">Suficiente</p>
                        <p className="text-muted-foreground">10-13</p>
                      </div>
                      <div className="p-2 rounded bg-destructive/10 text-center">
                        <p className="font-medium">Insuficiente</p>
                        <p className="text-muted-foreground">0-9</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Settings */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Propinas</CardTitle>
                <CardDescription>
                  Valores e prazos de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Propina Base (Kz)</Label>
                    <Input type="number" defaultValue="17500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dia de Vencimento</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Multa por Atraso (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Métodos de Pagamento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span>Dinheiro</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span>Transferência</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span>Multicaixa</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span>Online</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Settings */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Utilizadores</CardTitle>
                <CardDescription>
                  Administrar perfis e permissões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {[
                    { nome: "Admin Principal", email: "admin@sge.ao", perfil: "Administrador", estado: "Activo" },
                    { nome: "Maria Fernandes", email: "m.fernandes@sge.ao", perfil: "Secretária", estado: "Activo" },
                    { nome: "João Cardoso", email: "j.cardoso@sge.ao", perfil: "Professor", estado: "Activo" },
                    { nome: "Ana Neto", email: "a.neto@sge.ao", perfil: "Coordenador", estado: "Inactivo" },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.nome}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs rounded ${user.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {user.estado}
                        </span>
                        <span className="text-sm text-muted-foreground">{user.perfil}</span>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Utilizador
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configurar alertas e notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Receber alertas por email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Receber alertas por SMS
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segurança da Conta</CardTitle>
                  <CardDescription>
                    Proteja a sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação de 2 Factores</p>
                      <p className="text-sm text-muted-foreground">
                        Adicionar camada extra de segurança
                      </p>
                    </div>
                    <Switch
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                    />
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Alterar Palavra-passe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
