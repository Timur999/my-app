import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
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
        MatSelectModule
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
        MatSelectModule
    ],
})

export class MaterialModule { }