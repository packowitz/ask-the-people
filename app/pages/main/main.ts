import {Page, NavController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {SurveyPage} from "../survey/survey";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../components/survey.component";

@Page({
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
    
  }

  openSurveyPage() {
    this.nav.push(SurveyPage);
  }

  openStartSurveyPage() {
    this.nav.push(StartSurveyPage);
  }
}