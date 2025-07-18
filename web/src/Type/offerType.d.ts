export interface OfferType {
  id: number;
  name?: string;
  description?: string;
  network?: string;
  offer_id?: string;
  image?: string;
  url?: string;
  payout?: string;
  countries?: string[];
  platforms?: string[];
  is_featured?: number;
  provider?: {
    code?: string;
    name?: string;
    icon?: string;
  };
  category: {
    name?: string;
    id?: number;
    icon?: string;
    bg_color?: string;
    sort_order?: number;
  };
}
