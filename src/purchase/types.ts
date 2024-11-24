export interface Reflection {
  comment: string;
  satisfactionScore: number;
  date: string;
  mood?: string | null;
}

export interface Purchase {
  name: string;
  amount: number;
  datetime: string;
  location: string;
  notes?: string;
  reflections?: Reflection[];
}

export interface PurchaseList {
  items: Purchase[];
}

export interface ReflectionJson {
  comment: string;
  satisfactionScore: number;
  date: string;
  mood: string | null;
}
