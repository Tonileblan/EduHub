import React, { useState } from "react";
import type { Course } from "../../domain/entities/Course";
import type { CourseProgress } from "../../domain/entities/UserProgress";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  onOpenDetails: (course: Course) => void;
  onToggleFavorite: (courseId: string) => void;
  onToggleWatchLater: (courseId: string) => void;
  onOpenExactFolder: (path: string, title: string) => void;
  onUnzipToDrive: (sourcePath: string, title: string) => Promise<void>;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onOpenDetails,
  onToggleFavorite,
  onToggleWatchLater,
  onOpenExactFolder,
  onUnzipToDrive
}) => {
  const [unzipping, setUnzipping] = useState(false);
  const [unzipped, setUnzipped] = useState(false);

  const percent = progress?.percentCompleted || 0;
  const isFav = progress?.isFavorite || false;
  const isWL = progress?.isWatchLater || false;

  const originClass = course.originType === "LOCAL_SSD" ? "ssd"
    : course.originType === "DRIVE_MI_UNIDAD" ? "drive-unit"
    : "drive-shared";

  const originLabel = course.originType === "LOCAL_SSD" ? "💾 SSD Local"
    : course.originType === "DRIVE_MI_UNIDAD" ? "📁 Mi Unidad"
    : "☁️ Unidad Compartida";

  const handleUnzip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!course.localPath) return;
    try {
      setUnzipping(true);
      await onUnzipToDrive(course.localPath, course.title);
      setUnzipped(true);
    } finally {
      setUnzipping(false);
    }
  };

  return (
    <article className="course-card" aria-label={`Curso ${course.title}`}>
      <div>
        <div className="card-top">
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <span className={`origin-badge ${originClass}`}>
              {originLabel}
            </span>
            {course.isArchive && (
              <span className="origin-badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                📦 {course.archiveType || "ZIP / RAR"}
              </span>
            )}
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
            {course.isArchive ? (
              <button
                type="button"
                className="btn-primary"
                style={{ padding: "0.6rem 1rem", fontSize: "1.2rem", minHeight: "auto", background: "linear-gradient(135deg, var(--accent-amber), var(--accent-rose))" }}
                onClick={handleUnzip}
                disabled={unzipping}
                title="Descomprimir automáticamente y subir a tu Mi Unidad en Drive"
                aria-label="Descomprimir y subir a mi Drive"
              >
                {unzipping ? "⏳ Descomprimiendo..." : unzipped ? "✅ En Mi Drive" : "📦 Descomprimir a Drive"}
              </button>
            ) : (
              course.localPath && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: "0.6rem 1rem", fontSize: "1.2rem", minHeight: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenExactFolder(course.localPath, course.title);
                  }}
                  title="Abrir carpeta exacta en Finder / Google Drive"
                  aria-label="Abrir carpeta exacta en Finder"
                >
                  📂 Abrir en Drive
                </button>
              )
            )}

            <button
              type="button"
              className="btn-primary"
              style={{ padding: "0.6rem 1.2rem", fontSize: "1.2rem", minHeight: "auto" }}
              onClick={() => onOpenDetails(course)}
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