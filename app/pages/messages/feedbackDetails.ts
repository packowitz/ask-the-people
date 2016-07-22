import {Component} from "@angular/core";
import {NavParams, NavController, Loading, Alert} from "ionic-angular/index";
import {Feedback} from "../../components/feedback.component";
import {MessagesService} from "../../services/messages.service";
import {FeedbackAnswer} from "../../components/feedbackAnswer.component";
import {Model} from "../../components/model.component";
import {Util} from "../../components/util.component";
@Component({
  templateUrl: 'build/pages/messages/feedbackDetails.html'
})
export class FeedbackDetailsPage {
  private feedback: Feedback;
  private answers: FeedbackAnswer[] = [];
  private newAnswer: FeedbackAnswer;

  constructor(private nav: NavController,
              private navParams: NavParams,
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
      let loading = Loading.create({
        content: 'Loading Feedback Details',
        spinner: 'dots'
      });
      this.nav.present(loading);
      this.feedbackService.loadFeedbackAnswers(this.feedback.id).subscribe(
        answers => {
          this.answers = answers;
          if(this.feedback.unreadAnswers > 0) {
            this.feedback.unreadAnswers = 0;
            this.model.recalcUnreadMessages();
          }
          loading.dismiss();
        },
        error => {
          loading.dismiss().then(() => {
            this.nav.present(Alert.create({
              title: 'Network Error',
              message: 'There was a network error!',
              buttons: [{
                text: 'Cancel'
              }, {
                text: 'Retry',
                handler: () => this.loadAnswers()
              }]
            }));
          });
        }
      );
    }
  }

  closeFeedback() {
    let loading = Loading.create({
      content: 'Closing Conversation',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.feedbackService.closeFeedback(this.feedback).subscribe(
      feedback => {
        Feedback.update(this.feedback, feedback);
        loading.dismiss();
      },
      error => {
        loading.dismiss().then(() => {
          this.nav.present(Alert.create({
            title: 'Network Error',
            message: 'There was a network error!',
            buttons: [{
              text: 'Cancel'
            }, {
              text: 'Retry',
              handler: () => this.closeFeedback()
            }]
          }));
        });
      }
    );
  }

  editResponse() {
    this.newAnswer = new FeedbackAnswer();
  }

  sendAnswer() {
    let loading = Loading.create({
      content: 'Sending Response',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.feedbackService.sendFeedbackAnswer(this.feedback, this.newAnswer).subscribe(
      response => {
        this.newAnswer = null;
        this.answers.push(response.answer);
        Feedback.update(this.feedback, response.feedback);
        loading.dismiss();
      },
      error => {
        loading.dismiss().then(() => {
          this.nav.present(Alert.create({
            title: 'Network Error',
            message: 'There was a network error!',
            buttons: [{
              text: 'Cancel'
            }, {
              text: 'Retry',
              handler: () => this.sendAnswer()
            }]
          }));
        });
      }
    );
  }

}