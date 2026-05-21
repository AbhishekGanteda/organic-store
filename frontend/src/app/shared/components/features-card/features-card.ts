import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Feature } from '../../../core/models/feature.model';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-card.html',
  styleUrl: './features-card.css',
})
export class FeatureCard {

  @Input() feature!: Feature;

}