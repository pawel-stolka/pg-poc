import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Colors } from '@common/Colors';
import { PluCatDur, PluCats } from '@common/models';
import { Observable, combineLatest, map, tap } from 'rxjs';
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
  // @Input() currentDurations: any;
  // @Input() currentCategories: any;

  durationsForm: FormGroup;
  selectorDurations$: Observable<any>;
  currentDuration$: Observable<string | undefined>;
  // finDuration$//: Observable<string | undefined>;
  // selectedDuration: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.durationsForm = this.fb.group({
      durations: [null, Validators.required],
    });

    this.durationsForm.valueChanges.subscribe((dropChange) => {
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.category.categoryName,
          currentDuration: dropChange.durations,
        },
      };
      console.log('[pluCatDur in dropdown]', pluCatDur);
      this.productService.setProductDuration(pluCatDur);
    });

    this.selectorDurations$ = this.productService.products$.pipe(
      map((products) => {
        let pluCats = products.find(({ plu }) => plu === this.plu)?.categories;
        let _details = pluCats?.find(
          ({ categoryName }) => categoryName === this.category.categoryName
        );

        let insurances = _details?.insuranceDetails.find(
          ({ type }) => type === TEN_TIMES
        )?.insurances;
        // console.log('[insurances]', insurances);
        let durations = insurances?.map(({ duration }) => duration);
        // console.log(
        //   `[durations] ${this.plu} | ${this.category.categoryName}`,
        //   durations
        // );

        return durations;
      })
      // tap(durations => {
      //   this.selectedDuration = durations;
      // })
    );
    this.currentDuration$ = this.productService.productsState$.pipe(
      map((state) => state.find((x) => x.plu === this.plu)),
      map((pluCats) => pluCats?.categories),
      map((categories) =>
        categories?.find((x) => x.categoryName === this.category.categoryName)
      ),
      map((category) => category?.currentDuration),
      tap((currentDuration) => {
        this.durationsForm.get('durations')?.setValue(currentDuration);
        console.log(
          '[setValue | cat-durs | currentDuration]',
          // this.durationsForm.get('durations')?.value,
          currentDuration
        );
      })
    );
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
