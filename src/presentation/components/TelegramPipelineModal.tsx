import React, { useState, useEffect } from "react";
import type { Course } from "../../domain/entities/Course";

interface TelegramPipelineModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onMarkAsUploaded?: (courseId: string) => void;
}

export const TelegramPipelineModal: React.FC<TelegramPipelineModalProps> = ({
  course,
  isOpen,
  onClose,
  onShowToast,
  onMarkAsUploaded
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prepResult, setPrepResult] = useState<{
    success: boolean;
    destinationPath?: string;
    filesExtracted?: number;
    message?: string;
    webUrl?: string;
  } | null>(null);

  useEffect(() => {
    if (course) {
      setCurrentStep(course.isPreparedInDrive ? 4 : course.hasLocalFiles ? 2 : 1);
      setPrepResult(null);
      setCopiedCmd(null);
    }
  }, [course]);

  // Check prepared status on mount
  useEffect(() => {
    let isMounted = true;
    if (isOpen && course) {
      fetch(`/api/check-prepared-status?title=${encodeURIComponent(course.title)}&category=${encodeURIComponent(course.category)}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.isPrepared) {
            setPrepResult({
              success: true,
              destinationPath: data.destinationPath,
              message: "El curso ya está preparado en Google Drive listo para streaming."
            });
            setCurrentStep(4);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const cleanTitle = course.title.replace(/^[0-9._ -]+/, "").trim();
  const telegramUrl = course.telegramSearchUrl || `https://t.me/MEMBRESIATPC`;
  const driveSearchUrl = course.webUrl || `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanTitle)}`;
  const isTelegram = course.originType === "TELEGRAM_TPC";

  const cliCommand = `node scripts/auto_prepare_course_in_drive.js --title "${course.title}" --category "${course.category}"`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    onShowToast(`Copiado: ${label}`, "success");
    setTimeout(() => setCopiedCmd(null), 3000);
  };

  const handleAutoPrepare = async () => {
    setIsProcessing(true);
    setPrepResult(null);

    try {
      const params = new URLSearchParams({
        courseId: course.id,
        title: course.title,
        category: course.category,
        sourcePath: course.archivePath || course.localPath || ""
      });

      const res = await fetch(`/api/prepare-course-in-drive?${params.toString()}`);
      const data = await res.json();

      if (data.success || data.alreadyPrepared) {
        setPrepResult(data);
        setCurrentStep(4);
        if (onMarkAsUploaded) onMarkAsUploaded(course.id);
        onShowToast(data.message || `¡"${course.title}" preparado en Google Drive!`, "success");
      } else {
        setPrepResult({
          success: false,
          message: data.error || "No se pudo conectar al servicio local. Puedes ejecutar el comando manual."
        });
        onShowToast(data.error || "Error al preparar curso", "info");
      }
    } catch {
      setPrepResult({
        success: false,
        message: "Servidor local no detectado o en entorno Vercel Cloud. Ejecuta el comando en tu terminal para preparar el curso."
      });
      onShowToast("Copia el comando para ejecutarlo localmente", "info");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenFolder = (targetPath: string) => {
    fetch(`/api/open-folder?path=${encodeURIComponent(targetPath)}`)
      .catch(() => {
        window.open(driveSearchUrl, "_blank");
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pipeline-title">
      <div className="modal-content" style={{ maxWidth: "80rem" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.6rem" }}>
              <span className="origin-badge" style={{ background: isTelegram ? "rgba(217, 70, 239, 0.2)" : "rgba(99, 102, 241, 0.2)", color: isTelegram ? "#f0abfc" : "#a5b4fc", border: `1px solid ${isTelegram ? "rgba(217, 70, 239, 0.4)" : "rgba(99, 102, 241, 0.4)"}` }}>
                {isTelegram ? "✈️ Pipeline Telegram ➜ Google Drive" : "📦 Archivo Comprimido ➜ Streaming en Drive"}
              </span>
              <span className="origin-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                0 GB Objetivo Local
              </span>
            </div>
            <h2 id="pipeline-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "#ffffff" }}>
              {course.title}
            </h2>
            <p style={{ fontSize: "1.3rem", color: "var(--text-secondary)" }}>
              {isTelegram ? (
                <>Canal Telegram: <strong>DESCARGAS TPC 📥 (@MEMBRESIATPC)</strong></>
              ) : (
                <>Ubicación: <strong>{course.originName || "Google Drive • Unidades Compartidas"}</strong> ({course.archiveType || "ZIP/RAR"})</>
              )}
            </p>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Hero 1-Click Fast Track Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.15) 100%)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span>⚡</span> Preparación Automática en Google Drive (1-Clic)
                </h3>
                <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)", marginTop: "0.4rem", lineHeight: 1.5 }}>
                  {prepResult?.success
                    ? "¡El curso ya está preparado y descomprimido en tu Google Drive para streaming directo!"
                    : "Descomprime automáticamente archivos .rar/.zip o copia la carpeta directamente a tu Google Drive (Mi Unidad / 001-CURSOS) sin esfuerzo."}
                </p>
              </div>

              {prepResult?.success ? (
                <span className="origin-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.5)", fontSize: "1.25rem", padding: "0.6rem 1.2rem" }}>
                  ✅ Preparado en Drive
                </span>
              ) : (
                <span className="origin-badge" style={{ background: "rgba(234, 179, 8, 0.2)", color: "#facc15", border: "1px solid rgba(234, 179, 8, 0.5)", fontSize: "1.25rem", padding: "0.6rem 1.2rem" }}>
                  ⏳ Pendiente Preparar
                </span>
              )}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "1.6rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "1.2rem" }}>
                <div className="spinner" style={{ width: "2.4rem", height: "2.4rem", border: "3px solid rgba(255, 255, 255, 0.2)", borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    Descomprimiendo y preparando en Google Drive...
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                    Ejecutando unar y organizando estructura en Mi Unidad / 001-CURSOS
                  </div>
                </div>
              </div>
            )}

            {/* Completed Result Message */}
            {prepResult && (
              <div style={{
                background: prepResult.success ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                border: `1px solid ${prepResult.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                padding: "1.4rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "1.3rem",
                color: prepResult.success ? "#34d399" : "#f87171",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem"
              }}>
                <div style={{ fontWeight: 700 }}>{prepResult.message}</div>
                {prepResult.destinationPath && (
                  <code style={{ fontSize: "1.2rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                    Ruta: {prepResult.destinationPath}
                  </code>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {!prepResult?.success ? (
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
                    padding: "1rem 2rem",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(168, 85, 247, 0.4)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.8rem"
                  }}
                  disabled={isProcessing}
                  onClick={handleAutoPrepare}
                >
                  <span>{isProcessing ? "⏳ Procesando..." : "🚀 Preparar en Google Drive Ahora"}</span>
                  <span>➔</span>
                </button>
              ) : (
                <>
                  <a
                    href={driveSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      padding: "1rem 2rem",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.8rem"
                    }}
                  >
                    <span>▶️ Abrir Curso en Google Drive Web</span>
                    <span>➔</span>
                  </a>

                  {prepResult.destinationPath && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: "1rem 1.6rem", fontSize: "1.35rem" }}
                      onClick={() => handleOpenFolder(prepResult.destinationPath!)}
                    >
                      📁 Revelar en Finder
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "1rem 1.6rem", fontSize: "1.35rem" }}
                onClick={() => copyToClipboard(cliCommand, "Comando CLI")}
              >
                📋 {copiedCmd ? "✓ Comando Copiado" : "Copiar Comando Terminal"}
              </button>
            </div>
          </div>

          {/* Step-by-Step Tracker */}
          <div className="pipeline-steps-tracker">
            <div className={`step-node ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`} onClick={() => setCurrentStep(1)}>
              <div className="step-circle">1</div>
              <span>📥 {isTelegram ? "Telegram Desktop" : "Localizar Archivo"}</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`} onClick={() => setCurrentStep(2)}>
              <div className="step-circle">2</div>
              <span>📦 Descomprimir</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`} onClick={() => setCurrentStep(3)}>
              <div className="step-circle">3</div>
              <span>☁️ Sincronizar Drive</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 4 ? "active" : ""}`} onClick={() => setCurrentStep(4)}>
              <div className="step-circle">4</div>
              <span>🎉 Listo (0 GB SSD)</span>
            </div>
          </div>

          {/* Step 1: Download or Locate */}
          {currentStep === 1 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">📥</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>
                    {isTelegram ? "Paso 1: Descargar desde Telegram Desktop" : "Paso 1: Archivo Comprimido en Drive"}
                  </h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    {isTelegram
                      ? "Abre Telegram Desktop y descarga los archivos del canal @MEMBRESIATPC."
                      : "Este curso se encuentra en un archivo comprimido .rar/.zip en las Unidades Compartidas."}
                  </p>
                </div>
              </div>

              <div className="step-actions">
                {isTelegram && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)" }}
                  >
                    ✈️ Abrir en Telegram Desktop ➔
                  </a>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  Siguiente: Descomprimir ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Extract & Prepare */}
          {currentStep === 2 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">📦</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 2: Descomprimir y Preparar</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    {course.hasLocalFiles
                      ? `Archivos detectados en local: ${course.localPath}`
                      : `Haz clic en el botón superior de "Preparar en Google Drive Ahora" para procesar automáticamente.`}
                  </p>
                </div>
              </div>

              <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.4rem", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "1.25rem", color: "#38bdf8" }}>
                <code>Ruta Origen: {course.archivePath || course.localPath || `~/Downloads/${course.title}`}</code>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAutoPrepare}
                  disabled={isProcessing}
                >
                  ⚡ Descomprimir y Mover a Drive
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep(3)}
                >
                  Siguiente: Sincronización ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Cloud Sync */}
          {currentStep === 3 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">☁️</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 3: Sincronización Cloud y Streaming</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    Google Drive Desktop sincroniza automáticamente los vídeos extraídos en streaming sin ocupar espacio de forma permanente.
                  </p>
                </div>
              </div>

              <div className="step-actions">
                <a
                  href={driveSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  ☁️ Abrir en Google Drive Web ➔
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep(4)}
                >
                  Siguiente: Completar ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Finished & Cleanup */}
          {currentStep === 4 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">🎉</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 4: ¡Curso Preparado!</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    El curso está listo en tu Google Drive. Ya puedes verlo en streaming en cualquier momento desde tu Mac, tablet o móvil.
                  </p>
                </div>
              </div>

              <div className="step-actions">
                <a
                  href={driveSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  ▶️ Ver Curso en Google Drive
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    if (onMarkAsUploaded) onMarkAsUploaded(course.id);
                    onShowToast(`"${course.title}" sincronizado con éxito`, "success");
                    onClose();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
