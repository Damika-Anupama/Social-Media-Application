import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComradesComponent } from './comrades.component';

describe('ComradesComponent', () => {
  let component: ComradesComponent;
  let fixture: ComponentFixture<ComradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
