import { Injectable } from '@angular/core';

import questionsData from '../data/questions.json';

import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  questions: Question[] = questionsData;

  getAllQuestions(): Question[] {
    return this.questions;
  }

}