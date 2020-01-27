import {Component, Input} from '@angular/core';

@Component({
  selector: 'sh-core-last-update',
  templateUrl: './last-update.component.html',
  styleUrls: ['./last-update.component.scss']
})
export class LastUpdateComponent {

  @Input()
  public lastUpdate: Date = null;
}
