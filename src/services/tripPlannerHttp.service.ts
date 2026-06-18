import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class TripPlannerHttpService {
  readonly baseUrl = `http://${process.env.TRIPS_PLANNER_SERVICE_HOST || 'localhost'}:${process.env.TRIPS_PLANNER_SERVICE_HTTP_PORT || '4008'}`;

  constructor(readonly http: HttpService) {}

  private handleError(err: AxiosError): Observable<never> {
    const status = err.response?.status ?? 500;
    const data = err.response?.data;
    const message = typeof data === 'string' ? data : (data as any)?.message ?? err.message;
    return throwError(() => new HttpException(message, status));
  }

  get<T>(path: string, params?: any): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params })
      .pipe(map((r) => r.data), catchError((e: AxiosError) => this.handleError(e)));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body)
      .pipe(map((r) => r.data), catchError((e: AxiosError) => this.handleError(e)));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body)
      .pipe(map((r) => r.data), catchError((e: AxiosError) => this.handleError(e)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`)
      .pipe(map((r) => r.data), catchError((e: AxiosError) => this.handleError(e)));
  }
}