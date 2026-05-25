import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CreateOrderRequest, Order, OrderShippingAddress } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/orders';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  private cartService = inject(CartService);

  private authService = inject(AuthService);

  private orderService = inject(OrderService);

  private router = inject(Router);

  cartItems = this.cartService.cartItems;

  currentUser = this.authService.currentUser;
  isPlacingOrder = signal(false);
  orderPlaced = signal<Order | null>(null);
  errorMessage = signal('');
  hasPrefilledShippingAddress = signal(false);
  private redirectTimer: ReturnType<typeof setTimeout> | null = null;

  shippingForm = new FormGroup({
    label: new FormControl('Home'),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl(''),
    postalCode: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  private readonly syncShippingAddress = effect(() => {
    const user = this.currentUser();
    const primaryAddress = user?.addresses?.[0];

    if (primaryAddress && !this.hasPrefilledShippingAddress()) {
      this.shippingForm.patchValue({
        label: primaryAddress.label || 'Home',
        street: primaryAddress.street || '',
        city: primaryAddress.city || '',
        state: primaryAddress.state || '',
        postalCode: primaryAddress.postalCode || '',
        country: primaryAddress.country || '',
      });

      this.hasPrefilledShippingAddress.set(true);
    }
  });

  getSubtotal(): number {
    return this.cartItems().reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  placeOrder() {
    if (this.shippingForm.invalid || !this.cartItems().length) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    const shippingAddress = this.shippingForm.value as OrderShippingAddress;
    const payload: CreateOrderRequest = {
      items: this.cartItems().map(item => ({
        product: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalPrice: this.getSubtotal(),
    };

    this.isPlacingOrder.set(true);
    this.errorMessage.set('');

    this.orderService.createOrder(payload).subscribe({
      next: order => {
        this.orderPlaced.set(order);
        this.cartService.clearCart().subscribe();
        this.isPlacingOrder.set(false);

        if (this.redirectTimer) {
          clearTimeout(this.redirectTimer);
        }

        this.redirectTimer = setTimeout(() => {
          this.router.navigateByUrl('/orders');
        }, 900);
      },
      error: error => {
        this.isPlacingOrder.set(false);
        this.errorMessage.set(error?.error?.message || 'Unable to place order right now.');
      },
    });
  }

  continueShopping() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }

    this.router.navigateByUrl('/everything');
  }
}