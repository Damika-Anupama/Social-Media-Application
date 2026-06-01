import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LaunchBody } from '@src/app/model/LaunchBody';
import { communityService } from '@src/app/service/community.service';
import { observerService } from '@src/app/service/observer.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  launches: LaunchBody[] = [];
  launch!: LaunchBody;
  imgSrc = '';
  reactColor = 'black';

  changeReact = false;
  react = 'favorite';
  reacts = ['favorite', 'local_fire_department', 'sentiment_very_dissatisfied', 'auto_awesome', 'sick'];
  visibleImage = true;
  imageSrc = '';
  visibleVideo = false;
  videoSrc = '';
  visibleAudio = false;
  audioSrc = '';
  description = '';
  emoji = '😉';
  emojis = ['😃', '😍', '😴', '😎', '😡', '🥶', '😞', '🤔', '😶'];
  communityId = '';
  heading: any;

  constructor(
    private snackBar:MatSnackBar,
    private observer: observerService,
    private communityService:communityService
    ) { }

  ngOnInit(): void {
    this.observer.currentApprovalStageMessage.subscribe(msg => this.communityId = msg)
    this.communityService.getCommunityDetails(this.communityId).subscribe(value => {
      console.log(value);
    }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid details!', 'Dismiss', {duration: 2000});
      } else {
        this.snackBar.open('500 Something went wrong!', 'Dismiss', {duration: 2000});
      }
    });
  }

  changeColor(): void {
    this.changeReact = !(this.changeReact);
    if (!this.changeReact) {
      this.reactColor = 'black';
      this.react = 'favorite';
    } else {
      this.reactColor = 'warn';
    }
  }

  changeReactType(react: string): void {
    this.react = react;
    this.reactColor = 'warn';
    this.changeReact = true;
  }

  // for image upload
  readURL(event: Event): void {
    // @ts-ignore
    const file = event.target.files[0];
    if (file.size / 1000000 > 100) {
      this.snackBar.open('The input media should be less than 100MB 🤕', 'Dismiss', {duration: 2000});
      return;
    }
    // @ts-ignore
    this.mediaFile = event.target.files[0];
    // @ts-ignore
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const mediaType = file.type.substring(0, 5);
      if (mediaType === 'image') {
        this.visibleImage = true;
        this.visibleAudio = false;
        this.visibleVideo = false;
        this.videoSrc = '';
        this.audioSrc = '';
        // @ts-ignore
        reader.onload = e => this.imageSrc = reader.result;
      } else if (mediaType === 'video') {
        this.visibleVideo = true;
        this.visibleImage = false;
        this.visibleAudio = false;
        this.imageSrc = '';
        this.audioSrc = '';
        // @ts-ignore
        reader.onload = e => this.videoSrc = reader.result;
      } else if (mediaType === 'audio') {
        this.visibleAudio = true;
        this.visibleVideo = false;
        this.visibleImage = false;
        this.imageSrc = '';
        this.videoSrc = '';
        // @ts-ignore
        reader.onload = e => this.audioSrc = reader.result;
      }
      reader.readAsDataURL(file);
    }
  }
  addEmoji(emoji: any): void {
    this.emoji = emoji;
  }
  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  pitch(event: any): void {
    if (event.value === 1000) {
      if (this.description !== '' && this.imageSrc !== '' && this.emoji !== '') {
        this.createLaunch();
      } else {
        this.snackBar.open('Please complete all items before launch', 'Dismiss', {duration: 2000});
      }
    }
  }
  createLaunch(): void {
    // @ts-ignore
    this.launchService.createLaunch(this.mediaFile, this.description, this.emoji).subscribe(value => {
      alert("Congratulations 🤠\n Launch created Successfully !!")
      // this.snackBar.open('Congratulations 🤠\n Launch created Successfully !!', 'Dismiss', {duration: 2000});

      // this.mediaFile = null;
      this.description = '';
      this.emoji = '😉'; //default emoji
    }, (error: { status: number; }) => {
      if (error.status === 400) {
        alert("Invalid details!")
        // this.snackBar.open('Invalid details!', 'Dismiss', {duration: 2000});
      } else {
        alert('500 Something went wrong!')
        // this.snackBar.open('500 Something went wrong!', 'Dismiss', {duration: 2000});
      }
    });
  }
}
