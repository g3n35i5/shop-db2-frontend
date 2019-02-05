import { Component, OnInit } from '@angular/core';
import { BinarySettingsItem } from '../interfaces/binarysettingsitem';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public settings: BinarySettingsItem[];

  constructor(
    private settingsService: SettingsService
  ) {
    this.settings = [
      {
        storageID: 'redirectAfterPurchase',
        name: 'Redirect after purchase',
        description: 'Choose if you want to go back to the start page after ' +
          'a purchase or if you prefer to stay in the shop.',
        state: null,
        default: true
      },
      {
        storageID: 'useDarkTheme',
        name: 'Use dark theme',
        description: 'Choose if you want to use the dark theme.',
        state: null,
        default: false
      }
    ];

    /** Set all initial states. **/
    for (const item of this.settings) {
      item.state = this.getState(item);
    }
  }

  ngOnInit() {
  }

  getState(item: BinarySettingsItem): boolean {
    return this.settingsService.getState(item);
  }

  setState(item: BinarySettingsItem): void {
    this.settingsService.setState(item);
  }

}
