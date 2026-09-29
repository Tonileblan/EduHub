
import React from "react";

interface NavbarProps {
  onOpenScanner: () => void;
  onOpenStats: () => void;
  showStats: boolean;
  totalCourses: number;
}

export const Navbar: React.FC<NavbarProps> = ({
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
