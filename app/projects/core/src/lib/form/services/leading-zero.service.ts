import { Injectable } from '@angular/core';
import { FormServicesModule } from './form-services.module';

@Injectable({
  providedIn: FormServicesModule
})
export class LeadingZeroService {

  public addZeros(value: string): string {
    if (value.length >= 2) {
      return value;
    }

    const newValue: number = parseInt(value, 10);

    if (newValue < 10) {
      return '0' + value;
    } else {
      return value;
    }
  }
}
