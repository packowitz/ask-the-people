import {Component} from "@angular/core";
import {NavController, Storage, SqlStorage} from "ionic-angular";
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
  deviceHeight: number = 100;

  constructor(private nav: NavController,
              private model: Model,
              private authService: AuthService) {
    this.deviceHeight = window.innerHeight;
  }

  toggleShowLogin() {
    console.log(this.username + " - " + this.password);
    this.showLogin = !this.showLogin;
  }

  register() {
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.token = data.token;
        this.model.user = data.user;
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token).then(() => this.nav.setRoot(LoadingPage));
      }
    );
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(data => {
      this.model.token = data.token;
      this.model.user = data.user;
      let storage = new Storage(SqlStorage);
      storage.set('token', data.token).then(() => this.nav.setRoot(LoadingPage));
    });
  }

}