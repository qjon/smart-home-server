import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBoxComponent } from './device-box.component';

describe('DeviceBoxComponent', () => {
  let component: DeviceBoxComponent;
  let fixture: ComponentFixture<DeviceBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
