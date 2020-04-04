import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sh-core-main-action-button-section',
  templateUrl: './main-action-button-section.component.html',
  styleUrls: ['./main-action-button-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainActionButtonSectionComponent {
  @Input()
  public title: string = null;
}
