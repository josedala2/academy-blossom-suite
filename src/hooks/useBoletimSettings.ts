import { useState, useEffect, useCallback } from "react";

// Preset color options
export const colorPresets = [
  { name: "Verde Institucional", value: "#2E7D32", rgb: [46, 125, 50] },
  { name: "Azul Académico", value: "#1565C0", rgb: [21, 101, 192] },
  { name: "Azul Marinho", value: "#0D47A1", rgb: [13, 71, 161] },
  { name: "Bordô", value: "#880E4F", rgb: [136, 14, 79] },
  { name: "Roxo Elegante", value: "#4A148C", rgb: [74, 20, 140] },
  { name: "Cinza Profissional", value: "#37474F", rgb: [55, 71, 79] },
  { name: "Dourado", value: "#F57F17", rgb: [245, 127, 23] },
  { name: "Verde Escuro", value: "#1B5E20", rgb: [27, 94, 32] },
];

export interface BoletimSignature {
  label: string;
  name: string;
  enabled: boolean;
}

export interface BoletimSettings {
  schoolName: string;
  headerColor: string;
  headerColorRgb: number[];
  logoBase64: string | null;
  footerText: string;
  showGenerationDate: boolean;
  signatures: BoletimSignature[];
  lastUpdated: string;
}

const STORAGE_KEY = "boletim-settings";

const defaultSettings: BoletimSettings = {
  schoolName: "Sistema de Gestão Escolar",
  headerColor: colorPresets[0].value,
  headerColorRgb: colorPresets[0].rgb,
  logoBase64: null,
  footerText: "",
  showGenerationDate: true,
  signatures: [
    { label: "Director Pedagógico", name: "", enabled: true },
    { label: "Encarregado de Educação", name: "", enabled: true },
  ],
  lastUpdated: new Date().toISOString(),
};

export function useBoletimSettings() {
  const [settings, setSettings] = useState<BoletimSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new fields
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Error loading boletim settings:", error);
    }
    return defaultSettings;
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Create object URL for logo when component mounts
  useEffect(() => {
    if (settings.logoBase64) {
      setLogoUrl(settings.logoBase64);
    } else {
      setLogoUrl(null);
    }
  }, [settings.logoBase64]);

  const updateSettings = useCallback((updates: Partial<BoletimSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error("Error saving boletim settings:", error);
      return false;
    }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setLogoUrl(null);
    setIsDirty(true);
  }, []);

  const handleColorSelect = useCallback((preset: typeof colorPresets[0]) => {
    updateSettings({
      headerColor: preset.value,
      headerColorRgb: preset.rgb,
    });
  }, [updateSettings]);

  const handleCustomColorChange = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    updateSettings({
      headerColor: hex,
      headerColorRgb: [r, g, b],
    });
  }, [updateSettings]);

  const handleLogoUpload = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (file.size > 2 * 1024 * 1024) {
        resolve(false);
        return;
      }

      if (!file.type.startsWith("image/")) {
        resolve(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateSettings({ logoBase64: base64 });
        setLogoUrl(base64);
        resolve(true);
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  }, [updateSettings]);

  const handleRemoveLogo = useCallback(() => {
    updateSettings({ logoBase64: null });
    setLogoUrl(null);
  }, [updateSettings]);

  const updateSignature = useCallback((index: number, updates: Partial<BoletimSignature>) => {
    const newSignatures = [...settings.signatures];
    newSignatures[index] = { ...newSignatures[index], ...updates };
    updateSettings({ signatures: newSignatures });
  }, [settings.signatures, updateSettings]);

  const addSignature = useCallback(() => {
    const newSignatures = [
      ...settings.signatures,
      { label: "Nova Assinatura", name: "", enabled: true },
    ];
    updateSettings({ signatures: newSignatures });
  }, [settings.signatures, updateSettings]);

  const removeSignature = useCallback((index: number) => {
    const newSignatures = settings.signatures.filter((_, i) => i !== index);
    updateSettings({ signatures: newSignatures });
  }, [settings.signatures, updateSettings]);

  return {
    settings,
    logoUrl,
    isDirty,
    updateSettings,
    saveSettings,
    resetSettings,
    handleColorSelect,
    handleCustomColorChange,
    handleLogoUpload,
    handleRemoveLogo,
    updateSignature,
    addSignature,
    removeSignature,
    colorPresets,
  };
}
