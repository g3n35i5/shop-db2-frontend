import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { ShopComponent } from './shop/shop.component';
import { UserhistoryComponent } from './userhistory/userhistory.component';
import { GlobalhistoryComponent } from './globalhistory/globalhistory.component';
import { OfflineComponent } from './offline/offline.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'globalhistory', component: GlobalhistoryComponent },
  { path: 'userhistory/:id', component: UserhistoryComponent },
  { path: 'offline', component: OfflineComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
