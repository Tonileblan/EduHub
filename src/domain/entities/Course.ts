import type { Module } from "./Module";

export type OriginType = "DRIVE_MI_UNIDAD" | "DRIVE_COMPARTIDA" | "DRIVE_SHORTCUT" | "LOCAL_SSD" | "TELEGRAM_TPC";

export interface Course {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  platform?: string;
  niche: string;
  utility: string;
  targetAudience: string;
  difficulty: string;
  estimatedHours: string;
  originType: OriginType;
  originName: string;
  localPath: string;
  drivePath: string;
  webUrl: string;
  rating: number;
  totalLessons: number;
  tags: string[];
  hasLocalFiles?: boolean;
  isArchive?: boolean;
  archiveType?: "ZIP" | "RAR" | "7Z" | "OTHER";
  archivePath?: string;
  isPreparedInDrive?: boolean;
  modules?: Module[];
  telegramChannel?: string;
  telegramSearchUrl?: string;
  isUploadedToDrive?: boolean;
  pipelineStatus?: "PENDING" | "DOWNLOADED" | "EXTRACTED" | "UPLOADED";
}