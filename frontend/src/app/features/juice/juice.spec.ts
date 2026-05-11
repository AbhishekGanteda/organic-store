import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Juice } from './juice';

describe('Juice', () => {
  let component: Juice;
  let fixture: ComponentFixture<Juice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Juice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
