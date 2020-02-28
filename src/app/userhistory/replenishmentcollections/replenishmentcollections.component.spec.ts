import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReplenishmentcollectionsComponent} from './replenishmentcollections.component';

describe('RefundsComponent', () => {
  let component: ReplenishmentcollectionsComponent;
  let fixture: ComponentFixture<ReplenishmentcollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReplenishmentcollectionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplenishmentcollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
