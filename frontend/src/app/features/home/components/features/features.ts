import { Component } from '@angular/core';
import { Feature } from '../../../../core/models/feature.model';
import { FeatureService } from '../../../../core/services/features.service';
import { FeatureCard } from '../../../../shared/components/features-card/features-card';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [FeatureCard],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {

  features: Feature[] = [];

  constructor(private featureService: FeatureService) {
    this.features = this.featureService.getAllFeatures();
  }


}
