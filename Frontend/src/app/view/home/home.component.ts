import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { observerService } from '@src/app/service/observer.service';
import { UserService } from "@src/app/service/user.service";
import { environment } from '@src/environments/environment';
import { SocialAuthService } from 'angularx-social-login';
import { SearchTabComponent } from '../pop-ups/search-tab/search-tab.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profilePic: string | undefined;
  defaultDP = environment.defaultDP;
  userName = sessionStorage.getItem('userName') || '{}';
  userId = sessionStorage.getItem('userId') || '{}';

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private authService: SocialAuthService,
    private profileObserver: observerService
  ) {
  }



  ngOnInit(): void {
    // @ts-ignore// @ts-ignore
    this.profilePic = sessionStorage.getItem('profilePicture');

  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      // 'top': '0',
      // left: '0',
      // right: '0',
      // bottom: '0'
    };


    this.dialog.open(SearchTabComponent, dialogConfig);

  }
  gotoads(): void {
    this.router.navigateByUrl('/home/ads')
  }
  gotosuggestions(): void {
    this.router.navigateByUrl('/home/suggestions')
  }

  gotocontactus(): void {
    this.router.navigateByUrl('/home/contact-us')
  }

  gotodonate(): void {
    this.router.navigateByUrl('/home/donate')
  }

  gotoreport(): void {
    this.router.navigateByUrl('/home/report')
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.authService.signOut();
    this.router.navigateByUrl('/welcome')
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  gotoProfile(): void {
    this.profileObserver.updateApprovalMessage(this.userId);
    this.router.navigateByUrl('/home/profile')
  }
  gotoSettings(): void {
    this.router.navigateByUrl('/home/settings')
  }
  getStatus(): void {

  }
}
