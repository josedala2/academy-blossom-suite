import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import logoSGE from "@/assets/logo-sge.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#" },
    { label: "Sobre", href: "#about" },
    { label: "Serviços", href: "#services" },
    { label: "Notícias", href: "#news" },
    { label: "Contactos", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="gradient-hero">
        <div className="container flex h-10 items-center justify-between text-sm text-primary-foreground">
          <div className="flex items-center gap-6">
            <a href="tel:+244923456789" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+244 923 456 789</span>
            </a>
            <a href="mailto:info@sge.ao" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">info@sge.ao</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline opacity-80">Sistema de Gestão Escolar</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-md">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center justify-center group">
            <img 
              src={logoSGE} 
              alt="SGE - Sistema de Gestão Escolar" 
              className="h-12 w-auto transition-transform group-hover:scale-105"
              style={{ background: 'transparent' }}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-foreground/80 hover:text-primary font-medium transition-colors rounded-md hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              Registar
            </Button>
            <Button variant="default">
              Entrar
            </Button>
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-slide-up">
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-foreground/80 hover:text-primary font-medium transition-colors rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border mt-2 flex gap-3">
                <Button variant="outline" className="flex-1">
                  Registar
                </Button>
                <Button variant="default" className="flex-1">
                  Entrar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
