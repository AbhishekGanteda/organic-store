import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngIf="loading.users" role="status" aria-live="polite">Loading users…</div>
      <div *ngIf="!loading.users && users.length === 0">No users found.</div>

      <div *ngIf="view === 'products'">
        <input id="product-name" aria-label="Product name" [(ngModel)]="newProduct.name" />
        <select id="product-category" aria-label="Category"></select>
      </div>
    </div>
  `,
})
class TestHostComponent {
  loading = { users: false };
  users: any[] = [];
  view = 'summary';
  newProduct = { name: '' };
}

describe('Admin accessibility rendering (host)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows loading indicator then empty state for users', async () => {
    component.loading.users = true;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('div[role="status"]')?.textContent).toContain('Loading users');

    component.loading.users = false;
    component.users = [];
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el.textContent).toContain('No users found.');
    expect(el.querySelector('div[role="status"]')).toBeNull();
  });

  it('renders aria-labels for product create form inputs', async () => {
    component.view = 'products';
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const name = el.querySelector('#product-name') as HTMLInputElement | null;
    const category = el.querySelector('#product-category') as HTMLSelectElement | null;

    expect(name).toBeTruthy();
    expect(name?.getAttribute('aria-label')).toBe('Product name');
    expect(category).toBeTruthy();
    expect(category?.getAttribute('aria-label')).toBe('Category');
  });
});
