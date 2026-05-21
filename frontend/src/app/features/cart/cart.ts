import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { CartItem } from '../../core/models/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartItems: CartItem[] = [];

  isLoading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {

    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  increaseQuantity(item: CartItem) {

    if (!item._id) {
      return;
    }

    this.cartService
      .updateCartItem(item._id, item.quantity + 1)
      .subscribe();
  }

  decreaseQuantity(item: CartItem) {

    if (!item._id || item.quantity <= 1) {
      return;
    }

    this.cartService
      .updateCartItem(item._id, item.quantity - 1)
      .subscribe();
  }

  removeItem(item: CartItem) {

    if (!item._id) {
      return;
    }

    this.cartService
      .removeFromCart(item._id)
      .subscribe();
  }

  getSubtotal(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + (item.product.price * item.quantity),
      0
    );
  }

  clearCart() {

    this.cartService.clearCart().subscribe();
  }

  proceedToCheckout() {

    this.isLoading = true;

    setTimeout(() => {

      this.isLoading = false;

      this.router.navigateByUrl('/checkout');

    }, 1800);
  }
}