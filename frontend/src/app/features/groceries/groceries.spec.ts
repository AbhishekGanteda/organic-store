import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Groceries } from './groceries';
import { ProductService } from '../../core/services/product.service';

describe('Groceries', () => {
  let component: Groceries;
  let fixture: ComponentFixture<Groceries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Groceries],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductsByCategory: jest.fn().mockReturnValue(of([])),
            getSaleProducts: jest.fn().mockReturnValue(of([]))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Groceries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
