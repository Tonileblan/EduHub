
export type FileType = "video" | "pdf" | "doc" | "archive" | "link" | "other";

export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration?: string;
  fileName?: string;
  filePath?: string;
  fileType: FileType;
  webUrl?: string;
  watched?: boolean;
}
