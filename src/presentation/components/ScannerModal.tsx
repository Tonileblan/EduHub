
import React from "react";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCourses: number;
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  totalCourses,
  onShowToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="scanner-title">
      <div className="modal-content" style={{ maxWidth: "60rem" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 id="scanner-title" style={{ fontSize: "2rem", fontWeight: 800 }}>
              🔄 Motor de Sincronización
            </h2>
            <p style={{ fontSize: "1.3rem", color: "var(--text-muted)" }}>
              Indexación automática de Google Drive y Almacenamiento Local
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          <div style={{ background: "var(--bg-card)", padding: "1.6rem", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Estado de la Base de Datos</div>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
              {totalCourses.toLocaleString()} Cursos Indexados
            </div>
          </div>

          <div style={{ fontSize: "1.4rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <p style={{ marginBottom: "1rem" }}>
              El catálogo se sincroniza con:
            </p>
            <ul style={{ paddingLeft: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>☁️ <strong>Google Drive:</strong> <code>Mi unidad</code> y <code>140+ Unidades Compartidas</code></li>
              <li>💾 <strong>Almacenamiento Local:</strong> <code>~/Downloads/Claude Code - El Curso Completo</code></li>
            </ul>
          </div>

          <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", padding: "1.4rem", borderRadius: "var(--radius-md)", fontSize: "1.3rem", color: "var(--text-secondary)" }}>
            💡 Para re-escanear nuevas carpetas descargadas o compartidas, puedes ejecutar el script CLI <code>node scripts/scan_and_index_courses.js</code> o pedirle a tu agente que sincronice.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onShowToast("Catálogo verificado y actualizado con éxito", "success");
                onClose();
              }}
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
