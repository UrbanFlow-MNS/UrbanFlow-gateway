import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TmHttpService {
    readonly baseUrl = `http://${process.env.TM_SERVICE_HOST || 'localhost'}:${process.env.TM_SERVICE_HTTP_PORT || '4009'}`;

    constructor(readonly http: HttpService) {}

    get<T>(path: string, params?: any): Observable<T> {
        return this.http
          .get<T>(`${this.baseUrl}${path}`, { params })
          .pipe(map((r) => r.data));
    }

    post<T>(path: string, body: any): Observable<T> {
        return this.http
          .post<T>(`${this.baseUrl}${path}`, body)
          .pipe(map((r) => r.data));
    }

    put<T>(path: string, body: any): Observable<T> {
        return this.http
          .put<T>(`${this.baseUrl}${path}`, body)
          .pipe(map((r) => r.data));
    }

    delete<T>(path: string): Observable<T> {
        return this.http
          .delete<T>(`${this.baseUrl}${path}`)
          .pipe(map((r) => r.data));
    }
}