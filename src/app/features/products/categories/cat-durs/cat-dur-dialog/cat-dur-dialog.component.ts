import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface CategoryData {
  plu: string;
  categoryName: string;
}
@Component({
  selector: 'cat-dur-dialog',
  templateUrl: './cat-dur-dialog.component.html',
  styleUrls: ['./cat-dur-dialog.component.scss'],
})
export class CatDurDialogComponent {
  plu: string = 'cat-dur-plu';
  categoryName: string;
  // category = {
  //   categoryName: 'cat-dur-category-name'
  // }

  constructor(
    public dialogRef: MatDialogRef<CatDurDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {
    this.plu = data.plu;
    this.categoryName = data.categoryName;
  }

  closeDialog() {
    this.dialogRef.close({ closed: { plu: this.plu, categoryName: this.categoryName} });
  }
}
