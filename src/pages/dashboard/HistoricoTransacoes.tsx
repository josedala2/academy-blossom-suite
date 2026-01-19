import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowLeft,
  ArrowUpDown,
  Receipt,
  CreditCard,
  Banknote,
  Building2,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Transaction {
  id: number;
  student: string;
  class: string;
  type: string;
  amount: string;
  date: string;
  status: string;
  method: string;
  reference: string;
  description: string;
}

const allTransactions: Transaction[] = [
  {
    id: 1,
    student: "João Silva",
    class: "10ª A",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2026-01-08",
    status: "paid",
    method: "Multicaixa",
    reference: "TRX-2026-0001",
    description: "Propina Janeiro 2026",
  },
  {
    id: 2,
    student: "Maria Neto",
    class: "9ª C",
    type: "Propina",
    amount: "15.000 Kz",
    date: "2026-01-05",
    status: "paid",
    method: "Transferência",
    reference: "TRX-2026-0002",
    description: "Propina Janeiro 2026",
  },
  {
    id: 3,
    student: "Pedro Costa",
    class: "12ª A",
    type: "Propina",
    amount: "20.000 Kz",
    date: "2026-01-10",
    status: "paid",
    method: "Dinheiro",
    reference: "TRX-2026-0003",
    description: "Propina Janeiro 2026",
  },
  {
    id: 4,
    student: "Luísa Oliveira",
    class: "11ª B",
    type: "Material",
    amount: "5.000 Kz",
    date: "2026-01-09",
    status: "paid",
    method: "Multicaixa",
    reference: "TRX-2026-0004",
    description: "Material Escolar",
  },
  {
    id: 5,
    student: "Ana Ferreira",
    class: "10ª A",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2025-12-20",
    status: "paid",
    method: "Transferência",
    reference: "TRX-2025-0098",
    description: "Propina Dezembro 2025",
  },
  {
    id: 6,
    student: "Carlos Santos",
    class: "11ª B",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2025-12-18",
    status: "paid",
    method: "Dinheiro",
    reference: "TRX-2025-0097",
    description: "Propina Dezembro 2025",
  },
  {
    id: 7,
    student: "Miguel Andrade",
    class: "9ª A",
    type: "Matrícula",
    amount: "25.000 Kz",
    date: "2025-12-15",
    status: "paid",
    method: "Multicaixa",
    reference: "TRX-2025-0096",
    description: "Matrícula 2026",
  },
  {
    id: 8,
    student: "Sofia Mendes",
    class: "10ª B",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2025-12-12",
    status: "refunded",
    method: "Transferência",
    reference: "TRX-2025-0095",
    description: "Propina Dezembro 2025 - Reembolsado",
  },
  {
    id: 9,
    student: "Rita Lopes",
    class: "12ª B",
    type: "Material",
    amount: "8.500 Kz",
    date: "2025-12-10",
    status: "paid",
    method: "Dinheiro",
    reference: "TRX-2025-0094",
    description: "Livros e Material",
  },
  {
    id: 10,
    student: "Bruno Almeida",
    class: "11ª A",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2025-12-08",
    status: "paid",
    method: "Multicaixa",
    reference: "TRX-2025-0093",
    description: "Propina Dezembro 2025",
  },
  {
    id: 11,
    student: "Teresa Campos",
    class: "9ª B",
    type: "Propina",
    amount: "15.000 Kz",
    date: "2025-12-05",
    status: "paid",
    method: "Transferência",
    reference: "TRX-2025-0092",
    description: "Propina Dezembro 2025",
  },
  {
    id: 12,
    student: "André Martins",
    class: "10ª C",
    type: "Seguro",
    amount: "3.000 Kz",
    date: "2025-12-03",
    status: "paid",
    method: "Dinheiro",
    reference: "TRX-2025-0091",
    description: "Seguro Escolar 2026",
  },
  {
    id: 13,
    student: "Inês Rodrigues",
    class: "12ª A",
    type: "Propina",
    amount: "20.000 Kz",
    date: "2025-11-28",
    status: "paid",
    method: "Multicaixa",
    reference: "TRX-2025-0090",
    description: "Propina Novembro 2025",
  },
  {
    id: 14,
    student: "Diogo Pereira",
    class: "11ª C",
    type: "Propina",
    amount: "17.500 Kz",
    date: "2025-11-25",
    status: "cancelled",
    method: "Transferência",
    reference: "TRX-2025-0089",
    description: "Propina Novembro 2025 - Cancelado",
  },
  {
    id: 15,
    student: "Beatriz Sousa",
    class: "9ª A",
    type: "Material",
    amount: "12.000 Kz",
    date: "2025-11-20",
    status: "paid",
    method: "Dinheiro",
    reference: "TRX-2025-0088",
    description: "Uniforme Escolar",
  },
];

