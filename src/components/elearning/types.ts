export type ContentType = "video" | "audio" | "presentation" | "pdf" | "document" | "image" | "other";

export interface Content {
  id: string;
  name: string;
  type: ContentType;
  size: string;
  duration?: string; // for video/audio
  url?: string;
  uploadedAt: string;
  description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration?: number; // minutes
  contents: Content[];
  isPublished: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isPublished: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  class: string;
  description: string;
  modules: Module[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

// Helper functions
export const getContentIcon = (type: ContentType): string => {
  switch (type) {
    case "video": return "🎬";
    case "audio": return "🎵";
    case "presentation": return "📊";
    case "pdf": return "📄";
    case "document": return "📝";
    case "image": return "🖼️";
    default: return "📁";
  }
};

export const getContentColor = (type: ContentType): string => {
  switch (type) {
    case "video": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "audio": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "presentation": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "pdf": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "document": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    case "image": return "bg-green-500/10 text-green-500 border-green-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export const getFileContentType = (fileName: string): ContentType => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["mp4", "avi", "mov", "mkv", "webm", "m4v"].includes(ext || "")) return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext || "")) return "audio";
  if (["ppt", "pptx", "odp", "key"].includes(ext || "")) return "presentation";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "txt", "odt", "rtf"].includes(ext || "")) return "document";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext || "")) return "image";
  return "other";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
