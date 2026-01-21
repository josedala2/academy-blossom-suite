import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ELearningTrackingProvider } from "@/contexts/ELearningTrackingContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { routePermissions } from "@/config/permissions";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/dashboard/Perfil";
import PortalEstudante from "./pages/dashboard/PortalEstudante";
import Estudantes from "./pages/dashboard/Estudantes";
import MatriculaRapida from "./pages/dashboard/estudantes/MatriculaRapida";
import HistoricoAcademico from "./pages/dashboard/estudantes/HistoricoAcademico";
import Professores from "./pages/dashboard/Professores";
import Turmas from "./pages/dashboard/Turmas";
import Avaliacoes from "./pages/dashboard/Avaliacoes";
import Propinas from "./pages/dashboard/Propinas";
import HistoricoTransacoes from "./pages/dashboard/HistoricoTransacoes";
import Horarios from "./pages/dashboard/Horarios";
import Comunicados from "./pages/dashboard/Comunicados";
import Relatorios from "./pages/dashboard/Relatorios";
import RelatoriosPedagogicos from "./pages/dashboard/RelatoriosPedagogicos";
import ELearning from "./pages/dashboard/ELearning";
import Configuracoes from "./pages/dashboard/Configuracoes";
import Secretaria from "./pages/dashboard/Secretaria";
import PreRegistos from "./pages/dashboard/secretaria/PreRegistos";
import Visitantes from "./pages/dashboard/secretaria/Visitantes";
import SecretariaEstudantes from "./pages/dashboard/secretaria/Estudantes";
import SecretariaEncarregados from "./pages/dashboard/secretaria/Encarregados";
import SecretariaDocumentos from "./pages/dashboard/secretaria/Documentos";
import SecretariaTemplates from "./pages/dashboard/secretaria/Templates";
import SecretariaProcessos from "./pages/dashboard/secretaria/Processos";
import SecretariaRelatorios from "./pages/dashboard/secretaria/Relatorios";
import SecretariaRastreioDocumentos from "./pages/dashboard/secretaria/RastreioDocumentos";
import SecretariaPasses from "./pages/dashboard/secretaria/Passes";
import VerificarPasse from "./pages/VerificarPasse";
import HistoricoVerificacoes from "./pages/dashboard/secretaria/HistoricoVerificacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <ELearningTrackingProvider>
        <TooltipProvider>
          <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verificar-passe/:codigo" element={<VerificarPasse />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/perfil" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/perfil"]}>
                <Perfil />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/portal-estudante" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/portal-estudante"]}>
                <PortalEstudante />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudantes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/estudantes"]}>
                <Estudantes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudantes/matricula-rapida" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/estudantes/matricula-rapida"]}>
                <MatriculaRapida />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudantes/historico-academico" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/estudantes/historico-academico"]}>
                <HistoricoAcademico />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/professores" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/professores"]}>
                <Professores />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/turmas" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/turmas"]}>
                <Turmas />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/avaliacoes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/avaliacoes"]}>
                <Avaliacoes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/propinas" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/propinas"]}>
                <Propinas />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/propinas/historico" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/propinas/historico"]}>
                <HistoricoTransacoes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/horarios" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/horarios"]}>
                <Horarios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/comunicados" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/comunicados"]}>
                <Comunicados />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/relatorios" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/relatorios"]}>
                <Relatorios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/relatorios-pedagogicos" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/relatorios-pedagogicos"]}>
                <RelatoriosPedagogicos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/elearning" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/elearning"]}>
                <ELearning />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/configuracoes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/configuracoes"]}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria"]}>
                <Secretaria />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/pre-registos" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/pre-registos"]}>
                <PreRegistos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/visitantes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/visitantes"]}>
                <Visitantes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/estudantes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/estudantes"]}>
                <SecretariaEstudantes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/encarregados" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/encarregados"]}>
                <SecretariaEncarregados />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/documentos" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/documentos"]}>
                <SecretariaDocumentos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/templates" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/templates"]}>
                <SecretariaTemplates />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/processos" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/processos"]}>
                <SecretariaProcessos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/relatorios" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/relatorios"]}>
                <SecretariaRelatorios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/rastreio-documentos" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/rastreio-documentos"]}>
                <SecretariaRastreioDocumentos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/passes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/passes"]}>
                <SecretariaPasses />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/secretaria/verificacoes" element={
              <ProtectedRoute allowedRoles={routePermissions["/dashboard/secretaria/passes"]}>
                <HistoricoVerificacoes />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </ELearningTrackingProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
