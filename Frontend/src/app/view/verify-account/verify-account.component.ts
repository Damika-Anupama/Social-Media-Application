import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContainerService } from '@src/app/service/container.service';
import { observerService } from '@src/app/service/observer.service';
import { UserService } from '@src/app/service/user.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  items = this.usercontainer.getItems;
  constructor(
    private userService: UserService,
    private usercontainer: ContainerService
  ) {
  }

  ngOnInit(): void {
    var code = this.generateVerificationCode();
    console.log(this.items);
    // this.userService.sendVerificationCode(code, this.items);
  }
  generateVerificationCode(): number {
    var min = 0, max = 1000000;
    return Math.floor(Math.random() * (max - min + 1) + min);

  }

  createAccount(): void {
    // tally with the verification code
    // then create the account

    // this.userService.createAccount(this.username, this.email, this.gender, this.selectedGender, this.password).subscribe(value => {
    //   this.userService.authenticate(this.username, this.password)
    //   .subscribe(token => {
    //     sessionStorage.setItem(`token`, token.jwt);
    //     sessionStorage.setItem(`userId`, token.userId);
    //     sessionStorage.setItem(`profilePicture`, token.profilePicture);
    //     sessionStorage.setItem(`userName`, token.userName);
    //     this.router.navigateByUrl('/home');
    //   }, error => {
    //     this.snackBar.open('Invalid username and password', 'Dismiss', {
    //       duration: 1500
    //     });
    //     (this.txtUsername.nativeElement as HTMLInputElement).focus();
    //   });
    // }, error => {
    //   if (error.status === 400) {
    //     this.snackBar.open('Invalid details!', 'Dismiss', {
    //       duration: 2000
    //     });
    //     (this.txtUsername.nativeElement as HTMLInputElement).select();
    //   } else {
    //     this.snackBar.open('500 Something went wrong!', 'Dismiss', {
    //       duration: 2000
    //     });
    //   }
    // });
  }
}
