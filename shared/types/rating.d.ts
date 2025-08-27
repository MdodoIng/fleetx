export type TypeRootRating = {
  rating: number;
  improvements: string[];
};

export interface TypeRootRatingResponse {
  data: TypeRootRating;
}

export interface typePostRating {
  order_number: string;
  rating: number;
  improvment_item: number;
}
