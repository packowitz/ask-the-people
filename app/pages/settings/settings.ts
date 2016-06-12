import {ChooseUsername} from "./chooseUsername.component.ts";
import {Model} from "../../components/model.component";
import {PersonalData} from "./personalData.component";
import {Component} from "@angular/core";
import {NotificationSettings} from "./notifications.component";

@Component({
  templateUrl: 'build/pages/settings/settings.html',
  directives: [ChooseUsername, NotificationSettings, PersonalData]
})
export class SettingsPage {
  constructor(private model: Model) {}

}