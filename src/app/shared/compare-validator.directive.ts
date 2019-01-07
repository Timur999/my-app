import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from '@angular/forms'
import { Subscription } from 'rxjs'

export function compareValidator(controleNameToCompare: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length == 0) {
      return null; // dont validate empty value
    }
    const controleToCompare = c.root.get(controleNameToCompare);
    if (controleToCompare) {
      const subscription: Subscription = controleToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return controleToCompare && controleToCompare.value !== c.value ? { 'compare': true } : null;
  }
}

@Directive({
  selector: '[compare]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareValidatorDirective, multi: true }]
})
export class CompareValidatorDirective implements Validator{

  @Input('compare') controleNameToCompare: string;
  constructor() { }

  validate(c: AbstractControl): ValidationErrors | null{
    return compareValidator(this.controleNameToCompare);
  }

}
