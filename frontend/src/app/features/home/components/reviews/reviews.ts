import { Component } from '@angular/core';
import { Review } from '../../../../core/models/review.model';
import { ReviewService } from '../../../../core/services/reviews.service';
import { ReviewCard } from '../../../../shared/components/review-card/review-card';

@Component({
  selector: 'app-reviews',
  imports: [ReviewCard],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {

  reviews : Review[] = [];

  constructor(private reviewService : ReviewService) {
    this.reviews = this.reviewService.getAllReviews();
  }
}
