import {Component} from "@angular/core";
import {ToastController} from "ionic-angular/index";
import {Model} from "../../components/model.component.ts";
import {AuthService} from "../../services/auth.service.ts";

@Component({
  selector: 'notifications',
  templateUrl: 'build/pages/settings/notifications.html'
})
export class NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  expanded: boolean = false;

  constructor(private model: Model,
              private authService: AuthService,
              private toastController: ToastController) {
    this.enabled = model.user.notifications;
    this.soundEnabled = model.user.notificationsSound;
    this.vibrationEnabled = model.user.notificationsVibration;
  }

  dataUnchanged(): boolean {
    return this.model.user.notifications == this.enabled &&
      this.model.user.notificationsSound == this.soundEnabled &&
      this.model.user.notificationsVibration == this.vibrationEnabled;
  }

  doSubmit() {
    this.authService.postNotification(this.enabled, this.soundEnabled, this.vibrationEnabled).subscribe(() => {
      this.toastController.create({
        message: 'Push Notification settings saved',
        duration: 2000
      }).present();
    }, err => console.log(err))
  }
}