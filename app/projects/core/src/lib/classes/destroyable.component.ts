import { OnDestroy, OnInit } from '@angular/core';

import { ReplaySubject } from 'rxjs';

export abstract class Destroyable implements OnDestroy {
  protected destroy$ = new ReplaySubject<void>(1);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
