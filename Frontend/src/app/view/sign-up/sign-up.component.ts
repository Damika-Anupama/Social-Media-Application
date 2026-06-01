import { Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { ContainerService } from '@src/app/service/container.service';

declare var require: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})


export class SignUpComponent implements OnInit, DoCheck {
  username = '';
  email = '';
  gender = ""
  dob = ""
  password = '';

  confirmPassword = '';
  @ViewChild('txtUsername')
  txtUsername!: ElementRef;
  userExists = false;
  emailExists = false;
  selectedGender = '';
  color: ThemePalette = 'accent';
  showUserPic = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private usercontainer: ContainerService
  ) {
  }

  ngOnInit(): void {
  }

  verifyAccount(): void {
      // this.usercontainer.addToCart(this.username);
      // this.usercontainer.addToCart(this.email);
      // this.usercontainer.addToCart(this.gender);
      // this.usercontainer.addToCart(this.dob);
      // this.usercontainer.addToCart(this.password);
    this.router.navigateByUrl('/verify-account');
  }

  ngDoCheck(): void {
  }

  findUser(): void {
    this.userService.findUser(this.username).subscribe(value => {
      this.userExists = true;
    }, error => {
      this.userExists = false;
    });
  }

  findEmail(): void {
    this.userService.findEmail(this.email).subscribe(value => {
      this.emailExists = true;
    }, error => {
      this.emailExists = false;
    });
  }
}
