import { useState, useEffect, useMemo } from "react";
import type { Course } from "../../domain/entities/Course";
import type { FilterState } from "../../domain/entities/FilterState";
import { FilterCoursesUseCase } from "../../domain/usecases/FilterCoursesUseCase";
import { CourseRepositoryImpl } from "../../data/repositories/CourseRepositoryImpl";
import type { CourseProgress } from "../../domain/entities/UserProgress";

const courseRepo = new CourseRepositoryImpl();

export const initialFilterState: FilterState = {
  searchQuery: "",
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

export function useCourses(progressMap: Record<string, CourseProgress>) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [niches, setNiches] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await courseRepo.getAllCourses();
        setCourses(data);

        const [cats, auths, nich, plat] = await Promise.all([
          courseRepo.getCategories(),
          courseRepo.getAuthors(),
          courseRepo.getNiches(),
          courseRepo.getPlatforms()
        ]);
        setCategories(cats);
        setAuthors(auths);
        setNiches(nich);
        setPlatforms(plat);
      } catch (err: any) {
        setError(err.message || "Error al cargar catálogo de cursos");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    return FilterCoursesUseCase.filter(courses, filters, progressMap);
  }, [courses, filters, progressMap]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const markCourseAsPrepared = (courseId: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, isPreparedInDrive: true, isUploadedToDrive: true, pipelineStatus: "UPLOADED" }
          : c
      )
    );
  };

  return {
    courses,
    filteredCourses,
    loading,
    error,
    filters,
    categories,
    authors,
    niches,
    platforms,
    updateFilters,
    resetFilters,
    markCourseAsPrepared
  };
}
