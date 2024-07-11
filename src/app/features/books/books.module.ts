import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { AddEditBookComponent } from './components/add-edit-book/add-edit-book.component';

@NgModule({
  declarations: [
    BookListComponent,
    AddEditBookComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
