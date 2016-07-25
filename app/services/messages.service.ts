import {Model} from "../components/model.component";
import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Feedback} from "../components/domain/feedback.component";
import {FeedbackAnswer} from "../components/domain/feedbackAnswer.component";
import {Announcement} from "../components/domain/announcement.component";

export class FeedbackAnswerResponse {
  feedback: Feedback;
  answer: FeedbackAnswer;
}

@Injectable()
export class MessagesService {

  constructor(private http:Http, private model:Model) {}

  loadFeedback(): Observable<Feedback[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/app/feedback/list", {headers: headers}).map(res => res.json());
  }

  loadAnnouncements(): Observable<Announcement[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/app/announcement/list", {headers: headers}).map(res => res.json());
  }

  loadFeedbackAnswers(id: number): Observable<FeedbackAnswer[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/app/feedback/answers/" + id, {headers: headers}).map(res => res.json());
  }

  sendFeedback(feedback: Feedback): Observable<Feedback> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/feedback/", JSON.stringify(feedback), {headers: headers}).map(res => res.json());
  }

  closeFeedback(feedback: Feedback): Observable<Feedback> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.put(Model.server + "/app/feedback/close/" + feedback.id, null, {headers: headers}).map(res => res.json());
  }

  sendFeedbackAnswer(feedback: Feedback, answer: FeedbackAnswer): Observable<FeedbackAnswerResponse> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/feedback/answer/" + feedback.id, JSON.stringify(answer), {headers: headers}).map(res => res.json());
  }
}