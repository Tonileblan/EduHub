
import React from "react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanner: () => void;
  onOpenStats: () => void;
  showStats: boolean;
  totalCourses: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenScanner,
  onOpenStats,
  showStats,
  totalCourses
}) => {
  return (
    <header className="navbar" role="banner">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">🎓</div>
        <div className="brand-info">
          <h1>EduHub Pro</h1>
          <p>Tu Centro Maestro de Formación & Google Drive</p>
        </div>
      </div>

      {/* Global Persistent Sticky Search Bar */}
      <div className="nav-search-container" role="search">
        <div className="nav-search-box">
          <span className="nav-search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Buscar cursos, autores, tecnologías... (/)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar en todo el catálogo de cursos"
          />
          {searchQuery ? (
            <button
              type="button"
              className="nav-search-clear-btn"
              onClick={() => onSearchChange("")}
              aria-label="Borrar búsqueda en la barra de navegación"
            >
              ✕
            </button>
          ) : (
            <span className="nav-search-kbd-badge" aria-hidden="true" title="Presiona / para buscar">/</span>
          )}
        </div>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenStats}
          aria-label="Alternar métricas de aprendizaje"
        >
          📊 {showStats ? "Ocultar Métricas" : "Ver Métricas"}
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onOpenScanner}
          aria-label="Abrir panel de actualización y sincronización de cursos"
        >
          🔄 Actualizar Catálogo ({totalCourses.toLocaleString()})
        </button>
      </div>
    </header>
  );
};
