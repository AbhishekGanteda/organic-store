import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private api: ApiService) {}

  getAllQuestions(): Observable<Question[]> {
    return this.api
      .get<{ questions?: Question[] } | Question[]>('/questions')
      .pipe(map(response => Array.isArray(response) ? response : response.questions ?? []));
  }

}