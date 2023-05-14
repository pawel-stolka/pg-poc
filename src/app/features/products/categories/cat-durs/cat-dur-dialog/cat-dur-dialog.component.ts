import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface CategoryData {
  plu: string;
  categoryName: string;
}
@Component({
  selector: 'cat-dur-dialog',
  templateUrl: './cat-dur-dialog.component.html',
  styleUrls: ['./cat-dur-dialog.component.scss']
})
export class CatDurDialogComponent {
  plu: string = 'cat-dur-plu';
  categoryName: string;
  // category = {
  //   categoryName: 'cat-dur-category-name'
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryData) {
      this.plu = data.plu;
      this.categoryName = data.categoryName;
    }
}
