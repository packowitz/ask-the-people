import {Component} from "@angular/core";
import {Splashscreen} from "ionic-native";
import {Storage, SqlStorage, NavController, Platform, AlertController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../services/messages.service";
import {CountryService} from "../../services/country.service";
import {SurveyService} from "../../services/survey.service";
import {AuthService} from "../../services/auth.service";
import {TabsPage} from "../tabs/tabsPage";
import {WelcomePage} from "../welcome/welcome";

declare var FirebasePlugin: any;

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
  registeredNotifications: boolean = false;

  constructor(private nav: NavController,
              private authService: AuthService,
              private surveyService: SurveyService,
              private countryService: CountryService,
              private feedbackService: MessagesService,
              private model: Model,
              private platform: Platform,
              private alertController: AlertController) {
    this.localStorage = new Storage(SqlStorage);
    this.loadDataFromServer();
  }

  ionViewDidEnter() {
    Splashscreen.hide();
  }

  loadDataFromServer() {
    if(!this.loadedCountries) {
      this.loadCountries();
    } else if(!this.loadedUser) {
      this.loadUser();
    } else if(!this.loadedLast3Surveys) {
      this.loadLast3Surveys();
    } else if(!this.loadedUnreadFeedback) {
      this.loadFeedback();
    } else if(!this.loadedAnnouncements) {
      this.loadAnnouncements();
    } else if(!this.registeredNotifications) {
      this.registerNotification();
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
      }
    );
  }

  loadUser() {
    if(this.model.user && this.model.token) {
      this.loadedUser = true;
      this.loadDataFromServer();
    } else {
      this.localStorage.get('token').then(token => {
        if(token) {
          this.resolveUser(token);
        } else {
          this.nav.setRoot(WelcomePage);
        }
      });
    }
  }

  private resolveUser(token: string) {
    this.authService.getUserByToken(token).subscribe(
      data => {
        console.log("Loaded user data");
        this.model.user = data;
        this.loadedUser = true;
        this.loadDataFromServer();
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
      }
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
      }
    );
  }

  private registerNotification() {
    if(FirebasePlugin) {
      try {
        FirebasePlugin.getInstanceId(
          token => {
            let platform = this.platform.is("android") ? "android" : this.platform.is("ios") ? "iOS" : "unknown";
            this.authService.postDeviceBackground(platform, token).subscribe(data => this.model.user = data);
          },
          err => console.log("Error on FirebasePlugin.getInstanceId: " + err)
        );
        FirebasePlugin.onNotificationOpen(
          data => {
            alert("Notification: " + JSON.stringify(data) );
          },
          err => {
            alert('Error registering onNotification callback: ' + err);
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
    this.registeredNotifications = true;
    this.loadDataFromServer();
  }
}