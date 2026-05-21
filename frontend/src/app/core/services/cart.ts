import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CartItem } from '../models/cart-item';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.refreshCart();
    });
    this.refreshCart();
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
      this.cartSubject.next([]);
      return;
    }

    this.api.get<any>('/cart').subscribe({
      next: items => this.cartSubject.next(this.normalizeCartResponse(items)),
      error: () => this.cartSubject.next([]),
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cart$;
  }

  getCartCount(): Observable<number> {
    if (!this.authService.isLoggedIn()) {
      return of(0);
    }

    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem[]> {
    return this.api.post<any>('/cart', { productId, quantity }).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartSubject.next(items)),
      tap(() => this.refreshCart())
    );
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem[]> {
    return this.api.put<any>(`/cart/${itemId}`, { quantity }).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartSubject.next(items)),
      tap(() => this.refreshCart())
    );
  }

  removeFromCart(itemId: string): Observable<CartItem[]> {
    return this.api.delete<any>(`/cart/${itemId}`).pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartSubject.next(items)),
      tap(() => this.refreshCart())
    );
  }

  clearCart(): Observable<CartItem[]> {
    return this.api.delete<any>('/cart').pipe(
      map(response => this.normalizeCartResponse(response)),
      tap(items => this.cartSubject.next(items)),
      tap(() => this.refreshCart())
    );
  }

}