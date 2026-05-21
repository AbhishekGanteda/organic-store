import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../core/models/question.model';
import { QuestionService } from '../../core/services/questions.service';
import { QuestionCard } from '../../shared/components/question-card/question-card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, QuestionCard],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  questions: Question[] = [];

  constructor(private questionService: QuestionService) {
    this.questions = this.questionService.getAllQuestions();
  }

}