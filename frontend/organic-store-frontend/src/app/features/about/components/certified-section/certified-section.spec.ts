import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedSection } from './certified-section';

describe('CertifiedSection', () => {
  let component: CertifiedSection;
  let fixture: ComponentFixture<CertifiedSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertifiedSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertifiedSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
