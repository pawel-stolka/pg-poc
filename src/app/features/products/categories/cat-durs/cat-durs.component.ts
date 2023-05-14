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
      console.log('%c[dropChange]', Colors.BIGBIG_RED, dropChange);
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.category.categoryName,
          // currentDuration: this.selectorDurations,
          currentDuration: dropChange.durations,
          // currentDuration: change.durations,
        },
      };
      console.log('[pluCatDur in dropdown]', pluCatDur);
      this.productService.setProductDuration(pluCatDur);
    });

    this.selectorDurations$ = this.productService.products$.pipe(
      // tap(p => console.log('selectorDurations$ | category-durations', p)),
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
        console.log(
          `[durations] ${this.plu} | ${this.category.categoryName}`,
          durations
        );

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

    // this.finDuration$ = combineLatest([
    //   this.selectorDurations$,
    //   currentDuration$,
    // ]).pipe(
    //   map(([selectorDurations, currentDuration]) => {
    //     // let res = selectorDurations;
    //     let res = currentDuration;
    //     // console.log('[ > selectorDurations < ]', selectorDurations);
    //     console.log('[ > currentDuration < ]', currentDuration);

    //     return res;
    //   }),
    //   tap((currentDuration) => {
    //     this.durationsForm.get('durations')?.setValue(currentDuration);
    //     console.log(
    //       '[TAP | currentDuration]',
    //       // this.durationsForm.get('durations')?.value,
    //       currentDuration
    //     );
    //   })
    // );
  }

  openDialog() {
    let currDur = this.durationsForm.get('durations')?.value;
    // console.log('[this.openDialog]', currDur);

    this.dialog.open(CatDurDialogComponent, {
      data: {
        plu: this.plu,
        categoryName: this.category.categoryName,
        // currDur,
        // selectorDurations: this.selectorDurations,
      },
    });
  }

  ngOnInit(): void {
    this.currentDuration$.subscribe()
    // NOT NEEDED -> currentDuration$
    // this.finDuration$
    //   // this.currentDuration$
    //   .pipe(
    //     tap((fd) => console.log('%c[finDuration$ ON_INIT]', Colors.GOLDEN, fd))
    //   )
    //   .subscribe((currentDuration) => {
    //     console.log(
    //       '%c[SUB.ON_INIT | 1',
    //       Colors.GOLDEN,
    //       this.durationsForm.get('durations')?.value
    //     );
    //     this.durationsForm.get('durations')?.setValue(currentDuration);
    //     console.log(
    //       '%c[SUB.ON_INIT | 2',
    //       Colors.GOLDEN_BLACK,
    //       this.durationsForm.get('durations')?.value
    //     );
    //   });
  }
}
