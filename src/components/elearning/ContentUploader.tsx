import { useState, useRef } from "react";
import {
  Upload,
  FileVideo,
  FileAudio,
  FileText,
  Image,
  File,
  X,
  Play,
  Trash2,
  Link2,
  Plus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Content,
  ContentType,
  Lesson,
  Module,
  getContentIcon,
  getContentColor,
  getFileContentType,
  formatFileSize,
} from "./types";

interface ContentUploaderProps {
  modules: Module[];
  selectedModule: string | null;
  selectedLesson: string | null;
  onModulesChange: (modules: Module[]) => void;
}

const ContentUploader = ({
  modules,
  selectedModule,
  selectedLesson,
  onModulesChange,
}: ContentUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [linkData, setLinkData] = useState({ name: "", url: "", description: "" });

  const currentModule = modules.find((m) => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find((l) => l.id === selectedLesson);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!selectedModule || !selectedLesson) {
      toast({
        title: "Selecione uma aula",
        description: "Por favor selecione um módulo e aula primeiro",
        variant: "destructive",
      });
      return;
    }

    const newContents: Content[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: getFileContentType(file.name),
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split("T")[0],
    }));

    addContentsToLesson(newContents);

    toast({
      title: "Conteúdo adicionado",
      description: `${files.length} ficheiro(s) carregado(s)`,
    });
  };

  const addContentsToLesson = (newContents: Content[]) => {
    if (!selectedModule || !selectedLesson) return;

    const updatedModules = modules.map((m) =>
      m.id === selectedModule
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLesson
                ? { ...l, contents: [...l.contents, ...newContents] }
                : l
            ),
          }
        : m
    );

    onModulesChange(updatedModules);
  };

  const removeContent = (contentId: string) => {
    if (!selectedModule || !selectedLesson) return;

    const updatedModules = modules.map((m) =>
      m.id === selectedModule
        ? {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLesson
                ? { ...l, contents: l.contents.filter((c) => c.id !== contentId) }
                : l
            ),
          }
        : m
    );

    onModulesChange(updatedModules);
    toast({ title: "Conteúdo removido" });
  };

  const handleAddLink = () => {
    if (!linkData.name.trim() || !linkData.url.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newContent: Content = {
      id: Date.now().toString(),
      name: linkData.name.trim(),
      type: "other",
      size: "Link externo",
      url: linkData.url.trim(),
      description: linkData.description.trim(),
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    addContentsToLesson([newContent]);
    setLinkData({ name: "", url: "", description: "" });
    toast({ title: "Link adicionado" });
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <FileVideo className="h-5 w-5" />;
      case "audio":
        return <FileAudio className="h-5 w-5" />;
      case "presentation":
        return <FileText className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  if (!selectedModule || !selectedLesson) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center py-12">
          <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Selecione uma Aula</h3>
          <p className="text-muted-foreground max-w-sm">
            Para adicionar conteúdos, primeiro selecione um módulo e depois clique numa aula na lista à esquerda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Conteúdos da Aula</h3>
          <p className="text-sm text-muted-foreground">
            {currentModule?.title} → {currentLesson?.title}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-1" />
            Carregar
          </TabsTrigger>
          <TabsTrigger value="link">
            <Link2 className="h-4 w-4 mr-1" />
            Link Externo
          </TabsTrigger>
          <TabsTrigger value="contents">
            <File className="h-4 w-4 mr-1" />
            Conteúdos ({currentLesson?.contents.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept="video/*,audio/*,.ppt,.pptx,.pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium mb-2">
                  Arraste ficheiros ou clique para carregar
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Suporta vídeos, áudios, apresentações, PDFs e imagens
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <FileVideo className="h-3 w-3" />
                    Vídeo
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <FileAudio className="h-3 w-3" />
                    Áudio
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    PPT
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    PDF
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Image className="h-3 w-3" />
                    Imagem
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Link Tab */}
        <TabsContent value="link" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Adicionar Link Externo</CardTitle>
              <CardDescription>
                Adicione links para conteúdos externos como YouTube, Vimeo, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Nome do Conteúdo *</Label>
                <Input
                  placeholder="Ex: Vídeo Explicativo - Introdução"
                  value={linkData.name}
                  onChange={(e) => setLinkData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  placeholder="https://..."
                  value={linkData.url}
                  onChange={(e) => setLinkData((prev) => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (Opcional)</Label>
                <Textarea
                  placeholder="Breve descrição do conteúdo"
                  value={linkData.description}
                  onChange={(e) => setLinkData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <Button onClick={handleAddLink} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contents Tab */}
        <TabsContent value="contents" className="space-y-4 mt-4">
          {currentLesson?.contents.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhum conteúdo adicionado</p>
              <p className="text-sm text-muted-foreground">
                Carregue ficheiros ou adicione links externos
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-2">
              <div className="space-y-2">
                {currentLesson?.contents.map((content, index) => (
                  <Card key={content.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${getContentColor(
                            content.type
                          )}`}
                        >
                          {getContentTypeIcon(content.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            <p className="font-medium text-sm truncate">{content.name}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {getContentIcon(content.type)} {content.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{content.size}</span>
                            {content.url && (
                              <a
                                href={content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Abrir link
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {(content.type === "video" || content.type === "audio") && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeContent(content.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentUploader;
