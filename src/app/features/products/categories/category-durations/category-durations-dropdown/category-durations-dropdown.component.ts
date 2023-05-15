import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PluCatDur } from '@common/models';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { TEN_TIMES } from '../category-durations.component';

@Component({
  selector: 'category-durations-dropdown',
  templateUrl: './category-durations-dropdown.component.html',
  styleUrls: ['./category-durations-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDurationsDropdownComponent implements OnDestroy {
  @Input() plu: string = '';
  @Input() categoryName: string = '';

  dropForm: FormGroup = this.fb.group({
    durations: [null, Validators.required],
  });

  destroy$: Subject<boolean> = new Subject<boolean>();

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
    this.dropForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((change) => {
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
