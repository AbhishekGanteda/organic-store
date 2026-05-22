import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { CartService } from './cart';
import { ApiService } from './api.service';
import { AuthService } from './auth';

describe('Cart', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: {} },
        {
          provide: AuthService,
          useValue: {
            currentUser: signal(null),
            isLoggedIn: () => false,
          },
        },
      ],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
