import {ActionSheet, Platform, NavController, Alert, Loading, Toast, Popover} from "ionic-angular";
import {NgZone} from "@angular/core";
import {CameraOptions} from "ionic-native/dist/plugins/camera";
import {Camera} from "ionic-native/dist/index";
import {Survey} from "../../components/survey.component";
import {Model} from "../../components/model.component";
import {SurveyService} from "../../services/survey.service";
import {RandomImage} from "../../components/randomImage.component";
import {MainPage} from "../main/main";
import {Component} from "@angular/core";
import {CountrySelection} from "../../components/countrySelection.component";

@Component({
  templateUrl: 'build/pages/startSurvey/startSurvey.html'
})
export class StartSurveyPage {
  cameraOptions: CameraOptions = {
    destinationType: 0,
    sourceType: 1,
    encodingType: 0,
    quality:100,
    targetWidth: 300,
    targetHeight: 300,
    allowEdit: true,
    saveToPhotoAlbum: false
  };
  survey: Survey;
  countries: string[] = [];
  ageRange = {lower: 1, upper: 99};
  saveAsDefault: boolean = true;

  constructor(private platform: Platform,
              private nav: NavController,
              private ngZone: NgZone,
              private model: Model,
              private surveyService: SurveyService) {
    this.survey = new Survey();
    if(model.user.surveyCountry) {
      this.countries = model.user.surveyCountry.split(",");
    } else {
      this.countries.push(model.user.country);
    }
    this.survey.male = model.user.surveyMale !== false;
    this.survey.female = model.user.surveyFemale !== false;
    this.survey.minAge = model.user.surveyMinAge ? model.user.surveyMinAge : 1;
    this.survey.maxAge = model.user.surveyMaxAge ? model.user.surveyMaxAge : 99;
  }

  doTakePicture(isFirstPic: boolean, source: number) {
    this.cameraOptions.sourceType = source;
    Camera.getPicture(this.cameraOptions).then(data => {
      this.ngZone.run(() => {
        if(isFirstPic) {
          this.survey.pic1 = data;
        } else {
          this.survey.pic2 = data;
        }
      });
    }, error => {alert(error);});
  }

  choosePicture(isFirstPic: boolean) {
    let actionSheet = ActionSheet.create({
      title: 'Choose action',
      cssClass: 'action-sheets-basic-page',
      buttons: [{
          text: 'Camera',
          icon: this.platform.is('ios') ? null : 'camera',
          handler: () => {
            this.doTakePicture(isFirstPic, 1);
          }
        }, {
          text: 'Gallery',
          icon: this.platform.is('ios') ? null : 'image',
          handler: () => {
            this.doTakePicture(isFirstPic, 0);
          }
        }, {
          text: 'Dummy for Test',
          icon: this.platform.is('ios') ? null : 'bug',
          handler: () => {
            this.chooseDummyPicture(isFirstPic);
          }
      }
      ]
    });
    this.nav.present(actionSheet);
  }
  
  chooseDummyPicture(isFirstPic: boolean) {
    if(isFirstPic) {
      this.survey.pic1 = RandomImage.getRandomImage();
    } else {
      this.survey.pic2 = RandomImage.getRandomImage();
    }
  }

  changeGender(event: Event) {
    if(this.survey.male && this.survey.female) {
      this.survey.male = false;
    } else if(this.survey.male) {
      this.survey.female = true;
    } else {
      this.survey.male = true;
      this.survey.female = false;
    }
    event.preventDefault();
  }

  addCountry() {
    let countrySelection = Popover.create(CountrySelection, {callback: country => {
      if(this.countries.indexOf(country.alpha3) == -1) {
        this.countries.push(country.alpha3);
        this.countries.sort();
      }
      countrySelection.dismiss();
    }});
    this.nav.present(countrySelection);
  }

  removeCountry(country: string) {
    let idx = this.countries.indexOf(country);
    if(idx != -1) {
      this.countries.splice(idx,1);
    }
  }

  surveyComplete(): boolean {
    return this.survey.pic1 && this.survey.pic2 && this.countries.length > 0;
  }

  private startSurvey() {
    this.survey.minAge = this.ageRange.lower;
    this.survey.maxAge = this.ageRange.upper;
    this.survey.country = "";
    this.countries.forEach(c => {
      if(this.survey.country != "") {
        this.survey.country += ",";
      }
      this.survey.country += c;
    });
    let loading = Loading.create({
      content: 'Starting survey',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.surveyService.postSurvey(this.survey, "NUMBER100", this.saveAsDefault).subscribe(resp => {
      console.log("survey started");
      loading.dismiss().then(() => {
        this.nav.present(Toast.create({
          message: 'Survey has started',
          duration: 5000,
          showCloseButton: true,
          closeButtonText: 'OK'
        }));
      });
      this.nav.setRoot(MainPage);
    }, err => {
      loading.dismiss().then(() => {
        this.nav.present(Toast.create({
          message: 'Sorry, an error occured',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'OK'
        }));
      });
      console.log(err);
    });
  }

}