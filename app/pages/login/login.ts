import {Page, NavController, Storage, SqlStorage, Alert, Toast, Loading} from 'ionic-angular';
import {CountryService} from "../../services/country.service";
import {Country} from "../../components/country.component";
import {User} from "../../components/user.component";
import {AuthService} from "../../services/auth.service";
import {MainPage} from "../main/main";
import {Model} from "../../components/model.component";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "angular2/common";

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  countries: Country[];
  user: User = new User();
  registerForm: ControlGroup;
  yearOfBirth: AbstractControl;
  country: AbstractControl;
  loginForm: ControlGroup;
  username: AbstractControl;
  password: AbstractControl;
  showLoginForm: boolean = false;
  
  constructor(private nav: NavController,
              private countryService: CountryService,
              private authService: AuthService,
              private model: Model,
              private formBuilder: FormBuilder) {
    this.loadCountries();
    this.user.male = true;

    this.registerForm = formBuilder.group({
      'yearOfBirth': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country': ['', Validators.required]
    });
    this.yearOfBirth = this.registerForm.controls['yearOfBirth'];
    this.country = this.registerForm.controls['country'];

    this.loginForm = formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, err => {
      this.nav.present(Alert.create({
        title: 'Network Error',
        message: 'There was a network error!',
        buttons: [{
          text: 'Retry',
          handler: () => {
            this.loadCountries();
          }
        }]
      }));
    });
  }

  register() {
    let loading = Loading.create({
      content: 'Register',
      spinner: 'dots'
    });
    this.user.yearOfBirth = this.yearOfBirth.value;
    this.user.country = this.country.value;
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