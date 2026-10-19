import React, { useState } from "react";
import type { FilterState, SortOption, FormatFilter } from "../../domain/entities/FilterState";
import { CategoryPills } from "./CategoryPills";

export type ViewMode = "grid" | "list";

interface FilterBarProps {
  filters: FilterState;
  categories: string[];
  authors: string[];
  niches: string[];
  platforms: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  statsCounts: {
    total: number;
    favorites: number;
    inProgress: number;
    watchLater: number;
    completed: number;
    telegram: number;
    directDrive: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  categories,
  authors,
  niches,
  platforms,
  viewMode,
  onViewModeChange,
  onFilterChange,
  onResetFilters,
  statsCounts
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.category !== "ALL" ||
    filters.author !== "ALL" ||
    filters.platform !== "ALL" ||
    filters.niche !== "ALL" ||
    filters.originType !== "ALL" ||
    filters.formatType !== "ALL" ||
    filters.status !== "ALL" ||
    filters.onlyWithLessons
  );

  return (
    <section className="filter-bar-v2" aria-label="Buscador y filtros avanzados de formación">
      {/* Quick Status Navigation Tabs */}
      <div className="status-nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={filters.status === "ALL" && filters.originType === "ALL"}
          className={`status-tab ${filters.status === "ALL" && filters.originType === "ALL" ? "active" : ""}`}
          onClick={() => onFilterChange({ status: "ALL", originType: "ALL" })}
        >
          <span className="tab-icon">🌐</span>
          <span>Todo el Catálogo</span>
          <span className="tab-badge">{statsCounts.total.toLocaleString()}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.originType === "DRIVE_DIRECT"}
          className={`status-tab ${filters.originType === "DRIVE_DIRECT" ? "active" : ""}`}
          onClick={() => onFilterChange({ originType: filters.originType === "DRIVE_DIRECT" ? "ALL" : "DRIVE_DIRECT" })}
        >
          <span className="tab-icon">⭐</span>
          <span>En Mi Drive & Atajos</span>
          <span className="tab-badge highlight" style={{ background: "#10b981", color: "#ffffff" }}>
            {statsCounts.directDrive}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.originType === "TELEGRAM_TPC"}
          className={`status-tab ${filters.originType === "TELEGRAM_TPC" ? "active" : ""}`}
          onClick={() => onFilterChange({ originType: filters.originType === "TELEGRAM_TPC" ? "ALL" : "TELEGRAM_TPC" })}
        >
          <span className="tab-icon">✈️</span>
          <span>Telegram TPC</span>
          <span className="tab-badge highlight" style={{ background: "#d946ef", color: "#ffffff" }}>
            {statsCounts.telegram}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.status === "IN_PROGRESS"}
          className={`status-tab ${filters.status === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => onFilterChange({ status: "IN_PROGRESS" })}
        >
          <span className="tab-icon">⚡</span>
          <span>En Progreso</span>
          {statsCounts.inProgress > 0 && (
            <span className="tab-badge highlight">{statsCounts.inProgress}</span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.status === "FAVORITE"}
          className={`status-tab ${filters.status === "FAVORITE" ? "active" : ""}`}
          onClick={() => onFilterChange({ status: "FAVORITE" })}
        >
          <span className="tab-icon">❤️</span>
          <span>Mis Favoritos</span>
          {statsCounts.favorites > 0 && (
            <span className="tab-badge rose">{statsCounts.favorites}</span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.status === "WATCH_LATER"}
          className={`status-tab ${filters.status === "WATCH_LATER" ? "active" : ""}`}
          onClick={() => onFilterChange({ status: "WATCH_LATER" })}
        >
          <span className="tab-icon">📌</span>
          <span>Ver Más Tarde</span>
          {statsCounts.watchLater > 0 && (
            <span className="tab-badge amber">{statsCounts.watchLater}</span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filters.status === "COMPLETED"}
          className={`status-tab ${filters.status === "COMPLETED" ? "active" : ""}`}
          onClick={() => onFilterChange({ status: "COMPLETED" })}
        >
          <span className="tab-icon">🏆</span>
          <span>Completados</span>
          {statsCounts.completed > 0 && (
            <span className="tab-badge emerald">{statsCounts.completed}</span>
          )}
        </button>
      </div>

      {/* Main Search Bar & View Mode Switcher */}
      <div className="search-controls-wrapper">
        <div className="search-box-v2">
          <span className="search-box-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input-v2"
            placeholder="Buscar por curso, temática o autor (ej. Romuald, Claude, Midjourney, Trading, Copy)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            aria-label="Buscar cursos en la biblioteca"
          />
          {filters.searchQuery ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onFilterChange({ searchQuery: "" })}
              aria-label="Borrar texto de búsqueda"
            >
              ✕
            </button>
          ) : (
            <span className="search-kbd-badge" aria-hidden="true">/</span>
          )}
        </div>

        {/* View Mode & Filter Toggle Buttons */}
        <div className="search-actions-group">
          <button
            type="button"
            className={`btn-filter-toggle ${showAdvanced ? "active" : ""}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>⚙️ Filtros Avanzados</span>
            <span className="toggle-indicator">{showAdvanced ? "▲" : "▼"}</span>
          </button>

          <div className="view-mode-toggle" role="group" aria-label="Modo de visualización">
            <button
              type="button"
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => onViewModeChange("grid")}
              title="Vista en Cartelera / Cuadrícula Visual"
              aria-label="Vista cuadrícula"
            >
              🔲 Cards
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => onViewModeChange("list")}
              title="Vista en Tabla / Lista Compacta"
              aria-label="Vista lista compacta"
            >
              📋 Lista
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={onResetFilters}
              title="Restablecer todos los filtros"
            >
              ❌ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <CategoryPills
        categories={categories}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => onFilterChange({ category: cat })}
      />

      {/* Advanced Filter Controls Drawer */}
      {showAdvanced && (
        <div className="advanced-filters-panel">
          <div className="advanced-grid">
            <div className="filter-field">
              <label htmlFor="select-platform">🏢 Plataforma / Academia</label>
              <select
                id="select-platform"
                value={filters.platform}
                onChange={(e) => onFilterChange({ platform: e.target.value })}
              >
                <option value="ALL">Todas las Plataformas ({platforms.length})</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="select-origin">☁️ Ubicación / Origen</label>
              <select
                id="select-origin"
                value={filters.originType}
                onChange={(e) => onFilterChange({ originType: e.target.value })}
              >
                <option value="ALL">Todos los Orígenes</option>
                <option value="DRIVE_DIRECT">⭐ Mi Unidad & Atajos Cloud (Acceso Directo)</option>
                <option value="DRIVE_MI_UNIDAD">☁️ Google Drive • Mi Unidad</option>
                <option value="DRIVE_SHORTCUT">🚀 Google Drive • Atajos Cloud</option>
                <option value="DRIVE_COMPARTIDA">👥 Google Drive • Unidades Compartidas</option>
                <option value="TELEGRAM_TPC">✈️ Telegram TPC (SSD ➜ Drive)</option>
                <option value="LOCAL_SSD">💾 Almacenamiento Local SSD</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="select-author">👤 Creador / Autor</label>
              <select
                id="select-author"
                value={filters.author}
                onChange={(e) => onFilterChange({ author: e.target.value })}
              >
                <option value="ALL">Todos los Autores ({authors.length})</option>
                {authors.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="select-niche">🎯 Nicho / Especialidad</label>
              <select
                id="select-niche"
                value={filters.niche}
                onChange={(e) => onFilterChange({ niche: e.target.value })}
              >
                <option value="ALL">Todos los Nichos ({niches.length})</option>
                {niches.slice(0, 50).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="select-format">📦 Formato de Archivo</label>
              <select
                id="select-format"
                value={filters.formatType}
                onChange={(e) => onFilterChange({ formatType: e.target.value as FormatFilter })}
              >
                <option value="ALL">Todos los Formatos</option>
                <option value="FOLDERS">📁 Carpetas con Lecciones</option>
                <option value="ARCHIVES">📦 Archivos ZIP / RAR</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="select-sort">🔀 Ordenar Resultados</label>
              <select
                id="select-sort"
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              >
                <option value="relevance">🌟 Relevancia y Calidad</option>
                <option value="rating_desc">⭐ Mejor Valorados (4.8+)</option>
                <option value="lessons_desc">📚 Más Lecciones</option>
                <option value="title_asc">🔤 Título (A - Z)</option>
                <option value="author_asc">👤 Autor (A - Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
