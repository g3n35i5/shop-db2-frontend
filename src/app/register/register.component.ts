import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from './password-validation';
import {Router} from '@angular/router';
import {SnackbarService} from '../services/snackbar/snackbar.service';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  public disableInput: boolean;

  /*
   * Parameters for the form.
   */
  hidePassword = true;
  minFirstnameLength = 2;
  maxFirstnameLength = 32;
  minLastnameLength = 2;
  maxLastnameLength = 32;
  minPasswordLength = 6;
  maxPasswordLength = 64;
  passwordInfo = 'The password is optional. To be able to log in to your ' +
    'personal area or to become an administrator, a password must be set.';

  constructor(
    fb: FormBuilder,
    private snackbar: SnackbarService,
    private dataService: DataService,
    private router: Router
  ) {
    this.registerForm = fb.group({
      firstname: new FormControl('', Validators.compose(
        [
          Validators.minLength(this.minFirstnameLength),
          Validators.maxLength(this.maxFirstnameLength)
        ])),
      lastname: new FormControl('', Validators.compose(
        [
          Validators.minLength(this.minLastnameLength),
          Validators.maxLength(this.maxLastnameLength),
          Validators.required
        ]
      )),
      password: new FormControl('', Validators.compose(
        [
          Validators.minLength(this.minPasswordLength),
          Validators.maxLength(this.maxPasswordLength)
        ]
      )),
      password_repeat: new FormControl('', Validators.compose(
        [
          Validators.minLength(this.minPasswordLength),
          Validators.maxLength(this.maxPasswordLength)
        ]
      ))
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnInit() {
    this.disableInput = false;
  }

  /*
   * Return to the home page.
   */
  close(): void {
    this.router.navigate(['/']);
  }

  /**
   * Submit the registration.
   */
  submit(): void {
    if (this.registerForm.invalid) {
      this.snackbar.openSnackBar('Form is invalid');
      return;
    }
    this.disableInput = true;
    const data = {};
    for (const key in this.registerForm.value) {
      if (this.registerForm.value.hasOwnProperty(key)) {
        if (this.registerForm.value[key] !== '') {
          data[key] = this.registerForm.value[key];
        }
      }
    }
    this.dataService.createUser(data).subscribe(() => {
      this.snackbar.openSnackBar('The registration was successful. ' +
        'Please wait until your account has been activated by an w' +
        'administrator.');
      this.close();
    }, () => {
      this.disableInput = false;
    });
  }

  /**
   * Checks, whether a field has an error.
   * @param field is the name of the form field.
   */
  hasError(field: string): boolean {
    const control = this.registerForm.controls[field];
    if (control === null) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * This method returns an error message for the different fields depending
   * on the error case.
   * @param field is the name of the form field.
   */
  getErrorMessage(field: string): string {
    const control = this.registerForm.controls[field];

    if (control.errors.required) {
      return 'This field is required';
    } else if (control.errors.minlength) {
      return 'Minimum of ' + control.errors.minlength.requiredLength + ' characters';
    } else if (control.errors.maxlength) {
      return 'Maximum of ' + control.errors.maxlength.requiredLength + ' characters';
    } else if (control.errors.MatchPassword) {
      return 'The passwords do not match';
    } else {
      return 'Unknown error';
    }
  }
}
