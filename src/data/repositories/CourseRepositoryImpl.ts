import type { Course } from "../../domain/entities/Course";
import type { FilterState } from "../../domain/entities/FilterState";
import type { ICourseRepository } from "../../domain/repositories/ICourseRepository";

export class CourseRepositoryImpl implements ICourseRepository {
  private coursesCache: Course[] | null = null;

  async getAllCourses(): Promise<Course[]> {
    if (this.coursesCache) {
      return this.coursesCache;
    }

    try {
      const res = await fetch("/courses_catalog.json");
      if (!res.ok) throw new Error(`Network fetch failed with status ${res.status}`);
      const data: Course[] = await res.json();
      data.forEach(c => {
        const base = c.localPath ? (c.localPath.endsWith("/") ? c.localPath : c.localPath + "/") : "";
        (c.modules || []).forEach(m => {
          (m.lessons || []).forEach(l => {
            if (!l.filePath && (l as any).relPath) {
              l.filePath = base + (l as any).relPath;
            }
          });
        });
      });
      this.coursesCache = data;
      return data;
    } catch (e: any) {
      console.error("Error loading courses:", e.message);
      return [];
    }
  }

  async getCourseById(id: string): Promise<Course | null> {
    const courses = await this.getAllCourses();
    return courses.find(c => c.id === id) || null;
  }

  async searchCourses(_filters: FilterState): Promise<Course[]> {
    const courses = await this.getAllCourses();
    return courses;
  }

  async getCategories(): Promise<string[]> {
    const courses = await this.getAllCourses();
    const cats = new Set<string>();
    courses.forEach(c => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats).sort();
  }

  async getAuthors(): Promise<string[]> {
    const courses = await this.getAllCourses();
    const authors = new Set<string>();
    courses.forEach(c => {
      if (c.author && c.author !== "Especialista de la Industria") {
        authors.add(c.author);
      }
    });
    return Array.from(authors).sort();
  }

  async getNiches(): Promise<string[]> {
    const courses = await this.getAllCourses();
    const niches = new Set<string>();
    courses.forEach(c => {
      if (c.niche) niches.add(c.niche);
    });
    return Array.from(niches).sort();
  }
}