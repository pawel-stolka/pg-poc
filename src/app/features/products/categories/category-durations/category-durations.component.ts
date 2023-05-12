import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Colors } from '@common/Colors';
import { PluCatDur } from '@common/models';
import { map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'category-durations',
  templateUrl: './category-durations.component.html',
  styleUrls: ['./category-durations.component.scss'],
})
export class CategoryDurationsComponent implements OnInit {
  @Input() plu: string = 'init-plu';
  @Input() durations: any;
  @Input() category: any;
  // @Output() currentDuration = new EventEmitter();

  durationsForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.durationsForm = this.fb.group({
      durations: [null, Validators.required],
    });
    this.durationsForm.valueChanges.subscribe((change) => {
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.category.categoryName,
          currentDuration: change.durations,
        },
      };
      this.productService.setProductDuration(pluCatDur);
    });
  }

  ngOnInit(): void {
    const toSelect = this.durations.insuranceDetails[0].insurances.map(
      (i: any) => i.duration
    )[0];
    console.log('%c[//TODO: durations | toSelect]', Colors.BIGBIG_BLUE, toSelect);
    this.durationsForm.get('durations')?.setValue(toSelect);
  }
}
