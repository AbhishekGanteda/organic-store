import { Component } from '@angular/core';
import { AboutHero } from './components/about-hero/about-hero';
import { CertifiedSection } from './components/certified-section/certified-section';
import { StatsSection } from './components/stats-section/stats-section';

@Component({
  selector: 'app-about',
  imports: [AboutHero, CertifiedSection, StatsSection],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}
