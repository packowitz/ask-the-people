import {ionicBootstrap, Platform, Storage, SqlStorage, Alert, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login'
import 'rxjs/add/operator/map'
import {AuthService} from "./services/auth.service";
import {CountryService} from "./services/country.service";
import {LoadingPage} from "./pages/loading/loading";
import {Model} from "./components/model.component.ts";
import {MainPage} from "./pages/main/main";
import {SurveyService} from "./services/survey.service";
import {ViewChild, Component} from "@angular/core";

@Component({
  templateUrl: 'build/app.html'
})
class AtpApp {
  rootPage: any = LoadingPage;
  @ViewChild(Nav) nav: Nav;
  localStorage: Storage;

  constructor(private platform: Platform,
              private authService: AuthService,
              private model: Model) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.localStorage = new Storage(SqlStorage);
      this.localStorage.get('token').then(token => {
        if(token) {
          this.resolveUser(token);
        } else {
          this.nav.setRoot(LoginPage);
        }
      });
    });
  }

  private resolveUser(token: string) {
    this.authService.getUserByToken(token).subscribe(data => {
      this.model.user = data;
      this.model.token = token;
      this.nav.setRoot(MainPage);
    }, error => {
      let confirm = Alert.create({
        title: 'Authentication Error',
        message: 'Do you want to keep or reset your account and try again later?',
        buttons: [{
          text: 'Reset',
          handler: () => {
            this.localStorage.remove('token');
            this.nav.setRoot(LoginPage);
          }
        }, {
          text: 'Retry',
          handler: () => {
            this.resolveUser(token);
          }
        }
        ]
      });
      this.nav.present(confirm);
    });
  }
}

ionicBootstrap(AtpApp, [AuthService, CountryService, SurveyService, Model], {

});