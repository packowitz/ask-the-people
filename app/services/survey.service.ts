import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Model} from "../components/model.component";
import {Survey} from "../components/survey.component";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SurveyService {
  
  constructor(private http: Http, private model: Model) {}

  extractUser(res) {
    let response = res.json();
    this.model.user = response.user;
    return response.data;
  }

  postSurvey(survey: Survey): Observable<Survey> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/survey/private", JSON.stringify(survey), {headers: headers}).map(res => this.extractUser(res));
  }

  getSurveyToAnswer(): Observable<Survey> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/survey/answerable", {headers: headers}).map(res => this.extractUser(res));
  }

  postResult(survey: Survey, result: number): Observable<Survey> {
    let resultObj = {
      surveyId: survey.id,
      answer: result
    };
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/survey/result", JSON.stringify(resultObj), {headers: headers}).map(res => this.extractUser(res));
  }
  
  getLast3Surveys(): Observable<Survey[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/survey/list3", {headers: headers}).map(res => this.extractUser(res));
  }
}