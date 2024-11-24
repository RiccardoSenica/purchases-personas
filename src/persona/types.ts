interface Pet {
  [key: string]: unknown;
}

interface FrequencyObject {
  name: string;
  frequency: number;
}

interface SubscriptionBill {
  name: string;
  amount: number;
  date: string | Date;
}

interface ActivityObject {
  name: string;
  frequency: number;
  schedule?: string[];
}

interface BrandLoyalty {
  name: string;
  loyaltyScore: number;
}

interface Event {
  name: string;
  date: string | Date;
  details?: string;
}

interface TimelineActivity {
  activity: string;
  duration: string;
  location?: string;
}

interface RegularStop {
  location: string;
  purpose: string;
  frequency: string;
}

interface SpendingCategories {
  [category: string]: {
    preference: number;
    frequency: number;
  };
}

export interface Persona {
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
}
