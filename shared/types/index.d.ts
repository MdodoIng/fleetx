export interface TypeVendorPricingRuleRes {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean;
    delivery_model: number;
    rule_type: number;
    rule_category: number;
    rule_definition: {
      fare: number;
    };
    affiliation_id: string | null;
    vendor_id: string | null;
    branch_id: string | null;
    is_promotion_rule: boolean;
    special_area_set: any;
  };
}

export type TypeFirstOrderInsightResponse = {
  data: {
    avg_rating: number;
    improvements: string[] | any;
  };
};
