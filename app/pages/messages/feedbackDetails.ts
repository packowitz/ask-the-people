import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";
import {Feedback} from "../../components/domain/feedback.component";
import {MessagesService} from "../../services/messages.service";
import {FeedbackAnswer} from "../../components/domain/feedbackAnswer.component";
import {Model} from "../../components/model.component";
import {Util} from "../../components/util.component";
@Component({
  templateUrl: 'build/pages/messages/feedbackDetails.html'
})
export class FeedbackDetailsPage {
  private feedback: Feedback;
  private answers: FeedbackAnswer[] = [];
  private newAnswer: FeedbackAnswer;

  constructor(private navParams: NavParams,
              private model: Model,
              private feedbackService: MessagesService) {
    this.feedback = navParams.get('feedback');
    this.loadAnswers();
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  loadAnswers() {
    if(this.feedback.answers) {
      this.feedbackService.loadFeedbackAnswers(this.feedback.id).subscribe(
        answers => {
          this.answers = answers;
          if(this.feedback.unreadAnswers > 0) {
            this.feedback.unreadAnswers = 0;
            this.model.recalcUnreadMessages();
          }
        }
      );
    }
  }

  closeFeedback() {
    this.feedbackService.closeFeedback(this.feedback).subscribe(
      feedback => Feedback.update(this.feedback, feedback)
    );
  }

  editResponse() {
    this.newAnswer = new FeedbackAnswer();
  }

  sendAnswer() {
    this.feedbackService.sendFeedbackAnswer(this.feedback, this.newAnswer).subscribe(
      response => {
        this.newAnswer = null;
        this.answers.push(response.answer);
        Feedback.update(this.feedback, response.feedback);
      }
    );
  }

}