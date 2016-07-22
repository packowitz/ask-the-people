import {ionicBootstrap, Platform, Storage, SqlStorage, Alert, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login'
import 'rxjs/add/operator/map'
import {AuthService} from "./services/auth.service";
import {CountryService} from "./services/country.service";
import {LoadingPage} from "./pages/loading/loading";
import {Model} from "./components/model.component.ts";
import {SurveyService} from "./services/survey.service";
import {ViewChild, Component} from "@angular/core";
import {TabsPage} from "./pages/tabs/tabsPage";
import {HighscoreService} from "./services/highscore.service";
import {MessagesService} from "./services/messages.service";

@Component({
  templateUrl: 'build/app.html'
})
class AtpApp {
  rootPage: any = LoadingPage;
  @ViewChild(Nav) nav: Nav;
  localStorage: Storage;
  loadedCountries: boolean = false;
  loadedUser: boolean = false;
  loadedUnreadFeedback: boolean = false;

  constructor(private platform: Platform,
              private authService: AuthService,
              private countryService: CountryService,
              private feedbackService: MessagesService,
              private model: Model) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.localStorage = new Storage(SqlStorage);
      this.loadDataFromServer();
    });
  }

  showNetworkError() {
    this.nav.present(Alert.create({
      title: 'Connection lost',
      message: 'The ATP-Servers are not reachable. Please check your internet connection.',
      buttons: [{
        text: 'Retry',
        handler: () => {
          this.loadDataFromServer();
        }
      }]
    }));
  }

  loadDataFromServer() {
    if(!this.loadedCountries) {
      this.loadCountries();
    } else if((!this.loadedUser)) {
      this.loadUser();
    } else if((!this.loadedUnreadFeedback)) {
      this.loadFeedback();
    } else {
      this.nav.setRoot(TabsPage);
    }
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        console.log("loaded " + countries.length + " countries");
        this.loadedCountries = true;
        this.loadDataFromServer();
      },
      error => this.showNetworkError());
  }

  loadUser() {
    this.localStorage.get('token').then(token => {
      if(token) {
        this.resolveUser(token);
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
  }

  private resolveUser(token: string) {
    this.authService.getUserByToken(token).subscribe(
      data => {
        console.log("Loaded user data");
        this.model.user = data;
        this.model.token = token;
        this.loadedUser = true;
        this.loadDataFromServer();
      },
      error => {
        if(error.status == 401) {
          let confirm = Alert.create({
            title: 'Authentication Error',
            message: 'Your account does not exist! Go to the Login Page to login or create a new account.',
            buttons: [{
              text: 'Login Page',
              handler: () => {
                this.localStorage.remove('token');
                this.nav.setRoot(LoginPage);
              }
            }, {
              text: 'Retry',
              handler: () => {
                this.resolveUser(token);
              }
            }]
          });
          this.nav.present(confirm);
        } else {
          this.showNetworkError();
        }
      }
    );
  }

  private loadFeedback() {
    this.feedbackService.loadFeedback().subscribe(
      data => {
        this.model.feedback = data;
        this.model.recalcUnreadMessages();
        console.log("Loaded " + this.model.feedback.length + " feedback");
        this.loadedUnreadFeedback = true;
        this.loadDataFromServer();
      },
      error => this.showNetworkError()
    );
  }
}

ionicBootstrap(AtpApp, [AuthService, CountryService, MessagesService, HighscoreService, SurveyService, Model], {
  tabbarHighlight: true,
  tabbarPlacement: 'bottom',
  platforms: {
    ios: {
      statusbarPadding: true
    }
  }
});