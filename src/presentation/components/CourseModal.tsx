import React, { useState } from "react";
import type { Course } from "../../domain/entities/Course";
import type { CourseProgress } from "../../domain/entities/UserProgress";

interface CourseModalProps {
  course: Course | null;
  progress?: CourseProgress;
  onClose: () => void;
  onToggleLesson: (courseId: string, lessonId: string, totalLessons: number) => void;
  onSaveNotes: (courseId: string, notes: string) => void;
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenExactFolder: (path: string, title: string) => void;
  onUnzipToDrive: (sourcePath: string, title: string) => Promise<void>;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  progress,
  onClose,
  onToggleLesson,
  onSaveNotes,
  onShowToast,
  onOpenExactFolder,
  onUnzipToDrive
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<"syllabus" | "notes" | "info">("syllabus");
  const [notesText, setNotesText] = useState(progress?.notes || "");
  const [unzipping, setUnzipping] = useState(false);
  const [unzipped, setUnzipped] = useState(false);

  const handleCopyPath = (path: string, label: string) => {
    navigator.clipboard.writeText(path);
    onShowToast(`Ruta copiada al portapapeles: ${label}`, "info");
  };

  const handleSaveNotes = () => {
    onSaveNotes(course.id, notesText);
    onShowToast("Notas guardadas correctamente", "success");
  };

  const handleUnzip = async () => {
    if (!course.localPath) return;
    try {
      setUnzipping(true);
      await onUnzipToDrive(course.localPath, course.title);
      setUnzipped(true);
    } finally {
      setUnzipping(false);
    }
  };

  const completedSet = new Set(progress?.completedLessonIds || []);
  const percent = progress?.percentCompleted || 0;

