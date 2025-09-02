export interface TypeSuperSaverPromationRes {
  data: {
    start_time: string;
    end_time: string;
    full_day: boolean;
    next_day: boolean;
    enabled: boolean;
    active_orders_count: number;
    success_orders_count: number;
    achieved_supersaver: boolean;
    super_saver_reach_order_count: number;
    active: boolean;
    delivery_fee_rule: any;
    delivery_fee_rule_type: any;
  };
}

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
