import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services';
import { Book } from '../../models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  pagedBooks: Book[] = [];
  pageSize = 10; // Number of items per page
  currentPage = 1; // Current page number
  totalPages = 0; // Total pages available
  selectedBook!: Book | null;
  isAddEditBookScreenOpen = false;
  searchName: string = '';
  searchDescription: string = '';
  searchTerms: Subject<{ name: string, description: string }> = new Subject();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.fetchBooks();
  }

  fetchBooks(page: number = 1, limit: number = this.pageSize, name: string = '', description: string = ''): void {
    this.bookService
      .getBooks(page, limit, name, description)
      .subscribe({
        next: (books) => {
          this.books = books.data;
          this.totalPages = Math.ceil(books.total / this.pageSize);
          this.updatePage();
        },
        error: (error) => {
          console.error('Error fetching books:', error);
        },
      });
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.fetchBooks(this.currentPage, this.pageSize, this.searchName, this.searchDescription);
      },
      error: (error) => {
        console.error('Error deleting book:', error);
      },
    });
  }

  displayAddEditBookScreen(book: Book | null = null): void {
    this.selectedBook = book;
    this.isAddEditBookScreenOpen = true;
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBooks = this.books.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchBooks(this.currentPage, this.pageSize, this.searchName, this.searchDescription);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchBooks(this.currentPage, this.pageSize, this.searchName, this.searchDescription);
    }
  }

  closeAddEditScreen(shouldRefetchBookData: boolean): void {
    this.isAddEditBookScreenOpen = false;
    if (shouldRefetchBookData) {
      this.fetchBooks(this.currentPage, this.pageSize, this.searchName, this.searchDescription);
    }
  }

  setupSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(300), 
        distinctUntilChanged() 
      )
      .subscribe(() => {
        this.fetchBooks(1, this.pageSize, this.searchName, this.searchDescription);
      });
  }

  search(): void {
    this.searchTerms.next({ name: this.searchName, description: this.searchDescription });
  }
}