import { useState, useRef, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  ArrowLeft,
  CreditCard,
  Printer,
  User,
  GraduationCap,
  Users,
  Briefcase,
  Download,
  Eye,
  QrCode,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileBarChart,
  Video,
  VideoOff,
  RotateCcw,
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  Upload,
  ImagePlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cropper, { Area, Point } from "react-easy-crop";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

// Tipos
type TipoPasse = "estudante" | "professor" | "funcionario";
type EstadoPasse = "activo" | "expirado" | "suspenso" | "pendente";

interface Pessoa {
  id: string;
  nome: string;
  foto: string | null;
  tipo: TipoPasse;
  identificador: string; // número de estudante, BI do professor, etc.
  classe?: string; // apenas para estudantes
  cargo?: string; // apenas para professores/funcionários
  departamento?: string;
  dataAdmissao: string;
  passeActivo: boolean;
  passeNumero: string | null;
  passeDataEmissao: string | null;
  passeDataValidade: string | null;
  passeEstado: EstadoPasse;
}

// Mock data
const pessoasMock: Pessoa[] = [
  {
    id: "EST001",
    nome: "João Manuel Silva",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0001",
    classe: "10ª A",
    dataAdmissao: "2024-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0001",
    passeDataEmissao: "2024-02-15",
    passeDataValidade: "2025-07-31",
    passeEstado: "activo",
  },
  {
    id: "EST002",
    nome: "Ana Beatriz Santos",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0002",
    classe: "11ª B",
    dataAdmissao: "2023-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0002",
    passeDataEmissao: "2024-02-15",
    passeDataValidade: "2025-07-31",
    passeEstado: "activo",
  },
  {
    id: "EST003",
    nome: "Carlos Eduardo Mendes",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0003",
    classe: "12ª A",
    dataAdmissao: "2022-02-01",
    passeActivo: false,
    passeNumero: null,
    passeDataEmissao: null,
    passeDataValidade: null,
    passeEstado: "pendente",
  },
  {
    id: "PROF001",
    nome: "Maria Fernandes de Sousa",
    foto: null,
    tipo: "professor",
    identificador: "000123456LA789",
    cargo: "Professora de Matemática",
    departamento: "Ciências Exactas",
    dataAdmissao: "2020-03-01",
    passeActivo: true,
    passeNumero: "PASS-PROF-2024-0001",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2025-12-31",
    passeEstado: "activo",
  },
  {
    id: "PROF002",
    nome: "António José Cardoso",
    foto: null,
    tipo: "professor",
    identificador: "000456789LA123",
    cargo: "Professor de Português",
    departamento: "Línguas",
    dataAdmissao: "2019-09-01",
    passeActivo: true,
    passeNumero: "PASS-PROF-2024-0002",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2024-12-31",
    passeEstado: "expirado",
  },
  {
    id: "FUNC001",
    nome: "Rosa Helena Ferreira",
    foto: null,
    tipo: "funcionario",
    identificador: "000789123LA456",
    cargo: "Secretária Administrativa",
    departamento: "Secretaria",
    dataAdmissao: "2018-01-15",
    passeActivo: true,
    passeNumero: "PASS-FUNC-2024-0001",
    passeDataEmissao: "2024-01-10",
    passeDataValidade: "2025-12-31",
    passeEstado: "activo",
  },
  {
    id: "FUNC002",
    nome: "Pedro Nunes Costa",
    foto: null,
    tipo: "funcionario",
    identificador: "000321654LA987",
    cargo: "Vigilante",
    departamento: "Segurança",
    dataAdmissao: "2021-06-01",
    passeActivo: false,
    passeNumero: null,
    passeDataEmissao: null,
    passeDataValidade: null,
    passeEstado: "pendente",
  },
  {
    id: "EST004",
    nome: "Diana Rosa Almeida",
    foto: null,
    tipo: "estudante",
    identificador: "2024/EST/0004",
    classe: "9ª C",
    dataAdmissao: "2024-02-01",
    passeActivo: true,
    passeNumero: "PASS-EST-2024-0004",
    passeDataEmissao: "2024-02-20",
    passeDataValidade: "2025-07-31",
    passeEstado: "suspenso",
  },
];

// Generate QR Code data for a person
const generateQRData = (pessoa: Pessoa): string => {
  const qrData = {
    id: pessoa.id,
    nome: pessoa.nome,
    tipo: pessoa.tipo,
    identificador: pessoa.identificador,
    passeNumero: pessoa.passeNumero,
    validade: pessoa.passeDataValidade,
    classe: pessoa.classe,
    cargo: pessoa.cargo,
    instituicao: "SGE",
    verificacao: btoa(`${pessoa.id}:${pessoa.passeNumero}:${pessoa.passeDataValidade}`).slice(0, 16),
  };
  return JSON.stringify(qrData);
};

// Generate verification URL for QR Code
const generateVerificationURL = (pessoa: Pessoa): string => {
  const baseUrl = window.location.origin;
  const verificationCode = btoa(`${pessoa.id}:${pessoa.passeNumero}:${pessoa.passeDataValidade}`);
  return `${baseUrl}/verificar-passe/${verificationCode}`;
};

const SecretariaPasses = () => {
  const [activeTab, setActiveTab] = useState<TipoPasse | "todos">("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [selectedPessoas, setSelectedPessoas] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const [emitirModalOpen, setEmitirModalOpen] = useState(false);
  
  // Webcam states
  const [webcamModalOpen, setWebcamModalOpen] = useState(false);
  const [webcamPessoa, setWebcamPessoa] = useState<Pessoa | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>(pessoasMock);
  
  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Webcam functions
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Erro ao aceder à webcam:", error);
      toast.error("Não foi possível aceder à webcam", {
        description: "Verifique se a câmara está conectada e as permissões estão concedidas.",
      });
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const photoData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(photoData);
        
        // Stop the webcam after capture
        stopWebcam();
      }
    }
  }, [stopWebcam]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    setIsCropping(false);
    resetCropSettings();
    startWebcam();
  }, [startWebcam]);

  const resetCropSettings = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setCroppedAreaPixels(null);
  }, []);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const startCropping = useCallback(() => {
    setIsCropping(true);
  }, []);

  const cancelCropping = useCallback(() => {
    setIsCropping(false);
    resetCropSettings();
  }, [resetCropSettings]);

  // Helper function to create cropped image
  const getCroppedImg = useCallback(async (
    imageSrc: string,
    pixelCrop: Area,
    rotation: number,
    brightness: number,
    contrast: number
  ): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(
          image,
          safeArea / 2 - image.width * 0.5,
          safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
          data,
          Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
          Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      
      image.onerror = () => {
        reject(new Error("Could not load image"));
      };
    });
  }, []);

  const savePhoto = useCallback(async () => {
    if (capturedPhoto && webcamPessoa) {
      let finalPhoto = capturedPhoto;
      
      // If we have cropping data, apply it
      if (croppedAreaPixels && isCropping) {
        try {
          finalPhoto = await getCroppedImg(
            capturedPhoto,
            croppedAreaPixels,
            rotation,
            brightness,
            contrast
          );
        } catch (error) {
          console.error("Error cropping image:", error);
          toast.error("Erro ao processar a imagem");
          return;
        }
      }
      
      // Update the person's photo in state
      setPessoas((prev) =>
        prev.map((p) =>
          p.id === webcamPessoa.id ? { ...p, foto: finalPhoto } : p
        )
      );
      
      toast.success("Foto guardada com sucesso!", {
        description: `A foto de ${webcamPessoa.nome} foi actualizada.`,
      });
      
      closeWebcamModal();
    }
  }, [capturedPhoto, webcamPessoa, croppedAreaPixels, isCropping, rotation, brightness, contrast, getCroppedImg]);

  const openWebcamModal = useCallback((pessoa: Pessoa) => {
    setWebcamPessoa(pessoa);
    setCapturedPhoto(null);
    setIsCropping(false);
    resetCropSettings();
    setWebcamModalOpen(true);
  }, [resetCropSettings]);

  const closeWebcamModal = useCallback(() => {
    stopWebcam();
    setCapturedPhoto(null);
    setIsCropping(false);
    resetCropSettings();
    setWebcamPessoa(null);
    setWebcamModalOpen(false);
  }, [stopWebcam, resetCropSettings]);

  // Upload photo from file
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de ficheiro inválido", {
        description: "Apenas são aceites imagens JPG, PNG ou WEBP.",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ficheiro muito grande", {
        description: "O tamanho máximo permitido é 5MB.",
      });
      return;
    }

    // Read file and set as captured photo
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      stopWebcam(); // Stop webcam when uploading
      setCapturedPhoto(result);
      toast.success("Foto carregada com sucesso!", {
        description: "Pode agora recortar e ajustar a imagem.",
      });
    };
    reader.onerror = () => {
      toast.error("Erro ao ler o ficheiro", {
        description: "Tente novamente com outro ficheiro.",
      });
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    event.target.value = "";
  }, [stopWebcam]);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Auto-start webcam when modal opens
  useEffect(() => {
    if (webcamModalOpen && !capturedPhoto) {
      startWebcam();
    }
    
    return () => {
      if (!webcamModalOpen) {
        stopWebcam();
      }
    };
  }, [webcamModalOpen, capturedPhoto, startWebcam, stopWebcam]);

  const filteredPessoas = pessoas.filter((p) => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.identificador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = activeTab === "todos" || p.tipo === activeTab;
    const matchesEstado = estadoFilter === "todos" || p.passeEstado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getEstadoBadge = (estado: EstadoPasse) => {
    const config = {
      activo: { icon: CheckCircle2, label: "Activo", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      expirado: { icon: AlertCircle, label: "Expirado", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      suspenso: { icon: AlertCircle, label: "Suspenso", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      pendente: { icon: RefreshCw, label: "Pendente", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    };
    const { icon: Icon, label, className } = config[estado];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: TipoPasse) => {
    const icons = {
      estudante: GraduationCap,
      professor: Users,
      funcionario: Briefcase,
    };
    return icons[tipo];
  };

  const getTipoBadge = (tipo: TipoPasse) => {
    const config = {
      estudante: { label: "Estudante", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      professor: { label: "Professor", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
      funcionario: { label: "Funcionário", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
    };
    const { label, className } = config[tipo];
    const Icon = getTipoIcon(tipo);
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPessoas(filteredPessoas.map(p => p.id));
    } else {
      setSelectedPessoas([]);
    }
  };

  const handleSelectPessoa = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPessoas([...selectedPessoas, id]);
    } else {
      setSelectedPessoas(selectedPessoas.filter(p => p !== id));
    }
  };

  const handlePreview = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setPreviewOpen(true);
  };

  const handleImprimirPasse = async (pessoa: Pessoa) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98], // Tamanho de cartão de crédito
    });

    // Generate QR Code data
    const qrData = generateQRData(pessoa);
    
    // Helper function to load image as base64
    const loadImageAsBase64 = (src: string): Promise<string | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 0.9));
          } else {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    // Load the person's photo if available
    let photoBase64: string | null = null;
    if (pessoa.foto) {
      photoBase64 = await loadImageAsBase64(pessoa.foto);
    }

    // Generate QR code image
    const generateQRImageBase64 = (): Promise<string | null> => {
      return new Promise((resolve) => {
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        document.body.appendChild(tempContainer);

        const qrCanvas = document.createElement("canvas");
        tempContainer.appendChild(qrCanvas);

        import("qrcode.react").then(({ QRCodeCanvas }) => {
          const ReactDOM = require("react-dom/client");
          const root = ReactDOM.createRoot(qrCanvas);
          root.render(
            <QRCodeCanvas
              value={qrData}
              size={150}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          );

          setTimeout(() => {
            const canvas = tempContainer.querySelector("canvas");
            if (canvas) {
              resolve(canvas.toDataURL("image/png"));
            } else {
              resolve(null);
            }
            document.body.removeChild(tempContainer);
          }, 150);
        }).catch(() => {
          document.body.removeChild(tempContainer);
          resolve(null);
        });
      });
    };

    const qrImageBase64 = await generateQRImageBase64();

    // ======== FRENTE DO PASSE ========
    // Background
    doc.setFillColor(25, 65, 120);
    doc.rect(0, 0, 85.6, 53.98, "F");

    // Header strip
    doc.setFillColor(200, 160, 50);
    doc.rect(0, 0, 85.6, 12, "F");

    // School name
    doc.setTextColor(25, 65, 120);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("SGE - SISTEMA DE GESTÃO ESCOLAR", 42.8, 5, { align: "center" });
    doc.setFontSize(6);
    doc.text("PASSE DE IDENTIFICAÇÃO", 42.8, 9, { align: "center" });

    // Photo - add real photo if available, otherwise placeholder
    if (photoBase64) {
      try {
        doc.addImage(photoBase64, "JPEG", 5, 16, 22, 28);
      } catch (e) {
        // Fallback to placeholder if image fails
        doc.setFillColor(200, 200, 200);
        doc.rect(5, 16, 22, 28, "F");
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(6);
        doc.text("FOTO", 16, 31, { align: "center" });
      }
    } else {
      doc.setFillColor(200, 200, 200);
      doc.rect(5, 16, 22, 28, "F");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(6);
      doc.text("FOTO", 16, 31, { align: "center" });
    }

    // Person info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(pessoa.nome.toUpperCase(), 30, 20);

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    
    const tipoLabels = { estudante: "ESTUDANTE", professor: "PROFESSOR(A)", funcionario: "FUNCIONÁRIO(A)" };
    doc.text(tipoLabels[pessoa.tipo], 30, 25);
    
    if (pessoa.classe) {
      doc.text(`Turma: ${pessoa.classe}`, 30, 30);
    }
    if (pessoa.cargo) {
      doc.text(pessoa.cargo, 30, 30);
    }
    if (pessoa.departamento) {
      doc.text(pessoa.departamento, 30, 35);
    }

    doc.text(`Nº: ${pessoa.identificador}`, 30, 40);

    // Pass number and validity
    doc.setFontSize(5);
    doc.text(`Passe: ${pessoa.passeNumero || "---"}`, 5, 48);
    doc.text(`Válido até: ${pessoa.passeDataValidade ? new Date(pessoa.passeDataValidade).toLocaleDateString("pt-AO") : "---"}`, 5, 51);

    // QR Code - add real QR code if generated, otherwise fallback
    doc.setFillColor(255, 255, 255);
    doc.rect(68, 36, 15, 15, "F");
    
    if (qrImageBase64) {
      try {
        doc.addImage(qrImageBase64, "PNG", 68.5, 36.5, 14, 14);
      } catch (e) {
        // Fallback to pattern if QR fails
        drawQRFallback();
      }
    } else {
      drawQRFallback();
    }

    function drawQRFallback() {
      const qrStartX = 69;
      const qrStartY = 37;
      const moduleSize = 0.5;
      const verificationCode = pessoa.id + pessoa.passeNumero;
      
      doc.setFillColor(0, 0, 0);
      for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 25; col++) {
          const isPositionMarker = 
            (row < 7 && col < 7) || 
            (row < 7 && col > 17) || 
            (row > 17 && col < 7);
          
          const charCode = (verificationCode?.charCodeAt((row * 25 + col) % (verificationCode?.length || 1)) || 0);
          const shouldFill = isPositionMarker ? 
            ((row === 0 || row === 6 || col === 0 || col === 6) || (row >= 2 && row <= 4 && col >= 2 && col <= 4)) && 
            !((row === 1 || row === 5) && (col === 1 || col === 5)) :
            (charCode + row + col) % 3 === 0;
          
          if (shouldFill) {
            doc.rect(qrStartX + col * moduleSize, qrStartY + row * moduleSize, moduleSize, moduleSize, "F");
          }
        }
      }
    }
    
    // Add verification text under QR
    doc.setFontSize(3);
    doc.setTextColor(0, 0, 0);
    doc.text("Verificar", 75.5, 52, { align: "center" });

    // ======== VERSO DO PASSE (Nova página) ========
    doc.addPage([85.6, 53.98], "landscape");

    // Background verso
    doc.setFillColor(240, 240, 245);
    doc.rect(0, 0, 85.6, 53.98, "F");

    // Header strip verso
    doc.setFillColor(25, 65, 120);
    doc.rect(0, 0, 85.6, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMAÇÕES IMPORTANTES", 42.8, 5, { align: "center" });

    // Magnetic strip simulation
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 10, 85.6, 8, "F");

    // Instructions
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    
    const instrucoes = [
      "1. Este passe é pessoal e intransferível.",
      "2. Apresente este documento sempre que solicitado.",
      "3. Em caso de perda, comunique imediatamente à Secretaria.",
      "4. O uso indevido deste passe é passível de sanções.",
      "5. Este passe deve ser devolvido no final do vínculo.",
    ];

    instrucoes.forEach((texto, index) => {
      doc.text(texto, 5, 24 + (index * 4));
    });

    // Contact info box
    doc.setFillColor(25, 65, 120);
    doc.setDrawColor(25, 65, 120);
    doc.roundedRect(5, 44, 50, 7, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.text("Secretaria: +244 923 456 789 | secretaria@sge.ao", 30, 48, { align: "center" });

    // Barcode placeholder
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 44, 22, 7, "F");
    doc.setDrawColor(0, 0, 0);
    // Simulate barcode lines
    for (let i = 0; i < 15; i++) {
      const x = 62 + (i * 1.2);
      const width = i % 3 === 0 ? 0.8 : 0.4;
      doc.setFillColor(0, 0, 0);
      doc.rect(x, 45, width, 5, "F");
    }

    // Verification code for manual verification
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(4);
    const verCode = btoa(`${pessoa.id}:${pessoa.passeNumero}`).slice(0, 12).toUpperCase();
    doc.text(`Código: ${verCode}`, 42.8, 42, { align: "center" });
    doc.text(`ID: ${pessoa.id} | Emitido: ${pessoa.passeDataEmissao ? new Date(pessoa.passeDataEmissao).toLocaleDateString("pt-AO") : new Date().toLocaleDateString("pt-AO")}`, 42.8, 52, { align: "center" });

    doc.save(`passe_${pessoa.id}_${pessoa.nome.replace(/\s+/g, "_")}.pdf`);
    toast.success("Passe gerado com sucesso!", {
      description: `PDF do passe de ${pessoa.nome} com QR Code foi descarregado.`,
    });
  };

  const handleImprimirSelecionados = () => {
    if (selectedPessoas.length === 0) {
      toast.error("Seleccione pelo menos uma pessoa");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("SGE - Sistema de Gestão Escolar", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Relatório de Passes a Imprimir", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-AO")}`, 105, 28, { align: "center" });

    const pessoasSelecionadas = pessoas.filter(p => selectedPessoas.includes(p.id));
    
    autoTable(doc, {
      head: [["Nome", "Tipo", "Identificador", "Estado", "Validade"]],
      body: pessoasSelecionadas.map(p => [
        p.nome,
        p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1),
        p.identificador,
        p.passeEstado,
        p.passeDataValidade || "Pendente",
      ]),
      startY: 35,
      theme: "striped",
      headStyles: { fillColor: [25, 65, 120] },
    });

    doc.save(`passes_lote_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success(`${selectedPessoas.length} passes preparados para impressão`);
  };

  const handleEmitirNovoPasse = () => {
    setEmitirModalOpen(true);
  };

  const handleConfirmarEmissao = () => {
    if (selectedPessoas.length === 0) {
      toast.error("Seleccione pelo menos uma pessoa");
      return;
    }
    
    toast.success(`${selectedPessoas.length} passes emitidos com sucesso`);
    setEmitirModalOpen(false);
    setSelectedPessoas([]);
  };

  // Estatísticas
  const stats = {
    totalEstudantes: pessoas.filter(p => p.tipo === "estudante").length,
    totalProfessores: pessoas.filter(p => p.tipo === "professor").length,
    totalFuncionarios: pessoas.filter(p => p.tipo === "funcionario").length,
    activos: pessoas.filter(p => p.passeEstado === "activo").length,
    expirados: pessoas.filter(p => p.passeEstado === "expirado").length,
    pendentes: pessoas.filter(p => p.passeEstado === "pendente").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard/secretaria">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                Impressão de Passes
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Gerir e imprimir passes de identificação
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/secretaria/verificacoes" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <QrCode className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Histórico Verificações</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImprimirSelecionados} 
              disabled={selectedPessoas.length === 0}
              className="flex-1 sm:flex-none"
            >
              <Printer className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Imprimir</span> ({selectedPessoas.length})
            </Button>
            <Button size="sm" onClick={handleEmitirNovoPasse} className="flex-1 sm:flex-none">
              <CreditCard className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Emitir Passes</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalEstudantes}</div>
                  <div className="text-xs text-muted-foreground">Estudantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalProfessores}</div>
                  <div className="text-xs text-muted-foreground">Professores</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalFuncionarios}</div>
                  <div className="text-xs text-muted-foreground">Funcionários</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
                  <div className="text-xs text-muted-foreground">Activos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.expirados}</div>
                  <div className="text-xs text-muted-foreground">Expirados</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-600">{stats.pendentes}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TipoPasse | "todos")}>
          <div className="flex flex-col gap-4">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="todos" className="text-xs sm:text-sm">Todos</TabsTrigger>
              <TabsTrigger value="estudante" className="text-xs sm:text-sm">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Estudantes</span>
              </TabsTrigger>
              <TabsTrigger value="professor" className="text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Professores</span>
              </TabsTrigger>
              <TabsTrigger value="funcionario" className="text-xs sm:text-sm">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Func.</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                  Passes ({filteredPessoas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10 sm:w-12">
                          <Checkbox
                            checked={selectedPessoas.length === filteredPessoas.length && filteredPessoas.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="min-w-[120px]">Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Tipo</TableHead>
                        <TableHead className="hidden lg:table-cell">Identificador</TableHead>
                        <TableHead className="hidden xl:table-cell">Detalhe</TableHead>
                        <TableHead className="hidden sm:table-cell">Nº Passe</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">Validade</TableHead>
                        <TableHead className="text-right">Acções</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {filteredPessoas.map((pessoa) => (
                      <TableRow key={pessoa.id}>
                        <TableCell className="p-2 sm:p-4">
                          <Checkbox
                            checked={selectedPessoas.includes(pessoa.id)}
                            onCheckedChange={(checked) => handleSelectPessoa(pessoa.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {pessoa.foto ? (
                              <img
                                src={pessoa.foto}
                                alt={pessoa.nome}
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-medium text-sm sm:text-base block truncate">{pessoa.nome}</span>
                              <span className="text-xs text-muted-foreground md:hidden">{pessoa.tipo}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{getTipoBadge(pessoa.tipo)}</TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">{pessoa.identificador}</TableCell>
                        <TableCell className="hidden xl:table-cell text-xs sm:text-sm text-muted-foreground">
                          {pessoa.classe || pessoa.cargo || "-"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs sm:text-sm">
                          {pessoa.passeNumero || <span className="text-muted-foreground">---</span>}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">{getEstadoBadge(pessoa.passeEstado)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {pessoa.passeDataValidade ? (
                            <div className="flex items-center gap-1 text-xs sm:text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {new Date(pessoa.passeDataValidade).toLocaleDateString("pt-AO")}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">---</span>
                          )}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <div className="flex justify-end gap-0.5 sm:gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              title="Capturar Foto"
                              onClick={() => openWebcamModal(pessoa)}
                            >
                              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              title="Pré-visualizar"
                              onClick={() => handlePreview(pessoa)}
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              title="Imprimir Passe"
                              onClick={() => handleImprimirPasse(pessoa)}
                              disabled={pessoa.passeEstado === "pendente"}
                            >
                              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          {selectedPessoa && (
            <>
              <DialogHeader>
                <DialogTitle>Pré-visualização do Passe</DialogTitle>
                <DialogDescription>
                  Passe de identificação de {selectedPessoa.nome} (frente e verso)
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* FRENTE DO PASSE */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> FRENTE
                  </p>
                  <div className="relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-lg">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                    
                    {/* Header strip */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-accent flex flex-col items-center justify-center">
                      <span className="text-primary font-bold text-sm">SGE - SISTEMA DE GESTÃO ESCOLAR</span>
                      <span className="text-primary text-xs">PASSE DE IDENTIFICAÇÃO</span>
                    </div>

                    {/* Content */}
                    <div className="absolute top-14 left-0 right-0 bottom-0 p-4 flex gap-4">
                      {/* Photo */}
                      {selectedPessoa.foto ? (
                        <img
                          src={selectedPessoa.foto}
                          alt={selectedPessoa.nome}
                          className="w-20 h-24 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-24 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 text-white space-y-1">
                        <h3 className="font-bold text-sm uppercase">{selectedPessoa.nome}</h3>
                        <p className="text-xs opacity-80">
                          {selectedPessoa.tipo === "estudante" ? "ESTUDANTE" : 
                           selectedPessoa.tipo === "professor" ? "PROFESSOR(A)" : "FUNCIONÁRIO(A)"}
                        </p>
                        {selectedPessoa.classe && (
                          <p className="text-xs">Turma: {selectedPessoa.classe}</p>
                        )}
                        {selectedPessoa.cargo && (
                          <p className="text-xs">{selectedPessoa.cargo}</p>
                        )}
                        <p className="text-xs opacity-80">Nº: {selectedPessoa.identificador}</p>
                      </div>

                      {/* QR Code Real */}
                      <div className="absolute bottom-3 right-3 w-14 h-14 bg-white rounded p-1 flex items-center justify-center shadow-md">
                        <QRCodeSVG
                          value={generateQRData(selectedPessoa)}
                          size={48}
                          level="H"
                          includeMargin={false}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-20 p-2 text-white text-[10px] opacity-70">
                      <p>Passe: {selectedPessoa.passeNumero || "---"}</p>
                      <p>Válido até: {selectedPessoa.passeDataValidade ? new Date(selectedPessoa.passeDataValidade).toLocaleDateString("pt-AO") : "---"}</p>
                    </div>
                  </div>
                </div>

                {/* VERSO DO PASSE */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> VERSO
                  </p>
                  <div className="relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-lg bg-slate-100">
                    {/* Header strip */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">INFORMAÇÕES IMPORTANTES</span>
                    </div>

                    {/* Magnetic strip */}
                    <div className="absolute top-10 left-0 right-0 h-6 bg-gray-800" />

                    {/* Instructions */}
                    <div className="absolute top-18 left-0 right-0 bottom-0 p-3 pt-8">
                      <div className="space-y-1 text-[10px] text-gray-700">
                        <p>1. Este passe é pessoal e intransferível.</p>
                        <p>2. Apresente este documento sempre que solicitado.</p>
                        <p>3. Em caso de perda, comunique imediatamente à Secretaria.</p>
                        <p>4. O uso indevido deste passe é passível de sanções.</p>
                        <p>5. Este passe deve ser devolvido no final do vínculo.</p>
                      </div>

                      {/* Contact info */}
                      <div className="absolute bottom-8 left-3 right-3 flex justify-between items-end">
                        <div className="bg-primary text-white text-[8px] px-2 py-1 rounded">
                          Secretaria: +244 923 456 789 | secretaria@sge.ao
                        </div>
                        {/* Barcode simulation */}
                        <div className="flex gap-[1px]">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-black"
                              style={{
                                width: i % 3 === 0 ? 2 : 1,
                                height: 20,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* ID and emission date */}
                      <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-gray-500">
                        ID: {selectedPessoa.id} | Emitido: {selectedPessoa.passeDataEmissao ? new Date(selectedPessoa.passeDataEmissao).toLocaleDateString("pt-AO") : new Date().toLocaleDateString("pt-AO")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  handleImprimirPasse(selectedPessoa);
                  setPreviewOpen(false);
                }}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir (Frente e Verso)
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Emitir Modal */}
      <Dialog open={emitirModalOpen} onOpenChange={setEmitirModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emitir Novos Passes</DialogTitle>
            <DialogDescription>
              Confirme a emissão de passes para as pessoas seleccionadas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Serão emitidos passes para {selectedPessoas.length} pessoa(s).
            </p>

            {selectedPessoas.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {pessoas.filter(p => selectedPessoas.includes(p.id)).map(p => (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    {getTipoBadge(p.tipo)}
                    <span className="text-sm">{p.nome}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Emissão</label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Válido Até</label>
                <Input type="date" defaultValue="2025-12-31" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmitirModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarEmissao}>
              <CreditCard className="h-4 w-4 mr-2" />
              Confirmar Emissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webcam Capture Modal */}
      <Dialog open={webcamModalOpen} onOpenChange={(open) => !open && closeWebcamModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capturar ou Carregar Foto
            </DialogTitle>
            <DialogDescription>
              {webcamPessoa && `Foto para ${webcamPessoa.nome} - Use a câmara ou carregue uma imagem`}
            </DialogDescription>
          </DialogHeader>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="space-y-4">
            {/* Video/Photo Preview Area */}
            <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {capturedPhoto ? (
                isCropping ? (
                  <div className="relative w-full h-full">
                    <Cropper
                      image={capturedPhoto}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={3 / 4}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      style={{
                        containerStyle: {
                          width: "100%",
                          height: "100%",
                        },
                        mediaStyle: {
                          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        },
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={capturedPhoto}
                    alt="Foto capturada"
                    className="w-full h-full object-cover"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                )
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isStreaming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                      <VideoOff className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">A iniciar câmara...</p>
                    </div>
                  )}
                </>
              )}
              
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Crop/Adjustment Controls - Only visible when cropping */}
            {capturedPhoto && isCropping && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                {/* Zoom Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ZoomIn className="h-4 w-4" />
                      Zoom
                    </label>
                    <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={([value]) => setZoom(value)}
                  />
                </div>

                {/* Rotation Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <RotateCw className="h-4 w-4" />
                      Rotação
                    </label>
                    <span className="text-sm text-muted-foreground">{rotation}°</span>
                  </div>
                  <Slider
                    value={[rotation]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={([value]) => setRotation(value)}
                  />
                </div>

                {/* Brightness Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Brilho
                    </label>
                    <span className="text-sm text-muted-foreground">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={([value]) => setBrightness(value)}
                  />
                </div>

                {/* Contrast Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Contrast className="h-4 w-4" />
                      Contraste
                    </label>
                    <span className="text-sm text-muted-foreground">{contrast}%</span>
                  </div>
                  <Slider
                    value={[contrast]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={([value]) => setContrast(value)}
                  />
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={resetCropSettings}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Repor Valores
                </Button>
              </div>
            )}

            {/* Instructions */}
            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              {capturedPhoto ? (
                isCropping ? (
                  <p>Arraste para posicionar, use os controlos para ajustar zoom, rotação, brilho e contraste.</p>
                ) : (
                  <p>Foto pronta. Clique em "Recortar" para ajustar ou "Guardar" para confirmar.</p>
                )
              ) : (
                <div className="space-y-1">
                  <p>Use a câmara para capturar ou carregue uma foto existente.</p>
                  <p className="text-xs text-muted-foreground/70">Formatos aceites: JPG, PNG, WEBP (máx. 5MB)</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {capturedPhoto ? (
                isCropping ? (
                  <>
                    <Button variant="outline" onClick={cancelCropping}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={savePhoto}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aplicar e Guardar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={retakePhoto}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Repetir
                    </Button>
                    <Button variant="outline" onClick={startCropping}>
                      <Crop className="h-4 w-4 mr-2" />
                      Recortar
                    </Button>
                    <Button onClick={savePhoto}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button variant="outline" onClick={closeWebcamModal}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button variant="outline" onClick={triggerFileUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Foto
                  </Button>
                  <Button onClick={capturePhoto} disabled={!isStreaming}>
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar
                  </Button>
                </>
              )}
            </div>

            {/* Current person info */}
            {webcamPessoa && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {webcamPessoa.foto ? (
                  <img
                    src={webcamPessoa.foto}
                    alt="Foto actual"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{webcamPessoa.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {webcamPessoa.tipo === "estudante" ? `Estudante - ${webcamPessoa.classe}` :
                     webcamPessoa.cargo}
                  </p>
                </div>
                {webcamPessoa.foto && (
                  <Badge variant="outline" className="ml-auto">
                    Foto existente
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SecretariaPasses;
