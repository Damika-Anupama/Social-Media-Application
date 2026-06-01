import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  date = new Date();
  currentDate = this.date.getDay() + '-' + this.date.getMonth() + '-' + this.date.getFullYear();
  activeDayFund = 0;
  activeDays = 0;
  peopleReachFund = 0;
  peopleReach = 0;

  constructor() {
    // this.currentDate = this.currentDate.getDate();
  }

  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  ngOnInit(): void {
  }

  pitch1(event: any): void {
    this.activeDayFund = event.value / 200 * 5;
    this.activeDays = event.value / 200;
  }

  pitch2(event: any): void {
    this.peopleReach = event.value;
    this.peopleReachFund = event.value / 200 * 10;
  }

  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];
}
interface Animal {
  name: string;
  sound: string;
}
