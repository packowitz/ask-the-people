import {Component, Input} from "@angular/core";
import {HighscoreUser} from "../../components/highscoreUser.component";
@Component({
  selector: 'highscore-entry',
  template: `<ion-item *ngFor="let hs of highscore; let i = index">
                <ion-label class="highscore-entry">
                    <span>{{i + 1}}.</span>
                    <span class="highscore-name">
                        <img src="img/flags/{{hs.country}}.png" class="flag highscore-name-element">
                        <ion-icon [name]="hs.male ? 'male' : 'female'" class="highscore-name-element"></ion-icon>
                        <span class="highscore-name-element">{{getAge(hs)}} yrs.</span>
                        <span class="highscore-name-element">{{hs.username? hs.username : 'Anonymous'}}</span>
                    </span>
                    <span>{{showWeek ? hs.surveysAnsweredWeek : hs.surveysAnswered}} <ion-icon name="trophy" class="trophy"></ion-icon></span>
                </ion-label>
            </ion-item>`,
  styles: [`
  .highscore-entry {
    display: flex;
  }

  .highscore-name {
    flex-grow: 1;
    display: flex;
  }
  .highscore-name-element {
    margin-left: 2vw;
    min-width: 4vw;
  }

  .flag {
    height: 1.2em;
    border: 1px black solid;
  }

  .trophy {
    color: $atp-gold;
  }
`]
})
export class HighscoreEntry {
  @Input()
  highscore: HighscoreUser[];
  @Input()
  showWeek: boolean;

  getAge(hs: HighscoreUser) {
    return new Date().getFullYear() - hs.yearOfBirth;
  }
}