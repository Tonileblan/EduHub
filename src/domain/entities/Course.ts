import type { Module } from "./Module";

export type OriginType = "DRIVE_MI_UNIDAD" | "DRIVE_COMPARTIDA" | "LOCAL_SSD";

export interface Course {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
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
  modules?: Module[];
}