import React from "react";
import type { Course } from "../../domain/entities/Course";
import type { CourseProgress } from "../../domain/entities/UserProgress";
import { getCategoryTheme, getAuthorInitials } from "../utils/courseThemes";

interface CourseListViewProps {
  courses: Course[];
  progressMap: Record<string, CourseProgress>;
  onOpenDetails: (course: Course) => void;
  onToggleFavorite: (courseId: string) => void;
  onToggleWatchLater: (courseId: string) => void;
}

export const CourseListView: React.FC<CourseListViewProps> = ({
  courses,
  progressMap,
  onOpenDetails,
  onToggleFavorite,
  onToggleWatchLater
}) => {
  return (
    <div className="course-list-table-wrapper" role="region" aria-label="Lista de cursos">
      <table className="course-table">
        <thead>
          <tr>
            <th style={{ width: "4rem" }}>Fav</th>
            <th>Curso & Especialidad</th>
            <th>Autor / Creador</th>
            <th>Módulos & Horas</th>
            <th>Progreso</th>
            <th>Acciones Cloud</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const progress = progressMap[course.id];
            const theme = getCategoryTheme(course.category);
            const isFav = progress?.isFavorite || false;
            const isWL = progress?.isWatchLater || false;
            const percent = progress?.percentCompleted || 0;
            const initials = getAuthorInitials(course.author);
            const cleanTitle = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
            const driveUrl = course.webUrl || `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanTitle)}`;
            const isDirect = Boolean(course.webUrl && (course.webUrl.includes('/folders/') || course.webUrl.includes('/file/d/')));

            return (
              <tr key={course.id} className="course-table-row" onClick={() => onOpenDetails(course)}>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <button
                      type="button"
                      className={`row-fav-btn ${isFav ? "active" : ""}`}
                      onClick={() => onToggleFavorite(course.id)}
                      title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>
                    <button
                      type="button"
                      className={`row-fav-btn ${isWL ? "active" : ""}`}
                      onClick={() => onToggleWatchLater(course.id)}
                      title={isWL ? "En lista para ver" : "Guardar para ver más tarde"}
                    >
                      {isWL ? "📌" : "📍"}
                    </button>
                  </div>
                </td>

                <td>
                  <div className="table-course-info">
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                      <div className="table-category-tag" style={{ background: theme.tagBg, color: theme.accentColor }}>
                        <span>{theme.icon}</span> {course.category}
                      </div>
                      {course.platform && course.platform !== "Google Drive Cloud" && (
                        <span style={{ fontSize: "1.1rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", fontWeight: 700 }}>
                          🏢 {course.platform}
                        </span>
                      )}
                      {course.originType === "DRIVE_MI_UNIDAD" && (
                        <span style={{ fontSize: "1.1rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(16, 185, 129, 0.2)", color: "var(--accent-emerald)", fontWeight: 700 }}>
                          ⭐ Mi Unidad
                        </span>
                      )}
                      {course.originType === "DRIVE_SHORTCUT" && (
                        <span style={{ fontSize: "1.1rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", fontWeight: 700 }}>
                          🚀 Atajo Directo
                        </span>
                      )}
                    </div>
                    <h4 className="table-course-title">{course.title}</h4>
                    <div className="table-course-niche">🎯 {course.niche}</div>
                  </div>
                </td>

                <td>
                  <div className="table-author-cell">
                    <div className="author-avatar" style={{ background: theme.gradient }}>
                      {initials}
                    </div>
                    <span>{course.author}</span>
                  </div>
                </td>

                <td>
                  <div className="table-stats-cell">
                    <span>⏱️ {course.estimatedHours}</span>
                    <span>⭐ {course.rating}</span>
                    <span className="lessons-badge">📚 {course.totalLessons} lecciones</span>
                  </div>
                </td>

                <td>
                  <div className="table-progress-cell">
                    <div className="table-progress-text">
                      <span>{percent}%</span>
                      <span>{progress?.completedLessonIds?.length || 0}/{course.totalLessons}</span>
                    </div>
                    <div className="progress-track small">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </td>

                <td onClick={(e) => e.stopPropagation()}>
                  <div className="table-actions-cell">
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-drive-action"
                      style={isDirect ? { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#ffffff" } : undefined}
                      title={isDirect ? "Abrir carpeta en Google Drive (1 Clic)" : "Buscar en Google Drive"}
                    >
                      {isDirect ? "⚡ Drive (1 Clic)" : "☁️ Drive ➔"}
                    </a>
                    <button
                      type="button"
                      className="btn-syllabus-action"
                      onClick={() => onOpenDetails(course)}
                    >
                      Temario
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
