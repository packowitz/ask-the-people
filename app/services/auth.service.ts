import {Http, Headers} from "@angular/http";
import {User} from "../components/domain/user.component";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Model} from "../components/model.component";

@Injectable()
export class AuthService {
  constructor(public http:Http, private model: Model) {}

  register(user: User): Observable {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/auth/register", JSON.stringify(user), {headers: headers}).map(res => res.json());
  }

  login(username: string, password: string): Observable {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/auth/login", JSON.stringify({username: username, password: password}), {headers: headers}).map(res => res.json());
  }

  getUserByToken(token: string): Observable<User> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get(Model.server + "/app/user", {headers: headers}).map(res => res.json());
  }

  postUsername(username: string, password: string): Observable<boolean> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/user/username", JSON.stringify({username: username, password: password}), {headers: headers}).map(res => {
      let user = res.json();
      this.model.user = user;
      return user;
    });
  }

  postNotification(enabled: boolean, soundEnabled: boolean, vibrationEnabled: boolean): Observable<boolean> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/user/notifications", JSON.stringify({enabled: enabled, soundEnabled: soundEnabled, vibrationEnabled: vibrationEnabled}), {headers: headers}).map(res => {
      let user = res.json();
      this.model.user = user;
      return user;
    });
  }

  postPersonalData(yearOfBirth: number, male: boolean, country: string) {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/user/personal-data", JSON.stringify({'yearOfBirth': yearOfBirth, male: male, country: country}), {headers: headers}).map(res => {
      let user = res.json();
      this.model.user = user;
      return user;
    });
  }
}