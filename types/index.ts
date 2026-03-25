export type BackgroundType = "white" | "blue";
export type PhotoCount = 1 | 2 | 4 | 6 | 8;


// 🔹 Upload Form Data (frontend → backend)
export interface ProcessRequest {
  image: File;
  bgColor: BackgroundType;
  photoCount: PhotoCount;
}


// 🔹 API Response (image URL or blob)
export interface ProcessResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}


// 🔹 Preview Props
export interface PreviewProps {
  originalImage?: string | null;
  processedImage?: string | null;
  loading?: boolean;
}


// 🔹 UploadForm Props
export interface UploadFormProps {
  onResult: (imageUrl: string) => void;
}


// 🔹 Download Button Props
export interface DownloadButtonProps {
  imageUrl: string;
  fileName?: string;
}