import {
  Component,
  computed,
  inject,
  signal,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private cartService = inject(CartService);

  private authService = inject(AuthService);

  private router = inject(Router);

  isMenuOpen = signal(false);

  userMenuOpen = signal(false);

  cartCount = this.cartService.cartCount;

  currentUser = this.authService.currentUser;

  isAdmin = computed(() => {
    const user = this.currentUser();
    return !!user?.role && user.role === 'admin';
  });

  @ViewChild('menuContainer')
  menuContainerRef!: ElementRef;

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  onUserIconClick(event: MouseEvent) {

    event.stopPropagation();

    if (this.authService.isLoggedIn()) {

      this.userMenuOpen.update(v => !v);

    } else {

      this.router.navigateByUrl('/auth?mode=signin');
    }
  }

  onLogout() {

    this.authService.logout();

    this.userMenuOpen.set(false);

    this.router.navigateByUrl('/');
  }

  navigateToProfile() {

    this.userMenuOpen.set(false);

    this.router.navigateByUrl('/profile');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    if (!this.userMenuOpen()) {
      return;
    }

    const clickedInside =
      this.menuContainerRef?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.userMenuOpen.set(false);
    }
  }
}