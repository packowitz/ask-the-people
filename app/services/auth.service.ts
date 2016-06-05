import {Http, Headers} from "angular2/http";
import {User} from "../components/user.component";
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
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
    return this.http.get(Model.server + "/user", {headers: headers}).map(res => res.json());
  }

  getUsernameExists(username: string): Observable<boolean> {
    return this.http.get(Model.server + "/username_exists/" + username).map(res => res.json().exists);
  }

  postUsername(username: string, password: string): Observable<boolean> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/user/username", JSON.stringify({username: username, password: password}), {headers: headers}).map(res => {
      let user = res.json();
      this.model.user = user;
      return user;
    });
  }
}