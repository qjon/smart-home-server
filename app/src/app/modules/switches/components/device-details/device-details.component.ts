import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { DeviceDetailsStateConnectorService } from '../../store/state-connectors/device-details-state-connector.service';
import { SwitchDeviceModel } from '../../models/switch-device-model';
import { SwitchDeviceChangeSettingsDto } from '../../interfaces/switch-device.interface';
import { Actions, ofType } from '@ngrx/effects';
import { SwitchActionTypes } from '../../store/switches-actions';
import { Observable, ReplaySubject } from 'rxjs';
import { RoomsStateConnectorService } from '../../../rooms/store/state-connectors/rooms-state-connector.service';
import { RoomDto } from '../../../rooms/interfaces/room-dto.interface';

@Component({
  selector: 'sh-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public switches: FormGroup;

  public device: SwitchDeviceModel;

  public isEditMode = false;

  public deviceModels: string[] = [
    'CW-001',
    'S26E',
    'T1EU',
    'T1EU1C',
  ];
  public actionButtonsDisabled = false;

  public destroy$ = new ReplaySubject<void>();

  public rooms$: Observable<RoomDto[]>;

  public isScheduleOpen = true;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private deviceDetailsStateConnectorService: DeviceDetailsStateConnectorService,
              private roomsStateConnectorService: RoomsStateConnectorService,
              private actions$: Actions) {
  }

  public ngOnDestroy(): void {
    this.deviceDetailsStateConnectorService.setCurrentDeviceId(null);

    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.rooms$ = this.getRooms$();

    this.createForm();
    this.disableForm();

    this.onDeviceIdChange();

    const device$ =
      this.deviceDetailsStateConnectorService.device$
        .pipe(
          take(1), // not refresh form if update from device arrived
          takeUntil(this.destroy$),
        );

    this.onDeviceIdChangeResetForm(device$);
    this.onSubmitError();
    this.onSubmitSuccess(device$);

  }

  public clearRoom($event: MouseEvent) {
    $event.stopPropagation();

    this.form.controls['room'].setValue(null);
  }

  public compareRoom(optionItem: RoomDto, value: RoomDto): boolean {
    return value ? optionItem.id === value.id : false;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.disableForm();
      this.disableActionButtons();
      this.deviceDetailsStateConnectorService.update(this.device.id, this.prepareValuesToSend(this.form.value));
    }
  }

  public cancelEditMode(): void {
    this.isEditMode = false;
    this.form.reset(this.prepareFormValues(this.device));
    this.disableForm();
  }

  public openEditMode(): void {
    this.isEditMode = true;
    this.enableForm();
  }

  public openSchedule(): void {
    this.isScheduleOpen = true;
  }

  public hideSchedule(): void {
    this.isScheduleOpen = false;
  }

  private onSubmitError() {
    this.actions$
      .pipe(
        ofType(SwitchActionTypes.ChangeSettingsError),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.enableActionButtons();
      });
  }

  private onSubmitSuccess(device$) {
    this.actions$
      .pipe(
        ofType(SwitchActionTypes.ChangeSettingsSuccess),
        switchMap(() => device$),
        takeUntil(this.destroy$),
      )
      .subscribe((device: SwitchDeviceModel) => {
        this.device = device;
        this.form.reset(this.prepareFormValues(device));

        this.disableForm();
        this.isEditMode = false;
        this.enableActionButtons();
      });
  }

  private onDeviceIdChangeResetForm(device$) {
    device$
      .subscribe((device: SwitchDeviceModel) => {
        this.device = device;

        this.form.reset(this.prepareFormValues(device));
      });
  }

  private onDeviceIdChange() {
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => this.deviceDetailsStateConnectorService.setCurrentDeviceId(id));
  }


  private createForm() {
    this.switches = this.fb.group({
      0: [null, [Validators.required, Validators.maxLength(50)]],
      1: [null, [Validators.required, Validators.maxLength(50)]],
      2: [null, [Validators.required, Validators.maxLength(50)]],
      3: [null, [Validators.required, Validators.maxLength(50)]],
    });

    this.form = this.fb.group({
      deviceId: [null],
      name: [null, [Validators.required, Validators.maxLength(50)]],
      apiKey: [null, [Validators.required, Validators.maxLength(100)]],
      model: [null, [Validators.required, Validators.maxLength(50)]],
      room: [null],
      isSingleSwitch: [{ value: null, disabled: true }],
      switches: this.switches,
    });
  }

  private getRooms$() {
    return this.roomsStateConnectorService.rooms$
      .pipe(
        map((items) => items.map((item) => {
          return { id: item.id, name: item.name };
        })),
      );
  }

  private disableForm(): void {
    this.form.disable();
  }

  private enableForm(): void {
    this.form.enable();
    this.form.controls['isSingleSwitch'].disable();
    this.form.controls['deviceId'].disable();

    for (let i = this.device.switches.length; i < 4; i++) {
      this.switches.controls[i].disable();
    }
  }

  private prepareFormValues(device: SwitchDeviceModel): { [key: string]: any } {
    console.log(device);
    return {
      name: device.name,
      deviceId: device.id,
      apiKey: device.apiKey,
      model: device.model,
      isSingleSwitch: device.isSingleSwitch,
      room: device.isAssignedToRoom ? { id: device.roomId, name: device.roomName } : null,
      switches: {
        0: device.getOutlet(0).name,
        1: device.getOutlet(1) ? device.getOutlet(1).name : null,
        2: device.getOutlet(2) ? device.getOutlet(2).name : null,
        3: device.getOutlet(3) ? device.getOutlet(3).name : null,
      },
    };
  }

  private prepareValuesToSend(value: any): SwitchDeviceChangeSettingsDto {
    const switches = [
      { outlet: 0, name: this.switches.controls[0].value },
      { outlet: 1, name: this.switches.controls[1].value },
      { outlet: 2, name: this.switches.controls[2].value },
      { outlet: 3, name: this.switches.controls[3].value },
    ];

    return {
      name: value.name,
      apiKey: value.apiKey,
      model: value.model,
      room: value.room,
      switches,
    };
  }

  private enableActionButtons() {
    this.actionButtonsDisabled = false;
  }

  private disableActionButtons() {
    this.actionButtonsDisabled = true;
  }
}
