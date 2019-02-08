import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AvatarModule } from 'ng2-avatar';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CustomCurrency } from './filters';
import { CustomTimestamp } from './filters';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { LoadingComponent } from './loading/loading.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './shop/cart/cart.component';
import { ProductsComponent } from './shop/products/products.component';
import { ProductItemComponent } from './shop/products/product-item/product-item.component';
import { FavoriteItemComponent } from './shop/products/favorite-item/favorite-item.component';

@NgModule({
  declarations: [
    CustomCurrency,
    CustomTimestamp,
    AppComponent,
    SettingsComponent,
    LoginComponent,
    PageNotFoundComponent,
    LoadingComponent,
    ShopComponent,
    CartComponent,
    ProductsComponent,
    ProductItemComponent,
    FavoriteItemComponent
  ],
  imports: [
    AvatarModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
}
