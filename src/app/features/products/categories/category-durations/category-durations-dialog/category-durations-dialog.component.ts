import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CategoryData {
  plu: string;
  categoryName: string;
}

@Component({
  selector: 'category-durations-dialog',
  templateUrl: './category-durations-dialog.component.html',
  styleUrls: ['./category-durations-dialog.component.scss'],
})
export class CategoryDurationsDialogComponent {
  plu: string;
  categoryName: string;

  constructor(
    public dialogRef: MatDialogRef<CategoryDurationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {
    this.plu = data.plu;
    this.categoryName = data.categoryName;
  }

  closeDialog() {
    this.dialogRef.close({
      closed: { plu: this.plu, categoryName: this.categoryName },
    });
  }
}
