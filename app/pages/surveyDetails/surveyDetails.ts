import {NavParams} from "ionic-angular/index";
import {Survey} from "../../components/survey.component";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";

@Component({
  templateUrl: 'build/pages/surveyDetails/surveyDetails.html'
})
export class SurveyDetailsPage {
  survey: Survey;
  countries: string[];
  showSummary: boolean = true;

  constructor(private navParams: NavParams) {
    this.survey = navParams.get('survey');
    this.countries = this.survey.country.split(",");
  }

  showOptions(event: Event) {

  }
  
  getTimeDiff() {
    return Util.getTimeDiff(this.survey.startedDate);
  }
}