import {User} from "./user.component.ts";
import {Platform, Loading, NavController} from "ionic-angular";
import {Injectable} from "@angular/core";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  public loading: Loading;
  public user: User;
  public token: string;

  constructor(private platform: Platform) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "https://atp-pacworx.rhcloud.com";
    }
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