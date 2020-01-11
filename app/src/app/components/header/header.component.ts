import {Component} from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'sh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public version = environment.version;
  public buildDate = environment.buildDate;
}
