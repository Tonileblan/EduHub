import React, { useState, useEffect } from "react";
import { useCourses } from "./presentation/hooks/useCourses";
import { useProgress } from "./presentation/hooks/useProgress";
import { Navbar } from "./presentation/components/Navbar";
import { StatsBanner } from "./presentation/components/StatsBanner";
import { FilterBar } from "./presentation/components/FilterBar";
import { CourseCard } from "./presentation/components/CourseCard";
import { CourseModal } from "./presentation/components/CourseModal";
import { ScannerModal } from "./presentation/components/ScannerModal";
import { ToastContainer, type ToastMessage } from "./presentation/components/Toast";
import { Pagination } from "./presentation/components/Pagination";
import type { Course } from "./domain/entities/Course";
import "./App.css";

export const App: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "success" | "info" = "info") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const {
    progressMap,
    toggleLesson,
    toggleFavorite,
    toggleWatchLater,
    saveNotes,
    stats
  } = useProgress(6026, []);

  const {
    courses,
    filteredCourses,
    loading,
    error,
    filters,
    categories,
    authors,
    niches,
    updateFilters,
    resetFilters
  } = useCourses(progressMap);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const searchInput = document.querySelector(".search-input") as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleFavoriteWithToast = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
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
    const course = courses.find(c => c.id === courseId);
    toggleWatchLater(courseId);
    const isWLNow = !progressMap[courseId]?.isWatchLater;
    if (course) {
      showToast(
        isWLNow ? `📌 "${course.title}" añadido a Ver Más Tarde` : `📌 Quitado de Ver Más Tarde`,
        "info"
      );
    }
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
        {showStats && (
          <StatsBanner
            stats={stats}
          />
        )}

        <FilterBar
          filters={filters}
          categories={categories}
          authors={authors}
          niches={niches}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        <div className="results-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2rem 0 1.6rem 0" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Catálogo de Cursos ({filteredCourses.length})
          </h2>
          <span style={{ fontSize: "1.3rem", color: "var(--text-muted)" }}>
            Página {currentPage} de {totalPages}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
            <p style={{ fontSize: "1.6rem", color: "var(--text-secondary)" }}>Cargando catálogo maestro de 6.000+ cursos...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-md)" }}>
            <p style={{ color: "var(--accent-rose)", fontSize: "1.6rem" }}>{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.2rem" }}>🔍</div>
            <h3 style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>No se encontraron cursos con estos filtros</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1.4rem", marginBottom: "2rem" }}>Prueba a cambiar los términos de búsqueda o restablecer los filtros.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={resetFilters}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="course-grid">
              {paginatedCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progressMap[course.id]}
                  onOpenDetails={(c) => setSelectedCourse(c)}
                  onToggleFavorite={handleToggleFavoriteWithToast}
                  onToggleWatchLater={handleToggleWatchLaterWithToast}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      <CourseModal
        course={selectedCourse}
        progress={selectedCourse ? progressMap[selectedCourse.id] : undefined}
        onClose={() => setSelectedCourse(null)}
        onToggleLesson={toggleLesson}
        onSaveNotes={saveNotes}
        onShowToast={showToast}
      />

      <ScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        totalCourses={courses.length}
        onShowToast={showToast}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
