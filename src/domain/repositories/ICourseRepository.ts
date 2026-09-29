
import type { Course } from "../entities/Course";
import type { FilterState } from "../entities/FilterState";

export interface ICourseRepository {
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | null>;
  searchCourses(filters: FilterState): Promise<Course[]>;
  getCategories(): Promise<string[]>;
  getAuthors(): Promise<string[]>;
  getNiches(): Promise<string[]>;
}
