import {Component, Input} from "angular2/core";
import {Survey} from "./survey.component";

@Component({
  selector: 'survey-list',
  templateUrl: 'build/components/surveyList.html'
})
export class SurveyListComponent {
  @Input()
  surveys: Survey[];

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

  surveyDetails(survey: Survey) {
  }
}