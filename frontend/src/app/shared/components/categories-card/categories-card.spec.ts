import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCard } from './categories-card';

describe('CategoriesCard', () => {
  let component: CategoriesCard;
  let fixture: ComponentFixture<CategoriesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
