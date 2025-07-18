export const userSchema = {
  type: "object",
  required: ["id", "name", "email"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    name: {
      type: "string",
      maxLength: 255,
    },
    email: {
      type: "string",
      format: "email",
      maxLength: 255,
    },
    password: {
      type: "string",
      maxLength: 255,
    },
    googleId: {
      type: "string",
      maxLength: 255,
    },
    facebookId: {
      type: "string",
      maxLength: 255,
    },
    is_verified: {
      type: "boolean",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
  },
};
export const offerWallTasksSchema = {
  type: "object",
  required: [
    "id",
    "network",
    "offer_id",
    "campaign_id",
    "category_id",
    "name",
    "url",
    "payout",
    "redemptions",
    "clicks",
    "status",
    "is_translated",
    "is_featured",
    "goals_count",
  ],
  properties: {
    id: {
      type: "integer",
    },
    network: {
      type: "string",
      maxLength: 50,
    },
    offer_id: {
      type: "string",
      maxLength: 255,
    },
    campaign_id: {
      type: "string",
      maxLength: 255,
    },
    category_id: {
      type: "integer",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    instructions: {
      type: "string",
    },
    image: {
      type: "string",
      maxLength: 255,
    },
    url: {
      type: "string",
      maxLength: 2500,
    },
    payout: {
      type: "number",
    },
    countries: {
      type: "string",
    },
    devices: {
      type: "string",
    },
    platforms: {
      type: "string",
    },
    conversion_rate: {
      type: "number",
    },
    score: {
      type: "number",
    },
    daily_cap: {
      type: "number",
    },
    created_date: {
      type: "string",
      format: "date-time",
    },
    start_date: {
      type: "string",
      format: "date-time",
    },
    end_date: {
      type: "string",
      format: "date-time",
    },
    offer_type: {
      type: "string",
      maxLength: 255,
    },
    network_categories: {
      type: "string",
    },
    network_goals: {
      type: "string",
    },
    redemptions: {
      type: "integer",
    },
    clicks: {
      type: "integer",
    },
    status: {
      type: "string",
      enum: ["publish", "draft", "trash"],
    },
    is_translated: {
      type: "boolean",
    },
    is_featured: {
      type: "boolean",
    },
    goals_count: {
      type: "integer",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
  },
};
export const offerWallNetworkSchema = {
  type: "object",
  required: ["id", "name", "code", "type", "enabled"],
  properties: {
    id: {
      type: "integer",
    },
    name: {
      type: "string",
      maxLength: 255,
    },
    code: {
      type: "string",
      maxLength: 50,
    },
    logo: {
      type: "string",
      maxLength: 255,
    },
    type: {
      type: "string",
      enum: ["tasks", "surveys"],
    },
    config_params: {
      type: "string",
    },
    postback_validation_key: {
      type: "string",
      maxLength: 255,
      description: "Used to validate postback on our end",
    },
    postback_key: {
      type: "string",
      maxLength: 255,
    },
    api_key: {
      type: "string",
      maxLength: 255,
    },
    app_id: {
      type: "string",
      maxLength: 255,
    },
    pub_id: {
      type: "string",
      maxLength: 255,
    },
    countries: {
      type: "string",
      maxLength: 255,
    },
    categories: {
      type: "string",
      maxLength: 255,
    },
    enabled: {
      type: "boolean",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
  },
};
export const offerWallCategories = {
  type: "object",
  required: [
    "id",
    "name",
    "is_featured",
    "sort_order",
    "mapping_for",
    "match_keywords",
    "match_order",
  ],
  properties: {
    id: {
      type: "integer",
    },
    name: {
      type: "string",
      maxLength: 255,
    },
    icon: {
      type: "string",
      maxLength: 255,
      description:
        "Offerwall Category Icon ||type=image,path=/uploads/images/ow_cats/",
    },
    banner_img: {
      type: "string",
      maxLength: 255,
      description:
        "Offerwall Category Banner ||type=image,path=/uploads/images/ow_cats_banner/",
    },
    is_featured: {
      type: "boolean",
    },
    sort_order: {
      type: "integer",
    },
    fg_color: {
      type: "string",
      maxLength: 255,
    },
    bg_color: {
      type: "string",
      maxLength: 255,
    },
    mapping_for: {
      type: "string",
      maxLength: 255,
      default: "tasks",
    },
    match_keywords: {
      type: "string",
      maxLength: 1000,
    },
    match_order: {
      type: "integer",
    },
    item_count: {
      type: "integer",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
  },
};
