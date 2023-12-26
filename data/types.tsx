export interface CategoriesObj {
  categoriesCount: number;
  categories: string[];
  categoriesWithCount: { [key: string]: number };
}

export interface QuestionSmall {
  slug: string;
  isActive: boolean;

  id: string;
  text: string;
  a: string;
  b: string;
  c: string;
  r: string;
  media: string;
  categories: string[];
  score: number;
}

export interface QuestionSmallObj {
  questionsSmallCount: number;
  categoriesObj: CategoriesObj;
  questionsSmall: QuestionSmall[];
}
