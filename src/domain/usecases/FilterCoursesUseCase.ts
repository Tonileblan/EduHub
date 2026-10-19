import type { Course } from "../entities/Course";
import type { FilterState } from "../entities/FilterState";
import type { CourseProgress } from "../entities/UserProgress";

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row: number[] = [];
  for (let j = 0; j <= b.length; j++) row[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1]
        ? row[j - 1]
        : Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function collapseConsonants(str: string): string {
  return str.replace(/([a-z0-9])\1+/g, "$1");
}

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenMatchesText(token: string, text: string, words: string[]): boolean {
  // 1. Direct fast substring match
  if (text.includes(token)) return true;

  const tokenCollapsed = collapseConsonants(token);
  // Stemming: remove plural ending 's' or 'es' for tokens > 3 chars
  const tokenStem = token.length > 3 ? token.replace(/(es|s)$/, "") : token;
  const tokenStemCollapsed = collapseConsonants(tokenStem);

  if (tokenStem.length >= 3 && text.includes(tokenStem)) return true;

  // 2. Check each word in the searchable content
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;

    // Exact word or prefix match
    if (word === token || word.startsWith(token)) return true;
    if (token.length >= 4 && token.startsWith(word) && word.length >= 4) return true;

    // Stem matches (e.g. 'robins' -> 'robin', 'libros' -> 'libro')
    if (tokenStem.length >= 3 && (word === tokenStem || word.startsWith(tokenStem))) return true;
    const wordStem = word.length > 3 ? word.replace(/(es|s)$/, "") : word;
    if (wordStem === token || wordStem === tokenStem) return true;

    // Collapsed consonants match (e.g. 'robbins' vs 'robins', 'tonny' vs 'tony')
    const wordCollapsed = collapseConsonants(word);
    if (wordCollapsed === tokenCollapsed || wordCollapsed.includes(tokenCollapsed)) return true;
    if (
      tokenStemCollapsed.length >= 3 &&
      (wordCollapsed === tokenStemCollapsed || wordCollapsed.includes(tokenStemCollapsed))
    ) {
      return true;
    }

    // Typo tolerance via Levenshtein distance
    // For tokens >= 4 chars: distance <= 1
    // For tokens >= 7 chars: distance <= 2
    const lenDiff = Math.abs(word.length - token.length);
    if (token.length >= 4 && lenDiff <= 1) {
      if (levenshtein(token, word) <= 1) return true;
      if (tokenStem.length >= 3 && levenshtein(tokenStem, word) <= 1) return true;
    } else if (token.length >= 7 && lenDiff <= 2) {
      if (levenshtein(token, word) <= 2) return true;
    }
  }

  return false;
}

export class FilterCoursesUseCase {
  static filter(
    courses: Course[],
    filters: FilterState,
    progressMap: Record<string, CourseProgress>
  ): Course[] {
    const rawQuery = filters.searchQuery.trim();
    const queryTokens = rawQuery ? normalizeSearchText(rawQuery).split(/\s+/).filter(Boolean) : [];
    
    return courses.filter(course => {
      // 1. Fuzzy and Smart Text Search across Title, Author, Platform, Niche, Utility, Category, Tags
      if (queryTokens.length > 0) {
        const rawContent = `${course.title} ${course.author} ${course.platform || ""} ${course.niche} ${course.utility} ${course.category} ${course.tags.join(" ")}`;
        const searchableText = normalizeSearchText(rawContent);
        const words = searchableText.split(/\s+/).filter(Boolean);

        const matchesAllTokens = queryTokens.every(token => tokenMatchesText(token, searchableText, words));
        if (!matchesAllTokens) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category && filters.category !== "ALL") {
        if (course.category !== filters.category) return false;
      }

      // 3. Platform Filter
      if (filters.platform && filters.platform !== "ALL") {
        if (course.platform !== filters.platform) return false;
      }

      // 4. Author Filter
      if (filters.author && filters.author !== "ALL") {
        if (course.author !== filters.author) return false;
      }

      // 5. Niche Filter
      if (filters.niche && filters.niche !== "ALL") {
        if (course.niche !== filters.niche) return false;
      }

      // 6. Origin Type Filter
      if (filters.originType && filters.originType !== "ALL") {
        if (filters.originType === "DRIVE_ALL") {
          if (!course.originType.startsWith("DRIVE_")) return false;
        } else if (filters.originType === "DRIVE_DIRECT") {
          if (course.originType !== "DRIVE_MI_UNIDAD" && course.originType !== "DRIVE_SHORTCUT") return false;
        } else if (course.originType !== filters.originType) {
          return false;
        }
      }

      // 6. Format Type Filter (ZIP/RAR vs Direct Folder)
      if (filters.formatType && filters.formatType !== "ALL") {
        if (filters.formatType === "ARCHIVES" && !course.isArchive) return false;
        if (filters.formatType === "FOLDERS" && course.isArchive) return false;
      }

      // 7. User Status Filter
      if (filters.status && filters.status !== "ALL") {
        const progress = progressMap[course.id];
        if (filters.status === "FAVORITE" && !progress?.isFavorite) return false;
        if (filters.status === "WATCH_LATER" && !progress?.isWatchLater) return false;
        if (filters.status === "IN_PROGRESS" && progress?.status !== "IN_PROGRESS") return false;
        if (filters.status === "COMPLETED" && progress?.status !== "COMPLETED") return false;
        if (filters.status === "NOT_STARTED" && progress?.status && progress.status !== "NOT_STARTED") return false;
      }

      // 8. Only with local scanned lessons
      if (filters.onlyWithLessons && !course.hasLocalFiles) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (rawQuery && filters.sortBy === "relevance") {
        const normQ = normalizeSearchText(rawQuery);
        const aTitle = normalizeSearchText(a.title);
        const bTitle = normalizeSearchText(b.title);
        const aAuthor = normalizeSearchText(a.author);
        const bAuthor = normalizeSearchText(b.author);

        const aScore = (aTitle.includes(normQ) ? 10 : 0) + (aAuthor.includes(normQ) ? 8 : 0);
        const bScore = (bTitle.includes(normQ) ? 10 : 0) + (bAuthor.includes(normQ) ? 8 : 0);

        if (aScore !== bScore) {
          return bScore - aScore;
        }
      }

      if (filters.sortBy === "rating_desc") {
        return b.rating - a.rating;
      }
      if (filters.sortBy === "lessons_desc") {
        return b.totalLessons - a.totalLessons;
      }
      if (filters.sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (filters.sortBy === "author_asc") {
        return a.author.localeCompare(b.author);
      }
      if (a.originType === "LOCAL_SSD" && b.originType !== "LOCAL_SSD") return -1;
      if (b.originType === "LOCAL_SSD" && a.originType !== "LOCAL_SSD") return 1;
      return b.rating - a.rating;
    });
  }
}
