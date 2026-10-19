import React, { useState, useEffect, useMemo } from "react";
import { useCourses } from "./presentation/hooks/useCourses";
import { useProgress } from "./presentation/hooks/useProgress";
import { Navbar } from "./presentation/components/Navbar";
import { StatsBanner } from "./presentation/components/StatsBanner";
import { HeroSpotlight } from "./presentation/components/HeroSpotlight";
import { CategoryHub } from "./presentation/components/CategoryHub";
import { FilterBar, type ViewMode } from "./presentation/components/FilterBar";
import { CourseCard } from "./presentation/components/CourseCard";
import { CourseListView } from "./presentation/components/CourseListView";
import { CourseModal } from "./presentation/components/CourseModal";
import { ScannerModal } from "./presentation/components/ScannerModal";
import { TelegramPipelineModal } from "./presentation/components/TelegramPipelineModal";
import { ToastContainer, type ToastMessage } from "./presentation/components/Toast";
import { Pagination } from "./presentation/components/Pagination";
import type { Course } from "./domain/entities/Course";
import "./App.css";

export const App: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [pipelineCourse, setPipelineCourse] = useState<Course | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 24 : 40;

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "success" | "info" = "info") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const {
    progressMap,
    toggleLesson,
    toggleFavorite,
    toggleWatchLater,
    saveNotes,
    stats
  } = useProgress(6038, []);

  const {
    courses,
    filteredCourses,
    loading,
    error,
    filters,
    categories,
    authors,
    niches,
    platforms,
    updateFilters,
    resetFilters
  } = useCourses(progressMap);

  // Global search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const searchInput = document.querySelector(".search-input-v2") as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset pagination on filter changes or view mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, viewMode]);

  // Compute category counts for CategoryHub
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of courses) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, [courses]);

  // Compute status counts for filter tabs
  const statsCounts = useMemo(() => {
    let favorites = 0;
    let inProgress = 0;
    let watchLater = 0;
    let completed = 0;
    let telegram = 0;
    let directDrive = 0;

    for (const c of courses) {
      if (c.originType === "TELEGRAM_TPC") telegram++;
      if (c.originType === "DRIVE_MI_UNIDAD" || c.originType === "DRIVE_SHORTCUT") directDrive++;
    }

    for (const [_, prog] of Object.entries(progressMap)) {
      if (prog.isFavorite) favorites++;
      if (prog.isWatchLater) watchLater++;
      if (prog.percentCompleted === 100) {
        completed++;
      } else if (prog.percentCompleted > 0) {
        inProgress++;
      }
    }

    return {
      total: courses.length,
      favorites,
      inProgress,
      watchLater,
      completed,
      telegram,
      directDrive
    };
  }, [courses, progressMap]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleFavoriteWithToast = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    toggleFavorite(courseId);
    const isFavNow = !progressMap[courseId]?.isFavorite;
    if (course) {
      showToast(
        isFavNow ? `❤️ "${course.title}" añadido a Favoritos` : `🤍 Quitado de Favoritos`,
        "info"
      );
    }
  };

  const handleToggleWatchLaterWithToast = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    toggleWatchLater(courseId);
    const isWLNow = !progressMap[courseId]?.isWatchLater;
    if (course) {
      showToast(
        isWLNow ? `📌 "${course.title}" añadido a Ver Más Tarde` : `📌 Quitado de Ver Más Tarde`,
        "info"
      );
    }
  };

  const handleSearchTag = (query: string) => {
    updateFilters({ searchQuery: query });
    const searchInput = document.querySelector(".search-input-v2") as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleCategorySelect = (category: string) => {
    updateFilters({ category });
  };

  const handleOpenPipeline = (course: Course) => {
    setPipelineCourse(course);
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenScanner={() => setShowScannerModal(true)}
        onOpenStats={() => setShowStats(!showStats)}
        showStats={showStats}
        totalCourses={courses.length}
      />

      <main className="main-content">
        {/* Hero Spotlight Section */}
        <HeroSpotlight
          totalCourses={courses.length}
          onSearchTag={handleSearchTag}
          onSelectCategory={handleCategorySelect}
        />

        {/* Global Progress Metrics Banner if toggled */}
        {showStats && <StatsBanner stats={stats} />}

        {/* Visual Category Cards Hub */}
        <CategoryHub
          selectedCategory={filters.category}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
        />

        {/* Filter Controls & Search */}
        <FilterBar
          filters={filters}
          categories={categories}
          authors={authors}
          niches={niches}
          platforms={platforms}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          statsCounts={statsCounts}
        />

        {/* Results Info & View Header */}
        <div className="results-header-v2">
          <div className="results-left">
            <h2 className="results-title">
              {filters.originType === "TELEGRAM_TPC"
                ? "✈️ Cursos de Telegram TPC (Flujo SSD ➜ Drive)"
                : filters.originType === "DRIVE_DIRECT"
                ? "⭐ Cursos en Mi Drive & Atajos Cloud"
                : filters.platform !== "ALL"
                ? `🏢 Academia / Plataforma: ${filters.platform}`
                : filters.status === "FAVORITE"
                ? "❤️ Mis Cursos Favoritos"
                : filters.status === "IN_PROGRESS"
                ? "⚡ Cursos en Progreso"
                : filters.status === "WATCH_LATER"
                ? "📌 Lista para Ver Más Tarde"
                : filters.status === "COMPLETED"
                ? "🏆 Cursos Completados"
                : filters.category !== "ALL"
                ? `📚 Área: ${filters.category}`
                : "🌟 Catálogo Completo"}
            </h2>
            <span className="results-count-pill">
              {filteredCourses.length.toLocaleString()} formaciones encontradas
            </span>
          </div>

          <div className="results-right">
            <span className="page-indicator">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="loading-state-card">
            <div className="loading-spinner-glow">⚡</div>
            <h3>Cargando catálogo maestro de 6.000+ cursos...</h3>
            <p>Conectando con el índice de Google Drive Cloud y Telegram TPC</p>
          </div>
        ) : error ? (
          <div className="error-state-card">
            <p>{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">🔍</div>
            <h3>No encontramos cursos que coincidan con estos filtros</h3>
            <p>Prueba a buscar con otros términos, seleccionar otra área o limpiar los filtros.</p>
            <button type="button" className="btn-primary" onClick={resetFilters}>
              🔄 Restablecer Filtros
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="course-grid-v2">
                {paginatedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progressMap[course.id]}
                    onOpenDetails={(c) => setSelectedCourse(c)}
                    onToggleFavorite={handleToggleFavoriteWithToast}
                    onToggleWatchLater={handleToggleWatchLaterWithToast}
                    onOpenPipeline={handleOpenPipeline}
                  />
                ))}
              </div>
            ) : (
              <CourseListView
                courses={paginatedCourses}
                progressMap={progressMap}
                onOpenDetails={(c) => setSelectedCourse(c)}
                onToggleFavorite={handleToggleFavoriteWithToast}
                onToggleWatchLater={handleToggleWatchLaterWithToast}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {/* Course Details & Syllabus Cinema Modal */}
      <CourseModal
        course={selectedCourse}
        progress={selectedCourse ? progressMap[selectedCourse.id] : undefined}
        onClose={() => setSelectedCourse(null)}
        onToggleLesson={toggleLesson}
        onSaveNotes={saveNotes}
        onShowToast={showToast}
        onOpenPipeline={handleOpenPipeline}
      />

      {/* Telegram Pipeline Modal */}
      <TelegramPipelineModal
        course={pipelineCourse}
        isOpen={Boolean(pipelineCourse)}
        onClose={() => setPipelineCourse(null)}
        onShowToast={showToast}
      />

      {/* Cloud & Drive Synchronization Modal */}
      <ScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        totalCourses={courses.length}
        onShowToast={showToast}
      />

      {/* DOM Visual Toast Feedback */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
