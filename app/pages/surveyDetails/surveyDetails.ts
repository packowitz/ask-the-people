import {NavParams} from "ionic-angular/index";
import {Survey} from "../../components/survey.component";
import {Component} from "@angular/core";

@Component({
  templateUrl: 'build/pages/surveyDetails/surveyDetails.html'
})
export class SurveyDetailsPage {
  survey: Survey;

  constructor(navParams: NavParams) {
    this.survey = navParams.get('survey');
  }
}