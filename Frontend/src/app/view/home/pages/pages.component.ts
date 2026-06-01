import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  images = [62, 83, 466, 965, 982, 1043].map((n) => `assets/img/${n}-900x500.jpg`);
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  // @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  step = 0;
  constructor() { }

  ngOnInit(): void {
  }
  // togglePaused(): void {
  //   if (this.paused) {
  //     this.carousel.cycle();
  //   } else {
  //     this.carousel.pause();
  //   }
  //   this.paused = !this.paused;
  // }
  // onSlide(slideEvent: NgbSlideEvent): void {
  //   if (this.unpauseOnArrow && slideEvent.paused &&
  //     (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
  //     this.togglePaused();
  //   }
  //   if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
  //     this.togglePaused();
  //   }
  // }


}
