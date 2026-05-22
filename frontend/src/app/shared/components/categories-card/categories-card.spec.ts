import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCard } from './categories-card';

describe('CategoriesCard', () => {
  let component: CategoriesCard;
  let fixture: ComponentFixture<CategoriesCard>;

  const category = {
    id: 1,
    name: 'Fruits',
    image: 'fruits.png',
    description: 'Fresh produce',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesCard);
    component = fixture.componentInstance;
    component.category = category;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
