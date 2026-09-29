export type SortOption = "relevance" | "rating_desc" | "lessons_desc" | "title_asc" | "author_asc";
export type FormatFilter = "ALL" | "ARCHIVES" | "FOLDERS";

export interface FilterState {
  searchQuery: string;
  category: string;
  author: string;
  niche: string;
  originType: string;
  formatType: FormatFilter;
  status: string;
  sortBy: SortOption;
  onlyWithLessons: boolean;
}
