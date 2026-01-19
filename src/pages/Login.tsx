import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, UserCog, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logoSGE from "@/assets/logo-sge.png";

// Demo users for quick login
const demoUsers = [
  {
    name: "Administrador",
    email: "admin@escola.ao",
    password: "admin123",
    role: "Administrador",
    icon: UserCog,
    color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
  },
  {
    name: "Dir. Pedagógico",
    email: "director@escola.ao",
    password: "director123",
    role: "Pedagógico",
    icon: ClipboardCheck,
    color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
  },
  {
    name: "Secretário",
    email: "secretario@escola.ao",
    password: "secretario123",
    role: "Secretaria",
    icon: User,
    color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    name: "Professor",
    email: "professor@escola.ao",
    password: "professor123",
    role: "Professor",
    icon: BookOpen,
    color: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    name: "Estudante",
    email: "estudante@escola.ao",
    password: "estudante123",
    role: "Estudante",
    icon: GraduationCap,
    color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast({
        title: "Login efectuado com sucesso",
        description: "Bem-vindo ao Sistema de Gestão Escolar",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou palavra-passe incorrectos",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link to="/">
              <img src={logoSGE} alt="SGE" className="h-16 mx-auto mb-6" />
            </Link>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground mt-2">
              Introduza as suas credenciais para aceder ao sistema
            </p>
          </div>

          {/* Demo Users Section */}
          <Card className="border-dashed border-2 border-muted">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3 text-center font-medium">
                👆 Clique para preencher automaticamente
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {demoUsers.map((user) => {
                  const IconComponent = user.icon;
                  return (
                    <Button
                      key={user.email}
                      type="button"
                      variant="outline"
                      className={`h-auto py-2 px-2 flex flex-col items-center gap-0.5 transition-all ${user.color}`}
                      onClick={() => handleDemoLogin(user)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-[10px] font-medium leading-tight text-center">{user.name}</span>
                      <span className="text-[9px] opacity-70">{user.role}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.ao"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Palavra-passe</Label>
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Manter sessão iniciada
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "A entrar..." : "Entrar"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Microsoft
            </Button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/registar" className="text-primary font-medium hover:underline">
              Contacte a administração
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Sistema de Gestão Escolar
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-md">
            A plataforma completa para modernizar a gestão da sua instituição de ensino
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 text-primary-foreground">
            <div className="text-center">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm opacity-80">Escolas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">25K+</div>
              <div className="text-sm opacity-80">Estudantes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
