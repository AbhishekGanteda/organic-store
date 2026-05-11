import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Everything } from './everything';

describe('Everything', () => {
  let component: Everything;
  let fixture: ComponentFixture<Everything>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Everything]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Everything);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
