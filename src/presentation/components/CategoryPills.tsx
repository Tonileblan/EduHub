
import React from "react";

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="category-pills" role="tablist" aria-label="Categorías formativas">
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategory === "ALL"}
        className={`category-pill ${selectedCategory === "ALL" ? "active" : ""}`}
        onClick={() => onSelectCategory("ALL")}
      >
        ✨ Todas las Áreas
      </button>

      {categories.map(cat => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={selectedCategory === cat}
          className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
