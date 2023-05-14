import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PluCatDur } from '@common/models';
import { map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { TEN_TIMES } from '../category-durations.component';

@Component({
  selector: 'category-durations-dropdown',
  templateUrl: './category-durations-dropdown.component.html',
  styleUrls: ['./category-durations-dropdown.component.scss'],
})
export class CategoryDurationsDropdownComponent {
  @Input() plu: string = '';
  @Input() categoryName: string = '';

  dropForm: FormGroup;

  productDurations$ = this.productService.products$.pipe(
    map((products) => products.find(({ plu }) => this.plu === plu)?.categories),
    map(
      (categories) =>
        categories?.find(
          ({ categoryName }) => this.categoryName === categoryName
        )?.insuranceDetails
    ),
    map(
      (details) => details?.find(({ type }) => type === TEN_TIMES)?.insurances
    ),
    map((insurances) => insurances?.map(({ duration }) => duration))
  );

  durationState$ = this.productService.productsState$.pipe(
    map((state) => state.find((x) => x.plu === this.plu)?.categories),
    map((categories) =>
      categories?.find((x) => x.categoryName === this.categoryName)
    ),
    map((category) => category?.currentDuration),
    tap((currentDuration) => {
      this.dropForm.get('durations')?.setValue(currentDuration);
    })
  );

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.dropForm = this.fb.group({
      durations: [null, Validators.required],
    });

    this.dropForm.valueChanges.subscribe((change) => {
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.categoryName,
          currentDuration: change.durations,
        },
      };
      this.productService.setProductDuration(pluCatDur);
    });
  }
}
