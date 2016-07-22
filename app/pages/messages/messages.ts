import {Component} from "@angular/core";
import {Popover, NavController, Alert, Loading} from "ionic-angular/index";
import {ChooseFeedbackType} from "./chooseFeedbackType";
import {Feedback} from "../../components/feedback.component";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../services/messages.service";
import {Util} from "../../components/util.component";
import {FeedbackDetailsPage} from "./feedbackDetails";

@Component({
  templateUrl: 'build/pages/messages/messages.html'
})
export class FeedbackPage {
  selection: string = "feedback";
  newFeedback: Feedback = new Feedback();

  constructor(private nav: NavController,
              private model: Model,
              private feedbackService: MessagesService) {
  }

  startGiveFeedback() {
    let popover = Popover.create(ChooseFeedbackType, {
      callback: type => {
        this.newFeedback.type = type;
        popover.dismiss();
      }
    });
    this.nav.present(popover);
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  showFeedbackDetails(feedback) {
    this.nav.push(FeedbackDetailsPage, {feedback: feedback});
  }

  sendFeedback() {
    let loading = Loading.create({
      content: 'Sending Feedback',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.feedbackService.sendFeedback(this.newFeedback).subscribe(
      feedback => {
        this.newFeedback = new Feedback();
        this.model.feedback.unshift(feedback);
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
              handler: () => this.sendFeedback()
            }]
          }));
        });
      }
    );
  }
}