import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Feature } from '../models/feature.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private api: ApiService) {}

  getAllFeatures(): Observable<Feature[]> {
    return this.api
      .get<{ features?: Feature[] } | Feature[]>('/features')
      .pipe(map(response => Array.isArray(response) ? response : response.features ?? []));
  }

}