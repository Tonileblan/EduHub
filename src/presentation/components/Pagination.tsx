
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginación de catálogo" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", margin: "3rem 0" }}>
      <button
        type="button"
        className="btn-secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        ◀ Anterior
      </button>

      <span style={{ fontSize: "1.4rem", color: "var(--text-secondary)", fontWeight: 600 }}>
        Página {currentPage} de {totalPages}
      </span>

      <button
        type="button"
        className="btn-secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        Siguiente ▶
      </button>
    </nav>
  );
};
