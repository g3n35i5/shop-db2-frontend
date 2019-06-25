import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstatisticsComponent } from './userstatistics.component';

describe('UserstatisticsComponent', () => {
  let component: UserstatisticsComponent;
  let fixture: ComponentFixture<UserstatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
