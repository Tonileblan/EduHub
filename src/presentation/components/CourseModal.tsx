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
  onOpenPipeline?: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  progress,
  onClose,
  onToggleLesson,
  onSaveNotes,
  onShowToast,
  onOpenPipeline
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<"syllabus" | "notes" | "info">("syllabus");
  const [notesText, setNotesText] = useState(progress?.notes || "");

  const handleSaveNotes = () => {
    onSaveNotes(course.id, notesText);
    onShowToast("Notas guardadas correctamente", "success");
  };

  const completedSet = new Set(progress?.completedLessonIds || []);
  const percent = progress?.percentCompleted || 0;
  const isTelegram = course.originType === "TELEGRAM_TPC";

  const cleanSearchTerm = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
  const driveWebSearchUrl = course.webUrl || `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanSearchTerm)}`;
  const isDirectFolder = Boolean(course.webUrl && (course.webUrl.includes('/folders/') || course.webUrl.includes('/file/d/')));
  const telegramUrl = course.telegramSearchUrl || "https://t.me/MEMBRESIATPC";
  const isArchive = Boolean(course.isArchive || (course.localPath && /\.(zip|rar|7z)$/i.test(course.localPath)));
  const isPrepared = Boolean(course.isPreparedInDrive);
  const needsPrep = (isTelegram || isArchive) && !isPrepared;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap" }}>
              <span className="course-tag" style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--accent-primary)" }}>
                {course.category}
              </span>
              {course.platform && course.platform !== "Google Drive Cloud" && (
                <span className="course-tag" style={{ background: "rgba(168, 85, 247, 0.25)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.4)", fontWeight: 700 }}>
                  🏢 {course.platform}
                </span>
              )}
              {course.isPreparedInDrive ? (
                <span className="course-tag" style={{ background: "rgba(16, 185, 129, 0.25)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", fontWeight: 700 }}>
                  ✅ Preparado en Google Drive
                </span>
              ) : isTelegram ? (
                <span className="course-tag" style={{ background: "rgba(217, 70, 239, 0.2)", color: "#f0abfc", border: "1px solid rgba(217, 70, 239, 0.4)" }}>
                  ✈️ Telegram • DESCARGAS TPC 📥
                </span>
              ) : course.isArchive ? (
                <span className="course-tag" style={{ background: "rgba(245, 158, 11, 0.25)", color: "#facc15", border: "1px solid rgba(245, 158, 11, 0.4)", fontWeight: 700 }}>
                  📦 Archivo Comprimido ({course.archiveType || "ZIP/RAR"})
                </span>
              ) : course.originType === "DRIVE_MI_UNIDAD" ? (
                <span className="course-tag" style={{ background: "rgba(16, 185, 129, 0.2)", color: "var(--accent-emerald)", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                  ⭐ Google Drive • Mi Unidad
                </span>
              ) : course.originType === "DRIVE_SHORTCUT" ? (
                <span className="course-tag" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.4)" }}>
                  🚀 Google Drive • Atajo Cloud
                </span>
              ) : (
                <span className="course-tag" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)" }}>
                  ☁️ Google Drive Cloud (0 GB Local)
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

        {/* Action Bar for Direct Drive / Telegram Pipeline */}
        <div style={{ padding: "1.4rem 2.4rem", background: isTelegram ? "rgba(217, 70, 239, 0.1)" : isArchive ? "rgba(245, 158, 11, 0.08)" : "rgba(99, 102, 241, 0.08)", borderBottom: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "1.3rem", color: "var(--text-secondary)" }}>
            {isTelegram ? (
              <span>✈️ <strong>Canal Telegram:</strong> DESCARGAS TPC (@MEMBRESIATPC) ➜ Flujo SSD ➜ Google Drive</span>
            ) : isArchive ? (
              <span>📦 <strong>Archivo Comprimido:</strong> {course.originName || "Google Drive • Unidades Compartidas"} ➜ Streaming en Drive</span>
            ) : (
              <span>☁️ <strong>Ubicación Cloud:</strong> Google Drive ({course.originName || "Unidades Compartidas & Mi Unidad"})</span>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {needsPrep ? (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    background: isTelegram
                      ? "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.8rem 1.6rem",
                    fontSize: "1.35rem",
                    boxShadow: isTelegram
                      ? "0 4px 14px rgba(217, 70, 239, 0.4)"
                      : "0 4px 14px rgba(245, 158, 11, 0.4)"
                  }}
                  onClick={() => onOpenPipeline ? onOpenPipeline(course) : null}
                >
                  ⚡ Preparar Automáticamente en Drive (1-Clic)
                </button>
                {isTelegram && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.8rem 1.4rem", fontSize: "1.35rem" }}
                  >
                    ✈️ Abrir en Telegram
                  </a>
                )}
              </>
            ) : (
              <a
                href={driveWebSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.8rem 1.6rem",
                  fontSize: "1.35rem",
                  background: (isDirectFolder || isPrepared) ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : undefined,
                  boxShadow: (isDirectFolder || isPrepared) ? "0 4px 14px rgba(16, 185, 129, 0.4)" : undefined
                }}
              >
                {(isDirectFolder || isPrepared) ? "⚡ Abrir Carpeta en Drive (1-Clic) ➔" : "☁️ Abrir Curso en Google Drive Web ➔"}
              </a>
            )}
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
                        const lessonCleanTitle = l.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
                        const lessonDriveUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(lessonCleanTitle)}`;

                        return (
                          <div key={l.id} className="lesson-item">
                            <div className="lesson-left">
                              <input
                                type="checkbox"
                                className="lesson-checkbox"
                                checked={isWatched}
                                onChange={() => onToggleLesson(course.id, l.id, course.totalLessons)}
                                id={`lesson-${l.id}`}
                              />
                              <label
                                htmlFor={`lesson-${l.id}`}
                                className={`lesson-title ${isWatched ? "watched" : ""}`}
                              >
                                {l.fileType === "video" ? "🎬 " : l.fileType === "doc" ? "📄 " : "📦 "}
                                {l.title}
                              </label>
                            </div>

                            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                              {l.duration && (
                                <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
                                  {l.duration}
                                </span>
                              )}
                              <a
                                href={lessonDriveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary"
                                style={{ padding: "0.4rem 0.8rem", fontSize: "1.15rem", minHeight: "auto" }}
                                title="Buscar y reproducir lección en Google Drive"
                              >
                                ☁️ Stream
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "1.4rem" }}>
                    Este curso está indexado como contenedor maestro. Puedes abrir directamente todos los archivos y carpetas en Google Drive.
                  </p>
                  <a
                    href={driveWebSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    ☁️ Explorar Todo el Contenido en Google Drive ➔
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
              <div style={{ background: "var(--bg-card)", padding: "1.8rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.8rem", color: "var(--text-primary)" }}>
                  🎯 Utilidad y Aplicación Práctica
                </h3>
                <p style={{ fontSize: "1.4rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {course.utility}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))", gap: "1.4rem" }}>
                <div style={{ background: "var(--bg-tertiary)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Nicho / Especialidad</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.4rem" }}>
                    {course.niche}
                  </div>
                </div>

                <div style={{ background: "var(--bg-tertiary)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Duración Estimada</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.4rem" }}>
                    ⏱️ {course.estimatedHours}
                  </div>
                </div>

                <div style={{ background: "var(--bg-tertiary)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Total de Lecciones</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.4rem" }}>
                    📚 {course.totalLessons} recursos
                  </div>
                </div>

                <div style={{ background: "var(--bg-tertiary)", padding: "1.4rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Calificación</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fbbf24", marginTop: "0.4rem" }}>
                    ⭐ {course.rating} / 5.0
                  </div>
                </div>
              </div>

              {course.localPath && (
                <div style={{ background: "rgba(10, 14, 25, 0.6)", padding: "1.4rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: "20rem" }}>
                    <div style={{ color: "var(--text-muted)", marginBottom: "0.4rem" }}>📁 Ruta Local / Almacenamiento:</div>
                    <code style={{ color: "var(--accent-cyan)", wordBreak: "break-all" }}>{course.localPath}</code>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: "0.6rem 1.2rem", fontSize: "1.2rem", whiteSpace: "nowrap" }}
                    onClick={() => {
                      navigator.clipboard.writeText(course.localPath);
                      onShowToast("Ruta copiada al portapapeles", "success");
                    }}
                  >
                    📋 Copiar Ruta
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                Escribe ideas clave, resúmenes o enlaces de interés sobre este curso. Se guardan automáticamente en tu navegador.
              </p>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Escribe aquí tus notas personales sobre este curso..."
                style={{
                  width: "100%",
                  minHeight: "22rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  padding: "1.6rem",
                  fontSize: "1.4rem",
                  lineHeight: 1.6,
                  resize: "vertical"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.2rem" }}>
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