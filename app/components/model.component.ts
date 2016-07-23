import {User} from "./domain/user.component.ts";
import {Platform, Loading, NavController,Storage, LocalStorage} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Feedback} from "./domain/feedback.component";
import {Survey} from "./domain/survey.component";
import {Announcement} from "./domain/announcement.component";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  localStorage: Storage;
  public static FeedbackTab = 0;
  public static PurchaseTab = 1;
  public static MainTab = 2;
  public static MySurveysTab = 3;
  public static StartSurveyTab = 4;
  public loading: Loading;
  public user: User;
  public token: string;
  public last3surveys: Survey[] = [];
  public feedback: Feedback[] = [];
  public unreadFeedback: number = 0;
  public announcements: Announcement[] = [];
  public unreadAnnouncements: number = 0;
  readAnnouncements: string;

  constructor(private platform: Platform) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "https://atp-pacworx.rhcloud.com";
    }
    this.localStorage = new Storage(LocalStorage);
    this.localStorage.get('readAnnouncements').then(data => this.readAnnouncements = data);
  }

  public recalcUnreadMessages() {
    let unreadFeedback = 0;
    let unreadAnnouncements = 0;
    this.feedback.forEach(feedback => unreadFeedback += feedback.unreadAnswers);
    this.announcements.forEach(announcement => {
      if(!this.readAnnouncements || this.readAnnouncements.indexOf('|' + announcement.id + '|') == -1) {
        unreadAnnouncements ++;
      }
    });
    this.unreadFeedback = unreadFeedback;
    this.unreadAnnouncements = unreadAnnouncements;
  }

  public markAnnouncementAsRead() {
    if(!this.readAnnouncements) {
      this.readAnnouncements = '|';
    }
    this.announcements.forEach(announcement => this.readAnnouncements += announcement.id + '|');
    this.localStorage.set('readAnnouncements', this.readAnnouncements).then(() => this.recalcUnreadMessages());
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