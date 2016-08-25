import {NavParams, ViewController, PopoverController} from "ionic-angular/index";
import {Survey} from "../../components/domain/survey.component";
import {Component, PipeTransform, Pipe} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../services/survey.service";
import {AnswerBarComponent} from "../../components/answerbar.component";


@Pipe({name: 'country'})
export class CountryPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    var countries = {};
    value.forEach(answer => {
      let country = answer.country;
      countries[country] = countries[country] ? countries[country] : {alpha3: country, pic1: 0, pic2: 0, noOpinion: 0};
      if(answer.answer == 1) {
        countries[country].pic1 ++;
      } else if (answer.answer == 2) {
        countries[country].pic2 ++;
      } else {
        countries[country].noOpinion ++;
      }
    });
    return Object.keys(countries).map(function (key) {
      return countries[key]
    });
  }
}

@Pipe({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    var gender = {};
    value.forEach(answer => {
      let sex = answer.male ? 'male' : 'female';
      gender[sex] = gender[sex] ? gender[sex] : {gender: sex, pic1: 0, pic2: 0, noOpinion: 0};
      if(answer.answer == 1) {
        gender[sex].pic1 ++;
      } else if (answer.answer == 2) {
        gender[sex].pic2 ++;
      } else {
        gender[sex].noOpinion ++;
      }
    });
    return Object.keys(gender).map(function (key) {
      return gender[key]
    });
  }
}

@Pipe({name: 'age'})
export class AgePipe implements PipeTransform {
  private static resolveKey(ageDiff, age) {
    return age;
  }
  transform(value, args:string[]) : any {
    var ages = {};
    let minAge = 100;
    let maxAge = 0;
    value.forEach(answer => {
      minAge = answer.age < minAge ? answer.age : minAge;
      maxAge = answer.age > maxAge ? answer.age : maxAge;
    });
    let ageDiff = maxAge - minAge;

    value.forEach(answer => {
      let age = AgePipe.resolveKey(ageDiff, answer.age);
      ages[age] = ages[age] ? ages[age] : {age: age, pic1: 0, pic2: 0, noOpinion: 0};
      if(answer.answer == 1) {
        ages[age].pic1 ++;
      } else if (answer.answer == 2) {
        ages[age].pic2 ++;
      } else {
        ages[age].noOpinion ++;
      }
    });
    return Object.keys(ages).map(function (key) {
      return ages[AgePipe.resolveKey(ageDiff, key)]
    });
  }
}

@Component({
  templateUrl: 'build/pages/surveyDetails/surveyDetails.html',
  directives: [AnswerBarComponent],
  pipes: [CountryPipe, GenderPipe, AgePipe]
})
export class SurveyDetailsPage {
  survey: Survey;
  countries: string[];
  showSummary: boolean = true;
  showStatistics: boolean = false;

  constructor(private navParams: NavParams,
              private surveyService: SurveyService,
              private popoverController: PopoverController) {
    this.survey = navParams.get('survey');
    this.countries = this.survey.country.split(",");
    surveyService.loadSurveyDetails(this.survey);
  }

  showOptions(event: Event) {
    let popover = this.popoverController.create(SurveyDetailsMenu, {
      survey: this.survey,
      callbacks: {
        refresh: () => {this.surveyService.loadSurveyDetails(this.survey)},
        tweak: () => {alert("You can start an ATP with the same pictures but different criterias. Will come later.");},
        delete: () => {alert("Deleting an ATP will come later");}
      }
    });

    popover.present({
      ev: event
    });
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.survey.startedDate);
  }
  
  hasAnswerOfCountry(country: string): boolean {
    let a = this.survey.answers.filter(answer => answer.country == country);
    console.log("found " + a.length + " answers in " + country);
    return a.length > 0;
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