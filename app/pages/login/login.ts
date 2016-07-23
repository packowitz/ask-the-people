import {NavController, Storage, SqlStorage, Toast, Loading, Popover, NavParams} from 'ionic-angular';
import {User} from "../../components/domain/user.component";
import {AuthService} from "../../services/auth.service";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import {Component} from "@angular/core";
import {CountrySelection} from "../../components/countrySelection.component";
import {LoadingPage} from "../loading/loading";

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  user: User = new User();
  countryName: string;
  loginForm: ControlGroup;
  username: AbstractControl;
  password: AbstractControl;
  showLoginForm: boolean = false;

  constructor(private nav: NavController,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.user.male = false;

    this.loginForm = formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
  }

  chooseCountry() {
    let countrySelection = Popover.create(CountrySelection, {callback: country => {
      this.user.country = country.alpha3;
      this.countryName = country.nameEng;
      countrySelection.dismiss();
    }});
    this.nav.present(countrySelection);
  }

  registerFormInvalid(): boolean {
    if(!this.user.yearOfBirth || this.user.yearOfBirth < 1900 || this.user.yearOfBirth > 2050) {
      return true;
    }
    if(!this.user.country) {
      return true;
    }
    return false;
  }

  register() {
    let loading = Loading.create({
      content: 'Registering',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.authService.register(this.user).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
      } else {
        loading.dismiss().then(() => {
          this.nav.present(Toast.create({
            message: "Registration not successful",
            duration: 2000
          }));
        });
      }
    }, error => {
      loading.dismiss().then(() => {
        this.nav.present(Toast.create({
          message: "Registration not successful",
          duration: 2000
        }));
      });
    });
  }
  
  login() {
    let loading = Loading.create({
      content: 'Logging in',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.authService.login(this.username.value, this.password.value).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
      } else {
        loading.dismiss().then(() => {
          this.nav.present(Toast.create({
            message: "Login not successful",
            duration: 2000
          }));
        });
      }
    }, error => {
      loading.dismiss().then(() => {
        this.nav.present(Toast.create({
          message: "Login not successful",
          duration: 2000
        }));
      });
    });
  }
}