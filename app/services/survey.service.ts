import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
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

  postSurvey(survey: Survey, type: string, saveAsDefault: boolean): Observable<Survey> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    let request = {survey: survey, type: type, saveAsDefault: saveAsDefault};
    return this.http.post(Model.server + "/survey/private", JSON.stringify(request), {headers: headers}).map(res => this.extractUser(res));
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

  getCurrentSurveyList(): Observable<Survey[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/survey/list/current", {headers: headers}).map(res => this.extractUser(res));
  }

  getArchivedSurveyList(): Observable<Survey[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/survey/list/archived", {headers: headers}).map(res => this.extractUser(res));
  }

  updateSurvey(survey: Survey) {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    this.http.get(Model.server + "/survey/update/" + survey.id, {headers: headers}).map(res => this.extractUser(res)).subscribe(data => {
      survey.status = data.status;
      survey.answered = data.answered;
      survey.noOpinionCount = data.noOpinionCount;
      survey.pic1Count = data.pic1Count;
      survey.pic2Count = data.pic2Count;
    });
  }
  
  loadSurveyDetails(survey: Survey) {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    this.http.get(Model.server + "/survey/details/" + survey.id, {headers: headers}).map(res => this.extractUser(res)).subscribe(data => {
      survey.status = data.status;
      survey.answered = data.answered;
      survey.noOpinionCount = data.noOpinionCount;
      survey.pic1Count = data.pic1Count;
      survey.pic2Count = data.pic2Count;
      survey.answers = data.answers;
    });
  }
}