import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Colors } from '@common/Colors';
import { PluCatDur } from '@common/models';
import { Observable, map, noop, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

const typeDetailsIndex = 0;

@Component({
  selector: 'category-durations',
  templateUrl: './category-durations.component.html',
  styleUrls: ['./category-durations.component.scss'],
})
export class CategoryDurationsComponent implements OnInit {
  @Input() plu: string = 'init-plu';
  // @Input() durations: any;
  @Input() category: any;

  durationsForm: FormGroup;

  durations = {
    insuranceDetails: [{ insurances: [{ duration: 1 }, { duration: 2 }] }],
  };

  selectorDurations: any;
  currentDuration: any;

  // currentDuration: string | undefined;

  currentDuration$ = this.productService.productsState$.pipe(
    map((state) => state.find((x) => x.plu === this.plu)),
    map((pluCats) => pluCats?.categories),
    map((categories) =>
      categories?.find((x) => x.categoryName === this.category.categoryName)
    ),
    map((category) => category?.currentDuration),
    // tap(currentDuration => this.currentDuration = currentDuration)
    // map(categories => categories?.map(x => x.currentDuration))
    // tap((currentDuration) => {
    //   console.log(
    //     '%c[BIGBIG_RED: [setValue] in category-durations]',
    //     Colors.BIGBIG_RED,
    //     currentDuration
    //   );
    //   this.durationsForm.get('durations')?.setValue(currentDuration);
    // })
  );
  selectorDurations$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.durationsForm = this.fb.group({
      durations: [null, Validators.required],
    });
    this.selectorDurations$ = this.productService.products$.pipe(
      // tap(p => console.log('selectorDurations$ | category-durations', p)),
      map((products) => {
        let pluCats = products.find(({ plu }) => plu === this.plu)?.categories;
        console.log('1.selectorDurations$ | pluCats', pluCats, this.category);
        let _details = pluCats?.find(
          (x) => x.categoryName === this.category.categoryName
        );
        let insuranceDetail = _details?.insuranceDetails[0];
        let insurances = insuranceDetail?.insurances?.map(
          (i: any) => i.duration
        );
        console.log('2.selectorDurations$ | _details', _details);
        console.log(
          '3.selectorDurations$ | _details',
          insuranceDetail,
          insurances
        );
        return insurances;
      }),
      tap((durations) => console.log('durations | TAP', durations)),
      tap((durations) => (this.selectorDurations = durations))
      // tap(durations => this.currentDuration = durations),
    );

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
    // const toSelect = this.durations.insuranceDetails[0].insurances.map(
    //   (i: any) => i.duration
    // )[0];
    let toSelect;
    // this.currentDuration$.subscribe((x) => {
    //   console.log(
    //     '%c[BIGBIG_RED: [currentDuration$] in category-durations]',
    //     Colors.BIGBIG_RED,
    //     x
    //   );
    //   this.durationsForm.get('durations')?.setValue(x);
    // });
  }

  openDialog() {
    let currDur = this.durationsForm.get('durations')?.value;
    console.log('[this.openDialog]', currDur);

    this.dialog.open(CategoryDialogComponent, {
      data: {
        plu: this.plu,
        categoryName: this.category.categoryName,
        currDur,
        selectorDurations: this.selectorDurations,
      },
    });
  }
}
