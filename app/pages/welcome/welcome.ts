import {Component} from "@angular/core";
import {NavController, LoadingController, ToastController, Storage, SqlStorage} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../services/auth.service";
import {LoadingPage} from "../loading/loading";

@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage {
  showLogin: boolean = false;
  username: string;
  password: string;

  constructor(private nav: NavController,
              private model: Model,
              private authService: AuthService,
              private loadingController: LoadingController,
              private toastController: ToastController) {
  }

  toggleShowLogin() {
    console.log(this.username + " - " + this.password);
    this.showLogin = !this.showLogin;
  }

  register() {
    let loading = this.loadingController.create({
      content: 'Registering',
      spinner: 'dots'
    });
    loading.present();
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.token = data.token;
        this.model.user = data.user;
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
      },
      error => {
        loading.dismiss().then(
          () => {
            this.toastController.create({
              message: "Something went wrong. Try again.",
              duration: 2000
            }).present();
          }
        );
      }
    );
  }

  login() {
    let loading = this.loadingController.create({
      content: 'Logging in',
      spinner: 'dots'
    });
    loading.present();
    this.authService.login(this.username, this.password).subscribe(data => {
      this.model.token = data.token;
      this.model.user = data.user;
      let storage = new Storage(SqlStorage);
      storage.set('token', data.token).then(() => loading.dismiss().then(() => this.nav.setRoot(LoadingPage)));
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