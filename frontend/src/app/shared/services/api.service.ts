import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiError, isApiError } from './api.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response',
    body: null,
  };

  get<T>(path: string) {
    return this.http
      .get<T>(`${environment.apiUrl}${path}`, this.httpOptions)
      .pipe(map((v) => (v as any).body))
      .pipe(
        catchError((e) => {
          return of({
            status: 'UNKNOWN_ERROR',
            message: e.statusText,
            hint: e.status,
          } as ApiError);
        })
      )
      .pipe(
        tap((v) => {
          if (isApiError(v)) {
            throw v;
          }
        })
      ) as unknown as Observable<T>;
  }

  post<T>(path: string, body: any) {
    return this.http
      .post<T>(`${environment.apiUrl}${path}`, body, this.httpOptions)
      .pipe(map((v) => (v as any).body))
      .pipe(
        catchError((e) => {
          return of({
            status: 'UNKNOWN_ERROR',
            message: e.statusText,
            hint: e.status,
          } as ApiError);
        })
      )
      .pipe(
        tap((v) => {
          if (isApiError(v)) {
            throw v;
          }
        })
      ) as unknown as Observable<T>;
  }
}
