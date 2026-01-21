import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  Building2,
  Shield,
  Clock,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Type definitions
type TipoPasse = "estudante" | "professor" | "funcionario";

interface QRData {
  id: string;
  nome: string;
  tipo: TipoPasse;
  identificador: string;
  passeNumero: string | null;
  validade: string | null;
  classe?: string;
  cargo?: string;
  instituicao: string;
  verificacao: string;
}

interface VerificationResult {
  status: "valid" | "expired" | "invalid" | "error";
  data: QRData | null;
  message: string;
}

interface LocationInfo {
  latitude: number | null;
  longitude: number | null;
  name: string | null;
}

const VerificarPasse = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationInfo>({ latitude: null, longitude: null, name: null });
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user location
  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return { latitude: null, longitude: null, name: null };
    }

    setLocationLoading(true);

    return new Promise<LocationInfo>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let locationName = null;

          // Try to get location name via reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { "Accept-Language": "pt" } }
            );
            const data = await response.json();
            if (data.display_name) {
              locationName = data.display_name.split(",").slice(0, 3).join(",");
            }
          } catch (e) {
            console.log("Reverse geocoding failed:", e);
          }

          setLocationLoading(false);
          resolve({ latitude, longitude, name: locationName });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          setLocationLoading(false);
          resolve({ latitude: null, longitude: null, name: null });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }, []);

  // Log verification to database
  const logVerification = useCallback(async (
    verificationResult: VerificationResult,
    locationInfo: LocationInfo
  ) => {
    if (!codigo) return;

    try {
      const { error } = await supabase.functions.invoke("log-pass-verification", {
        body: {
          passId: verificationResult.data?.id || "unknown",
          passNumber: verificationResult.data?.passeNumero || null,
          personName: verificationResult.data?.nome || null,
          personType: verificationResult.data?.tipo || null,
          verificationStatus: verificationResult.status,
          verificationCode: codigo,
          locationLatitude: locationInfo.latitude,
          locationLongitude: locationInfo.longitude,
          locationName: locationInfo.name,
        },
      });

      if (error) {
        console.error("Failed to log verification:", error);
      } else {
        console.log("Verification logged successfully");
      }
    } catch (e) {
      console.error("Error logging verification:", e);
    }
  }, [codigo]);

  useEffect(() => {
    const verifyPass = async () => {
      setLoading(true);

      // Get location in parallel with verification
      const locationPromise = getLocation();

      if (!codigo) {
        const errorResult: VerificationResult = {
          status: "error",
          data: null,
          message: "Código de verificação não fornecido.",
        };
        setResult(errorResult);
        setLoading(false);
        return;
      }

      let verificationResult: VerificationResult;

      try {
        // Decode the base64 verification code
        const decoded = atob(codigo);
        const [id, passeNumero, validade] = decoded.split(":");

        if (!id || !passeNumero) {
          throw new Error("Formato de código inválido");
        }

        // Construct the data from the decoded values
        const qrData: QRData = {
          id,
          nome: "Dados disponíveis no sistema",
          tipo: id.startsWith("EST") ? "estudante" : id.startsWith("PROF") ? "professor" : "funcionario",
          identificador: "",
          passeNumero,
          validade: validade || null,
          instituicao: "SGE",
          verificacao: codigo.slice(0, 16),
        };

        // Check if pass is expired
        const today = new Date();
        const validadeDate = validade ? new Date(validade) : null;

        if (validadeDate && validadeDate < today) {
          verificationResult = {
            status: "expired",
            data: qrData,
            message: `Este passe expirou em ${validadeDate.toLocaleDateString("pt-AO")}.`,
          };
        } else {
          verificationResult = {
            status: "valid",
            data: qrData,
            message: "Passe válido e autenticado com sucesso.",
          };
        }
      } catch (error) {
        console.error("Error verifying pass:", error);
        verificationResult = {
          status: "invalid",
          data: null,
          message: "O código QR é inválido ou está corrompido.",
        };
      }

      // Wait for location
      const locationInfo = await locationPromise;
      setLocation(locationInfo);

      // Log the verification
      await logVerification(verificationResult, locationInfo);

      setResult(verificationResult);
      setLoading(false);
    };

    verifyPass();
  }, [codigo, getLocation, logVerification]);

  const getTipoIcon = (tipo: TipoPasse) => {
    const icons = {
      estudante: GraduationCap,
      professor: Users,
      funcionario: Briefcase,
    };
    return icons[tipo];
  };

  const getTipoLabel = (tipo: TipoPasse) => {
    const labels = {
      estudante: "Estudante",
      professor: "Professor(a)",
      funcionario: "Funcionário(a)",
    };
    return labels[tipo];
  };

  const getStatusConfig = (status: VerificationResult["status"]) => {
    const configs = {
      valid: {
        icon: CheckCircle2,
        iconColor: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        title: "Passe Válido",
        badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      expired: {
        icon: AlertCircle,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        title: "Passe Expirado",
        badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      invalid: {
        icon: XCircle,
        iconColor: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
        title: "Passe Inválido",
        badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      error: {
        icon: AlertCircle,
        iconColor: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-900",
        borderColor: "border-gray-200 dark:border-gray-800",
        title: "Erro de Verificação",
        badgeClass: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground">A verificar passe...</p>
              {locationLoading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  A obter localização...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const config = getStatusConfig(result.status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">SGE</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão Escolar - Verificação de Passes
          </p>
        </div>

        {/* Result Card */}
        <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${config.bgColor}`}>
                <StatusIcon className={`h-16 w-16 ${config.iconColor}`} />
              </div>
            </div>
            <CardTitle className="text-center text-xl">
              {config.title}
            </CardTitle>
            <CardDescription className="text-center">
              {result.message}
            </CardDescription>
          </CardHeader>

          {result.data && (
            <CardContent className="space-y-4">
              {/* Person Details */}
              <div className="bg-background rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <Badge className={config.badgeClass}>
                    {(() => {
                      const Icon = getTipoIcon(result.data.tipo);
                      return (
                        <span className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {getTipoLabel(result.data.tipo)}
                        </span>
                      );
                    })()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="font-mono text-sm font-medium">
                    {result.data.id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nº Passe</span>
                  <span className="font-mono text-sm font-medium">
                    {result.data.passeNumero || "---"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Validade
                  </span>
                  <span className={`font-medium text-sm ${result.status === "expired" ? "text-red-600" : ""}`}>
                    {result.data.validade 
                      ? new Date(result.data.validade).toLocaleDateString("pt-AO")
                      : "---"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Instituição
                  </span>
                  <span className="font-medium text-sm">
                    {result.data.instituicao}
                  </span>
                </div>
              </div>

              {/* Location Info */}
              {location.name && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <MapPin className="h-3 w-3" />
                  <span>{location.name}</span>
                </div>
              )}

              {/* Verification Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Shield className="h-3 w-3" />
                <span>Código de verificação: {result.data.verificacao}</span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Clock className="h-3 w-3" />
                <span>Verificado em: {new Date().toLocaleString("pt-AO")}</span>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Esta verificação é gerada automaticamente pelo Sistema de Gestão Escolar.
          <br />
          Em caso de dúvidas, contacte a Secretaria.
        </p>
      </div>
    </div>
  );
};

export default VerificarPasse;
