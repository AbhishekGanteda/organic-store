import { Injectable } from '@angular/core';

import reviewsData from '../data/reviews.json';

import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviews: Review[] = reviewsData;

  getAllReviews(): Review[] {
    return this.reviews;
  }

}