import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  private cartService = inject(CartService);

  private router = inject(Router);

  cartItems = this.cartService.cartItems;

  isLoading = signal(false);

  increaseQuantity(item: any) {

    if (!item._id) {
      return;
    }

    this.cartService
      .updateCartItem(item._id, item.quantity + 1)
      .subscribe();
  }

  decreaseQuantity(item: any) {

    if (!item._id || item.quantity <= 1) {
      return;
    }

    this.cartService
      .updateCartItem(item._id, item.quantity - 1)
      .subscribe();
  }

  removeItem(item: any) {

    if (!item._id) {
      return;
    }

    this.cartService
      .removeFromCart(item._id)
      .subscribe();
  }

  getSubtotal(): number {

    return this.cartItems().reduce(
      (total, item) =>
        total + (item.product.price * item.quantity),
      0
    );
  }

  clearCart() {

    this.cartService.clearCart().subscribe();
  }

  proceedToCheckout() {

    this.isLoading.set(true);

    setTimeout(() => {

      this.isLoading.set(false);

      this.router.navigateByUrl('/checkout');

    }, 1800);
  }
}