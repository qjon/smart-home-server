import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { ScheduleRepositoryService } from '../database/repository/schedule-repository.service';
import { ScheduleEntity } from '../database/entity/schedule.entity';
import { DevicesAdapterService } from '../adapters/devices-adapter.service';
import { DeviceEntity } from '../database/entity/device.entity';
import { LightSwitch, LightSwitchStatus } from '../interfaces/light/update-action.interface';
import { DeviceParamsEntity } from '../database/entity/device.params.entity';
import { interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class ScheduleWorkerService implements WorkerInterface {

  @Inject(ScheduleRepositoryService)
  protected scheduleRepositoryService: ScheduleRepositoryService;

  @Inject(DevicesAdapterService)
  protected devicesAdapterService: DevicesAdapterService;

  protected logger = new Logger(ScheduleWorkerService.name);

  protected interval: NodeJS.Timeout;

  public execute(): void {
    interval(1000)
      .pipe(
        map(() => new Date().getSeconds()),
        filter((seconds) => seconds === 0),
      )
      .subscribe((seconds) => {
        this.logger.log(seconds)
        this.runSchedule();
      });
  }

  public stop(): void {
    this.interval.unref();
  }

  async runSchedule(): Promise<any> {
    const date = new Date();
    const hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();

    const day = date.getDay() > 0 ? Math.pow(2, date.getDay() - 1) : 64;
    const time = `${hours}:${minutes}:00`;

    const scheduleList: ScheduleEntity[] = await this.scheduleRepositoryService.fetchScheduleByTimeAndDay(day, time, true);

    if (scheduleList.length > 0) {
      scheduleList.forEach((schedule: ScheduleEntity) => {
        const device = schedule.device;

        this.devicesAdapterService.updateSwitches({
          apiKey: device.apikey,
          deviceId: device.deviceId,
          host: device.host,
          port: device.port,
          method: 'POST',
          path: device.isSingleSwitch ? '/zeroconf/switch' : '/zeroconf/switches',
          data: this.prepareSwitches(device, schedule.action),
        });

        this.logger.log(`[Schedule] - device "${device.name}" (${device.deviceId}) - action: ${schedule.action}`);
      });
    }

  }

  private prepareSwitches(device: DeviceEntity, action: boolean): { switch: LightSwitchStatus } | { switches: LightSwitch[] } {
    let data: { switch: LightSwitchStatus } | { switches: LightSwitch[] };
    const switchAction: LightSwitchStatus = action ? LightSwitchStatus.ON : LightSwitchStatus.OFF;

    if (device.isSingleSwitch) {
      data = { switch: switchAction };
    } else {
      data = {
        switches: device.params.map((param: DeviceParamsEntity) => {
          return { switch: switchAction, outlet: param.outlet };
        }),
      };
    }

    return data;
  }

}
