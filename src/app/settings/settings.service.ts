import { Injectable } from '@angular/core';
import { BinarySettingsItem } from '../interfaces/binarysettingsitem';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  private settingsSubject = new Subject<BinarySettingsItem>();
  BinarySettingsItemState = this.settingsSubject.asObservable();

  /**
   * Get the current state of a settings item or null.
   * @param id is the settings identifier.
   */
  public getStateByID(id: string): boolean {
    return JSON.parse(localStorage.getItem(id));
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
    return typeof result !== null ? result : DEFAULT;
  }

  /**
   * Save the setting of the given item.
   *
   * @param item is the item which value has to be stored.
   */
  public setState(item: BinarySettingsItem): void {
    this.settingsSubject.next(<BinarySettingsItem>item);
    localStorage.setItem(item.storageID, item.state.toString());
  }
}
