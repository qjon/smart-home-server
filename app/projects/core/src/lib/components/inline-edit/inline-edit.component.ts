import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sh-core-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditComponent implements OnInit, OnDestroy {
  @Input()
  public name: string;

  @Input()
  public maxLength = 50;

  @Input()
  public renameError$: Observable<any>;

  @Input()
  public renameSuccess$: Observable<any>;

  @ViewChild('deviceName', {static: false})
  public inputElement: ElementRef<HTMLElement>;

  @Output()
  public onRename = new EventEmitter<string>();

  public isActive = false;
  public isSaving = false;
  public isEditing = false;
  public previousValue: string;
  public subscription = new Subscription();

  protected destroy$ = new ReplaySubject<any>();

  public constructor() {

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.renameSuccess$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.isSaving = false;
          this.onBlur();
        })
    );

    this.subscription.add(
      this.renameError$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.isEditing = true;
          this.isActive = true;
          this.isSaving = false;
          this.inputElement.nativeElement.focus();
        })
    );
  }

  public onBlur(): void {
    this.isEditing = false;
    this.isActive = false;
  }

  @HostListener('mouseenter')
  public onEnter() {
    this.isActive = true;
  }

  @HostListener('mouseleave')
  public onLeave() {
    if (!this.isEditing) {
      this.isActive = false;
    }
  }

  public onKeyDown($event: KeyboardEvent): boolean {
    if ($event.key === 'Enter') {
      $event.stopPropagation();

      this.isActive = false;
      this.save();

      return false;
    } else if ($event.key === 'Escape' || $event.key === 'Tab') {
      $event.stopPropagation();

      this.isActive = false;
      this.cancel();

      return false;
    } else if (this.name.length >= this.maxLength && !this.isSpecialKey($event.key) && !this.isNavigationKey($event.key)) {
      $event.stopPropagation();

      return false;
    } else {
      return true;
    }
  }

  public onInsert($event: KeyboardEvent): void {
    let newValue = $event.target['textContent'].toString();
    newValue = newValue.substr(0, Math.min(newValue.length, this.maxLength));

    this.name = newValue;
  }

  public saveCurrentValue(): void {
    this.previousValue = this.name;
    this.isEditing = true;
  }

  protected save(): void {
    this.inputElement.nativeElement.blur();
    this.isSaving = true;

    this.onRename.next(this.name);
  }

  protected cancel(): void {
    this.name = this.previousValue;
    this.inputElement.nativeElement.blur();
  }

  protected isSpecialKey(value): boolean {
    return ['Home', 'End', 'Insert', 'Delete', 'Backspace'].indexOf(value) > -1;
  }

  protected isNavigationKey(value): boolean {
    return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(value) > -1;
  }
}
