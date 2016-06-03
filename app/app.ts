import {App, IonicApp, Platform, Storage, SqlStorage, NavController, Alert} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login'
import 'rxjs/add/operator/map'
import {AuthService} from "./services/auth.service";
import {CountryService} from "./services/country.service";
import {LoadingPage} from "./pages/loading/loading";
import {Model} from "./components/model.component.ts";
import {MainPage} from "./pages/main/main";
import {SurveyService} from "./services/survey.service";
import {SurveyListComponent} from "./components/surveyList.component";

@App({
  templateUrl: 'build/app.html',
  providers: [AuthService, CountryService, SurveyService, Model],
  directives: [SurveyListComponent],
  config: {}
})
class AtpApp {
  rootPage: any = LoadingPage;
  nav: NavController;
  localStorage: Storage;

  constructor(private app: IonicApp,
              private platform: Platform,
              private authService: AuthService,
              private model: Model) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.nav = this.app.getComponent('nav');
      this.localStorage = new Storage(SqlStorage);
      this.localStorage.get('token').then(token => {
        if(token) {
          this.resolveUser(token);
        } else {
          this.nav.setRoot(LoginPage);
        }
      }).catch(err => console.log(err));
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