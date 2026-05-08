import { Injectable } from '@angular/core';

import { CartItem } from '../models/cart-item';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  addToCart(product: Product, quantity: number = 1) {

    const existingItem =
      this.cartItems.find(
        item => item.product.id === product.id
      );

    if (existingItem) {

      existingItem.quantity += quantity;

    }

    else {

      this.cartItems.push({
        product,
        quantity
      });

    }

  }

  getCartItems(): CartItem[] {

    return this.cartItems;

  }

  getCartCount(): number {

    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

  }

  removeFromCart(productId: number) {

    this.cartItems =
      this.cartItems.filter(
        item => item.product.id !== productId
      );

  }

  clearCart() {

    this.cartItems = [];

  }

}