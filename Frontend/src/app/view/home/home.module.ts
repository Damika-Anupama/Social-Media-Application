import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AdsComponent } from '@src/app/view/home/ads/ads.component';
import { ChatterBoxComponent } from '@src/app/view/home/chatter-box/chatter-box.component';
import { CommunityRoutingModule } from '@src/app/view/home/community/community-routing.module';
import { CommunityComponent } from '@src/app/view/home/community/community.component';
import { CommunityModule } from '@src/app/view/home/community/community.module';
import { ComradesComponent } from '@src/app/view/home/comrades/comrades.component';
import { DashboardComponent } from '@src/app/view/home/dashboard/dashboard.component';
import { HomeRoutingModule } from '@src/app/view/home/home-routing.module';
import { LaunchComponent } from '@src/app/view/home/launch/launch.component';
import { ProfileComponent } from '@src/app/view/home/profile/profile.component';
import { ReportComponent } from '@src/app/view/home/report/report.component';
import { SettingsComponent } from '@src/app/view/home/settings/settings.component';
import { ShopComponent } from '@src/app/view/home/shop/shop.component';
import { SuggestionsComponent } from '@src/app/view/home/suggestions/suggestions.component';
import { environment } from '@src/environments/environment';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';


/* material modules imports */
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DonateComponent } from './donate/donate.component';
import { GamesComponent } from './games/games.component';
import { MoreInfoComponent } from './more-info/more-info.component';
import { PagesComponent } from './pages/pages.component';
import { GamesModule } from './games/games.module';
import { GamesRoutingModule } from './games/games-routing.module';
import { AdModule } from './ads/ads.module';
import { AdsRoutingModule } from './ads/ads-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    SettingsComponent,
    LaunchComponent,
    AdsComponent,
    ReportComponent,
    SuggestionsComponent,
    ChatterBoxComponent,
    ComradesComponent,
    ShopComponent,
    CommunityComponent,
    PagesComponent,
    ContactUsComponent,
    DonateComponent,
    MoreInfoComponent,
    GamesComponent
  ], exports: [
    // MatSlideToggleModule,
  ],
  imports: [
    // MatSlideToggleModule,
    HomeRoutingModule,
    MatSliderModule,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatSnackBarModule,
    FormsModule,
    PickerModule,
    // BrowserModule,
    CommonModule,
    NgbCarouselModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    CommunityModule,
    CommunityRoutingModule,
    GamesModule,
    GamesRoutingModule,
    AdModule,
    AdsRoutingModule,
    MatDialogModule,
    // BrowserAnimationsModule,
    NgProgressModule.withConfig({
      color: 'red'
    }),
    NgProgressHttpModule.withConfig({
      silentApis: [environment.baseUrl + `/**`]
    }),
  ],
  providers: []
})
export class HomeModule {
}
