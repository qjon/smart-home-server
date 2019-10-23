import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchStatusComponent } from './switch-status.component';

describe('SwitchStatusComponent', () => {
  let component: SwitchStatusComponent;
  let fixture: ComponentFixture<SwitchStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
