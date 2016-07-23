import {Component} from "@angular/core";
import {CountryService} from "../services/country.service";
import {Country} from "./domain/country.component";
import {NavParams, NavController, Alert} from "ionic-angular/index";

@Component({
  template: `
<ion-list class="country-selection">
    <ion-list-header>Choose a country</ion-list-header>
    <ion-item *ngFor="let country of countries" (click)="callback(country)">
        <img src="img/flags/{{country.alpha3}}.png" class="flag">{{country.nameEng}}
    </ion-item>
</ion-list>`,
  styles: [`
    .country-selection{
        max-height: 60vh;
    }
    .button-inner {
        justify-content: flex-start;
    }
    .flag {
        height: 1.2em;
        vertical-align: bottom;
        margin-right: 3vw;
        border: 1px black solid;
    }`]
})

export class CountrySelection{
  countries: Country[];
  callback;

  constructor(private countryService: CountryService,
              private nav: NavController,
              private navParams: NavParams) {
    this.loadCountries();
    this.callback = navParams.get('callback');
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, err => {
      this.nav.present(Alert.create({
        title: 'Network Error',
        message: 'There was a network error!',
        buttons: [{
          text: 'Retry',
          handler: () => {
            this.loadCountries();
          }
        }]
      }));
    });
  }
}