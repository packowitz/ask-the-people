import {Component} from "@angular/core";
import {NavController, PopoverController} from "ionic-angular/index";
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
              private popoverController: PopoverController) {
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
    this.feedbackService.sendFeedback(this.newFeedback).subscribe(
      feedback => {
        this.newFeedback = new Feedback();
        this.model.feedback.unshift(feedback);
      }
    );
  }
}