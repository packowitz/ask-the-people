import {Component} from "@angular/core";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {MySurveysPage} from "../mySurveys/mySurveys";
import {MainPage} from "../main/main";
import {HighscorePage} from "../highscore/highscore";
import {PurchasePage} from "../purchase/purchase";

@Component({
  template: `<ion-tabs selectedIndex="2">
    <ion-tab tabIcon="cart" [root]="purchasePage"></ion-tab>
    <ion-tab tabIcon="trophy" [root]="highscorePage"></ion-tab>
    <ion-tab tabIcon="home" [root]="mainPage"></ion-tab>
    <ion-tab tabIcon="list-box" [root]="mySurveysPage"></ion-tab>
    <ion-tab tabTitle="ATP" [root]="startSurveyPage"></ion-tab>
</ion-tabs>`
})
export class TabsPage {
  purchasePage: PurchasePage;
  highscorePage: HighscorePage;
  mainPage: MainPage;
  mySurveysPage: MySurveysPage;
  startSurveyPage: StartSurveyPage;
  
  constructor() {
    this.purchasePage = PurchasePage;
    this.highscorePage = HighscorePage;
    this.mainPage = MainPage;
    this.mySurveysPage = MySurveysPage;
    this.startSurveyPage = StartSurveyPage;
  }
}