import {ChooseUsername} from "./chooseUsername.component.ts";
import {Model} from "../../components/model.component";
import {PersonalData} from "./personalData.component";
import {Component} from "@angular/core";

@Component({
  templateUrl: 'build/pages/settings/settings.html',
  directives: [ChooseUsername, PersonalData]
})
export class SettingsPage {
  constructor(private model: Model) {}

}