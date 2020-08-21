import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-core-main-action-button-section',
  templateUrl: './main-action-button-section.component.html',
  styleUrls: ['./main-action-button-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainActionButtonSectionComponent {
  @Input()
  public title: string = null;

  @Input()
  public hasBackButton = true;

  @Output()
  public onClickBack: EventEmitter<Event> = new EventEmitter<Event>();

  public back($event: Event): void {
    this.onClickBack.emit($event);
  }
}
