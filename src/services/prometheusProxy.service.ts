import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PrometheusProxyService {
    private readonly baseUrl = process.env.PROMETHEUS_URL ?? 'http://localhost:9090';

    constructor(private readonly http: HttpService) {}

    async query(query: string): Promise<unknown> {
        return firstValueFrom(
            this.http
                .get(`${this.baseUrl}/api/v1/query`, { params: { query } })
                .pipe(map((r) => r.data)),
        );
    }

    async queryRange(query: string, start: string, end: string, step: string): Promise<unknown> {
        return firstValueFrom(
            this.http
                .get(`${this.baseUrl}/api/v1/query_range`, { params: { query, start, end, step } })
                .pipe(map((r) => r.data)),
        );
    }

    async targets(): Promise<unknown> {
        return firstValueFrom(
            this.http
                .get(`${this.baseUrl}/api/v1/targets`)
                .pipe(map((r) => r.data)),
        );
    }
}
