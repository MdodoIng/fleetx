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

export type OverallRatingType =
  | 'MashkorRating'
  | 'MashkorRatingCount'
  | 'CourierDashboard'
  | 'CourierDashboardCount'
  | 'CourierDashboardPickup'
  | 'CourierDashboardPickupCount'
  | 'CourierDashboardDelivery'
  | 'CourierDashboardDeliveryCount'
  | 'MobileApp'
  | 'MobileAppCount'
  | 'MobileAppBuy'
  | 'MobileAppBuyCount'
  | 'MobileAppPickup'
  | 'MobileAppPickupCount'
  | 'SellerDashboard'
  | 'SellerDashboardCount'
  | 'SellerDashboardPickup'
  | 'SellerDashboardPickupCount'
  | 'SellerDashboardDelivery'
  | 'SellerDashboardDeliveryCount'
  | 'ImprovementType_1'
  | 'ImprovementType_2'
  | 'ImprovementType_3'
  | 'ImprovementType_4';

export interface TypeGetDashBoardResponce {
  data: {
    overall_rating_type: OverallRatingType;
    value: string;
    value_type: number;
  }[];
}
