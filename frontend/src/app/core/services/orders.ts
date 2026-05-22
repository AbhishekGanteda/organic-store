import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { CreateOrderRequest, Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private api: ApiService) {}

  getOrders(): Observable<Order[]> {
    return this.api.get<{ orders?: Order[] } | Order[]>('/orders').pipe(
      map(response => Array.isArray(response) ? response : response.orders ?? [])
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.api.get<Order>(`/orders/${id}`);
  }

  createOrder(payload: CreateOrderRequest): Observable<Order> {
    return this.api.post<Order>('/orders', payload);
  }
}