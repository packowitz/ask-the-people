import {Page, Loading, NavController, Toast, Alert} from "ionic-angular";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../components/survey.component";
import {MainPage} from "../main/main";
import {Messages} from "../../components/messages.component";

@Page({
  templateUrl: 'build/pages/survey/survey.html'
})
export class SurveyPage {
  picSize: number;
  survey: Survey;
  enabled: boolean = false;
  showTitle: boolean = false;
  loading: Loading;

  constructor(private nav: NavController, private surveyService: SurveyService) {
    this.loadNextSurvey();
  }

  loadNextSurvey() {
    this.loading = Loading.create({
      content: 'Loading survey',
      spinner: 'dots'
    });
    this.nav.present(this.loading);
    this.surveyService.getSurveyToAnswer().subscribe(data => {
      this.showSurvey(data);
    }, err => this.handleError(err));
  }

  ngOnInit() {
    setTimeout(() => {
      let maxWidht = window.innerWidth - 10;
      let maxHeight = (document.getElementById('survey-content').offsetHeight - 2) / 2;
      this.picSize = Math.min(maxWidht, maxHeight);
    }, 10);
  }

  handleError(err) {
    this.loading.dismiss().then(() => {
      this.nav.present(Toast.create({
        message: 'Sorry, an error occured',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK'
      }));
    });
    console.log(err);
    this.nav.setRoot(MainPage);
  }

  showSurvey(survey: Survey) {
    this.loading.dismiss();
    this.survey = survey;
    if(survey.title) {
      this.showTitle = true;
      setTimeout(() => this.showTitle = false, 1500);
    }
    this.enabled = false;
    setTimeout(() => this.enabled = true, survey.title? 3500 : 2000);
  }

  goHome() {
    this.nav.setRoot(MainPage);
  }

  reportAbuse() {
    this.nav.present(Alert.create({
      title: 'Report Abuse',
      message: "Abuse means that you think that these pictures show <strong>illegal</strong> or <strong>illegitimate</strong> content.<br/>If you just don't have a meaning on these picture then please press 'skip'.",
      buttons: [
        {text: 'Cancel'},
        {text: 'Report Abuse', handler: () => {
          this.selectPicture(3);
        }}
      ]
    }));
  }
  
  selectPicture(picNr: number) {
    if(this.enabled) {
      let timestamp: number = new Date().getTime();
      let message;
      if(picNr == 3) {
        message = "reporting abuse";
      } else {
        message = Messages.getAnsweredMsg();
      }
      this.loading = Loading.create({
        content: message,
        spinner: 'dots'
      });
      this.nav.present(this.loading);
      this.surveyService.postResult(this.survey, picNr).subscribe(data => {
        let timeDiff: number = new Date().getTime() - timestamp;
        if(timeDiff > 1500) {
          this.showSurvey(data);
        } else {
          setTimeout(() => this.showSurvey(data), 1500 - timeDiff);
        }
      }, err => this.handleError(err));
    } else {
      this.nav.present(Toast.create({
        message: Messages.getTooFastMsg(),
        enableBackdropDismiss: false,
        duration: 1000
      }));
    }
  }
}