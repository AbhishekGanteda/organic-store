import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit() {

    this.cartItems =
      this.cartService.getCartItems();

  }

  increaseQuantity(item: CartItem) {

    item.quantity++;

  }

  decreaseQuantity(item: CartItem) {

    if (item.quantity > 1) {
      item.quantity--;
    }

  }

  removeItem(productId: number) {

    this.cartService.removeFromCart(productId);

    this.cartItems =
      this.cartService.getCartItems();

  }

  getSubtotal(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + (item.product.price * item.quantity),
      0
    );

  }

}