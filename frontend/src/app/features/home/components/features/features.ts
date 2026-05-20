import { Component } from '@angular/core';
import { Feature } from '../../../../core/models/feature.model';
import { FeatureService } from '../../../../core/services/features.service';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {

  features: Feature[] = [];

  constructor(private featureService: FeatureService) {
    this.features = this.featureService.getAllFeatures();
  }


}
