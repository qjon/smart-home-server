import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SwitchesListComponent} from './switches-list.component';

describe('SwitchesListComponent', () => {
  let component: SwitchesListComponent;
  let fixture: ComponentFixture<SwitchesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchesListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
