import {ActionSheet, Platform, NavController, Alert, Loading, Toast} from "ionic-angular";
import {NgZone} from "@angular/core";
import {CameraOptions} from "ionic-native/dist/plugins/camera";
import {Camera} from "ionic-native/dist/index";
import {Survey} from "../../components/survey.component";
import {Model} from "../../components/model.component";
import {CountryService} from "../../services/country.service";
import {SurveyService} from "../../services/survey.service";
import {RandomImage} from "../../components/randomImage.component";
import {MainPage} from "../main/main";
import {Component} from "@angular/core";

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
  countries;
  picSize: number;

  constructor(private platform: Platform,
              private nav: NavController,
              private ngZone: NgZone,
              private model: Model,
              private countryService: CountryService,
              private surveyService: SurveyService) {
    this.survey = new Survey();
    this.survey.country = model.user.country;
    this.survey.male = true;
    this.survey.female = true;
    this.survey.minAge = 1;
    this.survey.maxAge = 99;
    countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, err => console.log('ERROR: ' + err));
  }

  ngOnInit() {
    setTimeout(() => {
      let maxWidht = window.innerWidth - 10;
      let maxHeight = (document.getElementById('start-survey-content').offsetHeight - 2) / 2;
      this.picSize = Math.min(maxWidht, maxHeight);
    }, 10);
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

  chooseCountry() {
    let alert = Alert.create();
    alert.setTitle('Choose country');
    this.countries.forEach(country => {
      alert.addInput({type: 'radio', label: country.nameEng, value: country.alpha3, checked: country.alpha3 == this.survey.country});
    });
    alert.addButton('Cancel');
    alert.addButton({text: 'Ok', handler: data => this.survey.country = data});
    this.nav.present(alert);
  }

  chooseAge() {
    let prompt = Alert.create({
      title: 'Choose age range',
      inputs: [
        {name: 'minAge', label: 'minimum age', type: 'number', value: '' + this.survey.minAge},
        {name: 'maxAge', label: 'maximum age', type: 'number', value: '' + this.survey.maxAge}
      ],
      buttons: [
        {text: 'Cancel'},
        {text: 'OK',  handler: data => {
          if(!data.minAge || data.minAge < 1) {
            data.minAge = 1
          }
          if(data.minAge > 99) {
            data.minAge = 99;
          }
          if(!data.maxAge || data.maxAge > 99) {
            data.maxAge = 99;
          }
          if(data.maxAge < 1) {
            data.maxAge = 1;
          }
          if(data.maxAge < data.minAge) {
            this.survey.minAge = data.maxAge;
            this.survey.maxAge = data.minAge;
          } else {
            this.survey.minAge = data.minAge;
            this.survey.maxAge = data.maxAge;
          }
        }}
      ]
    });
    this.nav.present(prompt);
  }

  chooseGender() {
    let alert = Alert.create();
    alert.setTitle('Choose gender');
    alert.addInput({type: 'radio', label: 'male only', value: 'male', checked: this.survey.male && !this.survey.female});
    alert.addInput({type: 'radio', label: 'female only', value: 'female', checked: !this.survey.male && this.survey.female});
    alert.addInput({type: 'radio', label: 'male and female', value: 'both', checked: this.survey.male && this.survey.female});
    alert.addButton('Cancel');
    alert.addButton({text: 'Ok', handler: data => {
      this.survey.male = data == 'male' || data == 'both';
      this.survey.female = data == 'female' || data == 'both';
    }});
    this.nav.present(alert);
  }

  submitSurvey() {
    let prompt = Alert.create({
      title: 'Complete survey',
      message: 'You can give a short hint to which part of the picture the people should focus on.',
      cssClass: 'specialClassForGetHint',
      inputs: [
        {name: 'hint', id: 'startSurveyHint', placeholder: 'use maximal 3 words as hint', type: 'text'}
      ],
      buttons: [
        {text: 'Cancel'},
        {text: 'Start',  handler: data => {
          this.survey.title = data.hint;
          this.startSurvey();
        }}
      ]
    });
    this.nav.present(prompt);
    setTimeout(() => {
      //noinspection TypeScriptUnresolvedVariable
      document.getElementsByClassName('specialClassForGetHint')[0].getElementsByTagName('input')[0].maxLength=25;
    }, 500);
  }

  private startSurvey() {
    let loading = Loading.create({
      content: 'Starting survey',
      spinner: 'dots'
    });
    this.nav.present(loading);
    this.surveyService.postSurvey(this.survey).subscribe(resp => {
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