import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
import logoSGE from "@/assets/logo-sge.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produto: [
      { label: "Funcionalidades", href: "#services" },
      { label: "Preços", href: "#pricing" },
      { label: "Demonstração", href: "#demo" },
      { label: "Actualizações", href: "#news" },
    ],
    empresa: [
      { label: "Sobre Nós", href: "#about" },
      { label: "Carreiras", href: "#careers" },
      { label: "Parcerias", href: "#partners" },
      { label: "Contactos", href: "#contact" },
    ],
    recursos: [
      { label: "Documentação", href: "#docs" },
      { label: "Tutoriais", href: "#tutorials" },
      { label: "FAQ", href: "#faq" },
      { label: "Suporte", href: "#support" },
    ],
    legal: [
      { label: "Termos de Uso", href: "#terms" },
      { label: "Privacidade", href: "#privacy" },
      { label: "Cookies", href: "#cookies" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="contact" className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={logoSGE} 
              alt="SGE - Sistema de Gestão Escolar" 
              className="h-14 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Sistema Integrado de Gestão Escolar - A solução completa para 
              modernizar a gestão educacional em Angola.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+244923456789" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                +244 923 456 789
              </a>
              <a href="mailto:info@sge.ao" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                info@sge.ao
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Rua Major Kanhangulo, nº 45<br />Luanda, Angola</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} SGE - Sistema de Gestão Escolar. Todos os direitos reservados.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
