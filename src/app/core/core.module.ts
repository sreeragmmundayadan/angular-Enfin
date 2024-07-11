import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    LoaderComponent,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    LoaderService,
  ],
})
export class CoreModule {}
