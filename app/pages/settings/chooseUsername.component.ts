import {Component} from "@angular/core";
import {Toast, NavController} from "ionic-angular/index";
import {ControlGroup, AbstractControl, FormBuilder, Validators} from "@angular/common";
import {Model} from "../../components/model.component.ts";
import {AuthService} from "../../services/auth.service.ts";

@Component({
  selector: 'choose-username',
  templateUrl: 'build/pages/settings/chooseUsername.html'
})
export class ChooseUsername {
  newUsernameForm: ControlGroup;
  newUsername: AbstractControl;
  newPassword: AbstractControl;
  newPasswordRepeat: AbstractControl;
  newUsernameExpanded: boolean = true;

  constructor(private model: Model,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private nav: NavController) {
    this.newUsernameForm = formBuilder.group({
      'newUsername': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'newPasswordRepeat': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    }, {validator: this.matchingPasswords('newPassword', 'newPasswordRepeat')});

    this.newUsername = this.newUsernameForm.controls['newUsername'];
    this.newPassword = this.newUsernameForm.controls['newPassword'];
    this.newPasswordRepeat = this.newUsernameForm.controls['newPasswordRepeat'];
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: ControlGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({'notEquivalent': true});
      }
    }
  }

  doSubmit() {
    this.authService.postUsername(this.newUsername.value, this.newPassword.value).subscribe(() => {
      this.nav.present(Toast.create({
        message: 'Username created',
        duration: 2000
      }));
    }, err => console.log(err))
  }
}