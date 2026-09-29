
import type { Course } from "../entities/Course";
import type { ICourseRepository } from "../repositories/ICourseRepository";

export class GetCoursesUseCase {
  private courseRepo: ICourseRepository;

  constructor(courseRepo: ICourseRepository) {
    this.courseRepo = courseRepo;
  }

  async execute(): Promise<Course[]> {
    return this.courseRepo.getAllCourses();
  }
}
