import React from "react";

interface HeroSpotlightProps {
  totalCourses: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchTag: (query: string) => void;
  onSelectCategory: (category: string) => void;
  filteredCount?: number;
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
  searchQuery,
  onSearchChange,
  onSearchTag,
  filteredCount
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultsSection = document.querySelector(".results-header-v2");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

        {/* Prominent Hero Search Engine */}
        <form
          className="hero-search-wrapper"
          role="search"
          aria-label="Buscador principal de cursos"
          onSubmit={handleSubmit}
        >
          <div className="hero-search-box">
            <span className="hero-search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="hero-search-input"
              placeholder="¿Qué quieres aprender hoy? Busca cursos, temas o autores (ej. Romuald, Python, Trading, IA)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="¿Qué quieres aprender hoy? Busca entre más de 6.000 cursos"
            />
            {searchQuery ? (
              <button
                type="button"
                className="hero-search-clear-btn"
                onClick={() => onSearchChange("")}
                aria-label="Borrar término de búsqueda"
              >
                ✕
              </button>
            ) : null}
            <button
              type="submit"
              className="hero-search-submit-btn"
              aria-label="Explorar resultados de búsqueda"
            >
              <span>Explorar</span>
              <span className="hero-search-enter-badge" aria-hidden="true">↵</span>
            </button>
          </div>
          {searchQuery ? (
            <div className="hero-search-live-status" aria-live="polite">
              ✨ <strong>{(filteredCount ?? 0).toLocaleString()}</strong> formaciones encontradas para &ldquo;{searchQuery}&rdquo;
            </div>
          ) : null}
        </form>

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
