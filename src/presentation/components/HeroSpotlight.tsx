import React from "react";

interface HeroSpotlightProps {
  totalCourses: number;
  onSearchTag: (query: string) => void;
  onSelectCategory: (category: string) => void;
}

const TRENDING_TAGS = [
  { label: "🔥 Romuald Fons", query: "Romuald" },
  { label: "🤖 Inteligencia Artificial", query: "Inteligencia Artificial" },
  { label: "📈 Trading & Cripto", query: "Trading" },
  { label: "💻 Python & Dev", query: "Python" },
  { label: "🚀 SEO & Tráfico", query: "SEO" },
  { label: "🛒 Ecommerce & Amazon", query: "Amazon" },
  { label: "✍️ Copywriting", query: "Copywriting" },
  { label: "🎨 UI/UX & Figma", query: "Figma" }
];

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  totalCourses,
  onSearchTag
}) => {
  return (
    <section className="hero-spotlight" aria-label="Destacado de la plataforma EduHub">
      <div className="hero-glow-blob top-left" />
      <div className="hero-glow-blob bottom-right" />

      <div className="hero-inner">
        <div className="hero-badge-row">
          <span className="hero-live-badge">
            <span className="live-dot" /> STREAMING CLOUD ACTIVO
          </span>
          <span className="hero-stat-pill">
            ☁️ Google Drive Directo (0 GB SSD Local)
          </span>
          <span className="hero-stat-pill highlight">
            ⚡ {totalCourses.toLocaleString()} Masterclasses
          </span>
        </div>

        <h1 className="hero-title">
          Tu Netflix Privado de <span className="gradient-text">Formación & Masterclasses</span>
        </h1>

        <p className="hero-description">
          Explora la biblioteca más completa de desarrollo, negocios, IA, marketing y finanzas. 
          Haz streaming directo desde Google Drive sin sincronizar gigas en tu disco.
        </p>

        <div className="hero-trending-row">
          <span className="trending-label">🔥 Búsquedas Rápidas:</span>
          <div className="trending-chips">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                className="trending-chip"
                onClick={() => onSearchTag(tag.query)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
