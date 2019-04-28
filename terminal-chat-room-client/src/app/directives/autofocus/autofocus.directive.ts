import { Directive, AfterViewInit, ElementRef } from '@angular/core'

@Directive({
  selector: '[autoFocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit() {
    this.element.nativeElement.focus()
  }

}
