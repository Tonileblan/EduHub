
import type { Lesson } from "./Lesson";

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}
