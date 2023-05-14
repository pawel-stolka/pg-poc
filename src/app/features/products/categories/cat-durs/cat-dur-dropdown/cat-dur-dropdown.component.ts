import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { TEN_TIMES } from '../cat-durs.component';
import { PluCatDur } from '@common/models';

@Component({
  selector: 'cat-dur-dropdown',
  templateUrl: './cat-dur-dropdown.component.html',
  styleUrls: ['./cat-dur-dropdown.component.scss']
})
export class CatDurDropdownComponent implements OnInit {
  @Input() plu: string = 'init-plu';
  @Input() categoryName: any;

  dropForm: FormGroup;

  selectorDurations$: Observable<any>;
  currentDuration$: Observable<string | undefined>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.dropForm = this.fb.group({
      durations: [null, Validators.required],
    });

    this.dropForm.valueChanges.subscribe(catDurDropChange => {

      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.categoryName,
          currentDuration: catDurDropChange.durations,
        },
      };
      // console.log('[cat-dur-dropdown]', catDurDropChange);
      // console.log('[cat-dur-dropdown #2]', pluCatDur);
      // this.productService.changeState(pluCatDur)
      this.productService.setProductDuration(pluCatDur);
    })

    this.selectorDurations$ = this.productService.products$.pipe(
      map((products) => {
        let pluCats = products.find(({ plu }) => plu === this.plu)?.categories;
        let details = pluCats?.find(
          ({ categoryName }) => categoryName === this.categoryName
        )?.insuranceDetails;

        return details?.find(
          ({ type }) => type === TEN_TIMES
        )?.insurances;
      }),
      map(insurances => insurances?.map(({ duration }) => duration))
      // tap(durations => {
      //   this.selectedDuration = durations;
      // })
    );

    this.currentDuration$ = this.productService.productsState$.pipe(
      map((state) => state.find((x) => x.plu === this.plu)),
      map((pluCats) => pluCats?.categories),
      map((categories) =>
        categories?.find((x) => x.categoryName === this.categoryName)
      ),
      map((category) => category?.currentDuration),
      tap((currentDuration) => {
        this.dropForm.get('durations')?.setValue(currentDuration);
        // console.log(
        //   '[TAP | currentDuration]',
        //   // this.durationsForm.get('durations')?.value,
        //   currentDuration
        // );
      })
    );

  }
  ngOnInit(): void {
    // currentDuration
  }
}
