import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {CommunityRoutingModule} from '@src/app/view/home/community/community-routing.module';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuComponent} from '@src/app/view/home/community/menu/menu.component';
import {PageComponent} from '@src/app/view/home/community/page/page.component';
import {BuildComponent} from '@src/app/view/home/community/build/build.component';
import {FormsModule} from "@angular/forms";
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { HomeRoutingModule } from '../home-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    MenuComponent,
    PageComponent,
    BuildComponent
    ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatSliderModule,
    NgbCarouselModule,
    CommunityRoutingModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    HomeRoutingModule,
    MatSnackBarModule,
    PickerModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class CommunityModule { }
