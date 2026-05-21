import {
  Component,
  OnInit,
  signal,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class Navbar implements OnInit {

  isMenuOpen = signal(false);

  userMenuOpen = signal(false);

  cartCount = 0;

  isAdmin = false;

  currentUser: any = null;

  private subs: Subscription[] = [];

  @ViewChild('menuContainer')
  menuContainerRef!: ElementRef;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

    if (this.authService.isLoggedIn()) {

      this.cartService.getCartCount().subscribe(count => {
        this.cartCount = count;
      });

    } else {

      this.cartCount = 0;
    }

    const sub = this.authService.currentUser$.subscribe(user => {

      this.currentUser = user;

      this.isAdmin =
        !!user?.role && user.role === 'admin';
    });

    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

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