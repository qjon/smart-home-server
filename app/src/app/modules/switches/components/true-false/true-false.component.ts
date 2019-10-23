import {Component, Input} from '@angular/core';

@Component({
  selector: 'sh-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.scss']
})
export class TrueFalseComponent {
  @Input()
  public value: boolean;
}
