import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CreditwarningComponent } from './dialogs/creditwarning/creditwarning.component';
import { ShopService } from './shop.service';
import { Subscription } from 'rxjs';
import { CartItem } from '../interfaces/cartitem';
import { CartState } from '../interfaces/cartstate';
import { User } from '../interfaces/user';
import {ShopState} from '../interfaces/shopstate';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  private userID: number;
  private firstVisit: boolean;
  private shopSubscription: Subscription;
  private cartSubscription: Subscription;

  public loaded: boolean;
  public disableInput: boolean;
  public cart: CartItem[];
  public user: User;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe(params => {
      this.userID = params['id'];
      this.shopService.switchUser(this.userID);
    });
}

  ngOnInit() {
    this.firstVisit = true;
    this.shopSubscription = this.shopService.shopState.subscribe((state: ShopState) => {
      this.loaded = state.loaded;
      this.user = state.user;
      if (this.user.credit < 0 && this.firstVisit) {
        this.openCreditWarning();
      }
    });
    this.cartSubscription = this.shopService.cartState.subscribe((state: CartState) => {
      this.disableInput = state.disableInput;
    });
  }

  ngOnDestroy() {
    this.shopSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  submitCart(): void {
    this.shopService.submitCart();
  }

  deleteCart(): void {
    this.shopService.deleteCart();
  }

  numberOfCartItems(): number {
    return this.shopService.numberOfCartItems();
  }

  cartIsEmpty(): boolean {
    return this.shopService.cartIsEmpty();
  }

  getUsername(): string {
    return this.shopService.getUsername();
  }

  /** Opens the credit warning dialog. **/
  openCreditWarning(): void {
    const dialogRef = this.dialog.open(CreditwarningComponent, {
      width: '400px',
      data: {
        credit: this.user.credit,
        debtLimit: this.shopService.getDebtLimit()
      },
      // This prevents the dialog from being closed before the time has expired.
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      // We set firstVisit to false so that the dialog is not reopened when the user is updated.
      this.firstVisit = false;
    });
  }
}
