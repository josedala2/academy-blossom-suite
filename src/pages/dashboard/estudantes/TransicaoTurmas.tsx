import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRightLeft,
  GraduationCap,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Save,
  Lock,
  AlertTriangle,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";


type Status = "aprovado" | "reprovado";

interface EstudanteExame {
  id: string;
  nome: string;
  numeroProcesso: string;
  turmaActual: string;
  classeActual: number;
  mediaFinal: number;
  status: Status;
  alocadoEm?: string; // id da nova turma
}

interface NovaTurma {
  id: string;
  nome: string;
  classe: number;
  turno: "manha" | "tarde" | "noite";
  capacidade: number;
}

const ANO_LECTIVO_ANTERIOR = "2024/2025";
const ANO_LECTIVO_NOVO = "2025/2026";
const DATA_LIMITE = new Date("2026-08-31T23:59:59");
const STORAGE_KEY = "transicao-turmas-fechada";


const ESTUDANTES_INICIAIS: EstudanteExame[] = [
  { id: "e1", nome: "Ana Maria Silva", numeroProcesso: "2024-001", turmaActual: "7ª A", classeActual: 7, mediaFinal: 14.5, status: "aprovado" },
  { id: "e2", nome: "Bruno Costa", numeroProcesso: "2024-002", turmaActual: "7ª A", classeActual: 7, mediaFinal: 11.2, status: "aprovado" },
  { id: "e3", nome: "Carla Domingos", numeroProcesso: "2024-003", turmaActual: "7ª A", classeActual: 7, mediaFinal: 8.4, status: "reprovado" },
  { id: "e4", nome: "Daniel Eduardo", numeroProcesso: "2024-004", turmaActual: "7ª B", classeActual: 7, mediaFinal: 16.1, status: "aprovado" },
  { id: "e5", nome: "Esmeralda Fonseca", numeroProcesso: "2024-005", turmaActual: "7ª B", classeActual: 7, mediaFinal: 10.0, status: "aprovado" },
  { id: "e6", nome: "Fábio Garcia", numeroProcesso: "2024-006", turmaActual: "8ª A", classeActual: 8, mediaFinal: 13.7, status: "aprovado" },
  { id: "e7", nome: "Gabriela Henriques", numeroProcesso: "2024-007", turmaActual: "8ª A", classeActual: 8, mediaFinal: 9.1, status: "reprovado" },
  { id: "e8", nome: "Hélder Ivo", numeroProcesso: "2024-008", turmaActual: "8ª A", classeActual: 8, mediaFinal: 12.6, status: "aprovado" },
  { id: "e9", nome: "Isabel Jorge", numeroProcesso: "2024-009", turmaActual: "9ª A", classeActual: 9, mediaFinal: 15.3, status: "aprovado" },
  { id: "e10", nome: "João Kapata", numeroProcesso: "2024-010", turmaActual: "9ª A", classeActual: 9, mediaFinal: 11.8, status: "aprovado" },
];

