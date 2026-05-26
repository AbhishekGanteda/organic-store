import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Everything } from './everything';
import { ProductService } from '../../core/services/product.service';

describe('Everything', () => {
  let component: Everything;
  let fixture: ComponentFixture<Everything>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Everything],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn().mockReturnValue(of([])),
            getSaleProducts: jest.fn().mockReturnValue(of([]))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Everything);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
