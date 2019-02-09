import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalhistoryComponent } from './globalhistory.component';

describe('GlobalhistoryComponent', () => {
  let component: GlobalhistoryComponent;
  let fixture: ComponentFixture<GlobalhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
