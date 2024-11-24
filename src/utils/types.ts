type Pet = {
  [key: string]: any;
};

type FrequencyObject = {
  name: string;
  frequency: number;
};

type SubscriptionBill = {
  name: string;
  amount: number;
  date: string | Date;
};

type ActivityObject = {
  name: string;
  frequency: number;
  schedule?: string[];
};

type BrandLoyalty = {
  name: string;
  loyaltyScore: number;
};

type Event = {
  name: string;
  date: string | Date;
  details?: string;
};

type TimelineActivity = {
  activity: string;
  duration: string;
  location?: string;
};

type RegularStop = {
  location: string;
  purpose: string;
  frequency: string;
};

type SpendingCategories = {
  [category: string]: {
    preference: number;
    frequency: number;
  };
};

export type Persona = {
  core: {
    age: number;
    name: string;
    occupation: {
      title: string;
      level: string;
      income: number;
      location: string;
      schedule: string[];
    };
    home: {
      type: string;
      ownership: string;
      location: string;
      commute_distance_km: number;
    };
    household: {
      status: string;
      members: string[];
      pets: Pet[];
    };
  };
  routines: {
    weekday: {
      [hour: string]: TimelineActivity;
    };
    weekend: ActivityObject[];
    commute: {
      method: string;
      route: string[];
      regular_stops: RegularStop[];
    };
  };
  preferences: {
    diet: string[];
    brands: BrandLoyalty[];
    price_sensitivity: number;
    payment_methods: string[];
    shopping: {
      grocery_stores: FrequencyObject[];
      coffee_shops: FrequencyObject[];
      restaurants: FrequencyObject[];
      retail: FrequencyObject[];
    };
  };
  finances: {
    subscriptions: SubscriptionBill[];
    regular_bills: SubscriptionBill[];
    spending_patterns: {
      impulsive_score: number;
      categories: SpendingCategories;
    };
  };
  habits: {
    exercise: ActivityObject[];
    social: ActivityObject[];
    entertainment: ActivityObject[];
    vices: ActivityObject[];
  };
  context: {
    stress_triggers: string[];
    reward_behaviors: string[];
    upcoming_events: Event[];
    recent_changes: string[];
  };
};

export interface MBTIType {
  type: string;
  traits: string[];
}
