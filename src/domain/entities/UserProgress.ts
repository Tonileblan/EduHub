
export type CourseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAVORITE" | "WATCH_LATER";

export interface CourseProgress {
  courseId: string;
  status: CourseStatus;
  isFavorite: boolean;
  isWatchLater: boolean;
  completedLessonIds: string[];
  notes: string;
  userRating?: number;
  lastWatchedLessonId?: string;
  lastWatchedAt?: string;
  percentCompleted: number;
}

export interface GlobalLearningStats {
  totalCoursesAvailable: number;
  coursesStarted: number;
  coursesCompleted: number;
  totalLessonsWatched: number;
  favoriteCount: number;
  watchLaterCount: number;
  topCategories: { category: string; count: number }[];
}
