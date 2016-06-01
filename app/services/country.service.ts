import {Http} from "angular2/http";
import {Country} from "../components/country.component";
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
import {Model} from "../components/model.component";

@Injectable()
export class CountryService {

  countries: Country[];
  
  constructor(public http:Http) {}

  getCountries(): Observable<Country[]> {
    if(this.countries) {
      return Observable.create(obs => obs.next(this.countries));
    }
    // if(window.localStorage.getItem("countries")) {
    //   return Observable.create(obs => obs.next(JSON.parse(window.localStorage.getItem("countries"))));
    // }
    return this.http.get(Model.server + "/country/list").map(res => {
      if(res.status != 200) {
        throw new Error('Error while retrieving countries: ' + res.status);
      }
      this.countries = res.json()
      // window.localStorage.setItem("countries", JSON.stringify(countries));
      return this.countries;
    })
  }
}