import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(request);

    // Show loader
    this.loaderService.show();

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Successful response; do nothing for now
        }
      }),
      finalize(() => {
        // Remove request from array
        this.removeRequest(request);

        // Hide loader if no more pending requests
        if (this.requests.length === 0) {
          this.loaderService.hide();
        }
      })
    );
  }

  private removeRequest(request: HttpRequest<any>): void {
    const index = this.requests.indexOf(request);
    if (index >= 0) {
      this.requests.splice(index, 1);
    }
  }
}
