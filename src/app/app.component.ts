import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from './settings/settings.service';
import {BinarySettingsItem} from './interfaces/binarysettingsitem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public useDarkTheme = true;
  private settingsSubscription: Subscription;

  constructor(
    private settingsService: SettingsService
  ) {

    const useDarkTheme = this.settingsService.getStateByID('useDarkTheme');
    this.useDarkTheme = useDarkTheme === null ? false : useDarkTheme;

    this.settingsSubscription = this.settingsService.BinarySettingsItemState
      .subscribe((item: BinarySettingsItem) => {
        this.checkForDarkTheme(item);
      });
  }

  /**
   * Each time a settings item gets changed this function evaluates, whether
   * to toggle the dark theme.
   * @param item is the settings item.
   */
  checkForDarkTheme(item: BinarySettingsItem): void {
    if (item.storageID === 'useDarkTheme') {
      this.useDarkTheme = item.state;
    }
  }
}
