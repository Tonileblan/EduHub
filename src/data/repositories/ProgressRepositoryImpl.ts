
import type { CourseProgress, GlobalLearningStats } from "../../domain/entities/UserProgress";
import type { IProgressRepository } from "../../domain/repositories/IProgressRepository";

const STORAGE_KEY = "eduhub_learning_progress_v1";

export class ProgressRepositoryImpl implements IProgressRepository {
  private progressMap: Record<string, CourseProgress> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.progressMap = JSON.parse(raw);
      }
    } catch (e) {
      this.progressMap = {};
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progressMap));
    } catch (e) {
      console.error("Failed to persist learning progress:", e);
    }
  }

  getProgress(courseId: string): CourseProgress {
    if (!this.progressMap[courseId]) {
      return {
        courseId,
        status: "NOT_STARTED",
        isFavorite: false,
        isWatchLater: false,
        completedLessonIds: [],
        notes: "",
        percentCompleted: 0
      };
    }
    return this.progressMap[courseId];
  }

  getAllProgress(): Record<string, CourseProgress> {
    return { ...this.progressMap };
  }

  saveProgress(progress: CourseProgress): void {
    this.progressMap[progress.courseId] = progress;
    this.persist();
  }

  toggleLessonWatched(courseId: string, lessonId: string, totalLessons: number): CourseProgress {
    const current = this.getProgress(courseId);
    const completedSet = new Set(current.completedLessonIds);

    if (completedSet.has(lessonId)) {
      completedSet.delete(lessonId);
    } else {
      completedSet.add(lessonId);
    }

    const completedLessonIds = Array.from(completedSet);
    const total = Math.max(1, totalLessons || completedLessonIds.length);
    const percent = Math.min(100, Math.round((completedLessonIds.length / total) * 100));

    let status = current.status;
    if (percent === 100) {
      status = "COMPLETED";
    } else if (completedLessonIds.length > 0) {
      status = "IN_PROGRESS";
    } else if (status === "IN_PROGRESS") {
      status = "NOT_STARTED";
    }

    const updated: CourseProgress = {
      ...current,
      completedLessonIds,
      percentCompleted: percent,
      status,
      lastWatchedLessonId: lessonId,
      lastWatchedAt: new Date().toISOString()
    };

    this.saveProgress(updated);
    return updated;
  }

  toggleFavorite(courseId: string): CourseProgress {
    const current = this.getProgress(courseId);
    const updated: CourseProgress = {
      ...current,
      isFavorite: !current.isFavorite
    };
    this.saveProgress(updated);
    return updated;
  }

  toggleWatchLater(courseId: string): CourseProgress {
    const current = this.getProgress(courseId);
    const updated: CourseProgress = {
      ...current,
      isWatchLater: !current.isWatchLater
    };
    this.saveProgress(updated);
    return updated;
  }

  saveCourseNotes(courseId: string, notes: string): CourseProgress {
    const current = this.getProgress(courseId);
    const updated: CourseProgress = {
      ...current,
      notes
    };
    this.saveProgress(updated);
    return updated;
  }

  getGlobalStats(totalCourses: number, courses: { category: string }[]): GlobalLearningStats {
    let coursesStarted = 0;
    let coursesCompleted = 0;
    let totalLessonsWatched = 0;
    let favoriteCount = 0;
    let watchLaterCount = 0;

    Object.values(this.progressMap).forEach(p => {
      if (p.status === "IN_PROGRESS") coursesStarted++;
      if (p.status === "COMPLETED") coursesCompleted++;
      if (p.isFavorite) favoriteCount++;
      if (p.isWatchLater) watchLaterCount++;
      totalLessonsWatched += p.completedLessonIds.length;
    });

    const categoryCounts: Record<string, number> = {};
    courses.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCoursesAvailable: totalCourses,
      coursesStarted,
      coursesCompleted,
      totalLessonsWatched,
      favoriteCount,
      watchLaterCount,
      topCategories
    };
  }

  exportProgress(): string {
    return JSON.stringify(this.progressMap, null, 2);
  }

  importProgress(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === "object" && parsed !== null) {
        this.progressMap = parsed;
        this.persist();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
