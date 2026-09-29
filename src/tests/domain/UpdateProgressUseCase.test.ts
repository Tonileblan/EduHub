
import { describe, it, expect, beforeEach } from "vitest";
import { ProgressRepositoryImpl } from "../../data/repositories/ProgressRepositoryImpl";
import { UpdateProgressUseCase } from "../../domain/usecases/UpdateProgressUseCase";

describe("UpdateProgressUseCase & ProgressRepositoryImpl", () => {
  let repo: ProgressRepositoryImpl;
  let useCase: UpdateProgressUseCase;

  beforeEach(() => {
    localStorage.clear();
    repo = new ProgressRepositoryImpl();
    useCase = new UpdateProgressUseCase(repo);
  });

  it("toggles lesson watched and computes percentage accurately", () => {
    const p1 = useCase.toggleLesson("test-course-1", "lesson-1", 4);
    expect(p1.completedLessonIds).toContain("lesson-1");
    expect(p1.percentCompleted).toBe(25);
    expect(p1.status).toBe("IN_PROGRESS");

    const p2 = useCase.toggleLesson("test-course-1", "lesson-1", 4);
    expect(p2.completedLessonIds).not.toContain("lesson-1");
    expect(p2.percentCompleted).toBe(0);
  });

  it("marks course as COMPLETED when all lessons are watched", () => {
    useCase.toggleLesson("test-course-2", "l1", 2);
    const completed = useCase.toggleLesson("test-course-2", "l2", 2);

    expect(completed.percentCompleted).toBe(100);
    expect(completed.status).toBe("COMPLETED");
  });

  it("toggles favorite state correctly", () => {
    const f1 = useCase.toggleFavorite("test-course-3");
    expect(f1.isFavorite).toBe(true);

    const f2 = useCase.toggleFavorite("test-course-3");
    expect(f2.isFavorite).toBe(false);
  });

  it("saves personal notes for course", () => {
    const p = useCase.saveNotes("test-course-4", "Recuerda repasar hooks de Claude");
    expect(p.notes).toBe("Recuerda repasar hooks de Claude");
  });
});
