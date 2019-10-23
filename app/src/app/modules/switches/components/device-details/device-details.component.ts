import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {DeviceDetailsStateConnectorService} from '../../store/state-connectors/device-details-state-connector.service';
import {SwitchDeviceModel} from '../../models/switch-device-model';
import {SwitchDeviceChangeSettingsDto} from '../../interfaces/switch-device.interface';
import {Actions, ofType} from '@ngrx/effects';
import {SwitchActionTypes} from '../../store/switches-actions';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'sh-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
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
  ];
  public actionButtonsDisabled = false;

  public destroy$ = new ReplaySubject<void>();

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private deviceDetailsStateConnectorService: DeviceDetailsStateConnectorService,
              private actions$: Actions) {
  }

  public ngOnDestroy(): void {
    this.deviceDetailsStateConnectorService.setCurrentDeviceId(null);

    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {

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
      isSingleSwitch: [{value: null, disabled: true}],
      switches: this.switches
    });

    this.disableForm();

    const device$ =
      this.deviceDetailsStateConnectorService.device$
        .pipe(
          take(1), // not refresh form if update from device arrived
          takeUntil(this.destroy$),
        );

    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => this.deviceDetailsStateConnectorService.setCurrentDeviceId(id));

    device$
      .subscribe((device: SwitchDeviceModel) => {
        this.device = device;

        this.form.reset(this.prepareFormValues(device));
      });

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

    this.actions$
      .pipe(
        ofType(SwitchActionTypes.ChangeSettingsError),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.enableActionButtons();
      });
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


  private disableForm(): void {
    this.form.disable();
  }

  private enableForm(): void {
    this.form.enable();
    this.form.controls['isSingleSwitch'].disable();
    this.form.controls['deviceId'].disable();

    for (let i = this.device.switches.size; i < 4; i++) {
      this.switches.controls[i].disable();
    }
  }

  private prepareFormValues(device): { [key: string]: any } {
    return {
      name: device.name,
      deviceId: device.id,
      apiKey: device.apiKey,
      model: device.model,
      isSingleSwitch: device.isSingleSwitch,
      switches: {
        0: device.switches.get(0).name,
        1: device.switches.has(1) ? device.switches.get(1).name : null,
        2: device.switches.has(2) ? device.switches.get(2).name : null,
        3: device.switches.has(3) ? device.switches.get(3).name : null,
      }
    };
  }

  private prepareValuesToSend(value: any): SwitchDeviceChangeSettingsDto {
    const switches = [
      {outlet: 0, name: this.switches.controls[0].value},
      {outlet: 1, name: this.switches.controls[1].value},
      {outlet: 2, name: this.switches.controls[2].value},
      {outlet: 3, name: this.switches.controls[3].value},
    ];

    return {
      name: value.name,
      apiKey: value.apiKey,
      model: value.model,
      switches
    };
  }

  private enableActionButtons() {
    this.actionButtonsDisabled = false;
  }

  private disableActionButtons() {
    this.actionButtonsDisabled = true;
  }
}
