import {Page, NavParams} from "ionic-angular/index";
import {Survey} from "../../components/survey.component";

@Page({
  templateUrl: 'build/pages/surveyDetails/surveyDetails.html'
})
export class SurveyDetailsPage {
  survey: Survey;

  constructor(navParams: NavParams) {
    this.survey = navParams.get('survey');
  }
}