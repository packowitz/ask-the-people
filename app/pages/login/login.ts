import {NavController, Storage, SqlStorage, PopoverController, LoadingController, ToastController} from 'ionic-angular';
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
  year: string = '2016';
  showLoginForm: boolean = false;

  constructor(private nav: NavController,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private popoverController: PopoverController,
              private loadingController: LoadingController,
              private toastController: ToastController) {
    this.user.male = false;

    this.loginForm = formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
  }

  // Helper method for translating date string into the integer we need
  saveYear() {
    this.user.yearOfBirth = +this.year;
  }

  chooseCountry() {
    let countrySelection = this.popoverController.create(CountrySelection, {callback: country => {
      this.user.country = country.alpha3;
      this.countryName = country.nameEng;
      countrySelection.dismiss();
    }});
    countrySelection.present();
  }

  registerFormInvalid(): boolean {
    if(!this.user.yearOfBirth || this.user.yearOfBirth < 1900 || this.user.yearOfBirth > 2050) {
      return true;
    }

    return !this.user.country;
  }

  register() {
    let loading = this.loadingController.create({
      content: 'Registering',
      spinner: 'dots'
    });
    loading.present();
    this.authService.register(this.user).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
      } else {
        loading.dismiss().then(() => {
          this.toastController.create({
            message: "Registration not successful",
            duration: 2000
          }).present();
        });
      }
    }, error => {
      loading.dismiss().then(() => {
        this.toastController.create({
          message: "Registration not successful",
          duration: 2000
        }).present();
      });
    });
  }
  
  login() {
    let loading = this.loadingController.create({
      content: 'Logging in',
      spinner: 'dots'
    });
    loading.present();
    this.authService.login(this.username.value, this.password.value).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
      } else {
        loading.dismiss().then(() => {
          this.toastController.create({
            message: "Login not successful",
            duration: 2000
          }).present();
        });
      }
    }, error => {
      loading.dismiss().then(() => {
        this.toastController.create({
          message: "Login not successful",
          duration: 2000
        }).present();
      });
    });
  }
}