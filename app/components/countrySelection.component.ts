import {Component} from "@angular/core";
import {CountryService} from "../services/country.service";
import {Country} from "./country.component";
import {NavParams} from "ionic-angular/index";

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
        height: 1.3em;
        vertical-align: bottom;
        margin-right: 3vw;
    }`]
})

export class CountrySelection{
  countries: Country[];
  callback;

  constructor(private countryService: CountryService, private navParams: NavParams) {
    countryService.getCountries().subscribe(countries => this.countries = countries);
    this.callback = navParams.get('callback');
  }
}