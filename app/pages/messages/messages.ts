import {Component} from "@angular/core";
import {NavController, PopoverController, AlertController, LoadingController} from "ionic-angular/index";
import {ChooseFeedbackType} from "./chooseFeedbackType";
import {Feedback} from "../../components/domain/feedback.component";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../services/messages.service";
import {Util} from "../../components/util.component";
import {FeedbackDetailsPage} from "./feedbackDetails";

@Component({
  templateUrl: 'build/pages/messages/messages.html'
})
export class FeedbackPage {
  selection: string;
  newFeedback: Feedback = new Feedback();

  constructor(private nav: NavController,
              private model: Model,
              private feedbackService: MessagesService,
              private popoverController: PopoverController,
              private alertController: AlertController,
              private loadingController: LoadingController) {
    this.selection = this.model.unreadAnnouncements > 0 ? 'announcements' : 'feedback';
    setTimeout(() => this.model.markAnnouncementAsRead(), 1000);
  }

  startGiveFeedback() {
    let popover = this.popoverController.create(ChooseFeedbackType, {
      callback: type => {
        this.newFeedback.type = type;
        popover.dismiss();
      }
    });
    popover.present();
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  showFeedbackDetails(feedback) {
    this.nav.push(FeedbackDetailsPage, {feedback: feedback});
  }

  sendFeedback() {
    let loading = this.loadingController.create({
      content: 'Sending Feedback',
      spinner: 'dots'
    });
    loading.present();
    this.feedbackService.sendFeedback(this.newFeedback).subscribe(
      feedback => {
        this.newFeedback = new Feedback();
        this.model.feedback.unshift(feedback);
        loading.dismiss();
      },
      error => {
        loading.dismiss().then(() => {
          this.alertController.create({
            title: 'Network Error',
            message: 'There was a network error!',
            buttons: [{
              text: 'Cancel'
            }, {
              text: 'Retry',
              handler: () => this.sendFeedback()
            }]
          }).present();
        });
      }
    );
  }
}