  const cleanSearchTerm = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
  const driveWebSearchUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanSearchTerm)}`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.8rem" }}>
              <span className="course-tag" style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--accent-primary)" }}>
                {course.category}
              </span>
              {course.isArchive && (
                <span className="course-tag" style={{ background: "rgba(245, 158, 11, 0.2)", color: "var(--accent-amber)" }}>
                  📦 Archivo Comprimido ({course.archiveType || "ZIP / RAR"})
                </span>
              )}
            </div>
            <h2 id="modal-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
              {course.title}
            </h2>
            <div style={{ fontSize: "1.4rem", color: "var(--accent-cyan)", fontWeight: 600 }}>
              👤 Creador / Autor: {course.author}
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal de curso"
          >
            ✕
          </button>
        </div>

        {/* Action Bar for Exact Drive Opening & Unzipping */}
        <div style={{ padding: "1.4rem 2.4rem", background: "rgba(99, 102, 241, 0.08)", borderBottom: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "1.3rem", color: "var(--text-secondary)" }}>
            <span>📍 <strong>Ubicación:</strong> {course.originName}</span>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {course.isArchive && (
              <button
                type="button"
                className="btn-primary"
                style={{ background: "linear-gradient(135deg, var(--accent-amber), var(--accent-rose))" }}
                onClick={handleUnzip}
                disabled={unzipping}
              >
                {unzipping ? "⏳ Descomprimiendo y Subiendo a Mi Drive..." : unzipped ? "✅ Listo en Mi Unidad (Abrir)" : "📦 Descomprimir y Pasar a Mi Drive"}
              </button>
            )}

            {course.localPath && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => onOpenExactFolder(course.localPath, course.title)}
              >
                📂 Abrir en Drive (Mac)
              </button>
            )}

            <a
              href={driveWebSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              🌐 Buscar en Drive Web ➔
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", padding: "1.2rem 2.4rem", borderBottom: "1px solid var(--border-glass)", background: "var(--bg-card)" }}>
          <button
            type="button"
            className={`category-pill ${activeTab === "syllabus" ? "active" : ""}`}
            onClick={() => setActiveTab("syllabus")}
          >
            📖 Temario y Lecciones ({course.totalLessons})
          </button>
          <button
            type="button"
            className={`category-pill ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            ℹ️ Ficha Técnica & Enlaces
          </button>
          <button
            type="button"
            className={`category-pill ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            📝 Mis Apuntes {progress?.notes ? "•" : ""}
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "syllabus" && (
            <div>
              {course.isArchive && (
                <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "var(--radius-md)", padding: "1.6rem", marginBottom: "2rem" }}>
                  <div style={{ fontWeight: 700, color: "var(--accent-amber)", fontSize: "1.4rem", marginBottom: "0.4rem" }}>
                    📦 Este curso se encuentra en archivo comprimido ({course.archiveType || "ZIP/RAR"})
                  </div>
                  <p style={{ fontSize: "1.3rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                    Pulsa el botón de abajo para descomprimir el contenido automáticamente y organizarlo dentro de tu carpeta personal <code>Mi unidad / 001-CURSOS</code> en Google Drive.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ background: "linear-gradient(135deg, var(--accent-amber), var(--accent-rose))" }}
                    onClick={handleUnzip}
                    disabled={unzipping}
                  >
                    {unzipping ? "⏳ Descomprimiendo en segundo plano..." : unzipped ? "✅ Descomprimido con Éxito (Abrir)" : "📦 Descomprimir y Pasar a Mi Drive Ahora"}
                  </button>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.6rem", background: "var(--bg-tertiary)", padding: "1.2rem 1.6rem", borderRadius: "var(--radius-md)" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.4rem" }}>Progreso del Curso</div>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
                    {completedSet.size} de {course.totalLessons} lecciones completadas
                  </div>
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
                  {percent}%
                </div>
              </div>

              {course.modules && course.modules.length > 0 ? (
                course.modules.map((m, mIdx) => (
                  <div key={m.id || mIdx} className="module-block">
                    <div className="module-header">
                      <span>📁 {m.title}</span>
                      <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        {m.lessons.length} {m.lessons.length === 1 ? "lección" : "lecciones"}
                      </span>
                    </div>

                    <div>
                      {m.lessons.map((l) => {
                        const isWatched = completedSet.has(l.id);
                        return (
                          <div key={l.id} className="lesson-item">
                            <div className="lesson-left">
                              <input
                                type="checkbox"
                                className="lesson-checkbox"
                                checked={isWatched}
                                onChange={() => onToggleLesson(course.id, l.id, course.totalLessons)}
                                id={`check-${l.id}`}
                              />
                              <label htmlFor={`check-${l.id}`} className={`lesson-title ${isWatched ? "watched" : ""}`}>
                                {l.fileType === "video" ? "🎬" : l.fileType === "pdf" ? "📄" : l.fileType === "doc" ? "📝" : "📦"} {l.title}
                              </label>
                            </div>

                            <div style={{ display: "flex", gap: "0.6rem" }}>
                              {l.filePath && (
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: "0.4rem 1rem", fontSize: "1.2rem", minHeight: "auto" }}
                                  onClick={() => onOpenExactFolder(l.filePath!, l.title)}
                                  title="Abrir archivo o carpeta en Finder"
                                >
                                  ▶️ Abrir
                                </button>
                              )}
                              {l.filePath && (
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: "0.4rem 1rem", fontSize: "1.2rem", minHeight: "auto" }}
                                  onClick={() => handleCopyPath(l.filePath!, l.title)}
                                  title="Copiar ruta exacta del archivo"
                                >
                                  Copiar Ruta
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontSize: "1.6rem", color: "var(--text-secondary)", marginBottom: "1.6rem" }}>
                    Este curso está alojado en Google Drive ({course.originName}).
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "1.2rem", flexWrap: "wrap" }}>
                    {course.localPath && (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onOpenExactFolder(course.localPath, course.title)}
                      >
                        📂 Abrir Carpeta Exacta en Drive (Mac)
                      </button>
                    )}
                    <a
                      href={driveWebSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      🌐 Buscar en Drive Web ➔
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem" }}>🎯 Utilidad y Qué Aprenderás</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{course.utility}</p>
              </div>

              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem" }}>👥 Audiencia Objetivo</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{course.targetAudience}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem" }}>
                <div style={{ background: "var(--bg-card)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Nivel de Dificultad</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{course.difficulty}</div>
                </div>
                <div style={{ background: "var(--bg-card)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Duración Estimada</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{course.estimatedHours}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem" }}>📁 Rutas de Acceso Exactas</h3>
                {course.drivePath && (
                  <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "1.3rem", background: "var(--bg-card)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "0.8rem" }}>
                    ☁️ {course.drivePath}
                  </p>
                )}
                {course.localPath && (
                  <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "1.3rem", background: "var(--bg-card)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                    💾 {course.localPath}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <p style={{ fontSize: "1.3rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                Escribe aquí tus ideas clave, prompts, comandos o resúmenes de este curso:
              </p>
              <textarea
                style={{ width: "100%", minHeight: "22rem", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "1.4rem", color: "var(--text-primary)", fontSize: "1.4rem", lineHeight: 1.6, resize: "vertical" }}
                placeholder="Anota aquí tus aprendizajes, enlaces y próximos pasos..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.4rem" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveNotes}
                >
                  💾 Guardar Apuntes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};