import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Colors } from '@common/Colors';
import { PluCatDur } from '@common/models';
import { map, noop, tap } from 'rxjs';
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

  selectorDurations$ = this.productService.products$.pipe(
    map((products) => {
      let pluCats = products.find(({ plu }) => plu === this.plu)?.categories;
      let details = pluCats?.find(
        (x) => x.categoryName === this.category.categoryName
      )?.insuranceDetails;

      // TODO: TEN_TIMES only!!!
      let _insurances = !!details
        ? details[typeDetailsIndex].insurances
        : undefined;
      let durations = _insurances?.map((i) => i.duration);
      console.log('[selectorDurations$]', durations);
      return durations;
    })
  );

  currentDuration: string | undefined; // = 'nope';

  currentDuration$ = this.productService.productsState$.pipe(
    map((state) => state.find((x) => x.plu === this.plu)),
    map((pluCats) => pluCats?.categories),
    map((categories) =>
      categories?.find((x) => x.categoryName === this.category.categoryName)
    ),
    map((category) => category?.currentDuration)
    // tap(currentDuration => this.currentDuration = currentDuration)
    // map(categories => categories?.map(x => x.currentDuration))
  );

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialog: MatDialog
  ) {
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
    // const toSelect = this.durations.insuranceDetails[0].insurances.map(
    //   (i: any) => i.duration
    // )[0];
    let toSelect;
    this.currentDuration$.subscribe((x) => (toSelect = x));
    console.log(
      '%c[//TODO: durations | toSelect]',
      Colors.BIGBIG_BLUE,
      toSelect
    );
    this.durationsForm.get('durations')?.setValue(toSelect);
  }

  openDialog() {
    this.dialog.open(CategoryDialogComponent, {
      data: {
        plu: this.plu,
        categoryName: this.category.categoryName
      },
    });
  }
}
