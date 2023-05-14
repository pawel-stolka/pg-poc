import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PluCatDur } from '@common/models';
import { map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CatDurDialogComponent } from './cat-dur-dialog/cat-dur-dialog.component';

export const TEN_TIMES = 'TEN_TIMES';
@Component({
  selector: 'cat-durs',
  templateUrl: './cat-durs.component.html',
  styleUrls: ['./cat-durs.component.scss'],
})
export class CatDursComponent implements OnInit {
  @Input() plu: string = 'init-plu';
  @Input() category: any;

  durationsForm: FormGroup = this.fb.group({
    durations: [null, Validators.required],
  });

  selectorDurations$ = this.productService.products$.pipe(
    map((products) => products.find(({ plu }) => plu === this.plu)?.categories),
    map((categories) =>
      categories?.find(
        ({ categoryName }) => this.category.categoryName === categoryName
      )
    ),
    map((category) => category?.insuranceDetails),
    map(
      (details) => details?.find(({ type }) => type === TEN_TIMES)?.insurances
    ),
    map((insurances) => insurances?.map(({ duration }) => duration))
  );

  currentDuration$ = this.productService.productsState$.pipe(
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.durationsForm.valueChanges.subscribe((dropChange) => {
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.category.categoryName,
          currentDuration: dropChange.durations,
        },
      };
      this.productService.setProductDuration(pluCatDur);
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(CatDurDialogComponent, {
      data: {
        plu: this.plu,
        categoryName: this.category.categoryName,
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`CatDurDialog close result`, result);
    // });
  }

  ngOnInit(): void {
    this.currentDuration$.subscribe();
  }
}
