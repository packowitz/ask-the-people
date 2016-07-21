import {Model} from "../components/model.component";
import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Feedback} from "../components/feedback.component";
import {FeedbackAnswer} from "../components/feedbackAnswer.component";

export class FeedbackAnswerResponse {
  feedback: Feedback;
  answer: FeedbackAnswer;
}

@Injectable()
export class FeedbackService {

  constructor(private http:Http, private model:Model) {}

  loadFeedback(): Observable<Feedback[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/feedback/list", {headers: headers}).map(res => res.json());
  }

  loadFeedbackAnswers(id: number): Observable<FeedbackAnswer[]> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.get(Model.server + "/feedback/answers/" + id, {headers: headers}).map(res => res.json());
  }

  sendFeedback(feedback: Feedback): Observable<Feedback> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/feedback/", JSON.stringify(feedback), {headers: headers}).map(res => res.json());
  }

  closeFeedback(feedback: Feedback): Observable<Feedback> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    return this.http.put(Model.server + "/feedback/close/" + feedback.id, null, {headers: headers}).map(res => res.json());
  }

  sendFeedbackAnswer(feedback: Feedback, answer: FeedbackAnswer): Observable<FeedbackAnswerResponse> {
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.model.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/feedback/answer/" + feedback.id, JSON.stringify(answer), {headers: headers}).map(res => res.json());
  }
}