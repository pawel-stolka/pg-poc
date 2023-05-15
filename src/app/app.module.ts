import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { NavComponent } from './features/nav/nav.component';
import { HomeComponent } from './features/home/home.component';
import { StateComponent } from './common/state/state.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailsComponent } from './features/details/details.component';
import { CategoriesComponent } from './features/products/categories/categories.component';
import { CategoryDetailComponent } from './features/products/categories/category-detail/category-detail.component';
import { BenefitsComponent } from './features/products/benefits/benefits.component';
import { CategoryPaymentsComponent } from './features/products/categories/category-payments/category-payments.component';
import { CategoryDurationsComponent } from './features/products/categories/category-durations/category-durations.component';
import { CategoryDurationsDialogComponent } from './features/products/categories/category-durations/category-durations-dialog/category-durations-dialog.component';
import { CategoryDurationsDropdownComponent } from './features/products/categories/category-durations/category-durations-dropdown/category-durations-dropdown.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'details', component: ProductDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailsComponent,
    NavComponent,
    CategoriesComponent,
    BenefitsComponent,
    CategoryDetailComponent,
    CategoryPaymentsComponent,
    StateComponent,
    CategoryDurationsComponent,
    CategoryDurationsDialogComponent,
    CategoryDurationsDropdownComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
