import {Component, OnInit} from '@angular/core';
import {BinarySettingsItem} from '../interfaces/binarysettingsitem';
import {SettingsService} from './settings.service';

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
    this.settings = this.settingsService.getSettings();
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
