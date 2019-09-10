import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreditwarningComponent} from './creditwarning.component';

describe('CreditwarningComponent', () => {
  let component: CreditwarningComponent;
  let fixture: ComponentFixture<CreditwarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditwarningComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditwarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
