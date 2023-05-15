import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PluCatDur } from '@common/models';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CategoryDurationsDialogComponent } from './category-durations-dialog/category-durations-dialog.component';

export const TEN_TIMES = 'TEN_TIMES';

@Component({
  selector: 'category-durations',
  templateUrl: './category-durations.component.html',
  styleUrls: ['./category-durations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDurationsComponent implements OnDestroy {
  @Input() plu: string = '';
  @Input() category: any;

  durationsForm: FormGroup = this.fb.group({
    durations: [null, Validators.required],
  });

  destroy$: Subject<boolean> = new Subject<boolean>();

  durationState$: Observable<string | undefined>;
  categoryState$: Observable<any>;

  productDurations$ = this.productService.products$.pipe(
    map((products) => products.find(({ plu }) => this.plu === plu)?.categories),
    map((categories) =>
      categories?.find(
        ({ categoryName }) => this.category.categoryName === categoryName
      )
    ),
    map((category) => category?.insuranceDetails),
    map(
      // TODO TEN_TIMES
      (details) => details?.find(({ type }) => type === TEN_TIMES)?.insurances
    ),
    map((insurances) => insurances?.map(({ duration }) => duration))
  );

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.durationState$ = this.productService.productsState$.pipe(
      map((state) => state.find(({ plu }) => this.plu === plu)?.categories),
      map((categories) =>
        categories?.find(
          ({ categoryName }) => this.category.categoryName === categoryName
        )
      ),
      map((category) => category?.currentDuration),
      tap((currentDuration) => {
        this.durationsForm.get('durations')?.setValue(currentDuration);
      })
    );

    this.durationsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((dropChange) => {
        let pluCatDur: PluCatDur = {
          plu: this.plu,
          category: {
            categoryName: this.category.categoryName,
            currentDuration: dropChange.durations,
          },
        };

        this.productService.setProductDuration(pluCatDur);
      });

    this.categoryState$ = this.productService.productsState$.pipe(
      map((state) => state.find(({ plu }) => this.plu === plu)?.categories),
      map((categories) =>
        categories?.find(
          (x: any) => this.category?.categoryName === x.categoryName
        )
      ),
      map((category) => category?.currentDuration)
      // tap((currentDuration) => {
      //   this.durationsForm.get('durations')?.setValue(currentDuration);
      // })
    );
  }

  openDialog() {
    let dialogRef = this.dialog.open(CategoryDurationsDialogComponent, {
      data: {
        plu: this.plu,
        categoryName: this.category.categoryName,
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`CatDurDialog close result`, result);
    // });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
