export interface Order {
  _id: string;
  user: string | { email?: string; name?: string };
  items: OrderItem[];
  shippingAddress?: OrderShippingAddress;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

export interface OrderShippingAddress {
  label?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderProduct {
  _id: string;
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface OrderItem {
  _id?: string;
  product: OrderProduct | string;
  quantity: number;
  price: number;
}

export interface CreateOrderItem {
  product: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
  shippingAddress: OrderShippingAddress;
  totalPrice: number;
}
