import { Component, Input } from '@angular/core';

@Component({
  selector: 'benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent {
  @Input() benefits: string[] = []
}
