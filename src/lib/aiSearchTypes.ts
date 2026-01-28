export interface AiSearchFilters {
  brand?: string;
  car_type?: string;
  year?: number;
  section_main?: string;
  section_sub?: string;
  in_stock?: boolean;
}

export interface AiSearchAlternative {
  id: string;
  name_ar: string;
  part_number: string;
  image: string;
  price: number;
  stock: number;
  brand: string;
  car_type: string;
  year: number | null;
}

export interface AiSearchItem {
  id: string;
  name_ar: string;
  part_number: string;
  brand: string;
  car_type: string;
  year: number | null;
  section_main: string;
  section_sub: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  score: number;
  alternatives: AiSearchAlternative[];
}

export interface AiSearchResponse {
  query: string;
  page: number;
  perPage: number;
  total: number;
  inferred: {
    brand: string | null;
    year: number | null;
    partNumbers: string[];
  };
  filters: AiSearchFilters;
  items: AiSearchItem[];
  meta: {
    hasAi: boolean;
    embeddingModel: string | null;
  };
}

