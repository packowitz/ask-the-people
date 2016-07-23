import {Component} from "@angular/core";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../components/survey.component";
import {SurveyListComponent} from "../../components/surveyList.component";
import {Tabs} from "ionic-angular/index";
import {Model} from "../../components/model.component";

@Component({
  templateUrl: 'build/pages/mySurveys/mySurveys.html',
  directives: [SurveyListComponent]
})
export class MySurveysPage {
  selection: string = "current";
  currentLoaded: boolean = false;
  currentSurveys: Survey[];
  archivedLoaded: boolean = false;
  archivedSurveys: Survey[];

  constructor(private tabs: Tabs, private surveyService: SurveyService) {}

  ionViewDidEnter() {
    if(!this.currentLoaded) {
      this.loadCurrentSurveys();
    } else {
      this.updateCurrentSurveys();
    }
  }

  ionChange() {
    if(!this.archivedLoaded) {
      this.loadArchivedSurveys();
    }
  }

  loadCurrentSurveys() {
    this.surveyService.getCurrentSurveyList().subscribe(surveys => {
      this.currentSurveys = surveys;
      this.currentLoaded = true;
    });
  }

  updateCurrentSurveys() {
    this.currentSurveys.forEach(survey => {
      if(survey.status != 'FINISHED') {
        this.surveyService.updateSurvey(survey);
      }
    });
  }

  loadArchivedSurveys() {
    this.surveyService.getArchivedSurveyList().subscribe(surveys => {
      this.archivedSurveys = surveys;
      this.archivedLoaded = true;
    });
  }

  gotoStartSurvey() {
    this.tabs.select(Model.StartSurveyTab);
  }
}