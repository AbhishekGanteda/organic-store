import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard {

  @Input() review!: Review;

  getStars(rating: number): string {
    return '★'.repeat(rating);
  }
  
}
