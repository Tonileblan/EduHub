import type { Course } from "../entities/Course";
import type { FilterState } from "../entities/FilterState";
import type { CourseProgress } from "../entities/UserProgress";

export class FilterCoursesUseCase {
  static filter(
    courses: Course[],
    filters: FilterState,
    progressMap: Record<string, CourseProgress>
  ): Course[] {
    const query = filters.searchQuery.trim().toLowerCase();
    
    return courses.filter(course => {
      // 1. Text Search across Title, Author, Niche, Utility, Tags
      if (query) {
        const titleMatch = course.title.toLowerCase().includes(query);
        const authorMatch = course.author.toLowerCase().includes(query);
        const nicheMatch = course.niche.toLowerCase().includes(query);
        const utilityMatch = course.utility.toLowerCase().includes(query);
        const categoryMatch = course.category.toLowerCase().includes(query);
        const tagMatch = course.tags.some(t => t.toLowerCase().includes(query));

        if (!titleMatch && !authorMatch && !nicheMatch && !utilityMatch && !categoryMatch && !tagMatch) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category && filters.category !== "ALL") {
        if (course.category !== filters.category) return false;
      }

      // 3. Author Filter
      if (filters.author && filters.author !== "ALL") {
        if (course.author !== filters.author) return false;
      }

      // 4. Niche Filter
      if (filters.niche && filters.niche !== "ALL") {
        if (course.niche !== filters.niche) return false;
      }

      // 5. Origin Type Filter
      if (filters.originType && filters.originType !== "ALL") {
        if (course.originType !== filters.originType) return false;
      }

      // 6. Format Type Filter (ZIP/RAR vs Direct Folder)
      if (filters.formatType && filters.formatType !== "ALL") {
        if (filters.formatType === "ARCHIVES" && !course.isArchive) return false;
        if (filters.formatType === "FOLDERS" && course.isArchive) return false;
      }

      // 7. User Status Filter
      if (filters.status && filters.status !== "ALL") {
        const progress = progressMap[course.id];
        if (filters.status === "FAVORITE" && !progress?.isFavorite) return false;
        if (filters.status === "WATCH_LATER" && !progress?.isWatchLater) return false;
        if (filters.status === "IN_PROGRESS" && progress?.status !== "IN_PROGRESS") return false;
        if (filters.status === "COMPLETED" && progress?.status !== "COMPLETED") return false;
        if (filters.status === "NOT_STARTED" && progress?.status && progress.status !== "NOT_STARTED") return false;
      }

      // 8. Only with local scanned lessons
      if (filters.onlyWithLessons && !course.hasLocalFiles) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "rating_desc") {
        return b.rating - a.rating;
      }
      if (filters.sortBy === "lessons_desc") {
        return b.totalLessons - a.totalLessons;
      }
      if (filters.sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (filters.sortBy === "author_asc") {
        return a.author.localeCompare(b.author);
      }
      if (a.originType === "LOCAL_SSD" && b.originType !== "LOCAL_SSD") return -1;
      if (b.originType === "LOCAL_SSD" && a.originType !== "LOCAL_SSD") return 1;
      return b.rating - a.rating;
    });
  }
}
