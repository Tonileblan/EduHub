import React from "react";
import { CATEGORY_THEMES } from "../utils/courseThemes";

interface CategoryHubProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryHub: React.FC<CategoryHubProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const categoriesList = Object.entries(CATEGORY_THEMES);

  return (
    <section className="category-hub-section" aria-label="Explorar por áreas de conocimiento">
      <div className="section-header-compact">
        <h2 className="section-heading">
          ✨ Explora por Especialidad
        </h2>
        <button
          type="button"
          className={`see-all-btn ${selectedCategory === "ALL" ? "active" : ""}`}
          onClick={() => onSelectCategory("ALL")}
        >
          {selectedCategory === "ALL" ? "✓ Viendo Todas las Áreas" : "Ver Todo el Catálogo ➔"}
        </button>
      </div>

      <div className="category-card-grid">
        {categoriesList.map(([catName, theme]) => {
          const isSelected = selectedCategory === catName;
          const count = categoryCounts[catName] || 0;

          return (
            <button
              key={catName}
              type="button"
              className={`category-card-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCategory(isSelected ? "ALL" : catName)}
              style={{
                "--card-gradient": theme.gradient,
                "--accent-glow": theme.glowColor,
                "--accent-color": theme.accentColor
              } as React.CSSProperties}
            >
              <div className="category-card-icon-wrapper">
                <span className="category-card-icon">{theme.icon}</span>
              </div>
              <div className="category-card-info">
                <h3 className="category-card-title">{catName}</h3>
                <p className="category-card-desc">{theme.description}</p>
                <div className="category-card-footer">
                  <span className="category-count-badge">
                    {count > 0 ? `${count.toLocaleString()} Cursos` : "Explorar"}
                  </span>
                  <span className="category-arrow">➔</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
