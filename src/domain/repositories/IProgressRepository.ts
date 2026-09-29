
import type { CourseProgress, GlobalLearningStats } from "../entities/UserProgress";

export interface IProgressRepository {
  getProgress(courseId: string): CourseProgress;
  getAllProgress(): Record<string, CourseProgress>;
  saveProgress(progress: CourseProgress): void;
  toggleLessonWatched(courseId: string, lessonId: string, totalLessons: number): CourseProgress;
  toggleFavorite(courseId: string): CourseProgress;
  toggleWatchLater(courseId: string): CourseProgress;
  saveCourseNotes(courseId: string, notes: string): CourseProgress;
  getGlobalStats(totalCourses: number, courses: { category: string }[]): GlobalLearningStats;
  exportProgress(): string;
  importProgress(jsonStr: string): boolean;
}
