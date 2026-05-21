export interface Order {
  _id: string;
  user: string | { email?: string; name?: string };
  totalPrice: number;
  status: string;
  createdAt?: string;
  items?: any[];
}
