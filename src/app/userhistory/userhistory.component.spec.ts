import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhistoryComponent } from './userhistory.component';

describe('UserhistoryComponent', () => {
  let component: UserhistoryComponent;
  let fixture: ComponentFixture<UserhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
