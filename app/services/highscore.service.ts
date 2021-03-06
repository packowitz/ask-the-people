import {Injectable} from "@angular/core";
import {HighscoreUser} from "../components/domain/highscoreUser.component";
import {Observable} from "rxjs/Rx";
import {AtpHttp} from "./atpHttp.service";

@Injectable()
export class HighscoreService {

  constructor(private atpHttp: AtpHttp) {}

  getHighscoreGlobalWeek(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/week");
  }

  getHighscoreLocalWeek(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/week/local");
  }

  getHighscoreGlobalTotal(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore");
  }

  getHighscoreLocalTotal(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/local");
  }
}