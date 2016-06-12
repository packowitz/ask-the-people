import {NavController, Storage, SqlStorage, Alert, Toast, Loading, Popover} from 'ionic-angular';
import {CountryService} from "../../services/country.service";
import {Country} from "../../components/country.component";
import {User} from "../../components/user.component";
import {AuthService} from "../../services/auth.service";
import {MainPage} from "../main/main";
import {Model} from "../../components/model.component";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import {Component} from "@angular/core";
import {CountrySelection} from "../../components/countrySelection.component";

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
              private model: Model,
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
      content: 'Register',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.authService.register(this.user).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token);
        this.authService.getUserByToken(data.token).subscribe(user => {
          this.model.user = user;
          this.model.token = data.token;
          loading.dismiss();
          this.nav.setRoot(MainPage);
        }, error => {
          storage.remove('token');
          loading.dismiss().then(() => {
            this.nav.present(Toast.create({
              message: "Registration not successful",
              duration: 2000
            }));
          });
        });
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
        storage.set('token', data.token);
        this.authService.getUserByToken(data.token).subscribe(user => {
          this.model.user = user;
          this.model.token = data.token;
          loading.dismiss();
          this.nav.setRoot(MainPage);
        }, error => {
          storage.remove('token');
          loading.dismiss().then(() => {
            this.nav.present(Toast.create({
              message: "Login not successful",
              duration: 2000
            }));
          });
        });
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