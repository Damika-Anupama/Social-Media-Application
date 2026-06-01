import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LaunchService } from '../../../service/launch.service';
import { LaunchBody } from '../../../model/LaunchBody';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@src/environments/environment';
import { EmojiSlider } from 'emoji-slider';
import { CommentService } from '@src/app/service/comment.service';
import { ReactionService } from '@src/app/service/reaction.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  @ViewChild('commentBox') searchElement: ElementRef | undefined;

  visibleImage = true;
  imageSrc = '';
  visibleVideo = false;
  videoSrc = '';
  visibleAudio = false;
  audioSrc = '';
  description = '';
  emoji = '😉';
  emojis = ['😃', '😍', '😴', '😎', '😡', '🥶', '😞', '🤔', '😶'];

  launches: LaunchBody[] = [];
  launch!: LaunchBody;
  imgSrc = '';
  reactColor = 'black';
  changeReact = false;
  react = 'favorite';
  reacts = ['favorite', 'local_fire_department', 'sentiment_very_dissatisfied', 'auto_awesome', 'sick'];
  // @ts-ignore
  mediaFile: FileList;
  launchImg = '';
  userDP = environment.defaultDP;
  myDP = sessionStorage.getItem('profilePicture')
  myUserId = sessionStorage.getItem('userId')
  commentBox: any;
  comment = '';
  isEmojiPickerVisible: boolean = false;
  commentBoxValue = '';

  constructor(
    public launchService: LaunchService, 
    private snackBar: MatSnackBar,
    private commentService:CommentService,
    private reactionService:ReactionService
    ) {
  }
  getFocus():void{
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      // @ts-ignore
      this.searchElement.nativeElement.focus();
    },0);
  }

  ngOnInit(): void {
    this.launchService.getAllLaunches().subscribe(launch => {
      this.launches = launch;
      console.log(launch);
    }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid details!', 'Dismiss', { duration: 2000 });
      } else {
        this.snackBar.open('500 Something went wrong!', 'Dismiss', { duration: 2000 });
      }
    });
  }

  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
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

  changeColor(launchId: Number): void {
    this.changeReact = !(this.changeReact);
    if (!this.changeReact) {
      this.reactColor = 'black';
      this.react = 'favorite';
    } else {
      this.reactColor = 'warn';
    }
    this.reactionService.saveReaction(this.react, launchId).subscribe(value => {
      location.reload();
    }, error => {
      if (error.status === 400) {
        alert("Invalid details!")
        // this.snackBar.open('Invalid details!', 'Dismiss', {duration: 2000});
      } else {
        alert('500 Something went wrong!')
        // this.snackBar.open('500 Something went wrong!', 'Dismiss', {duration: 2000});
      }
    });
  }

  changeReactType(react: string): void {
    this.react = react;
    this.reactColor = 'warn';
    this.changeReact = true;
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
    }, error => {
      if (error.status === 400) {
        alert("Invalid details!")
        // this.snackBar.open('Invalid details!', 'Dismiss', {duration: 2000});
      } else {
        alert('500 Something went wrong!')
        // this.snackBar.open('500 Something went wrong!', 'Dismiss', {duration: 2000});
      }
    });
  }

  addEmoji(emoji: any): void {
    this.emoji = emoji;
  }
  addCommentEmoji(emoji:any):void{
    this.commentBoxValue = this.commentBoxValue + emoji.emoji.native;
  }
  saveComment(comment:string,launchId: Number):void{
    this.commentService.saveComment(comment, launchId).subscribe(value => {
      location.reload();
    }, error => {
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
