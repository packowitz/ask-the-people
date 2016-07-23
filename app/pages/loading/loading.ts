import {Component} from "@angular/core";
import {Splashscreen} from "ionic-native/dist/index";
import {Storage, SqlStorage, Alert, NavController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../services/messages.service";
import {CountryService} from "../../services/country.service";
import {SurveyService} from "../../services/survey.service";
import {AuthService} from "../../services/auth.service";
import {TabsPage} from "../tabs/tabsPage";
import {LoginPage} from "../login/login";

@Component({
  templateUrl: 'build/pages/loading/loading.html'
})
export class LoadingPage {
  localStorage: Storage;
  loadedCountries: boolean = false;
  loadedUser: boolean = false;
  loadedLast3Surveys: boolean = false;
  loadedUnreadFeedback: boolean = false;
  loadedAnnouncements: boolean = false;

  constructor(private nav: NavController,
              private authService: AuthService,
              private surveyService: SurveyService,
              private countryService: CountryService,
              private feedbackService: MessagesService,
              private model: Model) {
    this.localStorage = new Storage(SqlStorage);
    this.loadDataFromServer();
  }

  ionViewDidEnter() {
    Splashscreen.hide();
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
    } else if((!this.loadedLast3Surveys)) {
      this.loadLast3Surveys();
    } else if((!this.loadedUnreadFeedback)) {
      this.loadFeedback();
    } else if((!this.loadedAnnouncements)) {
      this.loadAnnouncements();
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

  private loadLast3Surveys() {
    this.surveyService.getLast3Surveys().subscribe(
      data => {
        this.model.last3surveys = data;
        console.log("Loaded " + this.model.last3surveys.length + " last surveys");
        this.loadedLast3Surveys = true;
        this.loadDataFromServer();
      },
      error => this.showNetworkError()
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

  private loadAnnouncements() {
    this.feedbackService.loadAnnouncements().subscribe(
      data => {
        this.model.announcements = data;
        this.model.recalcUnreadMessages();
        console.log("Loaded " + this.model.announcements.length + " announcements");
        this.loadedAnnouncements = true;
        this.loadDataFromServer();
      },
      error => this.showNetworkError()
    );
  }
}