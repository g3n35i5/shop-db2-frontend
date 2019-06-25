import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { ShopComponent } from './shop/shop.component';
import { UserhistoryComponent } from './userhistory/userhistory.component';
import { GlobalhistoryComponent } from './globalhistory/globalhistory.component';
import { RegisterComponent } from './register/register.component';
import { MessageComponent } from './message/message.component';
import { UserstatisticsComponent } from './userstatistics/userstatistics.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'globalhistory', component: GlobalhistoryComponent },
  { path: 'userhistory/:id', component: UserhistoryComponent },
  { path: 'statistics/user/:id', component: UserstatisticsComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'maintenance', component: MessageComponent, data: {case: 'maintenance'}, pathMatch: 'full' },
  { path: 'offline', component: MessageComponent, data: {case: 'offline'}, pathMatch: 'full' },
  { path: '**', component: MessageComponent, data: {case: 'pagenotfound'}, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
