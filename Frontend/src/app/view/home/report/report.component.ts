import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbCarousel, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReportService} from '@src/app/service/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  images = [62, 83, 466, 965, 982, 1043].map((n) => `assets/img/${n}-900x500.jpg`);
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  message = '';
  mediaFile = null;
  // @ts-ignore
  @ViewChild('carousel', {static: true}) carousel: NgbCarousel;
  showDialog = false;
  alertMessage = '';

  constructor(private reportService: ReportService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log(this.message);
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

  inputMediaFile(event: Event): void {
    // @ts-ignore
    this.mediaFile = event.target.files[0];
    if (this.mediaFile != null) {
      this.snackBar.open('Media File Successfully Uploaded 😊', 'Dismiss', {duration: 2000});
    }
  }

  CheckReport(): void {
    if (this.message !== '') {
      if (this.mediaFile == null) {
        this.showDialog = true;
        this.alertMessage = 'Do you want to upload any file with your problem 🤔';
      } else {
        this.SubmitReport();
      }
    } else {
      this.snackBar.open('Please input your problem before you submit', 'Dismiss', {duration: 2000});
    }

  }


  SubmitReport(): void {
    this.reportService.saveReport(this.message, this.mediaFile).subscribe(value => {
      this.snackBar.open('Report Submitted Successfully 😊', 'Dismiss', {duration: 2000});
      this.message = '';
      this.mediaFile = null;
    }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid details!', 'Dismiss', {
          duration: 2000
        });
      } else {
        this.snackBar.open('500 Something went wrong!', 'Dismiss', {
          duration: 2000
        });
      }
    });
  }

  showMessage(): void {
    this.snackBar.open('Then Please upload your file', 'Dismiss', {duration: 2000});
  }
}
