import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-un-authorized',

  templateUrl: './un-authorized.component.html',
  styleUrl: './un-authorized.component.css'
})
export class UnAuthorizedComponent {
  private location = inject(Location);
   translate = inject(TranslateService);
goBack(): void {
    this.location.back();
  }
}
