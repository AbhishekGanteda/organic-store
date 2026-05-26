import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Juice } from './juice';
import { ProductService } from '../../core/services/product.service';

describe('Juice', () => {
  let component: Juice;
  let fixture: ComponentFixture<Juice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juice],
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

    fixture = TestBed.createComponent(Juice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