const ITEMS_PER_PAGE = 8;

const HistoricoTransacoes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Pago</Badge>;
      case "refunded":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Reembolsado</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Multicaixa":
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
      case "Transferência":
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
      case "Dinheiro":
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Receipt className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((tx) => {
        const matchesSearch =
          tx.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || tx.status === selectedStatus;
        const matchesType = selectedType === "all" || tx.type === selectedType;
        const matchesMethod = selectedMethod === "all" || tx.method === selectedMethod;
        const matchesClass = selectedClass === "all" || tx.class === selectedClass;
        
        const txDate = new Date(tx.date);
        const matchesDateFrom = !dateFrom || txDate >= dateFrom;
        const matchesDateTo = !dateTo || txDate <= dateTo;

        return matchesSearch && matchesStatus && matchesType && matchesMethod && matchesClass && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortField === "date") {
          const dateA = new Date(aValue as string).getTime();
          const dateB = new Date(bValue as string).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
  }, [searchTerm, selectedStatus, selectedType, selectedMethod, selectedClass, dateFrom, dateTo, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedMethod("all");
    setSelectedClass("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedStatus !== "all" ||
    selectedType !== "all" ||
    selectedMethod !== "all" ||
    selectedClass !== "all" ||
    dateFrom ||
    dateTo;

  const uniqueClasses = [...new Set(allTransactions.map((tx) => tx.class))].sort();

  const totalAmount = filteredTransactions
    .filter((tx) => tx.status === "paid")
    .reduce((sum, tx) => {
      const amount = parseFloat(tx.amount.replace(/[^\d]/g, ""));
      return sum + amount;
    }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/propinas")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Histórico de Transacções</h1>
              <p className="text-muted-foreground">
                Visualize todas as transacções financeiras
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Filtrado</div>
              <div className="text-2xl font-bold text-primary">
                {totalAmount.toLocaleString("pt-AO")} Kz
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {filteredTransactions.filter((tx) => tx.status === "paid").length} transacções pagas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total de Registos</div>
              <div className="text-2xl font-bold">{filteredTransactions.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                de {allTransactions.length} transacções
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Página Actual</div>
              <div className="text-2xl font-bold">
                {currentPage} de {totalPages || 1}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {ITEMS_PER_PAGE} itens por página
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Propina">Propina</SelectItem>
                  <SelectItem value="Matrícula">Matrícula</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Seguro">Seguro</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedMethod}
                onValueChange={(value) => {
                  setSelectedMethod(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Métodos</SelectItem>
                  <SelectItem value="Multicaixa">Multicaixa</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: pt }) : "Data Inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      setDateFrom(date);
                      setCurrentPage(1);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: pt }) : "Data Final"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      setDateTo(date);
                      setCurrentPage(1);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("reference")}
                    >
                      Referência
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("student")}
                    >
                      Estudante
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("type")}
                    >
                      Tipo
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("date")}
                    >
                      Data
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma transacção encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tx.student}</p>
                          <p className="text-xs text-muted-foreground">{tx.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{tx.class}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(tx.date), "dd/MM/yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(tx.method)}
                          <span className="text-sm">{tx.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {tx.amount}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Receipt className="h-4 w-4 mr-2" />
                              Ver Recibo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Descarregar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoricoTransacoes;
