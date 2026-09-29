import React from "react";
import type { FilterState, SortOption, FormatFilter } from "../../domain/entities/FilterState";
import { CategoryPills } from "./CategoryPills";

interface FilterBarProps {
  filters: FilterState;
  categories: string[];
  authors: string[];
  niches: string[];
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  categories,
  authors,
  niches,
  onFilterChange,
  onResetFilters
}) => {
  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.category !== "ALL" ||
    filters.author !== "ALL" ||
    filters.niche !== "ALL" ||
    filters.originType !== "ALL" ||
    filters.formatType !== "ALL" ||
    filters.status !== "ALL" ||
    filters.onlyWithLessons
  );

  return (
    <section className="filters-section" aria-label="Filtros y buscador de cursos">
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por curso, tema, autor (ej. Romuald, Claude, Amazon, Copy, Trading)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            aria-label="Buscar cursos en la biblioteca"
          />
          <span className="search-badge" aria-hidden="true">Presiona /</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetFilters}
            aria-label="Restablecer todos los filtros aplicados"
          >
            ❌ Limpiar Filtros
          </button>
        )}
      </div>

      <CategoryPills
        categories={categories}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => onFilterChange({ category: cat })}
      />

      <div className="filter-controls-row">
        <div className="filter-group">
          <label htmlFor="select-author">Autor / Creador</label>
          <select
            id="select-author"
            value={filters.author}
            onChange={(e) => onFilterChange({ author: e.target.value })}
          >
            <option value="ALL">Todos los Autores</option>
            {authors.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-niche">Nicho / Especialidad</label>
          <select
            id="select-niche"
            value={filters.niche}
            onChange={(e) => onFilterChange({ niche: e.target.value })}
          >
            <option value="ALL">Todos los Nichos</option>
            {niches.slice(0, 40).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-origin">Ubicación / Origen</label>
          <select
            id="select-origin"
            value={filters.originType}
            onChange={(e) => onFilterChange({ originType: e.target.value })}
          >
            <option value="ALL">Cualquier Origen</option>
            <option value="LOCAL_SSD">💾 Descargas SSD Local</option>
            <option value="DRIVE_MI_UNIDAD">📁 Google Drive (Mi Unidad)</option>
            <option value="DRIVE_COMPARTIDA">☁️ Unidades Compartidas</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-format">Formato de Archivo</label>
          <select
            id="select-format"
            value={filters.formatType}
            onChange={(e) => onFilterChange({ formatType: e.target.value as FormatFilter })}
          >
            <option value="ALL">Todos los Formatos</option>
            <option value="ARCHIVES">📦 Archivos ZIP / RAR (Extraer a Drive)</option>
            <option value="FOLDERS">📁 Carpetas con Lecciones</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-status">Mi Progreso</label>
          <select
            id="select-status"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="FAVORITE">❤️ Mis Favoritos</option>
            <option value="IN_PROGRESS">⚡ En Progreso</option>
            <option value="COMPLETED">🏆 Completados</option>
            <option value="WATCH_LATER">📌 Para Ver Más Tarde</option>
            <option value="NOT_STARTED">⏳ Sin Iniciar</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-sort">Ordenar Por</label>
          <select
            id="select-sort"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          >
            <option value="relevance">🌟 Relevancia y Calidad</option>
            <option value="rating_desc">⭐ Mejor Valorados</option>
            <option value="lessons_desc">📚 Mayor Nº de Lecciones</option>
            <option value="title_asc">🔤 Título (A - Z)</option>
            <option value="author_asc">👤 Autor (A - Z)</option>
          </select>
        </div>
      </div>
    </section>
  );
};
