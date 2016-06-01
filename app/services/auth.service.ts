import {Http, Headers} from "angular2/http";
import {User} from "../components/user.component";
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
import {Model} from "../components/model.component";

@Injectable()
export class AuthService {
  constructor(public http:Http) {}

  register(user: User): Observable {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/auth/register", JSON.stringify(user), {headers: headers}).map(res => res.json());
  }

  getUserByToken(token: string): Observable<User> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get(Model.server + "/user", {headers: headers}).map(res => res.json());
  }
}