import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = signal(false);

  cartCount: number = 0;

  constructor(
    private cartService: CartService
  ) {}

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  ngDoCheck() {

  this.cartCount =
    this.cartService.getCartCount();
  }
}
