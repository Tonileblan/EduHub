
import type { CourseProgress } from "../entities/UserProgress";
import type { IProgressRepository } from "../repositories/IProgressRepository";

export class UpdateProgressUseCase {
  private progressRepo: IProgressRepository;

  constructor(progressRepo: IProgressRepository) {
    this.progressRepo = progressRepo;
  }

  toggleLesson(courseId: string, lessonId: string, totalLessons: number): CourseProgress {
    return this.progressRepo.toggleLessonWatched(courseId, lessonId, totalLessons);
  }

  toggleFavorite(courseId: string): CourseProgress {
    return this.progressRepo.toggleFavorite(courseId);
  }

  toggleWatchLater(courseId: string): CourseProgress {
    return this.progressRepo.toggleWatchLater(courseId);
  }

  saveNotes(courseId: string, notes: string): CourseProgress {
    return this.progressRepo.saveCourseNotes(courseId, notes);
  }
}
