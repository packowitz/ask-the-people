import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Headers, Http} from "@angular/http";
import {Model} from "../components/model.component";
import {NotificationService} from "./notification.service";

@Injectable()
export class AtpHttp {
  private static timeout: number = 10000;

  constructor(private http: Http,
              private model: Model,
              private notificationService: NotificationService) {}

  doGet(uri: string, loadingMessage?: string): Observable<any> {
    if(loadingMessage) {
      this.notificationService.showLoading(loadingMessage);
    }
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    return this.http.get(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .map(data => this.handleData(data))
      .catch(err => this.handleError(err));
  }

  doPost(uri: string, body: any, loadingMessage?: string): Observable<any> {
    if(loadingMessage) {
      this.notificationService.showLoading(loadingMessage);
    }
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .map(data => this.handleData(data))
      .catch(err => this.handleError(err));
  }

  doPut(uri: string, body: any, loadingMessage?: string): Observable<any> {
    if(loadingMessage) {
      this.notificationService.showLoading(loadingMessage);
    }
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    headers.append('Content-Type', 'application/json');
    return this.http.put(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .map(data => this.handleData(data))
      .catch(err => this.handleError(err));
  }

  private handleData(data): Observable<any> {
    this.notificationService.dismissLoading();
    let response = data.json();
    if(response.user && response.data) {
      this.model.user = response.user;
      return response.data;
    } else {
      return response;
    }
  }

  private handleError(err) {
    //noinspection TypeScriptUnresolvedFunction
    this.notificationService.dismissLoading().then(() => {
      this.notificationService.showToast({
        message: 'Sorry, an error occured (' + err.status + '). Try again',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK'
      });
    });
    console.log(err);
    return Observable.throw(err);
  }
}