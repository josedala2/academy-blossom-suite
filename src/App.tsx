import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estudantes from "./pages/dashboard/Estudantes";
import Professores from "./pages/dashboard/Professores";
import Turmas from "./pages/dashboard/Turmas";
import Avaliacoes from "./pages/dashboard/Avaliacoes";
import Propinas from "./pages/dashboard/Propinas";
import Horarios from "./pages/dashboard/Horarios";
import Comunicados from "./pages/dashboard/Comunicados";
import Relatorios from "./pages/dashboard/Relatorios";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/estudantes" element={<Estudantes />} />
          <Route path="/dashboard/professores" element={<Professores />} />
          <Route path="/dashboard/turmas" element={<Turmas />} />
          <Route path="/dashboard/avaliacoes" element={<Avaliacoes />} />
          <Route path="/dashboard/propinas" element={<Propinas />} />
          <Route path="/dashboard/horarios" element={<Horarios />} />
          <Route path="/dashboard/comunicados" element={<Comunicados />} />
          <Route path="/dashboard/relatorios" element={<Relatorios />} />
          <Route path="/dashboard/configuracoes" element={<Configuracoes />} />
          <Route path="/dashboard/secretaria" element={<Secretaria />} />
          <Route path="/dashboard/secretaria/pre-registos" element={<PreRegistos />} />
          <Route path="/dashboard/secretaria/visitantes" element={<Visitantes />} />
          <Route path="/dashboard/secretaria/estudantes" element={<SecretariaEstudantes />} />
          <Route path="/dashboard/secretaria/encarregados" element={<SecretariaEncarregados />} />
          <Route path="/dashboard/secretaria/documentos" element={<SecretariaDocumentos />} />
          <Route path="/dashboard/secretaria/templates" element={<SecretariaTemplates />} />
          <Route path="/dashboard/secretaria/processos" element={<SecretariaProcessos />} />
          <Route path="/dashboard/secretaria/relatorios" element={<SecretariaRelatorios />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
