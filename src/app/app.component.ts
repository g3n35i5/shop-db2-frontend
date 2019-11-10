import {Component} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {SettingsService} from './settings/settings.service';
import {DataService} from './services/data.service';
import {BinarySettingsItem} from './interfaces/binarysettingsitem';
import * as screenfull from 'screenfull';
import {Screenfull} from 'screenfull';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public useDarkTheme = true;
  private settingsSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private dataService: DataService,
    private snackbar: MatSnackBar
  ) {

    const useDarkTheme = this.settingsService.getStateByID('useDarkTheme');
    this.useDarkTheme = useDarkTheme === null ? false : useDarkTheme;

    // Subscribe to changes of the settings service
    this.settingsSubscription = this.settingsService.BinarySettingsItemState
      .subscribe((item: BinarySettingsItem) => {
        this.checkForDarkTheme(item);
        this.checkForFullscreen(item);
      });

    // Set initial states
    this.checkForDarkTheme(this.settingsService.getItemByID('useDarkTheme'));
    if (!(<Screenfull>screenfull).isFullscreen && this.settingsService.getStateByID('fullscreen')) {
      this.askForFullscreen();
    }

    // Each 5 seconds, check the backend online status but suppress any console output on failure.
    interval(5000).subscribe(() => {
      this.dataService.backendOnline().subscribe(() => {}, () => {});
    });
  }

  askForFullscreen() {
    this.snackbar.open('Switch to fullscreen?', 'Yes', {duration: 5000}).onAction().subscribe(() => {
      this.checkForFullscreen(this.settingsService.getItemByID('fullscreen'));
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

  /**
   * Each time a settings item gets changed this function evaluates, whether
   * to toggle the fullscreen mode.
   * @param item is the settings item.
   */
  checkForFullscreen(item: BinarySettingsItem): void {
    if (item.storageID === 'fullscreen') {
      if (item.state !== (<Screenfull>screenfull).isFullscreen) {
        if ((<Screenfull>screenfull).enabled) {
          (<Screenfull>screenfull).toggle();
        }
      }
    }
  }
}
