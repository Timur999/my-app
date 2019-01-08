import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatExpansionModule,
        MatBottomSheetModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatBadgeModule,
        MatSortModule
    ],
    exports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatExpansionModule,
        MatBottomSheetModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatBadgeModule,
        MatSortModule
    ],
})

export class MaterialModule { }