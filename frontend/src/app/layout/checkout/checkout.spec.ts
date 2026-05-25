import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { Checkout } from './checkout';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/orders';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  const currentUser = signal<any>({
    name: 'Jane Doe',
    email: 'jane@example.com',
    addresses: [
      {
        label: 'Home',
        street: '123 Main St',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'USA',
      },
    ],
  });

  const mockAuthService: Partial<AuthService> = {
    currentUser,
    isLoggedIn: () => true,
  };

  const mockCartService: Partial<CartService> = {
    cartItems: signal([]),
    clearCart: () => of([]),
  };

  const mockOrderService: Partial<OrderService> = {
    createOrder: () => of({ _id: '1' } as any),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill the shipping form from the saved address', () => {
    expect(component.shippingForm.value).toEqual({
      label: 'Home',
      street: '123 Main St',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA',
    });
  });
});