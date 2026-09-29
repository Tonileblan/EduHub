import React from "react";
import type { Course } from "../../domain/entities/Course";
import type { CourseProgress } from "../../domain/entities/UserProgress";
import { getCategoryTheme, getAuthorInitials } from "../utils/courseThemes";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  onOpenDetails: (course: Course) => void;
  onToggleFavorite: (courseId: string) => void;
  onToggleWatchLater: (courseId: string) => void;
  onOpenPipeline?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onOpenDetails,
  onToggleFavorite,
  onToggleWatchLater,
  onOpenPipeline
}) => {
  const theme = getCategoryTheme(course.category);
  const percent = progress?.percentCompleted || 0;
  const isFav = progress?.isFavorite || false;
  const isWL = progress?.isWatchLater || false;
  const initials = getAuthorInitials(course.author);
  const isTelegram = course.originType === "TELEGRAM_TPC";

  const cleanTitle = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
  const driveUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanTitle)}`;

  return (
    <article
      className="course-card-v2"
      aria-label={`Curso ${course.title}`}
      onClick={() => onOpenDetails(course)}
      style={{
        "--theme-gradient": theme.gradient,
        "--theme-accent": isTelegram ? "#d946ef" : theme.accentColor,
        "--theme-glow": isTelegram ? "rgba(217, 70, 239, 0.4)" : theme.glowColor,
        "--theme-badge-bg": theme.badgeBg
      } as React.CSSProperties}
    >
      {/* Visual Thumbnail Banner */}
      <div className="card-media-banner" style={{ background: theme.gradient }}>
        <div className="banner-pattern-overlay" />
        <span className="banner-watermark-icon">{isTelegram ? "✈️" : theme.icon}</span>

        {/* Top Badges over banner */}
        <div className="banner-top-row">
          {isTelegram ? (
            <span className="banner-cloud-pill" style={{ background: "rgba(192, 38, 211, 0.7)", borderColor: "rgba(240, 171, 252, 0.5)", color: "#ffffff" }}>
              ✈️ Telegram TPC (SSD ➜ Drive)
            </span>
          ) : (
            <span className="banner-cloud-pill">
              ☁️ Drive 0 GB Local
            </span>
          )}

          <div className="banner-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`banner-icon-btn ${isWL ? "active" : ""}`}
              onClick={() => onToggleWatchLater(course.id)}
              title={isWL ? "En lista para ver" : "Guardar para ver más tarde"}
              aria-label="Ver más tarde"
            >
              📌
            </button>
            <button
              type="button"
              className={`banner-icon-btn ${isFav ? "active" : ""}`}
              onClick={() => onToggleFavorite(course.id)}
              title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              aria-label="Favorito"
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* Bottom Badges over banner */}
        <div className="banner-bottom-row">
          <span className="banner-rating-badge">
            ⭐ {course.rating.toFixed(1)}
          </span>
          <span className="banner-lessons-badge">
            📚 {course.totalLessons} lecciones
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="card-body-content">
        <div className="card-category-header">
          <span className="card-category-tag" style={{ background: theme.tagBg, color: theme.accentColor }}>
            <span>{theme.icon}</span> {course.category}
          </span>
          <span className="card-duration-tag">
            ⏱️ {course.estimatedHours}
          </span>
        </div>

        <h3 className="card-course-title" title={course.title}>
          {course.title}
        </h3>

        <div className="card-author-row">
          <div className="card-author-avatar" style={{ background: theme.gradient }}>
            {initials}
          </div>
          <span className="card-author-name">{course.author}</span>
        </div>

        <p className="card-course-utility">
          {course.utility}
        </p>

        <div className="card-tags-row">
          {isTelegram && (
            <span className="niche-tag" style={{ background: "rgba(217, 70, 239, 0.2)", color: "#f0abfc", borderColor: "rgba(217, 70, 239, 0.4)" }}>
              ✈️ DESCARGAS TPC
            </span>
          )}
          <span className="niche-tag">
            🎯 {course.niche}
          </span>
          {course.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="meta-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Track if started */}
      {percent > 0 && (
        <div className="card-progress-section">
          <div className="progress-info-row">
            <span>Progreso: {progress?.completedLessonIds.length || 0}/{course.totalLessons}</span>
            <span className="progress-percent">{percent}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${percent}%`, background: theme.gradient }} />
          </div>
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="card-action-footer" onClick={(e) => e.stopPropagation()}>
        {isTelegram ? (
          <button
            type="button"
            className="btn-drive-main"
            style={{ background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)", boxShadow: "0 4px 14px rgba(217, 70, 239, 0.4)" }}
            onClick={() => onOpenPipeline ? onOpenPipeline(course) : onOpenDetails(course)}
            title="Procesar descarga de Telegram, descompresión y subida a Drive"
          >
            <span>⚡ Pipeline SSD ➜ Drive</span>
            <span className="btn-arrow">➔</span>
          </button>
        ) : (
          <a
            href={driveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-drive-main"
            title="Abrir directamente en Google Drive Cloud"
          >
            <span>☁️ Ver en Drive</span>
            <span className="btn-arrow">➔</span>
          </a>
        )}

        <button
          type="button"
          className="btn-temario-sec"
          onClick={() => onOpenDetails(course)}
          aria-label={`Ver temario de ${course.title}`}
        >
          📖 Temario
        </button>
      </div>
    </article>
  );
};