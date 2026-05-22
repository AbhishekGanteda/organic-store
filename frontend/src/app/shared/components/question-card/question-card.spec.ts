import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCard } from './question-card';

describe('QuestionCard', () => {
  let component: QuestionCard;
  let fixture: ComponentFixture<QuestionCard>;

  const question = {
    id: 1,
    question: 'Is delivery available?',
    answer: 'Yes, delivery is available.',
    isOpen: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCard);
    component = fixture.componentInstance;
    component.question = question;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
