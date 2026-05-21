import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesCard } from './features-card';

describe('FeaturesCard', () => {
  let component: FeaturesCard;
  let fixture: ComponentFixture<FeaturesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
