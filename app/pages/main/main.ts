import {NavController, Alert, Tabs} from "ionic-angular";
import {Model} from "../../components/model.component";
import {SurveyPage} from "../survey/survey";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../components/survey.component";
import {SettingsPage} from "../settings/settings";
import {HighscorePage} from "../highscore/highscore";
import {FeedbackPage} from "../feedback/feedback";
import {MySurveysPage} from "../mySurveys/mySurveys";
import {Component} from "@angular/core";
import {SurveyListComponent} from "../../components/surveyList.component";

@Component({
  templateUrl: 'build/pages/main/main.html',
  directives: [SurveyListComponent]
})
export class MainPage {
  last3surveys: Survey[];

  constructor(private model: Model,
              private nav: NavController,
              private surveyService: SurveyService,
              private tabs: Tabs) {
  }

  ionViewDidEnter() {
    this.reloadLast3Surveys();
  }

  reloadLast3Surveys () {
    this.surveyService.getLast3Surveys().subscribe(data => {
      this.last3surveys = data;
    }, err => console.log(err));
  }

  showAnonymousAlert() {
    this.nav.present(Alert.create({
      title: 'Select a username',
      message: 'Go to settings and choose a username to use your ATP account on multiple devices or to be able to restore your account.',
      buttons: [
        {text: 'Settings', handler: () => {this.openSettingsPage();}},
        {text: 'Later'}
      ]
    }));
  }

  openSettingsPage() {
    this.nav.push(SettingsPage);
  }

  openPurchasePage() {
    this.tabs.select(Model.PurchaseTab);
  }

  openHighscorePage() {
    this.nav.push(HighscorePage);
  }

  openFeedbackPage() {
    this.tabs.select(Model.FeedbackTab);
  }

  openMySurveysPage() {
    this.tabs.select(Model.MySurveysTab);
  }

  openSurveyPage() {
    this.nav.push(SurveyPage);
  }

  openStartSurveyPage() {
    this.tabs.select(Model.StartSurveyTab);
  }
}