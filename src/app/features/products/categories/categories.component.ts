import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from '@common/models';
import { Observable, map } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

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

  stateCategories$: Observable<any>;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.stateCategories$ = this.productService.productsState$.pipe(
      map((state) => state.find(({ plu }) => this.plu === plu)?.categories)
    );
  }
}