const TransicaoTurmas = () => {
  const navigate = useNavigate();
  const [estudantes, setEstudantes] = useState<EstudanteExame[]>(ESTUDANTES_INICIAIS);
  const [novasTurmas, setNovasTurmas] = useState<NovaTurma[]>([]);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [filtroClasse, setFiltroClasse] = useState<string>("todas");
  const [busca, setBusca] = useState("");
  const [turmaDestino, setTurmaDestino] = useState<string>("");

  // Nova turma dialog
  const [openNovaTurma, setOpenNovaTurma] = useState(false);
  const [novaTurma, setNovaTurma] = useState<Omit<NovaTurma, "id">>({
    nome: "",
    classe: 8,
    turno: "manha",
    capacidade: 35,
  });

  const aprovadosDisponiveis = useMemo(() => {
    return estudantes.filter((e) => {
      if (e.status !== "aprovado") return false;
      if (e.alocadoEm) return false;
      if (filtroClasse !== "todas" && String(e.classeActual) !== filtroClasse) return false;
      if (busca && !e.nome.toLowerCase().includes(busca.toLowerCase()) && !e.numeroProcesso.includes(busca)) return false;
      return true;
    });
  }, [estudantes, filtroClasse, busca]);

  const reprovados = estudantes.filter((e) => e.status === "reprovado");
  const totalAprovados = estudantes.filter((e) => e.status === "aprovado").length;
  const alocados = estudantes.filter((e) => e.alocadoEm).length;

  const toggleSelecionado = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selecionarTodos = () => {
    if (selecionados.size === aprovadosDisponiveis.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(aprovadosDisponiveis.map((e) => e.id)));
    }
  };

  const criarNovaTurma = () => {
    if (!novaTurma.nome.trim()) {
      toast.error("Indique o nome da nova turma.");
      return;
    }
    const turma: NovaTurma = { ...novaTurma, id: `t-${Date.now()}` };
    setNovasTurmas((prev) => [...prev, turma]);
    setTurmaDestino(turma.id);
    setOpenNovaTurma(false);
    setNovaTurma({ nome: "", classe: 8, turno: "manha", capacidade: 35 });
    toast.success(`Turma "${turma.nome}" criada para ${ANO_LECTIVO_NOVO}.`);
  };

  const alocarSelecionados = () => {
    if (!turmaDestino) {
      toast.error("Seleccione a turma de destino.");
      return;
    }
    if (selecionados.size === 0) {
      toast.error("Seleccione pelo menos um estudante.");
      return;
    }
    const turma = novasTurmas.find((t) => t.id === turmaDestino);
    if (!turma) return;

    const ocupacaoActual = estudantes.filter((e) => e.alocadoEm === turma.id).length;
    if (ocupacaoActual + selecionados.size > turma.capacidade) {
      toast.error(`Capacidade excedida (${turma.capacidade} lugares).`);
      return;
    }

    setEstudantes((prev) =>
      prev.map((e) => (selecionados.has(e.id) ? { ...e, alocadoEm: turma.id } : e))
    );
    toast.success(`${selecionados.size} estudante(s) alocado(s) a "${turma.nome}".`);
    setSelecionados(new Set());
  };

  const removerAlocacao = (estudanteId: string) => {
    setEstudantes((prev) => prev.map((e) => (e.id === estudanteId ? { ...e, alocadoEm: undefined } : e)));
  };

  const confirmarTransicao = () => {
    if (novasTurmas.length === 0) {
      toast.error("Crie pelo menos uma nova turma.");
      return;
    }
    if (alocados === 0) {
      toast.error("Aloque estudantes antes de confirmar.");
      return;
    }
    toast.success(`Transição confirmada: ${alocados} estudante(s) em ${novasTurmas.length} nova(s) turma(s) para ${ANO_LECTIVO_NOVO}.`);
  };

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
                <ArrowRightLeft className="h-6 w-6 text-primary" />
                Transição de Turmas
              </h1>
              <p className="text-muted-foreground">
                Forme novas turmas com estudantes aprovados — {ANO_LECTIVO_ANTERIOR} → {ANO_LECTIVO_NOVO}
              </p>
            </div>
          </div>
          <Button onClick={confirmarTransicao} className="gap-2">
            <Save className="h-4 w-4" /> Confirmar Transição
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Avaliados</p>
              <p className="text-2xl font-bold">{estudantes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold text-primary">{totalAprovados}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Reprovados</p>
              <p className="text-2xl font-bold text-destructive">{reprovados.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Alocados</p>
              <p className="text-2xl font-bold">{alocados}/{totalAprovados}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="aprovados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="aprovados">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Aprovados
            </TabsTrigger>
            <TabsTrigger value="turmas">
              <Users className="h-4 w-4 mr-2" /> Novas Turmas ({novasTurmas.length})
            </TabsTrigger>
            <TabsTrigger value="reprovados">
              <XCircle className="h-4 w-4 mr-2" /> Reprovados
            </TabsTrigger>
          </TabsList>

          {/* APROVADOS */}
          <TabsContent value="aprovados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alocar Estudantes Aprovados</CardTitle>
                <CardDescription>
                  Seleccione os estudantes e atribua-os a uma nova turma do próximo ano lectivo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou nº processo..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filtroClasse} onValueChange={setFiltroClasse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Classe actual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as classes</SelectItem>
                      <SelectItem value="7">7ª Classe</SelectItem>
                      <SelectItem value="8">8ª Classe</SelectItem>
                      <SelectItem value="9">9ª Classe</SelectItem>
                      <SelectItem value="10">10ª Classe</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={turmaDestino} onValueChange={setTurmaDestino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Turma destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {novasTurmas.length === 0 ? (
                        <SelectItem value="vazio" disabled>Crie uma turma primeiro</SelectItem>
                      ) : (
                        novasTurmas.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    {selecionados.size} seleccionado(s) de {aprovadosDisponiveis.length} disponível(eis)
                  </p>
                  <div className="flex gap-2">
                    <Dialog open={openNovaTurma} onOpenChange={setOpenNovaTurma}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" /> Nova Turma
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar Nova Turma — {ANO_LECTIVO_NOVO}</DialogTitle>
                          <DialogDescription>Defina os parâmetros da nova turma.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label>Nome da Turma</Label>
                            <Input
                              placeholder="Ex: 8ª Classe C"
                              value={novaTurma.nome}
                              onChange={(e) => setNovaTurma({ ...novaTurma, nome: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label>Classe</Label>
                              <Select value={String(novaTurma.classe)} onValueChange={(v) => setNovaTurma({ ...novaTurma, classe: Number(v) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {[7, 8, 9, 10, 11, 12].map((c) => (
                                    <SelectItem key={c} value={String(c)}>{c}ª</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Turno</Label>
                              <Select value={novaTurma.turno} onValueChange={(v: any) => setNovaTurma({ ...novaTurma, turno: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="manha">Manhã</SelectItem>
                                  <SelectItem value="tarde">Tarde</SelectItem>
                                  <SelectItem value="noite">Noite</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Capacidade</Label>
                              <Input
                                type="number"
                                min={1}
                                value={novaTurma.capacidade}
                                onChange={(e) => setNovaTurma({ ...novaTurma, capacidade: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenNovaTurma(false)}>Cancelar</Button>
                          <Button onClick={criarNovaTurma}>Criar Turma</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" onClick={alocarSelecionados} disabled={selecionados.size === 0 || !turmaDestino}>
                      Alocar à Turma
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={aprovadosDisponiveis.length > 0 && selecionados.size === aprovadosDisponiveis.length}
                            onCheckedChange={selecionarTodos}
                          />
                        </TableHead>
                        <TableHead>Nº Processo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Turma Actual</TableHead>
                        <TableHead className="text-right">Média Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aprovadosDisponiveis.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Nenhum estudante aprovado disponível.
                          </TableCell>
                        </TableRow>
                      ) : (
                        aprovadosDisponiveis.map((e) => (
                          <TableRow key={e.id} className="cursor-pointer" onClick={() => toggleSelecionado(e.id)}>
                            <TableCell>
                              <Checkbox checked={selecionados.has(e.id)} />
                            </TableCell>
                            <TableCell className="font-mono text-xs">{e.numeroProcesso}</TableCell>
                            <TableCell className="font-medium">{e.nome}</TableCell>
                            <TableCell><Badge variant="outline">{e.turmaActual}</Badge></TableCell>
                            <TableCell className="text-right font-semibold text-primary">{e.mediaFinal.toFixed(1)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOVAS TURMAS */}
          <TabsContent value="turmas" className="space-y-4">
            {novasTurmas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>Nenhuma turma criada. Use o separador "Aprovados" para criar.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {novasTurmas.map((t) => {
                  const membros = estudantes.filter((e) => e.alocadoEm === t.id);
                  return (
                    <Card key={t.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{t.nome}</CardTitle>
                            <CardDescription>
                              {t.classe}ª Classe · Turno {t.turno} · {membros.length}/{t.capacidade}
                            </CardDescription>
                          </div>
                          <Badge variant={membros.length >= t.capacidade ? "destructive" : "default"}>
                            {membros.length >= t.capacidade ? "Cheia" : `${t.capacidade - membros.length} vagas`}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {membros.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Sem estudantes alocados.</p>
                        ) : (
                          <ul className="space-y-1 max-h-60 overflow-y-auto">
                            {membros.map((m) => (
                              <li key={m.id} className="flex items-center justify-between text-sm border-b last:border-0 py-1.5">
                                <span>{m.nome}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removerAlocacao(m.id)}>
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* REPROVADOS */}
          <TabsContent value="reprovados">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estudantes Reprovados</CardTitle>
                <CardDescription>Permanecem na mesma classe — repetem o ano lectivo.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Processo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Turma Actual</TableHead>
                        <TableHead className="text-right">Média Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reprovados.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-mono text-xs">{e.numeroProcesso}</TableCell>
                          <TableCell className="font-medium">{e.nome}</TableCell>
                          <TableCell><Badge variant="outline">{e.turmaActual}</Badge></TableCell>
                          <TableCell className="text-right font-semibold text-destructive">{e.mediaFinal.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TransicaoTurmas;
