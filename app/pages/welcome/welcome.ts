import {Component} from "@angular/core";
import {NavController, LoadingController, ToastController, Storage, SqlStorage} from "ionic-angular";
import {LoginPage} from "../login/login";
import {Model} from "../../components/model.component";
import {AuthService} from "../../services/auth.service";
import {LoadingPage} from "../loading/loading";

@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage {

  constructor(private nav: NavController,
              private model: Model,
              private authService: AuthService,
              private loadingController: LoadingController,
              private toastController: ToastController) {}

  gotoLogin() {
    this.nav.setRoot(LoginPage);
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

}