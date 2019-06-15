import {
    Directive,
    HostListener,
    ElementRef
} from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import {
    LEFT_ARROW,
    ENTER,
    TAB,
    RIGHT_ARROW,
    BACKSPACE,
    A

} from '@angular/cdk/keycodes';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[MobileNumber]',
    providers: [{ provide: NG_VALIDATORS, useExisting: MobileNumberDirective, multi: true }]

})
export class MobileNumberDirective implements Validator {
    constructor(private el: ElementRef) { }

    validate(c: AbstractControl): ValidationErrors | null {
        if (c.value) {
            return (c.value.toString().length < 3 ||
                (c.value.toString().length > 3 && c.value.toString().length < 10)
                // (c.value.toString().length < 12)
            ) ? { 'min length': true } : null;
        }
        return null;
    }

    @HostListener('keydown', ['$event'])
    oninput($event: KeyboardEvent) {
        // tslint:disable-next-line
        const keyCode = $event.keyCode;
        const concated = this.el.nativeElement.value.concat($event.key);

        if (keyCode === ENTER || keyCode === TAB || keyCode === BACKSPACE ||
            keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW || (keyCode === A && $event.ctrlKey)) {

        } else if (isNaN(concated) ||
            concated.length > 11 ||
            keyCode === 190
        ) {
            $event.preventDefault();
        }

    }


}
