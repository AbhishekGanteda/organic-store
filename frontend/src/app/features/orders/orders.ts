import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Order, OrderItem, OrderProduct } from '../../core/models/order.model';
import { OrderService } from '../../core/services/orders';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly orderCount = computed(() => this.orders().length);
  readonly mostRecentOrderDate = computed(() => {
    const orders = this.orders();

    if (!orders.length) {
      return 'No orders yet';
    }

    const latestOrder = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
    )[0];

    return this.getOrderDate(latestOrder);
  });

  readonly canViewRecipient = computed(() => {
    const user = this.auth.currentUser();
    return !!user && user.role === 'admin';
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrders().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load your orders right now.');
      },
    });
  }

  getProductName(item: OrderItem): string {
    const product = item.product as OrderProduct;
    return product?.name || 'Product';
  }

  getProductImage(item: OrderItem): string {
    const product = item.product as OrderProduct;
    return product?.image || 'https://via.placeholder.com/96x96?text=Order';
  }

  getCustomerName(order: Order): string {
    return typeof order.user === 'string' ? 'Customer' : order.user?.name || 'Customer';
  }

  getOrderDate(order: Order): string {
    return order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently';
  }
}