import { Injectable } from '@angular/core';

import featuresData from '../data/features.json';

import { Feature } from '../models/feature.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  features: Feature[] = featuresData;

  getAllFeatures(): Feature[] {
    return this.features;
  }

}