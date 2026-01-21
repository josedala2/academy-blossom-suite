import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Search,
  ArrowLeft,
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Clock,
  RefreshCw,
  Download,
  GraduationCap,
  Users,
  Briefcase,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface VerificationLog {
  id: string;
  pass_id: string;
  pass_number: string | null;
  person_name: string | null;
  person_type: string | null;
  verification_status: string;
  verification_code: string;
  ip_address: string | null;
  user_agent: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  location_name: string | null;
  verified_at: string;
  created_at: string;
}

const HistoricoVerificacoes = () => {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pass_verification_logs")
        .select("*")
        .order("verified_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar histórico de verificações");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.pass_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.pass_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.location_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "todos" || log.verification_status === statusFilter;
    const matchesTipo = tipoFilter === "todos" || log.person_type === tipoFilter;
    const matchesDate = !dateFilter || log.verified_at.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesTipo && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: typeof CheckCircle2; label: string; className: string }> = {
      valid: { icon: CheckCircle2, label: "Válido", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      expired: { icon: AlertCircle, label: "Expirado", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      invalid: { icon: XCircle, label: "Inválido", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      error: { icon: AlertCircle, label: "Erro", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    };
    const { icon: Icon, label, className } = config[status] || config.error;
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: string | null) => {
    const icons: Record<string, typeof GraduationCap> = {
      estudante: GraduationCap,
      professor: Users,
      funcionario: Briefcase,
    };
    return icons[tipo || ""] || GraduationCap;
  };

  const getTipoLabel = (tipo: string | null) => {
    const labels: Record<string, string> = {
      estudante: "Estudante",
      professor: "Professor",
      funcionario: "Funcionário",
    };
    return labels[tipo || ""] || "-";
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("SGE - Sistema de Gestão Escolar", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Histórico de Verificações de Passes", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-AO")}`, 105, 28, { align: "center" });
    doc.text(`Total de registos: ${filteredLogs.length}`, 105, 34, { align: "center" });

    autoTable(doc, {
      head: [["Data/Hora", "ID Passe", "Nº Passe", "Tipo", "Estado", "Local"]],
      body: filteredLogs.map((log) => [
        new Date(log.verified_at).toLocaleString("pt-AO"),
        log.pass_id,
        log.pass_number || "-",
        getTipoLabel(log.person_type),
        log.verification_status,
        log.location_name?.substring(0, 30) || "-",
      ]),
      startY: 40,
      theme: "striped",
      headStyles: { fillColor: [25, 65, 120] },
      styles: { fontSize: 8 },
    });

    doc.save(`verificacoes_passes_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Relatório exportado com sucesso!");
  };

  // Stats
  const stats = {
    total: logs.length,
    valid: logs.filter((l) => l.verification_status === "valid").length,
    expired: logs.filter((l) => l.verification_status === "expired").length,
    invalid: logs.filter((l) => l.verification_status === "invalid").length,
    today: logs.filter((l) => l.verified_at.startsWith(new Date().toISOString().split("T")[0])).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard/secretaria/passes">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                Histórico de Verificações
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Registo de todas as verificações de passes por QR Code
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button size="sm" onClick={handleExportPDF} disabled={filteredLogs.length === 0}>
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          <Card>
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.valid}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Válidos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.expired}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Expirados</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hidden sm:block">
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.invalid}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Inválidos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hidden sm:block">
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.today}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-sm">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 sm:w-32">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Estados</SelectItem>
                    <SelectItem value="valid">Válido</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                    <SelectItem value="invalid">Inválido</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="flex-1 sm:w-32">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Tipos</SelectItem>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex-1 sm:w-36"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
              Verificações ({filteredLogs.length})
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Lista de todas as verificações de passes via QR Code
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma verificação encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[130px]">Data/Hora</TableHead>
                      <TableHead className="hidden sm:table-cell">ID Passe</TableHead>
                      <TableHead className="hidden lg:table-cell">Nº Passe</TableHead>
                      <TableHead className="hidden md:table-cell">Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden lg:table-cell">Local</TableHead>
                      <TableHead className="hidden xl:table-cell">IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const TipoIcon = getTipoIcon(log.person_type);
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="p-2 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground hidden sm:block" />
                              <span>{new Date(log.verified_at).toLocaleDateString("pt-AO")}</span>
                              <span className="text-muted-foreground">{new Date(log.verified_at).toLocaleTimeString("pt-AO", { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {/* Mobile: show ID below date */}
                            <div className="text-xs text-muted-foreground sm:hidden mt-1 font-mono">
                              {log.pass_id}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-xs sm:text-sm p-2 sm:p-4">
                            {log.pass_id}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm p-2 sm:p-4">
                            {log.pass_number || "-"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell p-2 sm:p-4">
                            {log.person_type ? (
                              <Badge variant="outline" className="flex items-center gap-1 w-fit text-xs">
                                <TipoIcon className="h-3 w-3" />
                                {getTipoLabel(log.person_type)}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">{getStatusBadge(log.verification_status)}</TableCell>
                          <TableCell className="hidden lg:table-cell p-2 sm:p-4">
                            {log.location_name ? (
                              <div className="flex items-center gap-1 text-xs sm:text-sm max-w-[150px] lg:max-w-[200px] truncate" title={log.location_name}>
                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                {log.location_name}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell font-mono text-xs text-muted-foreground p-2 sm:p-4">
                            {log.ip_address || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoricoVerificacoes;
