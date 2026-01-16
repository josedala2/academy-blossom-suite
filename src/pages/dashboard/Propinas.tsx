import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Receipt,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RegistarPagamentoModal from "@/components/modals/RegistarPagamentoModal";
import GerarRecibosModal from "@/components/modals/GerarRecibosModal";
import EnviarLembretesModal from "@/components/modals/EnviarLembretesModal";
import RelatorioMensalModal from "@/components/modals/RelatorioMensalModal";

const payments = [
  {
    id: 1,
    student: "João Silva",
    class: "10ª A",
    month: "Janeiro 2026",
    amount: "17.500 Kz",
    dueDate: "2026-01-10",
    status: "paid",
    paidDate: "2026-01-08",
    method: "Multicaixa",
  },
  {
    id: 2,
    student: "Ana Ferreira",
    class: "10ª A",
    month: "Janeiro 2026",
    amount: "17.500 Kz",
    dueDate: "2026-01-10",
    status: "pending",
    paidDate: null,
    method: null,
  },
  {
    id: 3,
    student: "Carlos Santos",
    class: "11ª B",
    month: "Janeiro 2026",
    amount: "17.500 Kz",
    dueDate: "2026-01-10",
    status: "overdue",
    paidDate: null,
    method: null,
  },
  {
    id: 4,
    student: "Maria Neto",
    class: "9ª C",
    month: "Janeiro 2026",
    amount: "15.000 Kz",
    dueDate: "2026-01-10",
    status: "paid",
    paidDate: "2026-01-05",
    method: "Transferência",
  },
  {
    id: 5,
    student: "Pedro Costa",
    class: "12ª A",
    month: "Janeiro 2026",
    amount: "20.000 Kz",
    dueDate: "2026-01-10",
    status: "paid",
    paidDate: "2026-01-10",
    method: "Dinheiro",
  },
];

const recentTransactions = [
  { id: 1, student: "João Silva", amount: "17.500 Kz", time: "Há 2 horas", type: "Propina" },
  { id: 2, student: "Maria Neto", amount: "15.000 Kz", time: "Há 5 horas", type: "Propina" },
  { id: 3, student: "Pedro Costa", amount: "20.000 Kz", time: "Ontem", type: "Propina" },
  { id: 4, student: "Luísa Oliveira", amount: "5.000 Kz", time: "Ontem", type: "Material" },
];

const Propinas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false);
  const [isRecibosModalOpen, setIsRecibosModalOpen] = useState(false);
  const [isLembretesModalOpen, setIsLembretesModalOpen] = useState(false);
  const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.student
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Gestão de Propinas
            </h1>
            <p className="text-muted-foreground">
              Pagamentos, cobranças e relatórios financeiros
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setIsPagamentoModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registar Pagamento
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Recebido (Mês)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.540.000 Kz</div>
              <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Pendente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">2.345.000 Kz</div>
              <p className="text-xs text-muted-foreground">134 estudantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Em Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">875.000 Kz</div>
              <p className="text-xs text-muted-foreground">47 estudantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Taxa Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">87%</div>
              <p className="text-xs text-muted-foreground">Meta: 95%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="payments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="overdue">Em Atraso</TabsTrigger>
              </TabsList>

              <TabsContent value="payments" className="space-y-4">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Pesquisar estudante..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full md:w-40">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="overdue">Atraso</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-full md:w-40">
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jan">Janeiro</SelectItem>
                          <SelectItem value="feb">Fevereiro</SelectItem>
                          <SelectItem value="mar">Março</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estudante</TableHead>
                          <TableHead>Turma</TableHead>
                          <TableHead>Mês</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acções</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.student}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{payment.class}</Badge>
                            </TableCell>
                            <TableCell>{payment.month}</TableCell>
                            <TableCell className="font-mono">
                              {payment.amount}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  payment.status === "paid"
                                    ? "border-primary text-primary"
                                    : payment.status === "pending"
                                    ? "border-accent text-accent"
                                    : "border-destructive text-destructive"
                                }
                              >
                                {payment.status === "paid"
                                  ? "Pago"
                                  : payment.status === "pending"
                                  ? "Pendente"
                                  : "Atraso"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {payment.status === "paid" ? (
                                  <Button variant="ghost" size="sm">
                                    <Receipt className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button variant="ghost" size="sm">
                                      <CreditCard className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Pendentes</CardTitle>
                    <CardDescription>
                      Estudantes com propinas por pagar este mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Lista de pagamentos pendentes...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overdue">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos em Atraso</CardTitle>
                    <CardDescription>
                      Estudantes com propinas em atraso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Lista de pagamentos em atraso...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transacções Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{tx.student}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type} • {tx.time}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-medium text-primary">
                      +{tx.amount}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  Ver Todas
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acções Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsRecibosModalOpen(true)}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Gerar Recibos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsLembretesModalOpen(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Lembretes
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsRelatorioModalOpen(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Mensal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Registar Pagamento */}
        <RegistarPagamentoModal
          open={isPagamentoModalOpen}
          onOpenChange={setIsPagamentoModalOpen}
        />

        {/* Modal Gerar Recibos */}
        <GerarRecibosModal
          open={isRecibosModalOpen}
          onOpenChange={setIsRecibosModalOpen}
        />

        {/* Modal Enviar Lembretes */}
        <EnviarLembretesModal
          open={isLembretesModalOpen}
          onOpenChange={setIsLembretesModalOpen}
        />

        {/* Modal Relatório Mensal */}
        <RelatorioMensalModal
          open={isRelatorioModalOpen}
          onOpenChange={setIsRelatorioModalOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Propinas;
