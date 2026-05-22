import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

beforeEach(() => {
	TestBed.configureTestingModule({
		providers: [provideRouter([])],
	});
});
