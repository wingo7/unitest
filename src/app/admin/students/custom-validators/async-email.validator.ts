import {AbstractControl} from '@angular/forms';
import {StudentsService} from '../students.service';

export class ValidateEmailNotTaken {
  static createValidator(service: StudentsService, updating: boolean) {
    let counter = 0;
    return (control: AbstractControl) => {
      if (updating && counter < 1) {
        counter++;
        return service.checkEmailAddress(control.value).map(() => {
          return null;
        });
      }
      return service.checkEmailAddress(control.value).map(res => {
        return res ? null : { emailTaken: true };
      });
    };
  }
}
