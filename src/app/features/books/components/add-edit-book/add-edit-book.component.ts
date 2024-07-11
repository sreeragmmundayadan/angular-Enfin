import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models';
import { BookService } from '../../services';

@Component({
  selector: 'app-add-edit-book',
  templateUrl: './add-edit-book.component.html',
  styleUrls: ['./add-edit-book.component.scss'],
})
export class AddEditBookComponent implements OnInit {
  @Input() book!: Book | null;
  @Output() closeAddEditScreen = new EventEmitter<boolean>();

  bookForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private readonly bookService: BookService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.book) {
      this.isEditMode = true;
      this.setFormValues(this.book);
    }
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      publishDate: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  private setFormValues(book: Book): void {
    this.bookForm.patchValue({
      name: book.name,
      description: book.description,
      publishDate: book.publishDate,
      price: book.price,
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.bookService.updateBook(this.bookForm.value).subscribe(() => {
        this.onCloseAddEditScreen();
      });
    } else {
      this.bookService.addBook(this.bookForm.value).subscribe(() => {
        this.onCloseAddEditScreen();
      });
    }
  }

  onCloseAddEditScreen(shouldRefetchBookData = true) {
    this.closeAddEditScreen.emit(shouldRefetchBookData);
  }
}
