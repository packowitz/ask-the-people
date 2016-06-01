import {Page, NavController, Storage, SqlStorage} from 'ionic-angular';
import {CountryService} from "../../services/country.service";
import {Country} from "../../components/country.component";
import {User} from "../../components/user.component";
import {AuthService} from "../../services/auth.service";
import {MainPage} from "../main/main";
import {Model} from "../../components/model.component";

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  countries: Country[];
  user: User = new User();
  
  constructor(public nav: NavController, public countryService: CountryService, public authService: AuthService, private model: Model) {
    countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, err => console.log('ERROR: ' + err));
  }

  register() {
    this.authService.register(this.user).subscribe(data => {
      if(data.token) {
        let storage = new Storage(SqlStorage);
        storage.set('token', data.token);
        this.authService.getUserByToken(data.token).subscribe(user => {
          this.model.user = user;
          this.model.token = data.token;
          this.nav.setRoot(MainPage);
        }, error => {
          storage.remove('token');
          this.nav.setRoot(LoginPage);
        });
      } else {
        console.log("error register user:");
        console.log(data);
      }
    });
  }
}