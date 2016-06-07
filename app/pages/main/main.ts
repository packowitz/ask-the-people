import {NavController, Alert} from "ionic-angular";
import {Model} from "../../components/model.component";
import {SurveyPage} from "../survey/survey";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../components/survey.component";
import {SettingsPage} from "../settings/settings";
import {PurchasePage} from "../purchase/purchase";
import {HighscorePage} from "../highscore/highscore";
import {FeedbackPage} from "../feedback/feedback";
import {MySurveysPage} from "../mySurveys/mySurveys";
import {Component} from "@angular/core";

@Component({
    templateUrl: 'build/pages/main/main.html'
})
export class MainPage {
  last3surveys: Survey[];

  constructor(private model: Model,
              private nav: NavController,
              private surveyService: SurveyService) {
    surveyService.getLast3Surveys().subscribe(data => {
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
    this.nav.push(PurchasePage);
  }

  openHighscorePage() {
    this.nav.push(HighscorePage);
  }

  openFeedbackPage() {
    this.nav.push(FeedbackPage);
  }

  openMySurveysPage() {
    this.nav.push(MySurveysPage);
  }

  openSurveyPage() {
    this.nav.push(SurveyPage);
  }

  openStartSurveyPage() {
    this.nav.push(StartSurveyPage);
  }
}