import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class FocusService {

  constructor() { }

  focus(element: HTMLElement) {
    element.focus();
  }
}
