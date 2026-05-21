import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private api: ApiService) {}

  getAllReviews(): Observable<Review[]> {
    return this.api
      .get<{ reviews?: Review[] } | Review[]>('/reviews')
      .pipe(map(response => Array.isArray(response) ? response : response.reviews ?? []));
  }

}