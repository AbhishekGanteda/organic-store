import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  faqItems = [

    {
      question: 'Pulvinar nostrud class cum facilis?',
      answer:
        'I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut elit tellus luctus nec ullamcorper mattis pulvinar leo.',
      isOpen: true,
    },

    {
      question: 'Pon excepturi numquam, facilis?',
      answer:
        'Lorem ipsum dolor sit amet adipisicing elit. Ut elit tellus luctus nec mattis pulvinar dapibus leo.',
      isOpen: false,
    },

    {
      question: 'Consequat nesciunt fusce facilisi?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut luctus nec ullamcorper mattis pulvinar dapibus leo.',
      isOpen: false,
    },

    {
      question: 'Ultricies mattis hac?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      isOpen: false,
    },

    {
      question: 'Fermentum volutpat?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      isOpen: false,
    },

    {
      question: 'Dignissim aliqua?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      isOpen: false,
    },

  ];

  toggleFaq(index: number) {

    this.faqItems[index].isOpen =
      !this.faqItems[index].isOpen;

  }

}