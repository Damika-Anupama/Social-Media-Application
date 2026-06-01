import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import {MatDialog} from '@angular/material/dialog';
// import { searchCommunityContentComponent } from './searchCommunityDialogBox/searchCommunityContent.component';
import { communityService } from '@src/app/service/community.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComBody } from '@src/app/model/ComBody';
import { observerService } from '@src/app/service/observer.service';
import { ObserversModule } from '@angular/cdk/observers';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  images = [62, 83, 466, 965, 982, 1043].map((n) => `assets/img/${n}-900x500.jpg`);
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  communityBodies: ComBody[] = [];
  declare communityBody: ComBody;
  // @ts-ignore
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  step = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private communityService: communityService, 
    private snackBar:MatSnackBar,
    private observer:observerService
    ) {
  }

  ngOnInit(): void {
    //@ts-ignore 
    this.communityService.getAllCommunities().subscribe(value => {
      console.log(value);
      this.communityBodies  = value;
      }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid details!', 'Dismiss', { duration: 2000 });
      } else {
        this.snackBar.open('500 Something went wrong!', 'Dismiss', { duration: 2000 });
      }
    });
  }

  togglePaused(): void {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent): void {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  routToBuildPage(): void {
    this.router.navigateByUrl('/home/com/build');
  }
  openPage(community: any):void{
    this.observer.updateApprovalMessage(community.communityId +"");
    this.router.navigateByUrl('/home/com/page/' + community.communityId)
  }
}
