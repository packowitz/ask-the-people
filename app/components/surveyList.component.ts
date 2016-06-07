import {Component, Input} from "@angular/core";
import {Survey} from "./survey.component";
import {NavController} from "ionic-angular/index";
import {StartSurveyPage} from "../pages/startSurvey/startSurvey";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";

@Component({
  selector: 'survey-list',
  templateUrl: 'build/components/surveyList.html'
})
export class SurveyListComponent {
  @Input()
  surveys: Survey[];
  @Input()
  surveyCount: number;

  constructor(private nav: NavController) {}

  getTimeDiff(survey: Survey) {
    let surveyStarted: number = new Date(Date.parse(survey.startedDate)).getTime();
    let diffInMin = Math.round((new Date().getTime() - surveyStarted) / 60000);
    if(diffInMin < 60) {
      return diffInMin + " min";
    }
    if(diffInMin < 1440) {
      return Math.round(diffInMin / 60) + " hours";
    }
    return Math.round(diffInMin / 1440) + " days";
  }

  gotoStartSurvey() {
    this.nav.push(StartSurveyPage);
  }

  openSurveyDetails(survey: Survey) {
    this.nav.push(SurveyDetailsPage, {survey: survey});
  }
}