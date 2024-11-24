export interface Purchase {
  name: string;
  amount: number;
  datetime: string;
  location: string;
  notes?: string;
}

export interface PurchaseList {
  items: Purchase[];
}
