import {Injectable} from "@angular/core";
import {Model} from "../components/model.component";
import {Http, Headers} from "@angular/http";
import {HighscoreUser} from "../components/domain/highscoreUser.component";
import {Observable} from "rxjs/Rx";

@Injectable()
export class HighscoreService {

  constructor(private http: Http, private model: Model) {}

  getHighscoreGlobalWeek(): Observable<HighscoreUser[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/user/highscore/week", {headers: headers}).map(res => res.json());
  }

  getHighscoreLocalWeek(): Observable<HighscoreUser[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/user/highscore/week/local", {headers: headers}).map(res => res.json());
  }

  getHighscoreGlobalTotal(): Observable<HighscoreUser[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/user/highscore", {headers: headers}).map(res => res.json());
  }

  getHighscoreLocalTotal(): Observable<HighscoreUser[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/user/highscore/local", {headers: headers}).map(res => res.json());
  }
}