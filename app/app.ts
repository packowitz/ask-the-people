import {ionicBootstrap, Platform, Storage, SqlStorage, Alert, Nav, Tabs} from 'ionic-angular';
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
import {SettingsPage} from "./pages/settings/settings";
import {PurchasePage} from "./pages/purchase/purchase";
import {HighscorePage} from "./pages/highscore/highscore";
import {MySurveysPage} from "./pages/mySurveys/mySurveys";
import {StartSurveyPage} from "./pages/startSurvey/startSurvey";

@Component({
  templateUrl: 'build/app.html'
})
class AtpApp {
  rootPage: any = LoadingPage;
  @ViewChild(Nav) nav: Nav;
  localStorage: Storage;
  showApp: boolean = false;
  purchasePage: PurchasePage;
  highscorePage: HighscorePage;
  mainPage: MainPage;
  mySurveysPage: MySurveysPage;
  startSurveyPage: StartSurveyPage;

  constructor(private platform: Platform,
              private authService: AuthService,
              private countryService: CountryService,
              private model: Model) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.loadCountries();
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

  private doShowApp() {
    this.purchasePage = PurchasePage;
    this.highscorePage = HighscorePage;
    this.mainPage = MainPage;
    this.mySurveysPage = MySurveysPage;
    this.startSurveyPage = StartSurveyPage;
    this.showApp = true;
  }

  private resolveUser(token: string) {
    this.authService.getUserByToken(token).subscribe(data => {
      this.model.user = data;
      this.model.token = token;
      this.doShowApp();
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

  loadCountries() {
    this.countryService.getCountries().subscribe(data => {
      console.log("countries loaded");
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
}

ionicBootstrap(AtpApp, [AuthService, CountryService, SurveyService, Model], {
  tabbarHighlight: true,
  tabbarPlacement: 'bottom',
  platforms: {
    ios: {
      statusbarPadding: true
    }
  }
});