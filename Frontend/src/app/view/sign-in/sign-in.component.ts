import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { data } from 'jquery';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  username = '';
  password = '';
  @ViewChild('txtUsername')
  txtUsername!: ElementRef;
  @ViewChild('frm')
  frmSignIn!: NgForm;
  // @ts-ignore
  socialUser: SocialUser;
  // @ts-ignore
  isLoggedin: boolean;
  profilePicture = null;
  userName = '';
  contactNumber = '';
  gender = '';
  public user: SocialUser = new SocialUser;
  constructor(private userService: UserService, private router: Router,
    private snackBar: MatSnackBar, private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
  }

  authenticate(): void {
    this.userService.authenticate(this.username, this.password)
      .subscribe(token => {
        sessionStorage.setItem(`token`, token.jwt);
        sessionStorage.setItem(`userId`, token.userId);
        sessionStorage.setItem(`profilePicture`, token.profilePicture);
        sessionStorage.setItem(`userName`, token.userName);
        this.userName = token.userName;
        this.router.navigateByUrl('/home');
      }, error => {
        this.snackBar.open('Invalid username and password', 'Dismiss', {
          duration: 1500
        });
        this.username = '';
        this.password = '';
        this.frmSignIn.reset();
        (this.txtUsername.nativeElement as HTMLInputElement).focus();
      });
  }

  navigatetohome(): void {
    this.router.navigateByUrl('/home');
  }

  login(userName: string, password: string): void {
    this.userService.authenticate(userName, password)
      .subscribe(token => {
        sessionStorage.setItem(`token`, token.jwt);
        sessionStorage.setItem(`userId`, token.userId);
        sessionStorage.setItem(`profilePicture`, token.profilePicture);
        sessionStorage.setItem(`userName`, token.userName);
        this.router.navigateByUrl('/home');
      }, error => {
        this.snackBar.open('Invalid username and password', 'Dismiss', {
          duration: 1500
        });
        (this.txtUsername.nativeElement as HTMLInputElement).focus();
      });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      console.log(data)
      this.userService.findUser(data.name).subscribe(value => {
        this.login(data.name, data.id)
      }, error => {
        this.userService.createAccount(data.name, data.email, this.contactNumber, this.gender, data.id).subscribe(value => {
          this.login(data.name, data.id)
        }, error => {
          if (error.status === 400) {
            this.snackBar.open('Invalid details!', 'Dismiss', {
              duration: 2000
            });
            (this.txtUsername.nativeElement as HTMLInputElement).select();
          } else {
            this.snackBar.open('500 Something went wrong!', 'Dismiss', {
              duration: 2000
            });
          }
        });
      });

    });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
      console.log(data)
      this.userService.findUser(data.name).subscribe(value => {
        this.login(data.name, data.id)
      }, error => {
        this.userService.createAccount(data.name, data.email, this.contactNumber, this.gender, data.id).subscribe(value => {
          this.login(data.name, data.id)
        }, error => {
          if (error.status === 400) {
            this.snackBar.open('Invalid details!', 'Dismiss', {
              duration: 2000
            });
            (this.txtUsername.nativeElement as HTMLInputElement).select();
          } else {
            this.snackBar.open('500 Something went wrong!', 'Dismiss', {
              duration: 2000
            });
          }
        });
      });

    });
  }
}
