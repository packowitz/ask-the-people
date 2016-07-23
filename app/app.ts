import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import 'rxjs/add/operator/map'
import {AuthService} from "./services/auth.service";
import {CountryService} from "./services/country.service";
import {LoadingPage} from "./pages/loading/loading";
import {Model} from "./components/model.component.ts";
import {SurveyService} from "./services/survey.service";
import {ViewChild, Component} from "@angular/core";
import {HighscoreService} from "./services/highscore.service";
import {MessagesService} from "./services/messages.service";

@Component({
  templateUrl: 'build/app.html'
})
class AtpApp {
  rootPage: any = LoadingPage;
  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(AtpApp, [AuthService, CountryService, MessagesService, HighscoreService, SurveyService, Model], {
  tabbarHighlight: true,
  tabbarPlacement: 'bottom',
  platforms: {
    ios: {
      statusbarPadding: true
    }
  }
});