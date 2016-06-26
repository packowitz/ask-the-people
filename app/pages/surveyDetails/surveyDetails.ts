import {NavParams, Popover, NavController, ViewController} from "ionic-angular/index";
import {Survey} from "../../components/survey.component";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../services/survey.service";

@Component({
  templateUrl: 'build/pages/surveyDetails/surveyDetails.html'
})
export class SurveyDetailsPage {
  survey: Survey;
  countries: string[];
  showSummary: boolean = true;
  showStatistics: boolean = false;

  constructor(private nav: NavController,
              private navParams: NavParams,
              private surveyService: SurveyService) {
    this.survey = navParams.get('survey');
    this.countries = this.survey.country.split(",");
    surveyService.loadSurveyDetails(this.survey);
  }

  showOptions(event: Event) {
    let popover = Popover.create(SurveyDetailsMenu, {
      survey: this.survey,
      callbacks: {
        refresh: () => {this.surveyService.loadSurveyDetails(this.survey)},
        tweak: () => {alert("You can start an ATP with the same pictures but different criterias. Will come later.");},
        delete: () => {alert("Deleting an ATP will come later");}
      }
    });

    this.nav.present(popover, {
      ev: event
    });
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.survey.startedDate);
  }
}

@Component({
  template: `
    <ion-list style="margin: 0;">
      <ion-item *ngIf="survey.status != 'FINISHED'" (click)="refresh()">
        <ion-icon name="refresh" item-left></ion-icon> Refresh
      </ion-item>
      <ion-item *ngIf="survey.status != 'ABUSE'" (click)="tweak()">
        <ion-icon name="share-alt" item-left></ion-icon> Tweak
      </ion-item>
      <ion-item class="text-danger" (click)="delete()">
        <ion-icon name="remove-circle" item-left></ion-icon> Delete
      </ion-item>
    </ion-list>
  `,
})
class SurveyDetailsMenu {
  survey: Survey;
  callbacks;

  constructor(private navParams: NavParams, private viewController: ViewController) {
    this.survey = navParams.get('survey');
    this.callbacks = navParams.get('callbacks')
  }
  
  refresh() {
    this.callbacks.refresh();
    this.viewController.dismiss();
  }
  
  tweak() {
    this.callbacks.tweak();
    this.viewController.dismiss();
  }
  
  delete() {
    this.callbacks.delete();
    this.viewController.dismiss();
  }
}