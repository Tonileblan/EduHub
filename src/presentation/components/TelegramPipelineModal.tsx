import React, { useState } from "react";
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
  if (!isOpen || !course) return null;

  const [currentStep, setCurrentStep] = useState<number>(course.hasLocalFiles ? 2 : 1);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const cleanTitle = course.title.replace(/^[0-9️⃣🔟._ -]+/, "").trim();
  const telegramUrl = course.telegramSearchUrl || `https://t.me/MEMBRESIATPC`;
  const driveSearchUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(cleanTitle)}`;

  const bashHelperScript = `# Pipeline EduHub: ${cleanTitle}
# 1. Crear carpeta temporal
mkdir -p ~/Downloads/EduHub-Temp/"${cleanTitle}"

# 2. Descomprimir archivos si son ZIP/RAR
find ~/Downloads/"${course.title}" -name "*.zip" -exec unzip -o {} -d ~/Downloads/EduHub-Temp/"${cleanTitle}" \\;
find ~/Downloads/"${course.title}" -name "*.rar" -exec unrar x -o+ {} ~/Downloads/EduHub-Temp/"${cleanTitle}" \\;

# 3. Tras subir a Google Drive, liberar SSD
# rm -rf ~/Downloads/EduHub-Temp/"${cleanTitle}"
`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    onShowToast(`Copiado: ${label}`, "success");
    setTimeout(() => setCopiedCmd(null), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pipeline-title">
      <div className="modal-content" style={{ maxWidth: "78rem" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.6rem" }}>
              <span className="origin-badge" style={{ background: "rgba(217, 70, 239, 0.2)", color: "#f0abfc", border: "1px solid rgba(217, 70, 239, 0.4)" }}>
                ✈️ Pipeline Telegram ➜ SSD ➜ Drive
              </span>
              <span className="origin-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                0 GB Objetivo
              </span>
            </div>
            <h2 id="pipeline-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "#ffffff" }}>
              {course.title}
            </h2>
            <p style={{ fontSize: "1.3rem", color: "var(--text-secondary)" }}>
              Canal Origen: <strong>DESCARGAS TPC 📥 (@MEMBRESIATPC)</strong>
            </p>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Progress Steps Header */}
          <div className="pipeline-steps-tracker">
            <div className={`step-node ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`} onClick={() => setCurrentStep(1)}>
              <div className="step-circle">1</div>
              <span>📥 Descargar Telegram</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`} onClick={() => setCurrentStep(2)}>
              <div className="step-circle">2</div>
              <span>📦 Descomprimir SSD</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`} onClick={() => setCurrentStep(3)}>
              <div className="step-circle">3</div>
              <span>☁️ Subir a Drive</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${currentStep >= 4 ? "active" : ""}`} onClick={() => setCurrentStep(4)}>
              <div className="step-circle">4</div>
              <span>🗑️ Liberar SSD (0 GB)</span>
            </div>
          </div>

          {/* Step 1 Content */}
          {currentStep === 1 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">📥</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 1: Descargar desde Telegram Desktop</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    Abre el canal <strong>@MEMBRESIATPC</strong> en Telegram y descarga los archivos del curso a tu carpeta local.
                  </p>
                </div>
              </div>

              <div className="step-actions">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)" }}
                >
                  ✈️ Abrir en Telegram Desktop ➔
                </a>
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

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">📦</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 2: Descomprimir y Organizar en SSD</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    {course.hasLocalFiles
                      ? `✅ Archivos detectados en local: ${course.localPath}`
                      : `Descomprime los archivos .zip o .rar descargados para extraer los vídeos y PDFs.`}
                  </p>
                </div>
              </div>

              <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.4rem", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "1.25rem", color: "#38bdf8" }}>
                <code>Ruta Local: {course.localPath || `~/Downloads/${course.title}`}</code>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => copyToClipboard(bashHelperScript, "Script de Descompresión")}
                >
                  📋 {copiedCmd ? "✓ Script Copiado" : "Copiar Script Bash de Descompresión"}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setCurrentStep(3)}
                >
                  Siguiente: Subir a Drive ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 3 Content */}
          {currentStep === 3 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">☁️</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 3: Subir a Google Drive Cloud</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    Sube la carpeta del curso a tu Google Drive (Mi Unidad o Unidad Compartida) para poder verla en streaming desde cualquier dispositivo.
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
                  ☁️ Abrir Google Drive Web ➔
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep(4)}
                >
                  Siguiente: Limpiar SSD ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 4 Content */}
          {currentStep === 4 && (
            <div className="pipeline-step-card">
              <div className="step-header">
                <span className="step-icon">🗑️</span>
                <div>
                  <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#ffffff" }}>Paso 4: Liberar SSD y Marcar Sincronizado</h3>
                  <p style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
                    Una vez subido a Google Drive, puedes eliminar los archivos descargados del SSD para mantener 0 GB ocupados localmente.
                  </p>
                </div>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  onClick={() => {
                    if (onMarkAsUploaded) onMarkAsUploaded(course.id);
                    onShowToast(`"${course.title}" marcado como sincronizado en Drive Cloud`, "success");
                    onClose();
                  }}
                >
                  ✅ Completar y Marcar en Drive Cloud
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
