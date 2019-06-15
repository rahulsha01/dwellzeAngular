import { Directive, ElementRef, HostListener } from '@angular/core';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, A, Z, SPACE, BACKSPACE } from '@angular/cdk/keycodes';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[InitCapital]',
})

export class InitCapitalDirective {
    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onkeydown(e: KeyboardEvent) {
         // tslint:disable-next-line
        const keyCode = e.keyCode;

        if (
            keyCode === DOWN_ARROW ||
            keyCode === UP_ARROW ||
            keyCode === LEFT_ARROW ||
            keyCode === RIGHT_ARROW ||
            keyCode === SPACE ||
            keyCode === TAB ||
            keyCode === ESCAPE ||
            keyCode === ENTER ||
            keyCode === BACKSPACE ||
            (keyCode >= A && keyCode <= Z)
        ) { } else {
            e.preventDefault();
        }
    }

    @HostListener('keyup') onKeyUp() {

        this.el.nativeElement.value = this.el.nativeElement.value.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });

    }


}
