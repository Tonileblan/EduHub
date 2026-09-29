
import { useState, useCallback, useMemo } from "react";
import { ProgressRepositoryImpl } from "../../data/repositories/ProgressRepositoryImpl";
import { UpdateProgressUseCase } from "../../domain/usecases/UpdateProgressUseCase";
import type { CourseProgress } from "../../domain/entities/UserProgress";

const progressRepo = new ProgressRepositoryImpl();
const updateProgressUseCase = new UpdateProgressUseCase(progressRepo);

export function useProgress(totalCourses: number, courses: { category: string }[]) {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>(() => {
    return progressRepo.getAllProgress();
  });

  const toggleLesson = useCallback((courseId: string, lessonId: string, totalLessons: number) => {
    const updated = updateProgressUseCase.toggleLesson(courseId, lessonId, totalLessons);
    setProgressMap(prev => ({ ...prev, [courseId]: updated }));
  }, []);

  const toggleFavorite = useCallback((courseId: string) => {
    const updated = updateProgressUseCase.toggleFavorite(courseId);
    setProgressMap(prev => ({ ...prev, [courseId]: updated }));
  }, []);

  const toggleWatchLater = useCallback((courseId: string) => {
    const updated = updateProgressUseCase.toggleWatchLater(courseId);
    setProgressMap(prev => ({ ...prev, [courseId]: updated }));
  }, []);

  const saveNotes = useCallback((courseId: string, notes: string) => {
    const updated = updateProgressUseCase.saveNotes(courseId, notes);
    setProgressMap(prev => ({ ...prev, [courseId]: updated }));
  }, []);

  const stats = useMemo(() => {
    return progressRepo.getGlobalStats(totalCourses, courses);
  }, [totalCourses, courses, progressMap]);

  return {
    progressMap,
    toggleLesson,
    toggleFavorite,
    toggleWatchLater,
    saveNotes,
    stats
  };
}
