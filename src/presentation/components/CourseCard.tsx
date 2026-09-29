import React from "react";
import type { Course } from "../../domain/entities/Course";
import type { CourseProgress } from "../../domain/entities/UserProgress";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  onOpenDetails: (course: Course) => void;
  onToggleFavorite: (courseId: string) => void;
  onToggleWatchLater: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onOpenDetails,
  onToggleFavorite,
  onToggleWatchLater,
}) => {
  const percent = progress?.percentCompleted || 0;
  const isFav = progress?.isFavorite || false;
  const isWL = progress?.isWatchLater || false;

  const cleanTitle = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
  const driveUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanTitle)}`;

  return (
    <article className="course-card" aria-label={`Curso ${course.title}`} onClick={() => onOpenDetails(course)}>
      <div>
        <div className="card-top">
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <span className="origin-badge drive-unit">
              ☁️ Google Drive
            </span>
            <span className="origin-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
              🌐 Cloud (0 GB Local)
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              className={`card-fav-btn ${isWL ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchLater(course.id);
              }}
              title={isWL ? "En lista para ver" : "Guardar para ver más tarde"}
              aria-label={isWL ? "Quitar de ver más tarde" : "Guardar para ver más tarde"}
            >
              📌
            </button>
            <button
              type="button"
              className={`card-fav-btn ${isFav ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(course.id);
              }}
              title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <h3 className="course-title" title={course.title}>
          {course.title}
        </h3>

        <div className="course-author">
          <span>👤</span> {course.author}
        </div>

        <p className="course-utility">
          {course.utility}
        </p>

        <div className="course-tags">
          <span className="course-tag" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)" }}>
            🎯 {course.niche}
          </span>
          {course.tags.slice(0, 3).map(tag => (
            <span key={tag} className="course-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        {percent > 0 && (
          <div className="card-progress-wrapper">
            <div className="progress-info">
              <span>Progreso: {progress?.completedLessonIds.length || 0}/{course.totalLessons}</span>
              <span>{percent}%</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <div className="card-footer" style={{ gap: "0.8rem", flexWrap: "wrap" }}>
          <div className="card-stats">
            <span>⏱️ {course.estimatedHours}</span>
            <span>⭐ {course.rating}</span>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a
              href={driveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ padding: "0.6rem 1rem", fontSize: "1.2rem", minHeight: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              onClick={(e) => e.stopPropagation()}
              title="Abrir directamente en Google Drive Cloud"
            >
              ☁️ Drive ➔
            </a>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: "0.6rem 1.2rem", fontSize: "1.2rem", minHeight: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(course);
              }}
              aria-label={`Ver detalles de ${course.title}`}
            >
              Temario ➔
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};