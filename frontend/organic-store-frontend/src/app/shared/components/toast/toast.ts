import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class Toast {

  @Input() message: string = '';

  @Input() type: 'success' | 'error' | 'warning' =
    'success';

}