import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from "@angular/router";
import { DateDescendObject } from '@src/app/model/DateDescendObject';
import { Gender } from '@src/app/model/Gender';
import { onlineStatus } from '@src/app/model/OnlineStatus';
import { ProfileObjectType } from '@src/app/model/ProfileObjectType';
import { Relationship } from '@src/app/model/Relationship';
import { Role } from '@src/app/model/Role';
import { observerService } from '@src/app/service/observer.service';
import { UserService } from "@src/app/service/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  message: string = "";
  userId = sessionStorage.getItem('userId');
  // implicitly setting data
  id: Number = 0;
  createdDate: string = '';
  isActive: boolean = false;
  role: Role = Role.USER;
  updatedDate: Date = new Date(2018, 11, 24, 10, 33, 30, 0);
  lastLogin: Date = new Date(2018, 11, 24, 10, 33, 30, 0);
  onlineStatus: onlineStatus = onlineStatus.OFFLINE;
  //explicitly setting data
  username: string = '';
  fullName: string = '';
  gender: Gender = Gender.CUSTOM;
  email: string = '';
  shortDescription: string = '';
  // @ts-ignore
  profilePicture: FileList;
  contactNum: string = '';
  location: string = '';
  education: string = '';
  skills: string = '';
  dob: Date = new Date(2018, 11, 24, 10, 33, 30, 0);
  relationship: Relationship = Relationship.SINGLE;
  dateDescendObjects: DateDescendObject[] = [];
  ht: Map<Date, DateDescendObject[]> = new Map<Date, DateDescendObject[]>();
  dateArr: string[] = [];

  //other details of the user
  noOfCommunities: Number = 0;
  noOfFriends: Number = 0;
  noOfLaunches: Number = 0;
  friendType = ProfileObjectType.FRIEND;
  launchType = ProfileObjectType.LAUNCH;
  communityType = ProfileObjectType.COMMUNITY;
  pageType = ProfileObjectType.PAGE;

  constructor(
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private profileObserver: observerService
  ) {
  }

  ngOnInit(): void {
    this.profileObserver.currentApprovalStageMessage.subscribe(msg => this.message = msg)
    const userId = sessionStorage.getItem("userId");
    this.userService.getProfileInfo(userId).subscribe(value => {
      this.id = value.id;
      this.createdDate = value.createdDate;
      this.isActive = value.isActive;
      this.role = value.role;
      this.updatedDate = value.updatedDate;
      this.lastLogin = value.lastLogin;
      this.onlineStatus = value.onlineStatus;
      this.username = value.username;
      this.fullName = value.fullName;
      this.gender = value.gender;
      this.email = value.email;
      this.shortDescription = value.shortDescription;
      this.profilePicture = value.profilePicture;
      this.contactNum = value.contactNum;
      this.location = value.location;
      this.education = value.education;
      this.skills = value.skills;
      this.dob = value.dob;
      this.relationship = value.relationship;
      this.noOfCommunities = value.noOfCommunities;
      this.noOfFriends = value.noOfFriends;
      this.noOfLaunches = value.noOfLaunches;
      this.dateDescendObjects = value.dateDescendObjects;
      // iterate dateDecendObjects
      value.dateDescendObjects.forEach(e => {
        console.log(e);
        if(!this.dateArr.includes(e.createdDate.substring(0,9))){
          this.dateArr.push(e.createdDate.substring(0,9));
        }
      });
      console.log(this.dateArr)

    }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid details!', 'Dismiss', { duration: 2000 });
      } else {
        this.snackBar.open('500 Something went wrong!', 'Dismiss', { duration: 2000 });
      }
    });
  }
}
