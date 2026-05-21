import { Component, Input } from '@angular/core';
import { Question } from '../../../core/models/question.model';

@Component({
  selector: 'app-question-card',
  imports: [],
  templateUrl: './question-card.html',
  styleUrl: './question-card.css',
})
export class QuestionCard {
  @Input() question!: Question;

  toggleFaq(q: Question) {
    q.isOpen = !q.isOpen;
  }

}
