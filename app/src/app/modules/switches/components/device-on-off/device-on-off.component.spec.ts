import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnOffComponent } from './device-on-off.component';

describe('DeviceOnOffComponent', () => {
  let component: DeviceOnOffComponent;
  let fixture: ComponentFixture<DeviceOnOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
