import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { TEN_TIMES } from '../cat-durs.component';

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

    this.selectorDurations$ = this.productService.products$.pipe(
      tap(sd => console.log('selectorDurations$ | cat-dur-dropdown', sd)),
      map((products) => {
        let pluCats = products.find(({ plu }) => plu === this.plu)?.categories;
        let _details = pluCats?.find(
          ({ categoryName }) => categoryName === this.categoryName
        );

        let insurances = _details?.insuranceDetails.find(
          ({ type }) => type === TEN_TIMES
        )?.insurances;
        // console.log('[insurances]', insurances);
        let durations = insurances?.map(({ duration }) => duration);
        console.log(
          `[durations] ${this.plu} | ${this.categoryName}`,
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
        categories?.find((x) => x.categoryName === this.categoryName)
      ),
      map((category) => category?.currentDuration),
      // tap((currentDuration) => {
      //   this.dropForm.get('durations')?.setValue(currentDuration);
      //   console.log(
      //     '[TAP | currentDuration]',
      //     // this.durationsForm.get('durations')?.value,
      //     currentDuration
      //   );
      // })
    );

  }
  ngOnInit(): void {
    // currentDuration
  }
}
