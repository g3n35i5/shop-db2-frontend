import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AvatarModule} from 'ng2-avatar';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {AngularStickyThingsModule} from '@w11k/angular-sticky-things';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {CustomCurrency, CustomTimestamp} from './filters';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MaterialModule} from './material/material.module';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SettingsComponent} from './settings/settings.component';
import {LoginComponent} from './login/login.component';
import {LoadingComponent} from './loading/loading.component';
import {ShopComponent} from './shop/shop.component';
import {CartComponent} from './shop/cart/cart.component';
import {ProductsComponent} from './shop/products/products.component';
import {ProductItemComponent} from './shop/products/product-item/product-item.component';
import {FavoriteItemComponent} from './shop/products/favorite-item/favorite-item.component';
import {UserhistoryComponent} from './userhistory/userhistory.component';
import {DepositsComponent} from './userhistory/deposits/deposits.component';
import {PurchasesComponent} from './userhistory/purchases/purchases.component';
import {ReplenishmentcollectionsComponent} from './userhistory/replenishmentcollections/replenishmentcollections.component';
import {CreditwarningComponent} from './shop/dialogs/creditwarning/creditwarning.component';
import {GlobalhistoryComponent} from './globalhistory/globalhistory.component';
import {RegisterComponent} from './register/register.component';
import {InterceptorComponent} from './services/interceptor/interceptor.component';
import {MessageComponent} from './message/message.component';
import {UserstatisticsComponent} from './userstatistics/userstatistics.component';
import {ChartComponent} from './userstatistics/chart/chart.component';

@NgModule({
  declarations: [
    CustomCurrency,
    CustomTimestamp,
    AppComponent,
    SettingsComponent,
    LoginComponent,
    LoadingComponent,
    ShopComponent,
    CartComponent,
    ProductsComponent,
    ProductItemComponent,
    FavoriteItemComponent,
    UserhistoryComponent,
    DepositsComponent,
    PurchasesComponent,
    ReplenishmentcollectionsComponent,
    CreditwarningComponent,
    GlobalhistoryComponent,
    RegisterComponent,
    MessageComponent,
    UserstatisticsComponent,
    ChartComponent
  ],
  imports: [
    AvatarModule.forRoot(),
    ScrollToModule.forRoot(),
    AngularStickyThingsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorComponent,
      multi: true,
    }
  ],
  entryComponents: [
    CreditwarningComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
}
