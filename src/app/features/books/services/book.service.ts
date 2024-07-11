import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Book } from '../models';
import { ApiResponseData } from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) { }

  getBooks(
    page: number = 1,
    limit: number = 10,
    searchName: string = '',
    searchDescription: string = ''
  ): Observable<ApiResponseData<Book[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchName) {
      params = params.set('name', searchName);
    }

    if (searchDescription) {
      params = params.set('description', searchDescription);
    }

    return this.http.get<any>(`${this.apiUrl}`, { params });

  }

  addBook(bookData: Book): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, bookData);
  }

  updateBook(bookData: Book): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, bookData);
  }

  deleteBook(bookId: number): Observable<any> {
    let params = new HttpParams()
      .set('id', bookId)
    return this.http.delete<any>(`${this.apiUrl}`, { params });
  }
}
