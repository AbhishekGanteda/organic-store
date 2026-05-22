import { Injectable, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CartItem } from '../models/cart-item';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  readonly cartItems = signal<CartItem[]>([]);
  readonly cartCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) {
    effect(() => {
      this.authService.currentUser();
      this.refreshCart();
    });
  }

  private normalizeCartResponse(response: any): CartItem[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (Array.isArray(response?.cart)) {
      return response.cart;
    }
    if (Array.isArray(response?.items)) {
      return response.items;
    }
    return [];
  }

  private refreshCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.cartItems.set([]);
      return;
    }

    this.api.get<any>('/cart').subscribe({
      next: items => this.cartItems.set(this.normalizeCartResponse(items)),
      error: () => this.cartItems.set([]),
    });
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem[]> {
    return this.api.post<any>('/cart', { productId, quantity }).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartItems.set(items))
    );
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem[]> {
    return this.api.put<any>(`/cart/${itemId}`, { quantity }).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartItems.set(items))
    );
  }

  removeFromCart(itemId: string): Observable<CartItem[]> {
    return this.api.delete<any>(`/cart/${itemId}`).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartItems.set(items))
    );
  }

  clearCart(): Observable<CartItem[]> {
    return this.api.delete<any>('/cart').pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartItems.set(items))
    );
  }

}