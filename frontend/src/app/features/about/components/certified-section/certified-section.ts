import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certified-section',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './certified-section.html',
  styleUrl: './certified-section.css',
})
export class CertifiedSection implements OnInit, AfterViewInit {
  images: string[] = [
    'https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/elementor/thumbs/image-02-ok9thlk7f88j35jeicf161gqa3zxv2i1l1ldi2gemg.jpg',
    'https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/elementor/thumbs/farming03-free-img-o9vzqvrix9ebgtwlxr5iwk27s1xblzkum1b4ivvlzc.jpg',
    'https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/elementor/thumbs/farming04-free-img-o9xdxvnzch1gu353cc71s2fv9hgs2o8e1ubsjmmia0.jpg',
    'https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/elementor/thumbs/image-01-ok9t8tqfmw86q6a5qjwdw95uon8m0ro8dme893gop4.jpg',
  ];

  get sliderImages(): string[] {
    return [
      this.images[this.images.length - 1],
      ...this.images,
      this.images[0]
    ];
  }

  currentImage = signal(1); // Start at 1 (first real image)
  disableTransition = signal(false);

  intervalId: any;

  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    // Optionally, you can add more logic here if needed
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentImage.update(value => value + 1);
    }, 3000);
  }

  onTransitionEnd() {
    // If at the fake last image, jump to real first image
    if (this.currentImage() === this.sliderImages.length - 1) {
      this.disableTransition.set(true);
      this.currentImage.set(1);
      setTimeout(() => this.disableTransition.set(false), 20);
    }
    // If at the fake first image, jump to real last image
    if (this.currentImage() === 0) {
      this.disableTransition.set(true);
      this.currentImage.set(this.images.length);
      setTimeout(() => this.disableTransition.set(false), 20);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}