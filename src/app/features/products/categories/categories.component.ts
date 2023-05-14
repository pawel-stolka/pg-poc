import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '@common/models';
import { Observable, delay, map, of } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
// import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @Input() plu: string = 'cat-plu';
  @Input() categories: Category[] = [];

  productsForm = this.fb.group({
    products: [null, Validators.required],
  });

  // categories$: Observable<any> = this.productService.products$.pipe(
  //   map((products) => products.find(({ plu }) => this.plu === plu)?.categories)
  // );

  currentDurations: any;
  currentCategories$ = this.productService.productsState$.pipe(
    map((state) => state.find(({ plu }) => this.plu === plu)?.categories)
  );

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}
}
