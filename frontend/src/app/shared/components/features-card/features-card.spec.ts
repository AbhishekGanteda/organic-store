import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCard } from './features-card';

describe('FeatureCard', () => {
  let component: FeatureCard;
  let fixture: ComponentFixture<FeatureCard>;

  const feature = {
    id: 1,
    name: 'Free Delivery',
    icon: 'truck',
    description: 'Fast and free delivery',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureCard);
    component = fixture.componentInstance;
    component.feature = feature;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
