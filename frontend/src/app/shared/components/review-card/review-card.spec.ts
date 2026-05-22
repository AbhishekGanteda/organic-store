import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCard } from './review-card';

describe('ReviewCard', () => {
  let component: ReviewCard;
  let fixture: ComponentFixture<ReviewCard>;

  const review = {
    id: 1,
    name: 'Asha',
    image: 'reviewer.png',
    review: 'Great quality products.',
    rating: 5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCard);
    component = fixture.componentInstance;
    component.review = review;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
