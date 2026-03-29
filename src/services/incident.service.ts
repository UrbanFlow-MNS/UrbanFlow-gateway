import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

@Injectable()
export class IncidentService {
    private readonly baseUrl: string;

    constructor(private readonly httpService: HttpService) {
        this.baseUrl = `http://${process.env.INCIDENT_SERVICE_HOST || 'localhost'}:${process.env.INCIDENT_SERVICE_PORT || '4004'}`;
    }

    findAll(): Observable<any> {
        return this.httpService.get(`${this.baseUrl}/incidents`).pipe(
            map((res: AxiosResponse) => res.data),
        );
    }

    findOne(id: number): Observable<any> {
        return this.httpService.get(`${this.baseUrl}/incidents/${id}`).pipe(
            map((res: AxiosResponse) => res.data),
        );
    }

    create(body: any): Observable<any> {
        return this.httpService.post(`${this.baseUrl}/incidents`, body).pipe(
            map((res: AxiosResponse) => res.data),
        );
    }

    update(id: number, body: any): Observable<any> {
        return this.httpService.patch(`${this.baseUrl}/incidents/${id}`, body).pipe(
            map((res: AxiosResponse) => res.data),
        );
    }

    remove(id: number): Observable<any> {
        return this.httpService.delete(`${this.baseUrl}/incidents/${id}`).pipe(
            map((res: AxiosResponse) => res.data),
        );
    }
}
