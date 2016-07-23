import {NavController, Alert, Tabs} from "ionic-angular";
import {Model} from "../../components/model.component";
import {SurveyPage} from "../survey/survey";
import {SurveyService} from "../../services/survey.service";
import {SettingsPage} from "../settings/settings";
import {HighscorePage} from "../highscore/highscore";
import {Component} from "@angular/core";
import {SurveyListComponent} from "../../components/surveyList.component";

@Component({
  templateUrl: 'build/pages/main/main.html',
  directives: [SurveyListComponent]
})
export class MainPage {

  constructor(private model: Model,
              private nav: NavController,
              private surveyService: SurveyService,
              private tabs: Tabs) {
  }

  ionViewDidEnter() {
    this.updateLast3Surveys();
  }

  updateLast3Surveys () {
    this.model.last3surveys.forEach(survey => {
      if(survey.status != 'FINISHED') {
        this.surveyService.updateSurvey(survey);
      }
    });
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