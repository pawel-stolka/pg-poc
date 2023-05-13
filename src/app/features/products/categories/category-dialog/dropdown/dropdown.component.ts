import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Colors } from '@common/Colors';
import { PluCatDur } from '@common/models';
import { map } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() selectorDurations: any;
  @Input() plu: any;
  @Input() categoryName: any;

  currentDuration: any;
  dropdownForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.dropdownForm = this.fb.group({
      durations: [null, Validators.required],
    });

    let toSelect = '1.21';

    this.dropdownForm.valueChanges.subscribe((dropChange) => {
      console.log('dropChange', dropChange);

      // alert(dropChange.durations)
      let pluCatDur: PluCatDur = {
        plu: this.plu,
        category: {
          categoryName: this.categoryName,
          // currentDuration: this.selectorDurations,
          currentDuration: dropChange.durations,
          // currentDuration: change.durations,
        },
      };
      console.log('[pluCatDur in dropdown]', pluCatDur);

      this.productService.setProductDuration(pluCatDur);
    });
  }

  ngOnInit() {
    console.log('DROPDOWN ONINIT');
    this.productService.productsState$
      .pipe(
        map((state) => state.find((s) => s.plu === this.plu)?.categories),
        map(
          (categories) =>
            categories?.find((c) => c.categoryName === this.categoryName)
              ?.currentDuration
        )
        // map(state => state.map(pluCat => ({
        //   plu: pluCat.plu,
        //   // d: pluCat.categories.map
        // })))
      )
      .subscribe((currentDuration) => {
        console.log('%c[currentDuration in dropdown CTOR]', Colors.BIGBIG_RED, currentDuration);
        this.dropdownForm.get('durations')?.setValue(currentDuration);
      });
  }
}
