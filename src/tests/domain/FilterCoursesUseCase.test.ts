import { describe, it, expect } from "vitest";
import { FilterCoursesUseCase } from "../../domain/usecases/FilterCoursesUseCase";
import type { Course } from "../../domain/entities/Course";
import type { FilterState } from "../../domain/entities/FilterState";
import type { CourseProgress } from "../../domain/entities/UserProgress";

const mockCourses: Course[] = [
  {
    id: "c1",
    slug: "claude-code",
    title: "Claude Code: El Curso Completo",
    author: "IA Masters Academy",
    category: "IA & Agentes Autónomos",
    niche: "Automatización y Agentes",
    utility: "Construir agentes y loops con Claude Code",
    targetAudience: "Desarrolladores",
    difficulty: "Avanzado",
    estimatedHours: "12h",
    originType: "LOCAL_SSD",
    originName: "Descargas SSD",
    localPath: "/downloads/claude",
    drivePath: "",
    webUrl: "",
    rating: 5.0,
    totalLessons: 35,
    tags: ["IA", "Claude", "Agentes"],
    hasLocalFiles: true,
    isArchive: false
  },
  {
    id: "c2",
    slug: "amazon-fba",
    title: "Aprende a Vender en Amazon FBA",
    author: "David Costarrosa",
    category: "E-Commerce & Amazon FBA",
    niche: "Amazon FBA",
    utility: "Vender productos en Amazon",
    targetAudience: "Emprendedores",
    difficulty: "Intermedio",
    estimatedHours: "8h",
    originType: "DRIVE_COMPARTIDA",
    originName: "Unidad Compartida 1.12",
    localPath: "",
    drivePath: "Google Drive/Unidad 1.12",
    webUrl: "",
    rating: 4.8,
    totalLessons: 14,
    tags: ["Amazon", "Ecommerce"],
    hasLocalFiles: false,
    isArchive: false
  },
  {
    id: "c3",
    slug: "electricidad-industrial-rar",
    title: "Electricidad Industrial",
    author: "Ingeniería Total",
    category: "Desarrollo de Software & Web",
    niche: "Electricidad e Ingeniería",
    utility: "Aprender electricidad industrial",
    targetAudience: "Técnicos",
    difficulty: "Intermedio",
    estimatedHours: "15h",
    originType: "DRIVE_COMPARTIDA",
    originName: "Unidad Compartida 1.10",
    localPath: "/path/Electricidad Industrial.rar",
    drivePath: "Google Drive/Unidad 1.10/Electricidad Industrial.rar",
    webUrl: "",
    rating: 4.7,
    totalLessons: 1,
    tags: ["Ingeniería", "Electricidad"],
    hasLocalFiles: false,
    isArchive: true,
    archiveType: "RAR"
  }
];

const mockProgressMap: Record<string, CourseProgress> = {
  c1: {
    courseId: "c1",
    status: "IN_PROGRESS",
    isFavorite: true,
    isWatchLater: false,
    completedLessonIds: ["l1", "l2"],
    notes: "Mis notas de Claude",
    percentCompleted: 15
  },
  c2: {
    courseId: "c2",
    status: "COMPLETED",
    isFavorite: false,
    isWatchLater: false,
    completedLessonIds: ["l1"],
    notes: "",
    percentCompleted: 100
  }
};

describe("FilterCoursesUseCase", () => {
  it("filters courses by search query matching title", () => {
    const filters: FilterState = {
      searchQuery: "Claude",
      category: "ALL",
      author: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c1");
  });

  it("filters courses by archives (ZIP/RAR)", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ARCHIVES",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c3");
    expect(result[0].isArchive).toBe(true);
  });

  it("filters courses by status FAVORITE", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "FAVORITE",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c1");
  });

  it("filters courses by category", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "E-Commerce & Amazon FBA",
      author: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c2");
  });
});
