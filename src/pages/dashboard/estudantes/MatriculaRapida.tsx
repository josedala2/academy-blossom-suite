import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  FileText
} from "lucide-react";
import { jsPDF } from "jspdf";
import logoSGE from "@/assets/logo-sge.png";

// Período oficial de matrículas (configurável)
const PERIODO_MATRICULAS = {
  inicio: new Date("2025-08-01T00:00:00"),
  fim: new Date("2025-10-31T23:59:59"),
  anoLectivo: "2025/2026",
};

interface DadosMatricula {
  // Dados do Estudante
  nomeCompleto: string;
  dataNascimento: string;
  genero: string;
  nacionalidade: string;
  documentoIdentidade: string;
  
  // Contacto
  telefone: string;
  email: string;
  endereco: string;
  
  // Dados Académicos
  turma: string;
  anoLectivo: string;
  turno: string;
  
  // Encarregado de Educação
  nomeEncarregado: string;
  parentesco: string;
  telefoneEncarregado: string;
  emailEncarregado: string;
}

const MatriculaRapida = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState<DadosMatricula>({
    nomeCompleto: "",
    dataNascimento: "",
    genero: "",
    nacionalidade: "Angolana",
    documentoIdentidade: "",
    telefone: "",
    email: "",
    endereco: "",
    turma: "",
    anoLectivo: "2024/2025",
    turno: "",
    nomeEncarregado: "",
    parentesco: "",
    telefoneEncarregado: "",
    emailEncarregado: "",
  });

  const handleInputChange = (field: keyof DadosMatricula, value: string) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const dentroDoPeriodo = () => {
    const hoje = new Date();
    return hoje >= PERIODO_MATRICULAS.inicio && hoje <= PERIODO_MATRICULAS.fim;
  };

  const gerarComprovativoPDF = (numeroMatricula: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    try {
      doc.addImage(logoSGE, "PNG", 15, 12, 20, 20);
    } catch (e) { /* ignore */ }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("COMPROVATIVO DE MATRÍCULA", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema de Gestão Escolar", pageWidth / 2, 27, { align: "center" });
    doc.text(`Ano Lectivo ${dados.anoLectivo}`, pageWidth / 2, 33, { align: "center" });

    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.8);
    doc.line(15, 40, pageWidth - 15, 40);

    // Nº matrícula
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Nº Matrícula: ${numeroMatricula}`, 15, 50);
    doc.text(`Data: ${new Date().toLocaleString("pt-PT")}`, pageWidth - 15, 50, { align: "right" });

    // Dados do Estudante
    let y = 62;
    const linha = (label: string, valor: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(valor || "—", 70, y);
      y += 7;
    };

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO ESTUDANTE", 15, y); y += 7;
    doc.setFontSize(10);
    linha("Nome Completo", dados.nomeCompleto);
    linha("Data de Nascimento", dados.dataNascimento);
    linha("Género", dados.genero === "M" ? "Masculino" : dados.genero === "F" ? "Feminino" : "");
    linha("Nacionalidade", dados.nacionalidade);
    linha("Documento", dados.documentoIdentidade);
    linha("Telefone", dados.telefone);
    linha("Email", dados.email);
    linha("Endereço", dados.endereco);

    y += 4;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS ACADÉMICOS", 15, y); y += 7;
    doc.setFontSize(10);
    linha("Ano Lectivo", dados.anoLectivo);
    linha("Turma", dados.turma);
    linha("Turno", dados.turno);

    y += 4;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ENCARREGADO DE EDUCAÇÃO", 15, y); y += 7;
    doc.setFontSize(10);
    linha("Nome", dados.nomeEncarregado);
    linha("Parentesco", dados.parentesco);
    linha("Telefone", dados.telefoneEncarregado);
    linha("Email", dados.emailEncarregado);

    // Rodapé
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(150);
    doc.setLineWidth(0.3);
    doc.line(15, pageHeight - 35, pageWidth - 15, pageHeight - 35);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Este documento é válido como comprovativo provisório de matrícula.",
      pageWidth / 2, pageHeight - 28, { align: "center" }
    );
    doc.text("________________________________", pageWidth - 15, pageHeight - 18, { align: "right" });
    doc.text("Secretaria", pageWidth - 35, pageHeight - 13, { align: "right" });

    doc.save(`Comprovativo-Matricula-${numeroMatricula}.pdf`);
  };

  const handleSubmit = () => {
    if (!dados.nomeCompleto || !dados.dataNascimento || !dados.turma) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!dentroDoPeriodo()) {
      toast.error("Fora do período de matrículas", {
        description: `As matrículas decorrem de ${PERIODO_MATRICULAS.inicio.toLocaleDateString("pt-PT")} a ${PERIODO_MATRICULAS.fim.toLocaleDateString("pt-PT")}.`,
      });
      return;
    }

    const numeroMatricula = `MAT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;

    gerarComprovativoPDF(numeroMatricula);

    toast.success("Matrícula realizada com sucesso!", {
      description: `${dados.nomeCompleto} matriculado(a) na turma ${dados.turma}. Comprovativo ${numeroMatricula} descarregado.`,
    });

    setDados({
      nomeCompleto: "", dataNascimento: "", genero: "", nacionalidade: "Angolana",
      documentoIdentidade: "", telefone: "", email: "", endereco: "",
      turma: "", anoLectivo: PERIODO_MATRICULAS.anoLectivo, turno: "",
      nomeEncarregado: "", parentesco: "", telefoneEncarregado: "", emailEncarregado: "",
    });
    setEtapa(1);
  };

  const turmasDisponiveis = [
    { id: "7A", nome: "7ª Classe A", vagas: 5 },
    { id: "7B", nome: "7ª Classe B", vagas: 3 },
    { id: "8A", nome: "8ª Classe A", vagas: 8 },
    { id: "8B", nome: "8ª Classe B", vagas: 2 },
    { id: "9A", nome: "9ª Classe A", vagas: 10 },
    { id: "10A", nome: "10ª Classe A", vagas: 7 },
    { id: "11A", nome: "11ª Classe A", vagas: 4 },
    { id: "12A", nome: "12ª Classe A", vagas: 6 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/estudantes")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" />
                Matrícula Rápida
              </h1>
              <p className="text-muted-foreground">
                Processo simplificado de matrícula de novos estudantes
              </p>
            </div>
          </div>
          
          {/* Indicador de Etapas */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    etapa >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {etapa > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 ${etapa > step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Período de Matrículas */}
        <Card className={dentroDoPeriodo() ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"}>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Calendar className={`h-5 w-5 ${dentroDoPeriodo() ? "text-primary" : "text-destructive"}`} />
              <div>
                <p className="text-sm font-semibold">
                  Período Oficial de Matrículas — Ano Lectivo {PERIODO_MATRICULAS.anoLectivo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {PERIODO_MATRICULAS.inicio.toLocaleDateString("pt-PT")} até {PERIODO_MATRICULAS.fim.toLocaleDateString("pt-PT")}
                </p>
              </div>
            </div>
            <Badge variant={dentroDoPeriodo() ? "default" : "destructive"}>
              {dentroDoPeriodo() ? "Matrículas Abertas" : "Matrículas Encerradas"}
            </Badge>
          </CardContent>
        </Card>

        {/* Etapa 1: Dados Pessoais */}

        {etapa === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais do Estudante
              </CardTitle>
              <CardDescription>
                Preencha os dados de identificação do estudante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Nome completo do estudante"
                    value={dados.nomeCompleto}
                    onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dados.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="genero">Género *</Label>
                  <Select value={dados.genero} onValueChange={(v) => handleInputChange("genero", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nacionalidade">Nacionalidade</Label>
                  <Input
                    id="nacionalidade"
                    value={dados.nacionalidade}
                    onChange={(e) => handleInputChange("nacionalidade", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="documentoIdentidade">Nº Documento de Identidade</Label>
                  <Input
                    id="documentoIdentidade"
                    placeholder="BI ou Cédula"
                    value={dados.documentoIdentidade}
                    onChange={(e) => handleInputChange("documentoIdentidade", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Telefone
                  </Label>
                  <Input
                    id="telefone"
                    placeholder="+244 9XX XXX XXX"
                    value={dados.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={dados.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="endereco" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Endereço
                  </Label>
                  <Input
                    id="endereco"
                    placeholder="Morada completa"
                    value={dados.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setEtapa(2)}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa 2: Dados Académicos */}
        {etapa === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Dados Académicos
              </CardTitle>
              <CardDescription>
                Seleccione a turma e turno do estudante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="anoLectivo" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Ano Lectivo
                  </Label>
                  <Select value={dados.anoLectivo} onValueChange={(v) => handleInputChange("anoLectivo", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="turma">Turma *</Label>
                  <Select value={dados.turma} onValueChange={(v) => handleInputChange("turma", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmasDisponiveis.map((turma) => (
                        <SelectItem key={turma.id} value={turma.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{turma.nome}</span>
                            <Badge variant={turma.vagas > 5 ? "default" : turma.vagas > 0 ? "secondary" : "destructive"}>
                              {turma.vagas} vagas
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="turno">Turno *</Label>
                  <Select value={dados.turno} onValueChange={(v) => handleInputChange("turno", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEtapa(1)}>
                  Voltar
                </Button>
                <Button onClick={() => setEtapa(3)}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa 3: Encarregado de Educação */}
        {etapa === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Encarregado de Educação
              </CardTitle>
              <CardDescription>
                Dados do responsável pelo estudante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nomeEncarregado">Nome Completo *</Label>
                  <Input
                    id="nomeEncarregado"
                    placeholder="Nome do encarregado de educação"
                    value={dados.nomeEncarregado}
                    onChange={(e) => handleInputChange("nomeEncarregado", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="parentesco">Parentesco</Label>
                  <Select value={dados.parentesco} onValueChange={(v) => handleInputChange("parentesco", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Grau de parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="avo">Avó/Avô</SelectItem>
                      <SelectItem value="tio">Tio/Tia</SelectItem>
                      <SelectItem value="tutor">Tutor Legal</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="telefoneEncarregado" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Telefone *
                  </Label>
                  <Input
                    id="telefoneEncarregado"
                    placeholder="+244 9XX XXX XXX"
                    value={dados.telefoneEncarregado}
                    onChange={(e) => handleInputChange("telefoneEncarregado", e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="emailEncarregado" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="emailEncarregado"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={dados.emailEncarregado}
                    onChange={(e) => handleInputChange("emailEncarregado", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Resumo */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resumo da Matrícula
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Estudante</p>
                    <p className="font-medium">{dados.nomeCompleto || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Nascimento</p>
                    <p className="font-medium">{dados.dataNascimento || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turma</p>
                    <p className="font-medium">{dados.turma || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Encarregado</p>
                    <p className="font-medium">{dados.nomeEncarregado || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEtapa(2)}>
                  Voltar
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <Save className="h-4 w-4" />
                  Finalizar Matrícula
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MatriculaRapida;