
import React from "react";
import type { GlobalLearningStats } from "../../domain/entities/UserProgress";

interface StatsBannerProps {
  stats: GlobalLearningStats;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats }) => {
  return (
    <section className="stats-banner" aria-label="Estadísticas de formación y progreso">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)" }}>
          📚
        </div>
        <div className="stat-content">
          <div className="stat-val">{stats.totalCoursesAvailable.toLocaleString()}</div>
          <div className="stat-label">Cursos en tu Biblioteca</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)" }}>
          ⚡
        </div>
        <div className="stat-content">
          <div className="stat-val">{stats.coursesStarted}</div>
          <div className="stat-label">Cursos en Progreso</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)" }}>
          🏆
        </div>
        <div className="stat-content">
          <div className="stat-val">{stats.coursesCompleted}</div>
          <div className="stat-label">Cursos Completados</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)" }}>
          ❤️
        </div>
        <div className="stat-content">
          <div className="stat-val">{stats.favoriteCount}</div>
          <div className="stat-label">Favoritos Guardados</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)" }}>
          ✅
        </div>
        <div className="stat-content">
          <div className="stat-val">{stats.totalLessonsWatched}</div>
          <div className="stat-label">Lecciones Vistas</div>
        </div>
      </div>
    </section>
  );
};
