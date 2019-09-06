import { Injectable } from '@angular/core';
import { BinarySettingsItem } from '../interfaces/binarysettingsitem';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly settings: BinarySettingsItem[];

  constructor() {
    this.settings = [
      {
        storageID: 'redirectAfterPurchase',
        name: 'Redirect after purchase',
        description: 'Choose if you want to go back to the start page after ' +
          'a purchase or if you prefer to stay in the shop.',
        state: null,
        default: true,
        icon: 'keyboard_backspace'
      },
      {
        storageID: 'sortByLastname',
        name: 'Sort users by lastname',
        description: 'Select whether you want to sort users by their lastname.',
        state: null,
        default: false,
        icon: 'sort'
      },
      {
        storageID: 'useDarkTheme',
        name: 'Use dark theme',
        description: 'Choose if you want to use the dark theme.',
        state: null,
        default: true,
        icon: 'invert_colors'
      },
      {
        storageID: 'fullscreen',
        name: 'Fullscreen',
        description: 'Choose if you want to run shop-db2 in fullscreen mode.',
        state: null,
        default: true,
        icon: 'fullscreen'
      }
    ];

    /** Set all initial states. **/
    for (const item of this.settings) {
      item.state = this.getState(item);
      this.setState(item);
    }
  }

  private settingsSubject = new Subject<BinarySettingsItem>();
  BinarySettingsItemState = this.settingsSubject.asObservable();

  /**
   * Get all settings.
   */
  public getSettings(): BinarySettingsItem[] {
    return this.settings;
  }

  /**
   * Get the current state of a settings item or null.
   * @param id is the settings identifier.
   */
  public getStateByID(id: string): boolean {
    return this.getState(this.getItemByID(id));
  }

  /**
   * Returns the full settings item by ID
   * @param id is the settings identifier.
   */
  public getItemByID(id: string): BinarySettingsItem {
    return this.settings.find(s => s.storageID === id);
  }

  /**
   * Get the current state of a settings item. If there is no entry in the
   * local storage, the default value will be used instead.
   *
   * @param item is the settings item
   */
  public getState(item: BinarySettingsItem): boolean {
    const DEFAULT = item.default;
    const result = JSON.parse(localStorage.getItem(item.storageID));
    return result !== null ? result : DEFAULT;
  }

  /**
   * Save the setting of the given item.
   *
   * @param item is the item which value has to be stored.
   */
  public setState(item: BinarySettingsItem): void {
    localStorage.setItem(item.storageID, this.getState(item).toString());
    this.settingsSubject.next(<BinarySettingsItem>item);
  }
}
