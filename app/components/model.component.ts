import {User} from "./user.component.ts";
import {Platform, Loading, NavController} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Feedback} from "./feedback.component";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  public static FeedbackTab = 0;
  public static PurchaseTab = 1;
  public static MainTab = 2;
  public static MySurveysTab = 3;
  public static StartSurveyTab = 4;
  public loading: Loading;
  public user: User;
  public token: string;
  public feedback: Feedback[] = [];
  public unreadFeedback: number = 0;
  public unreadAnnouncements: number = 0;

  constructor(private platform: Platform) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "https://atp-pacworx.rhcloud.com";
    }
  }

  public recalcUnreadMessages() {
    let unreadFeedback = 0;
    this.feedback.forEach(feedback => unreadFeedback += feedback.unreadAnswers);
    this.unreadFeedback = unreadFeedback;
  }

  public showLoading(text: string, nav: NavController) {
    if(this.loading) {
      this.loading.dismiss();
    }
    this.loading = Loading.create({
      content: text,
      spinner: 'dots'
    });
    nav.present(this.loading);
  }

  public dismissLoading() {
    this.loading.dismiss().then(() => this.loading = null);
  }
}