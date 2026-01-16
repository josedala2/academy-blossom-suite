import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const news = [
  {
    date: "15 Jan 2026",
    category: "Actualização",
    title: "Nova funcionalidade de pagamentos online",
    description: "Integração completa com Multicaixa Express para facilitar o pagamento de propinas.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
  },
  {
    date: "10 Jan 2026",
    category: "Parceria",
    title: "Parceria com Ministério da Educação",
    description: "O SGE torna-se a plataforma recomendada para escolas em todo o território nacional.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
  },
  {
    date: "05 Jan 2026",
    category: "Evento",
    title: "Formação para administradores",
    description: "Workshop gratuito para capacitar equipas de gestão escolar no uso da plataforma.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
  },
];

const News = () => {
  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Notícias
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Últimas novidades
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <Card 
              key={index} 
              className="group card-hover overflow-hidden border-border/50"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
