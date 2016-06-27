import {Component} from "@angular/core";
import {Splashscreen} from "ionic-native/dist/index";

@Component({
  templateUrl: 'build/pages/loading/loading.html'
})
export class LoadingPage {
  ionViewDidEnter() {
    Splashscreen.hide();
  }
}