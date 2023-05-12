import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';
import { DialogData } from 'src/app/features/home/home.component';
import { ProductService } from 'src/app/services/product.service';

export interface CategoryData {
  plu: any;
}

@Component({
  selector: 'category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent {
  productsState$ = this.productService.productsState$;
  durationState$ = this.productService.productsState$.pipe(
    map((state) => state.find(({ plu }) => plu === this.data?.plu)),
    map((pluCats) =>
      pluCats?.categories.find((c) => c.categoryName === this.data.categoryName)
    ),
    map((category) => category?.currentDuration)
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryData | DialogData | any,
    private productService: ProductService
  ) {}
}
