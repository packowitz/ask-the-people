import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {CountryService} from "../../services/country.service";
import {NavController, Toast, Popover} from "ionic-angular/index";
import {AuthService} from "../../services/auth.service";
import {CountrySelection} from "../../components/countrySelection.component";
import {Country} from "../../components/country.component";

@Component({
  selector: 'personal-data',
  templateUrl: 'build/pages/settings/personalData.html',
  styles: [`
    .country {
        float: right;
    }
    .flag {
        height: 1.3em;
        vertical-align: bottom;
    }`]
})
export class PersonalData {
  expanded: boolean = false;
  yearOfBirth: number;
  male: boolean;
  country: string;
  countryName: string;

  constructor(private model: Model,
              private countryService: CountryService,
              private nav: NavController,
              private authService: AuthService) {
    this.yearOfBirth = model.user.yearOfBirth;
    this.male = model.user.male;
    this.country = model.user.country;
    countryService.getCountries().subscribe(countries => {
      countries.forEach(c => {
        if(c.alpha3 == this.country) {
          this.countryName = c.nameEng;
        }
      });
    });
  }
  
  dataUnchanged(): boolean {
    return this.model.user.yearOfBirth == this.yearOfBirth &&
      this.model.user.male == this.male &&
      this.model.user.country == this.country;
  }

  chooseCountry() {
    let countrySelection = Popover.create(CountrySelection, {callback: country => {
      this.country = country.alpha3;
      this.countryName = country.nameEng;
      countrySelection.dismiss();
    }});
    this.nav.present(countrySelection);
  }

  doSubmit() {
    this.authService.postPersonalData(this.yearOfBirth, this.male, this.country).subscribe(() => {
      this.nav.present(Toast.create({
        message: 'Personal data updated',
        duration: 2000
      }));
    }, err => console.log(err))
  }
}