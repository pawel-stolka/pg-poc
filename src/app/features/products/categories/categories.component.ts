import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '@common/models';
import { Observable, delay, map, of } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @Input() categories: Category[] = [];
  // @Input() product: Product = {} as Product;
  @Input() plu: string = 'cat-plu';

  productsForm: FormGroup;
  // products$: Observable<Product[]>;
  categories$: Observable<any>;
  durations$: Observable<string[]>;
  durationsForm: FormGroup = this.fb.group({
    durations: [null, Validators.required],
  });
  currentDuration: any;

  payments$: Observable<any[]>;

  // openDialog() {
  //   this.dialog.open(CategoryDialogComponent, {
  //     data: {
  //       plu: this.plu
  //     },
  //   });
  // }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    // public dialog: MatDialog
  ) {
    this.productsForm = this.fb.group({
      products: [null, Validators.required],
    });

    this.categories$ = this.productService.products$.pipe(
      map(
        (products) => products.find(({ plu }) => plu === this.plu)?.categories
      )
    );

    this.durations$ = this.categories$;

    this.payments$ = this.categories$.pipe(
      map((x: any) => x.map((v: any) => v.insuranceDetails))
    );


  }
}

const getDurations = (): Observable<string[]> =>
  of(mockDurations).pipe(delay(2500));

const mockDurations: string[] = ['3', '5', '8', '11'];
