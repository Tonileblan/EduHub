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
    isArchive: false,
    platform: "Udemy"
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
    isArchive: false,
    platform: "Hotmart"
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
    archiveType: "RAR",
    platform: "EDteam"
  },
  {
    id: "c4",
    slug: "academia-prime-ia",
    title: "Claude Code UGC Creator Studio",
    author: "Academia Prime IA",
    category: "IA & Automatización",
    niche: "UGC & Modelos IA",
    utility: "Crear agentes y modelos UGC",
    targetAudience: "Creadores",
    difficulty: "Intermedio",
    estimatedHours: "6h",
    originType: "TELEGRAM_TPC",
    originName: "Telegram • DESCARGAS TPC 📥",
    localPath: "/downloads/Academia Prime IA/Claude Code UGC Creator Studio",
    drivePath: "Mi unidad/001-CURSOS/00-IA-CURSOS/Claude Code UGC Creator Studio",
    webUrl: "https://drive.google.com/drive/u/0/search?q=Claude",
    rating: 4.9,
    totalLessons: 22,
    tags: ["Telegram", "UGC", "Claude"],
    hasLocalFiles: true,
    isArchive: false,
    platform: "Academia Prime IA"
  },
  {
    id: "c5",
    slug: "cita-con-el-destino-virtual-tony-robbins-2025",
    title: "Cita con el Destino Virtual - Tony Robbins 2025",
    author: "Tony Robbins",
    category: "Desarrollo Personal, Mente & Productividad",
    niche: "Desarrollo Personal",
    utility: "Transformación personal",
    targetAudience: "Todos",
    difficulty: "Todos los niveles",
    estimatedHours: "20h",
    originType: "DRIVE_SHORTCUT",
    originName: "Atajos Cloud",
    localPath: "",
    drivePath: "",
    webUrl: "https://drive.google.com/drive/folders/12f2MRcez7NPW-jFVyxqvg45rjttgTHe0",
    rating: 4.9,
    totalLessons: 12,
    tags: ["Tony Robbins", "Mentalidad"],
    hasLocalFiles: false,
    isArchive: false,
    platform: "Tony Robbins"
  },
  {
    id: "c6",
    slug: "curso-business-mastery-virtual-tonny-robins",
    title: "Curso Business Mastery Virtual – Tonny Robins",
    author: "Tonny Robins",
    category: "Desarrollo Personal, Mente & Productividad",
    niche: "Negocios y Liderazgo",
    utility: "Maestría en negocios",
    targetAudience: "Líderes",
    difficulty: "Avanzado",
    estimatedHours: "18h",
    originType: "DRIVE_SHORTCUT",
    originName: "Atajos Cloud",
    localPath: "",
    drivePath: "",
    webUrl: "https://drive.google.com/drive/folders/1L1VzqPARy2M8tuSWVSHe7kC3k6m-u2mF",
    rating: 4.8,
    totalLessons: 23,
    tags: ["Tonny Robins", "Business"],
    hasLocalFiles: false,
    isArchive: false,
    platform: "Tony Robbins"
  },
  {
    id: "c7",
    slug: "robin-arzon-mental-strength",
    title: "Robin Arzón - Mental Strength",
    author: "Robin Arzón",
    category: "Desarrollo Personal, Mente & Productividad",
    niche: "Mental Strength",
    utility: "Fuerza mental y resistencia",
    targetAudience: "Atletas y emprendedores",
    difficulty: "Intermedio",
    estimatedHours: "5h",
    originType: "DRIVE_COMPARTIDA",
    originName: "Unidad Masterclass",
    localPath: "",
    drivePath: "",
    webUrl: "https://drive.google.com/drive/folders/robin-arzon",
    rating: 4.8,
    totalLessons: 10,
    tags: ["Masterclass", "Robin Arzón"],
    hasLocalFiles: false,
    isArchive: false,
    platform: "Masterclass USA"
  },
  {
    id: "c8",
    slug: "desata-el-poder-interior-tony-robbins-2025",
    title: "Desata el Poder Interior - Tony Robbins 2025",
    author: "Tony Robbins",
    category: "Desarrollo Personal, Mente & Productividad",
    niche: "Desarrollo Personal",
    utility: "Unleash the Power Within",
    targetAudience: "Todos",
    difficulty: "Todos los niveles",
    estimatedHours: "15h",
    originType: "DRIVE_SHORTCUT",
    originName: "Atajos Cloud",
    localPath: "",
    drivePath: "",
    webUrl: "https://drive.google.com/drive/folders/1t8oyHu5vU91cq55NF7vXkIr_1ljz9nNv",
    rating: 5.0,
    totalLessons: 20,
    tags: ["Tony Robbins", "UPW"],
    hasLocalFiles: false,
    isArchive: false,
    platform: "Tony Robbins"
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
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(2);
    expect(result.map(c => c.id)).toContain("c1");
    expect(result.map(c => c.id)).toContain("c4");
  });

  it("filters courses by archives (ZIP/RAR)", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
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
      platform: "ALL",
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
      platform: "ALL",
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

  it("filters courses by platform", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      platform: "EDteam",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c3");
    expect(result[0].platform).toBe("EDteam");
  });

  it("filters courses by originType TELEGRAM_TPC", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "TELEGRAM_TPC",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c4");
    expect(result[0].originType).toBe("TELEGRAM_TPC");
  });

  it("filters courses by formatType ARCHIVES", () => {
    const filters: FilterState = {
      searchQuery: "",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
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

  it("handles multi-token search across different fields", () => {
    const filters: FilterState = {
      searchQuery: "Claude agentes",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result.map(c => c.id)).toContain("c1");
  });

  it("handles accent-insensitive search queries", () => {
    const filters: FilterState = {
      searchQuery: "ingenieria", // without accent for "Ingeniería"
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result.map(c => c.id)).toContain("c3");
  });

  it("matches 'robins' with fuzzy tolerance to Tony Robbins, Tonny Robins, and Robin Arzón (Google Drive parity)", () => {
    const filters: FilterState = {
      searchQuery: "robins",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    const matchedIds = result.map(c => c.id);
    // Must match Tony Robbins (c5), Tonny Robins (c6), and Robin Arzon (c7)
    expect(matchedIds).toContain("c5");
    expect(matchedIds).toContain("c6");
    expect(matchedIds).toContain("c7");
  });

  it("matches multi-term queries with typos like 'tony robins' or 'destino robins'", () => {
    const filters: FilterState = {
      searchQuery: "destino robins",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const result = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    expect(result.map(c => c.id)).toContain("c5");
  });

  it("verifies fuzzy matching returns Tony Robbins, Tonny Robins, Robin Arzón, and Desata el Poder Interior for 'robins'", () => {
    const filters: FilterState = {
      searchQuery: "robins",
      category: "ALL",
      author: "ALL",
      platform: "ALL",
      niche: "ALL",
      originType: "ALL",
      formatType: "ALL",
      status: "ALL",
      sortBy: "relevance",
      onlyWithLessons: false
    };

    const results = FilterCoursesUseCase.filter(mockCourses, filters, mockProgressMap);
    const matchedIds = results.map(c => c.id);

    expect(matchedIds).toContain("c5"); // Cita con el Destino Virtual - Tony Robbins
    expect(matchedIds).toContain("c6"); // Curso Business Mastery Virtual - Tonny Robins
    expect(matchedIds).toContain("c7"); // Robin Arzón - Mental Strength
    expect(matchedIds).toContain("c8"); // Desata el Poder Interior - Tony Robbins
  });
});
